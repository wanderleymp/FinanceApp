import React from 'react';
import { Movement } from '../../types/movement';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters';
import { 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText 
} from 'lucide-react';

export const renderMovementCard = (movement: Movement) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(movement.status)}`}
        >
          {movement.status}
        </span>
        <span className="text-sm text-gray-500">
          {formatDate(movement.date)}
        </span>
      </div>

      <div className="flex items-center mb-2">
        <DollarSign className="mr-2 text-primary" size={16} />
        <span className="font-semibold text-lg">
          {formatCurrency(movement.total_amount)}
        </span>
      </div>

      <div className="flex items-center mb-2">
        <Tag className="mr-2 text-blue-500" size={16} />
        <span className="text-sm text-gray-700">
          {movement.type}
        </span>
      </div>

      <div className="flex items-center">
        <FileText className="mr-2 text-gray-500" size={16} />
        <span className="text-sm text-gray-600 truncate">
          {movement.description || 'Sem descrição'}
        </span>
      </div>
    </div>
  );
};
