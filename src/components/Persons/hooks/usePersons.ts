import { useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Person } from '../../../types/person';
import { PersonService } from '../../../services/PersonService';
import { useCRUDBase } from '../../CRUDBase/hooks/useCRUDBase';
import { useAuth } from '../../../contexts/AuthContext';

export const usePersons = () => {
  const { user } = useAuth();
  const isMountedRef = useRef(false);

  const fetchPersons = useCallback(async (page: number, limit: number, search?: string) => {
    try {
      return await PersonService.getPersons(page, limit, search);
    } catch (error) {
      toast.error('Erro ao carregar pessoas');
      throw error;
    }
  }, []);

  const {
    data: persons,
    isLoading,
    viewMode,
    searchTerm,
    handleSearchChange,
    handleViewModeChange,
    handleToggleStatus,
    handleItemsPerPageChange,
    loadData,
    pagination
  } = useCRUDBase<Person>({
    fetchData: fetchPersons,
    initialState: {
      viewMode: 'table',
      itemsPerPage: 10
    },
    preventMultipleCalls: true
  });

  const handleCreatePersonByCNPJ = async (cnpj: string) => {
    try {
      await PersonService.createPersonByCNPJ(cnpj);
      toast.success('Pessoa jurídica criada com sucesso');
      loadData(1);
    } catch (error) {
      toast.error('Erro ao criar pessoa jurídica');
      throw error;
    }
  };

  return {
    persons,
    isLoading,
    viewMode,
    searchTerm,
    onSearchChange: handleSearchChange,
    handleViewModeChange,
    handleToggleStatus,
    handleCreatePersonByCNPJ,
    loadData,
    pagination
  };
};