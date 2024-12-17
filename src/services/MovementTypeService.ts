import apiService from './ApiService';
import { MovementType, MovementTypeResponse } from '../types/movement-type';
import { toast } from 'react-hot-toast';

export class MovementTypeService {
  private static readonly BASE_URL = '/movement-types';

  private static transformMovementType(data: any): MovementType {
    return {
      id: data.movement_type_id,
      movement_type_id: data.movement_type_id,
      type_name: data.type_name,
      _count: data._count || {
        movements: 0,
        movement_statuses: 0
      }
    };
  }

  public static async getMovementTypes(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<MovementTypeResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('type_name', search);
      }

      const response = await apiService.get<any>(`${this.BASE_URL}?${params.toString()}`);
      
      return {
        data: response.data.map(this.transformMovementType),
        pagination: {
          total: response.meta.total || 0,
          totalPages: response.meta.last_page || 1,
          currentPage: response.meta.current_page || 1,
          perPage: response.meta.per_page || limit,
          hasNext: response.meta.current_page < response.meta.last_page,
          hasPrevious: response.meta.current_page > 1
        }
      };
    } catch (error) {
      toast.error('Erro ao buscar tipos de movimentação');
      throw error;
    }
  }

  public static async getMovementTypeById(id: number): Promise<MovementType> {
    try {
      const response = await apiService.get<any>(`${this.BASE_URL}/${id}`);
      return this.transformMovementType(response);
    } catch (error) {
      toast.error('Erro ao buscar tipo de movimentação');
      throw error;
    }
  }

  public static async createMovementType(data: { type_name: string }): Promise<MovementType> {
    try {
      const response = await apiService.post<any>(this.BASE_URL, data);
      return this.transformMovementType(response);
    } catch (error) {
      toast.error('Erro ao criar tipo de movimentação');
      throw error;
    }
  }

  public static async updateMovementType(
    id: number, 
    data: { type_name: string }
  ): Promise<MovementType> {
    try {
      const response = await apiService.put<any>(`${this.BASE_URL}/${id}`, data);
      return this.transformMovementType(response);
    } catch (error) {
      toast.error('Erro ao atualizar tipo de movimentação');
      throw error;
    }
  }

  public static async deleteMovementType(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.BASE_URL}/${id}`);
      toast.success('Tipo de movimentação excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir tipo de movimentação');
      throw error;
    }
  }
}