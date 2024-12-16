import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { CRUDBaseProps } from '../types';

interface UseCRUDBaseProps<T> {
  fetchData: (page: number, limit: number, search?: string) => Promise<{
    data: T[];
    meta: {
      current_page: number;
      total: number;
      last_page: number;
      per_page: number;
    };
  }>;
  initialState?: {
    viewMode?: 'table' | 'grid';
    itemsPerPage?: number;
  };
  preventMultipleCalls?: boolean;
}

export function useCRUDBase<T>(props: UseCRUDBaseProps<T>) {
  const { 
    fetchData, 
    initialState = {}, 
    preventMultipleCalls = false 
  } = props;

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(
    initialState.viewMode || 'table'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: initialState.itemsPerPage || 10,
    totalItems: 0,
    totalPages: 0
  });

  const lastFetchParamsRef = useRef<{
    page: number;
    limit: number;
    search?: string;
  } | null>(null);

  const loadData = useCallback(async (page: number = 1, search?: string) => {
    if (preventMultipleCalls && 
        lastFetchParamsRef.current?.page === page && 
        lastFetchParamsRef.current?.search === search) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await fetchData(page, pagination.itemsPerPage, search);
      
      setData(result.data || []);
      setPagination(prev => ({
        ...prev,
        currentPage: result.meta.current_page,
        totalItems: result.meta.total,
        totalPages: result.meta.last_page,
        itemsPerPage: result.meta.per_page
      }));
      
      lastFetchParamsRef.current = { 
        page: result.meta.current_page, 
        limit: result.meta.per_page, 
        search 
      };
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchData, 
    pagination.itemsPerPage, 
    preventMultipleCalls
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = useCallback((page: number) => {
    loadData(page, searchTerm);
  }, [loadData, searchTerm]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    loadData(1, term);
  }, [loadData]);

  const handleViewModeChange = useCallback((mode: 'table' | 'grid') => {
    setViewMode(mode);
  }, []);

  return {
    data,
    isLoading,
    viewMode,
    searchTerm,
    pagination: {
      ...pagination,
      itemsPerPage: pagination.itemsPerPage,
      currentPage: pagination.currentPage,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages
    },
    handlePageChange,
    handleSearchChange,
    handleViewModeChange,
    loadData
  };
}