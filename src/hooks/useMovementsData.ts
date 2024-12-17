import { useState, useCallback } from 'react';
import { Movement } from '../types/movement';
import { MovementService } from '../services/MovementService';
import { toast } from 'react-hot-toast';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export const useMovementsData = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const fetchMovements = useCallback(async (
    page = 1, 
    limit = 10, 
    searchTerm = '', 
    startDate?: Date | null, 
    endDate?: Date | null, 
    status?: string
  ) => {
    try {
      setIsLoading(true);
      const result = await MovementService.listMovements({
        page,
        pageSize: limit,
        searchTerm,
        startDate,
        endDate,
        status
      });

      setMovements(result.data);
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        pageSize: result.pageSize,
        totalItems: result.totalItems,
      });

      return {
        data: result.data,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          pageSize: result.pageSize,
          totalItems: result.totalItems,
        }
      };
    } catch (error: any) {
      toast.error('Erro ao carregar movimentações');
      console.error('Fetch Movements Error:', error);
      return { data: [], pagination: pagination };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    movements,
    isLoading,
    pagination,
    fetchMovements
  };
};
