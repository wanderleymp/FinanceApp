import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { MovementService } from '../../services/MovementService';
import { Movement } from '../../types/movement';
import { toast } from 'react-hot-toast';

interface CancelMovementModalProps {
  movement: Movement;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelMovementModal: React.FC<CancelMovementModalProps> = ({ 
  movement, 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Por favor, informe o motivo do cancelamento');
      return;
    }

    try {
      setIsLoading(true);
      
      await MovementService.cancelMovement(movement.id, {
        reason: cancelReason,
        status: 'Cancelado'
      });

      toast.success('Movimento cancelado com sucesso');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao cancelar movimento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-red-600 flex items-center">
            <AlertTriangle className="mr-2" size={24} />
            Cancelar Movimento
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Você está prestes a cancelar o movimento:
          <div className="mt-2 bg-gray-100 p-2 rounded">
            <p><strong>ID:</strong> {movement.id}</p>
            <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(movement.total_amount)}</p>
            <p><strong>Data:</strong> {new Date(movement.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo do Cancelamento *
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            placeholder="Descreva o motivo do cancelamento"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500/50"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Voltar
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
          >
            {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </button>
        </div>
      </div>
    </div>
  );
};
