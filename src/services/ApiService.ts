import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';
import { AuthService } from './AuthService';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // Aumentar timeout para 15 segundos
      timeoutErrorMessage: 'A conexão com o servidor demorou muito. Tente novamente.',
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          data: config.data
        });
        const token = AuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error)
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('API Response:', {
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        if (error.code === 'ECONNABORTED') {
          toast.error('O servidor demorou muito para responder. Verifique sua conexão ou tente novamente.');
          return Promise.reject(new Error('Timeout de conexão'));
        }

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as any;

          switch (status) {
            case 401:
              AuthService.logout();
              toast.error('Sessão expirada. Por favor, faça login novamente.');
              break;
            case 403:
              toast.error('Você não tem permissão para realizar esta ação.');
              break;
            case 404:
              toast.error('Recurso não encontrado.');
              break;
            case 422:
              const message = data?.message || 'Dados inválidos. Verifique as informações fornecidas.';
              toast.error(message);
              break;
            case 500:
              toast.error('Erro interno do servidor. Tente novamente mais tarde.');
              break;
            default:
              toast.error('Ocorreu um erro. Tente novamente.');
          }
        } else if (error.request) {
          toast.error('Não foi possível conectar ao servidor. Verifique sua conexão de internet.');
        } else {
          toast.error('Ocorreu um erro na requisição.');
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      console.log('🌐 API Request:', { url, method: 'get', data: config?.data });
      const response = await this.api.get<T>(url, {
        ...config,
        // Configurações específicas para cada requisição
        timeout: 20000, // 20 segundos para requisições GET
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API GET Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: error.config
        });

        if (error.response?.status === 401) {
          AuthService.logout();
        }

        toast.error('Não foi possível carregar os dados. Tente novamente.');
      }
      return Promise.reject(error);
    }
  }

  public async post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T, T>(url, data, {
        ...config,
        timeout: 25000, // 25 segundos para requisições POST
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API POST Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        const errorMessage = error.response?.data 
          ? (error.response.data as any).message 
          : 'Erro ao processar a solicitação';

        toast.error(errorMessage);
      }
      throw error;
    }
  }

  public async put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.put<T, T>(url, data, {
        ...config,
        timeout: 25000, // 25 segundos para requisições PUT
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API PUT Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        const errorMessage = error.response?.data 
          ? (error.response.data as any).message 
          : 'Erro ao atualizar os dados';

        toast.error(errorMessage);
      }
      throw error;
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T, T>(url, {
        ...config,
        timeout: 20000, // 20 segundos para requisições DELETE
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API DELETE Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        const errorMessage = error.response?.data 
          ? (error.response.data as any).message 
          : 'Erro ao excluir o registro';

        toast.error(errorMessage);
      }
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
export default apiService;