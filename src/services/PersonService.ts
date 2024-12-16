import apiService from './ApiService';
import { Person, PersonsResponse } from '../types/person';

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
    return await apiService.get<Person>(`${this.BASE_URL}/${id}`);
  }

  public static async createPerson(data: Partial<Person>): Promise<Person> {
    return await apiService.post<Person>(this.BASE_URL, data);
  }

  public static async createPersonByCNPJ(cnpj: string, licenseId: number): Promise<Person> {
    try {
      const response = await apiService.post('/persons/create-by-cnpj', { 
        cnpj, 
        license_id: licenseId 
      });
      return response.data;
    } catch (error) {
      console.error('Error creating person by CNPJ:', error);
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
}