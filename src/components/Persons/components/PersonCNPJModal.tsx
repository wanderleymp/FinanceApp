import React, { useState, useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface PersonCNPJModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cnpj: string) => Promise<void>;
}

// Função para validar CNPJ
const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Cálculo dos dígitos verificadores
  let sum = 0;
  let peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * peso[i];
  }
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (digit1 !== parseInt(cnpj[12])) return false;

  sum = 0;
  peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * peso[i];
  }
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return digit2 === parseInt(cnpj[13]);
};

export const PersonCNPJModal: React.FC<PersonCNPJModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [cnpj, setCnpj] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Máscara de CNPJ com memoização
  const formatCNPJ = useCallback((value: string) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    return value;
  }, []);

  // Validação em tempo real
  const cnpjValidation = useMemo(() => {
    const cleanedCnpj = cnpj.replace(/[^\d]/g, '');
    if (cleanedCnpj.length === 14) {
      return validateCNPJ(cleanedCnpj);
    }
    return null;
  }, [cnpj]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanedCnpj = cnpj.replace(/[^\d]/g, '');

    if (!cleanedCnpj.trim()) {
      setError('Digite o CNPJ');
      toast.error('Digite o CNPJ');
      return;
    }

    if (!validateCNPJ(cleanedCnpj)) {
      setError('CNPJ inválido');
      toast.error('CNPJ inválido');
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(cleanedCnpj);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar CNPJ';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePersonByCNPJ = async () => {
    try {
      setIsLoading(true);
      if (!cnpjValidation) {
        toast.error('Por favor, insira um CNPJ válido');
        return;
      }

      await onSubmit(cnpj);
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar pessoa jurídica:', error);
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Erro ao criar pessoa jurídica';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Nova Pessoa Jurídica</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={(e) => handleCreatePersonByCNPJ()} className="p-6 space-y-4">
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <div className="relative">
              <input
                type="text"
                id="cnpj"
                value={cnpj}
                onChange={(e) => {
                  const formattedValue = formatCNPJ(e.target.value);
                  setCnpj(formattedValue);
                }}
                placeholder="00.000.000/0000-00"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  cnpjValidation === false ? 'border-red-500' : ''
                }`}
                maxLength={18}
                required
              />
              <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {cnpjValidation === false && (
              <p className="text-red-500 text-sm mt-1">CNPJ inválido</p>
            )}
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || cnpjValidation === false}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Criar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};