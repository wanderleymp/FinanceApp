import { createColumnHelper } from '@tanstack/react-table';
import { Person } from '../../../types/person';
import { Building2, FileText, UserCircle2, Users, MapPin } from 'lucide-react';

const columnHelper = createColumnHelper<Person>();

export const columns = [
  columnHelper.accessor('person_id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('full_name', {
    header: 'Nome',
    cell: info => (
      <div className="flex items-center gap-2">
        {info.row.original.person_type === 'PF' ? (
          <UserCircle2 className="w-4 h-4 text-blue-500" />
        ) : (
          <Building2 className="w-4 h-4 text-purple-500" />
        )}
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('fantasy_name', {
    header: 'Nome Fantasia',
    cell: info => info.getValue() || '-',
  }),
  columnHelper.accessor('documents', {
    header: 'Documentos',
    cell: info => (
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-blue-500" />
        <span>{info.getValue()?.[0]?.document_value || '-'}</span>
      </div>
    ),
  }),
  columnHelper.accessor('addresses', {
    header: 'Localização',
    cell: info => {
      const addresses = info.getValue();
      const mainAddress = addresses?.[0];
      if (!mainAddress) return <span className="text-gray-500">Endereço não cadastrado</span>;
      return (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>{`${mainAddress.city}/${mainAddress.state}`}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('user_count', {
    header: 'Usuários',
    cell: info => (
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-500" />
        <span>{info.getValue() || 0}</span>
      </div>
    ),
  }),
];