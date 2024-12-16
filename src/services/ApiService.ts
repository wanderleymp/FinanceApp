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
      timeout: 10000,
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
        console.error('API Request:', {
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
          message: error.message
        });
        
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
          toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
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
      const response = await this.api.get<string>(url, config);
      
      console.log('🌐 Raw Response Data (Type):', typeof response.data);
      console.log('🌐 Raw Response Data (Keys):', Object.keys(response.data || {}));
      console.log('🌐 Raw Response Data:', JSON.stringify(response.data, null, 2));
      
      // Garantir que o parsing da resposta seja feito corretamente
      const responseData = typeof response.data === 'string' 
        ? JSON.parse(response.data) 
        : response.data;

      console.log('🌐 Parsed Response Data:', {
        status: response.status,
        headers: response.headers,
        data: responseData
      });
      
      return responseData as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: error.config
        });

        if (error.response?.status === 401) {
          AuthService.logout();
        }

        toast.error('Ocorreu um erro na requisição.');
      }
      return Promise.reject(error);
    }
  }

  public async post<T>(url: string, data?: object): Promise<T> {
    try {
      const response = await this.api.post<T, T>(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async put<T>(url: string, data?: object): Promise<T> {
    try {
      const response = await this.api.put<T, T>(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.api.delete<T, T>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance();
export default apiService;