import { Movement } from '../../types/movement';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters';

export const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: (info: { getValue: () => any }) => info.getValue(),
  },
  {
    header: 'Data',
    accessorKey: 'date',
    cell: (info: { getValue: () => string }) => formatDate(info.getValue()),
  },
  {
    header: 'Tipo',
    accessorKey: 'type',
    cell: (info: { getValue: () => string }) => info.getValue(),
  },
  {
    header: 'Valor',
    accessorKey: 'total_amount',
    cell: (info: { getValue: () => number }) => formatCurrency(info.getValue()),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (info: { getValue: () => string }) => {
      const status = info.getValue();
      const statusColors: { [key: string]: string } = {
        'Confirmado': 'text-green-600 bg-green-50 px-2 py-1 rounded-full',
        'Pendente': 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full',
        'Cancelado': 'text-red-600 bg-red-50 px-2 py-1 rounded-full',
      };

      return (
        <span className={statusColors[status] || 'text-gray-600 bg-gray-50 px-2 py-1 rounded-full'}>
          {status}
        </span>
      );
    },
  },
];
