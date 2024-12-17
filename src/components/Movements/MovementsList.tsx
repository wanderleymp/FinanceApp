import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  KanbanSquare, 
  Ban, 
  MessageCircle, 
  Receipt, 
  Edit 
} from 'lucide-react';
import { CRUDBase } from '../CRUDBase';
import { useMovements } from './hooks/useMovements';
import { columns } from './columns';
import { renderMovementCard } from './renderCard';
import { MovementForm } from './MovementForm';
import { CancelMovementModal } from './CancelMovementModal';
import { Movement } from '../../types/movement';
import { MovementService } from '../../services/MovementService';
import { toast } from 'react-hot-toast';

export const MovementsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    movements,
    isLoading,
    viewMode,
    searchTerm,
    pagination,
    filters,
    kanbanColumns,
    handleSearch,
    handlePageChange,
    handleViewModeChange,
    handlePeriodChange,
    handleDateRangeChange,
    handleStatusChange,
    loadData,
  } = useMovements();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

  useEffect(() => {
    console.error('MovementsList - Movements:', movements);
    console.error('MovementsList - Loading:', isLoading);
    console.error('MovementsList - Pagination:', pagination);
  }, [movements, isLoading, pagination]);

  const handleEdit = (movement: Movement) => {
    navigate(`/movements/edit/${movement.id}`, { state: { movement } });
  };

  const handleCancelClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedMovement) return;

    try {
      setIsCanceling(true);
      await MovementService.deleteMovement(selectedMovement.id);
      setIsCancelModalOpen(false);
      loadData(pagination.currentPage);
      toast.success('Movimento cancelado com sucesso');
    } catch (error) {
      toast.error('Erro ao cancelar movimento');
    } finally {
      setIsCanceling(false);
      setSelectedMovement(null);
    }
  };

  const handleGenerateReceipt = async (movement: Movement) => {
    try {
      setIsGeneratingReceipt(true);
      // Substituir por método real de geração de recibo
      toast.success('Recibo gerado com sucesso');
      loadData(pagination.currentPage);
    } catch (error) {
      toast.error('Erro ao gerar recibo');
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  const renderCustomActions = (movement: Movement) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleEdit(movement)}
        className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors duration-200 group"
        title="Editar Movimento"
      >
        <Edit className="text-orange-500 group-hover:scale-110" />
      </button>
      <button
        onClick={() => handleGenerateReceipt(movement)}
        className="p-1.5 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
        title="Gerar Recibo"
      >
        <Receipt className="text-green-500 group-hover:scale-110" />
      </button>
      <button
        onClick={() => handleCancelClick(movement)}
        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
        title="Cancelar Movimento"
      >
        <Ban className="text-red-500 group-hover:scale-110" />
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <CRUDBase
        data={movements}
        columns={columns}
        isLoading={isLoading}
        viewMode={viewMode}
        searchTerm={searchTerm}
        pagination={pagination}
        renderCard={renderMovementCard}
        renderCustomActions={renderCustomActions}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onViewModeChange={handleViewModeChange}
        title="Movimentos"
        subtitle="Gerencie os movimentos do sistema"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePeriodChange('today')}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              Hoje
            </button>
            <button
              onClick={() => handlePeriodChange('week')}
              className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
            >
              Esta Semana
            </button>
            <button
              onClick={() => handlePeriodChange('month')}
              className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
            >
              Este Mês
            </button>
            <button
              onClick={() => setShowCustomDateRange(!showCustomDateRange)}
              className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              <Calendar className="inline-block mr-2" size={16} />
              Período Personalizado
            </button>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            <Plus className="mr-2" />
            <span>Novo Movimento</span>
          </button>
        </div>

        {showCustomDateRange && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-4">
              <input 
                type="date" 
                onChange={(e) => handleDateRangeChange(
                  new Date(e.target.value), 
                  null
                )} 
                className="px-3 py-2 border rounded-lg"
              />
              <input 
                type="date" 
                onChange={(e) => handleDateRangeChange(
                  null, 
                  new Date(e.target.value)
                )} 
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}
      </CRUDBase>

      {isFormOpen && (
        <MovementForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            loadData();
          }}
        />
      )}

      {isCancelModalOpen && selectedMovement && (
        <CancelMovementModal
          movement={selectedMovement}
          isLoading={isCanceling}
          onConfirm={handleConfirmCancel}
          onClose={() => setIsCancelModalOpen(false)}
        />
      )}
    </div>
  );
};
