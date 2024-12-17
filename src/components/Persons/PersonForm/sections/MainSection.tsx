import React from 'react';
import { Building2, Search } from 'lucide-react';
import { Person } from '../../../../types/person';

interface MainSectionProps {
  formData: Partial<Person>;
  setFormData: (data: Partial<Person>) => void;
  onCNPJSearch?: (cnpj: string) => Promise<void>;
  onSearch?: (searchTerm: string) => Promise<void>;
  isLoading: boolean;
}

export const MainSection: React.FC<MainSectionProps> = ({
  formData,
  setFormData,
  onCNPJSearch,
  onSearch,
  isLoading,
}) => {
  const handleSearch = () => {
    if (formData.person_type_id === 2 && onCNPJSearch) {
      const cnpj = formData.documents?.find(d => d.document_type === 'CNPJ')?.document_value;
      if (cnpj) {
        onCNPJSearch(cnpj);
      }
    } else if (onSearch) {
      onSearch(formData.full_name || '');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Dados Principais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Pessoa
          </label>
          <select
            value={formData.person_type_id}
            onChange={(e) => setFormData({ ...formData, person_type_id: Number(e.target.value) })}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={1}>Pessoa Física</option>
            <option value={2}>Pessoa Jurídica</option>
          </select>
        </div>

        {formData.person_type_id === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={formData.birth_date || ''}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {formData.person_type_id === 2 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Fantasia
            </label>
            <input
              type="text"
              value={formData.fantasy_name || ''}
              onChange={(e) => setFormData({ ...formData, fantasy_name: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};