import { useState, useCallback } from 'react';
import { Movement } from '../../../types/movement';
import { MovementService } from '../../../services/MovementService';
import { useCRUDBase } from '../../CRUDBase/hooks/useCRUDBase';
import { useMovementsData } from '../../../hooks/useMovementsData';
import { formatMovementMetrics } from '../../../utils/metricsFormatter';

export const useMovements = () => {
  const [filters, setFilters] = useState({
    period: 'month',
    status: 'all',
    ...MovementService.getDateRangeForPeriod('month')
  });

  const {
    movements,
    isLoading: isLoadingMovements,
    pagination,
    fetchMovements
  } = useMovementsData();

  const {
    viewMode,
    searchTerm,
    handleSearch,
    handlePageChange,
    handleViewModeChange,
    loadData,
    isLoading: isLoadingCRUD
  } = useCRUDBase<Movement>({
    fetchData: fetchMovements,
    initialState: {
      viewMode: 'table',
      itemsPerPage: 10
    }
  });

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'custom') => {
    if (period === 'custom') {
      setFilters(prev => ({ ...prev, period }));
    } else {
      const dateRange = MovementService.getDateRangeForPeriod(period);
      setFilters({
        ...filters,
        period,
        ...dateRange
      });
      loadData(1);
    }
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
    loadData(1);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate,
      period: 'custom'
    }));
    loadData(1);
  };

  const kanbanColumns = [
    { 
      id: 'pending', 
      title: 'Pendente', 
      items: movements.filter(m => m.status === 'Pendente') 
    },
    { 
      id: 'confirmed', 
      title: 'Confirmado', 
      items: movements.filter(m => m.status === 'Confirmado') 
    },
    { 
      id: 'canceled', 
      title: 'Cancelado', 
      items: movements.filter(m => m.status === 'Cancelado') 
    },
  ];

  const metrics = formatMovementMetrics(movements);

  return {
    movements,
    isLoading: isLoadingMovements || isLoadingCRUD,
    viewMode,
    searchTerm,
    pagination,
    filters,
    kanbanColumns,
    metrics,
    handleSearch,
    handlePageChange,
    handleViewModeChange,
    handlePeriodChange,
    handleStatusChange,
    handleDateRangeChange,
    loadData,
  };
};
