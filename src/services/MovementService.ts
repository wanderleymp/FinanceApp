import { apiService } from './ApiService';
import { Movement, GetMovementsParams, GetMovementsResponse } from '../types/movement';

export const MovementService = {
  async listMovements({
    page = 1,
    pageSize = 10,
    searchTerm = '',
    startDate = null,
    endDate = null,
    status = ''
  }: {
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    startDate?: Date | null,
    endDate?: Date | null,
    status?: string
  }): Promise<{
    data: Movement[],
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalItems: number
  }> {
    try {
      console.error('MOVEMENT SERVICE: Attempting to fetch movements');
      console.error('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

      const params: any = {
        page,
        limit: pageSize,
        search: searchTerm,
        startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
        endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
        status
      };

      console.error('Fetch params:', JSON.stringify(params, null, 2));

      const response = await apiService.get<GetMovementsResponse>('/movements', { params });

      console.error('MOVEMENT SERVICE: Response received', response.data);

      if (!response.data || !response.data.movements) {
        console.error('MOVEMENT SERVICE: Invalid response structure', response.data);
        return {
          data: [],
          currentPage: page,
          totalPages: 0,
          pageSize,
          totalItems: 0
        };
      }

      return {
        data: response.data.movements,
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        pageSize: response.data.pagination.pageSize,
        totalItems: response.data.pagination.total
      };
    } catch (error) {
      console.error('MOVEMENT SERVICE: Error fetching movements', error);
      return {
        data: [],
        currentPage: page,
        totalPages: 0,
        pageSize,
        totalItems: 0
      };
    }
  },

  async getMovementById(id: number) {
    try {
      console.error('MOVEMENT SERVICE: Attempting to fetch movement by id');
      console.error('Movement ID:', id);

      const response = await apiService.get(`/movements/${id}`);
      return response.data;
    } catch (error) {
      console.error('MOVEMENT SERVICE: Error fetching movement by id', error);
      throw error;
    }
  },

  async createMovement(movementData: Movement) {
    try {
      console.error('MOVEMENT SERVICE: Attempting to create movement');
      console.error('Movement Data:', JSON.stringify(movementData, null, 2));

      const response = await apiService.post('/movements', movementData);

      console.error('MOVEMENT SERVICE: Response received', response.data);

      return response.data;
    } catch (error) {
      console.error('MOVEMENT SERVICE: Error creating movement', error);
      throw error;
    }
  },

  async updateMovement(id: number, movementData: Movement) {
    try {
      console.error('MOVEMENT SERVICE: Attempting to update movement');
      console.error('Movement ID:', id);
      console.error('Movement Data:', JSON.stringify(movementData, null, 2));

      const response = await apiService.put(`/movements/${id}`, movementData);

      console.error('MOVEMENT SERVICE: Response received', response.data);

      return response.data;
    } catch (error) {
      console.error('MOVEMENT SERVICE: Error updating movement', error);
      throw error;
    }
  },

  async deleteMovement(id: number) {
    try {
      console.error('MOVEMENT SERVICE: Attempting to delete movement');
      console.error('Movement ID:', id);

      const response = await apiService.delete(`/movements/${id}`);

      console.error('MOVEMENT SERVICE: Response received', response.data);

      return response.data;
    } catch (error) {
      console.error('MOVEMENT SERVICE: Error deleting movement', error);
      throw error;
    }
  },

  getDateRangeForPeriod(period: string) {
    const today = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (period) {
      case 'today':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'week':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        endDate = today;
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
    }

    return { startDate, endDate };
  }
};
