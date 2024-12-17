import apiService from './ApiService';
import { MovementStatus, MovementStatusResponse } from '../types/movement-status';
import { toast } from 'react-hot-toast';

export class MovementStatusService {
  private static readonly BASE_URL = '/movement-status';

  private static transformMovementStatus(data: any): MovementStatus {
    return {
      id: data.movement_status_id,
      movement_status_id: data.movement_status_id,
      status_name: data.status_name,
      description: data.description,
      display_order: data.display_order,
      // Campos opcionais mantidos com valores padrão
      status_category_id: data.status_category_id || null,
      movement_type_id: data.movement_type_id || null,
      is_final: data.is_final || false,
      active: data.active ?? true,
      movement_types: {
        type_name: data.movement_types?.type_name || ''
      },
      movement_status_categories: {
        category_name: data.movement_status_categories?.category_name || ''
      }
    };
  }

  public static async getMovementStatuses(
    page: number = 1,
    limit: number = 10,
    search: string = 'all'
  ): Promise<MovementStatusResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status_name: search
      });

      const response = await apiService.get<any>(`${this.BASE_URL}?${params.toString()}`);
      
      return {
        data: response.data.map(this.transformMovementStatus),
        pagination: {
          total: response.meta.total || 0,
          totalPages: 1, // Baseado no retorno atual
          currentPage: page,
          perPage: limit,
          hasNext: false,
          hasPrevious: false
        }
      };
    } catch (error) {
      toast.error('Erro ao buscar status de movimentação');
      throw error;
    }
  }

  public static async getMovementStatus(id: number): Promise<MovementStatus> {
    try {
      const response = await apiService.get<any>(`${this.BASE_URL}/${id}`);
      return this.transformMovementStatus(response);
    } catch (error) {
      toast.error('Erro ao buscar status de movimentação');
      throw error;
    }
  }

  public static async createMovementStatus(data: Partial<MovementStatus>): Promise<MovementStatus> {
    try {
      const response = await apiService.post<any>(this.BASE_URL, {
        status_name: data.status_name,
        description: data.description,
        display_order: data.display_order
      });
      toast.success('Status de movimento criado com sucesso');
      return this.transformMovementStatus(response);
    } catch (error) {
      toast.error('Erro ao criar status de movimentação');
      throw error;
    }
  }

  public static async updateMovementStatus(id: number, data: Partial<MovementStatus>): Promise<MovementStatus> {
    try {
      const response = await apiService.put<any>(`${this.BASE_URL}/${id}`, {
        status_name: data.status_name,
        description: data.description,
        display_order: data.display_order
      });
      toast.success('Status de movimento atualizado com sucesso');
      return this.transformMovementStatus(response);
    } catch (error) {
      toast.error('Erro ao atualizar status de movimentação');
      throw error;
    }
  }

  public static async deleteMovementStatus(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.BASE_URL}/${id}`);
      toast.success('Status de movimento excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir status de movimentação');
      throw error;
    }
  }
}