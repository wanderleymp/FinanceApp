import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { CRUDBase } from '../CRUDBase';
import { UserService } from '../../services/UserService';
import { User, UsersResponse } from '../../types/user';
import { toast } from 'react-hot-toast';

const columns = [
  {
    header: 'ID',
    accessorKey: 'user_id',
  },
  {
    header: 'Username',
    accessorKey: 'username',
  },
  {
    header: 'Nome Completo',
    accessorKey: 'person_name',
  },
  {
    header: 'Status',
    accessorKey: 'active',
    cell: (info: any) => info.getValue() ? 'Ativo' : 'Inativo',
  },
  {
    header: 'Último Login',
    accessorKey: 'last_login',
    cell: (info: any) => info.getValue() || 'Nunca logado',
  },
];

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const isMountedRef = useRef(false);

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response: UsersResponse = await UserService.getUsers(page, pagination.itemsPerPage, searchTerm);
      setUsers(response.data);
      setPagination({
        currentPage: response.meta.current_page,
        totalPages: response.meta.last_page,
        totalItems: response.meta.total,
        itemsPerPage: response.meta.per_page,
      });
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.itemsPerPage, searchTerm]);

  useEffect(() => {
    if (!isMountedRef.current) {
      fetchUsers();
      isMountedRef.current = true;
    }
  }, [fetchUsers]);

  const handleDelete = async (user: User) => {
    try {
      await UserService.deleteUser(user.user_id);
      toast.success('Usuário excluído com sucesso');
      fetchUsers(pagination.currentPage);
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleExportExcel = () => {
    toast('Exportação para Excel em desenvolvimento', { icon: '📊' });
  };

  const handleExportPDF = () => {
    toast('Exportação para PDF em desenvolvimento', { icon: '📄' });
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Reset to first page when searching
    fetchUsers(1);
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
  };

  const renderUserCard = (user: User) => (
    <div>
      <h3 className="font-medium">{user.person_name}</h3>
      <p className="text-sm text-gray-500 mt-1">{user.username}</p>
      <div className="mt-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.active ? 'Ativo' : 'Inativo'}
        </span>
      </div>
    </div>
  );

  return (
    <CRUDBase
      title="Usuários"
      data={users}
      columns={columns}
      isLoading={isLoading}
      viewMode={viewMode}
      pagination={pagination}
      renderCard={renderUserCard}
      onDelete={handleDelete}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onViewModeChange={handleViewModeChange}
      exportOptions={[
        {
          label: 'Excel',
          icon: <FileSpreadsheet className="w-4 h-4" />,
          onClick: handleExportExcel
        },
        {
          label: 'PDF',
          icon: <FileText className="w-4 h-4" />,
          onClick: handleExportPDF
        }
      ]}
    />
  );
};