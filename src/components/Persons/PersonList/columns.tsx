import { createColumnHelper } from '@tanstack/react-table';
import { Person } from '../../../types/person';
import { Building2, FileText, UserCircle2, MapPin, MessageCircle } from 'lucide-react';

const columnHelper = createColumnHelper<Person>();

export const columns = (
  handleOpenContactsModal: (person: Person) => void
) => [
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
    cell: info => {
      const documents = info.getValue();
      const mainDocument = documents?.[0];
      
      if (!mainDocument) return <span>-</span>;
      
      const formattedDocument = mainDocument.document_type === 'CPF' 
        ? mainDocument.document_value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        : mainDocument.document_value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      
      return (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span>{formattedDocument}</span>
        </div>
      );
    },
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
  columnHelper.display({
    id: 'contacts',
    header: 'Contatos',
    cell: info => {
      const row = info.row.original;
      const contactCount = row.contacts?.length || 0;

      return (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenContactsModal(row);
          }}
        >
          <MessageCircle className="w-4 h-4 text-green-600" />
          <span>{contactCount}</span>
        </div>
      );
    },
  }),
];