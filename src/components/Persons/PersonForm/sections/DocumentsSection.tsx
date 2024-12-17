import React, { useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { PersonDocument } from '../../../../types/person';

interface DocumentsSectionProps {
  documents: PersonDocument[];
  onChange: (documents: PersonDocument[]) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onChange,
}) => {
  const [newDocument, setNewDocument] = useState<Partial<PersonDocument>>({
    document_type: 'CPF',
    document_value: '',
  });

  const handleAddDocument = () => {
    if (!newDocument.document_value) return;
    onChange([...documents, { 
      ...newDocument, 
      person_document_id: Date.now() 
    } as PersonDocument]);
    setNewDocument({ document_type: 'CPF', document_value: '' });
  };

  const handleRemoveDocument = (index: number) => {
    onChange(documents.filter((_, i) => i !== index));
  };

  const formatDocument = (type: string, value: string) => {
    if (type === 'CPF') {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (type === 'CNPJ') {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Documentos</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              value={newDocument.document_type}
              onChange={(e) => setNewDocument({ ...newDocument, document_type: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="RG">RG</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={newDocument.document_value}
              onChange={(e) => setNewDocument({ ...newDocument, document_value: e.target.value })}
              placeholder="Número do documento"
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddDocument}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Documento</span>
        </button>
      </div>

      {documents.length > 0 && (
        <div className="mt-6 space-y-4">
          {documents.map((document, index) => (
            <div
              key={document.person_document_id || index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">
                    {formatDocument(document.document_type, document.document_value)}
                  </p>
                  <p className="text-sm text-gray-500">{document.document_type}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDocument(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};