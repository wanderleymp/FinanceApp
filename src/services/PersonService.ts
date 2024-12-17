import apiService from './ApiService';
import { Person, PersonsResponse, PersonContact } from '../types/person';

export class PersonService {
  private static readonly BASE_URL = '/persons';

  public static async getPersons(page: number = 1, limit: number = 10, search?: string): Promise<PersonsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {})
      });

      console.log(`🔍 Requesting persons with params: ${params.toString()}`);

      const response = await apiService.get(`/persons?${params.toString()}`);
      
      console.log('🌟 Raw Person Response:', JSON.stringify(response, null, 2));

      // Verifica se a resposta tem o formato esperado
      if (response && response.data && response.meta) {
        console.log('✅ Response with data and meta');
        return {
          data: response.data.map((person: any) => ({
            ...person,
            id: person.person_id,
            name: person.full_name,
          })),
          meta: {
            total: response.meta.total || 0,
            per_page: response.meta.per_page || limit,
            current_page: response.meta.current_page || page,
            last_page: response.meta.last_page || 1,
            from: response.meta.from || 1,
            to: response.meta.to || response.data.length
          }
        };
      }

      // Fallback para caso a resposta não esteja no formato esperado
      const data = Array.isArray(response) ? response : [];
      const totalItems = data.length;

      console.log(`⚠️ Fallback data processing. Data length: ${totalItems}`);

      return {
        data: data.map((person: any) => ({
          ...person,
          id: person.person_id,
          name: person.full_name,
        })),
        meta: {
          total: totalItems,
          per_page: limit,
          current_page: page,
          last_page: Math.max(1, Math.ceil(totalItems / limit)),
          from: (page - 1) * limit + 1,
          to: Math.min(page * limit, totalItems)
        }
      };
    } catch (error) {
      console.error('❌ Error fetching persons:', error);
      throw error;
    }
  }

  public static async getPerson(id: number): Promise<Person> {
    const person = await apiService.get<Person>(`${this.BASE_URL}/${id}`);
    console.log('Documentos da pessoa:', person.documents);
    return person;
  }

  public static async createPerson(data: Partial<Person>): Promise<Person> {
    return await apiService.post<Person>(this.BASE_URL, data);
  }

  public static async createPersonByCNPJ(cnpj: string): Promise<Person> {
    try {
      console.log('[DEBUG] PersonService - Creating person by CNPJ:', { 
        cnpj: cnpj.replace(/\D/g, ''),
        raw_cnpj: cnpj
      });

      const cleanCNPJ = cnpj.replace(/\D/g, '');
      
      if (cleanCNPJ.length !== 14) {
        const errorMsg = 'CNPJ inválido: deve conter 14 dígitos';
        console.error(`[DEBUG] PersonService - ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.log('[DEBUG] PersonService - Preparing POST request to create person by CNPJ');
      const response = await apiService.post(`/persons/cnpj/${cleanCNPJ}`, {});
      
      console.log('[DEBUG] PersonService - Response from creating person by CNPJ:', response);
      return response.data;
    } catch (error: any) {
      console.error('[DEBUG] PersonService - Detailed error creating person by CNPJ:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        stack: error.stack
      });
      throw error;
    }
  }

  public static async updatePerson(id: number, data: Partial<Person>): Promise<Person> {
    try {
      const response = await apiService.put(`/persons/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  }

  public static async searchCEP(cep: string): Promise<any> {
    return await apiService.get(`${this.BASE_URL}/consulta/cep/${cep}`);
  }

  public static async searchCNPJ(cnpj: string): Promise<any> {
    return await apiService.get(`${this.BASE_URL}/consulta/cnpj/${cnpj}`);
  }

  public static async addDocument(personId: number, document: any): Promise<void> {
    await apiService.post(`${this.BASE_URL}/${personId}/documents`, document);
  }

  public static async deleteDocument(personId: number, documentId: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${personId}/documents/${documentId}`);
  }

  public static async addContact(personId: number, contact: any): Promise<void> {
    await apiService.post(`${this.BASE_URL}/${personId}/contacts`, contact);
  }

  public static async deleteContact(personId: number, contactId: number): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${personId}/contacts/${contactId}`);
  }

  public static async deletePersonContact(personContactId: number): Promise<void> {
    if (!personContactId) {
      console.error('ID de contato inválido:', personContactId);
      throw new Error('ID de contato inválido');
    }

    try {
      console.log('🗑️ Iniciando deleção de contato:', { 
        personContactId, 
        endpoint: `/person-contact/${personContactId}` 
      });

      const response = await apiService.delete(`/person-contact/${personContactId}`);
      
      console.log('✅ Resposta da deleção:', {
        status: response.status,
        data: response.data
      });
    } catch (error) {
      console.error('❌ Erro detalhado ao deletar contato:', {
        errorType: error instanceof Error ? error.name : 'Unknown Error',
        message: error instanceof Error ? error.message : 'Sem mensagem de erro',
        stack: error instanceof Error ? error.stack : 'Sem stack trace',
        personContactId
      });
      throw error;
    }
  }

  public static async searchContacts(searchTerm: string): Promise<PersonContact[]> {
    try {
      const response = await apiService.get(`/contacts?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw error;
    }
  }
}