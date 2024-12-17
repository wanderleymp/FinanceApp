import React, { useState, useEffect } from 'react';
import { X, Plus, Mail, Phone, Search } from 'lucide-react';
import { Person, Contact, PersonContact } from '../../../types/person';
import { PersonService } from '../../../services/PersonService';
import { toast } from 'react-hot-toast';
import { ContactSearchSelect } from '../../Common/ContactSearchSelect';

interface PersonContactsModalProps {
  person: Person;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const PersonContactsModal: React.FC<PersonContactsModalProps> = ({
  person,
  isOpen,
  onClose,
  onSave,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchContacts, setSearchContacts] = useState<PersonContact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    type_id: 1,
    value: '',
    name: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContacts(person.contacts || []);
    } else {
      setContacts([]);
      setSearchContacts([]);
      setSearchTerm('');
      setNewContact({
        type_id: 1,
        value: '',
        name: '',
      });
    }
  }, [isOpen, person.contacts]);

  const handleSearchContacts = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      const results = await PersonService.searchContacts(searchTerm);
      setSearchContacts(results);
    } catch (error) {
      toast.error('Erro ao buscar contatos');
      setSearchContacts([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectExistingContact = (contact: PersonContact) => {
    setNewContact({
      type_id: contact.contact_type === 'EMAIL' ? 1 : 
               contact.contact_type === 'PHONE' ? 2 : 3,
      value: contact.contact_value,
      name: contact.contact_name || '',
    });
    setSearchContacts([]);
    setSearchTerm('');
  };

  const handleAddContact = async () => {
    try {
      if (!newContact.value) {
        toast.error('Preencha o valor do contato');
        return;
      }

      const addedContact = await PersonService.addContact(person.id, newContact);
      
      toast.success('Contato adicionado com sucesso');
      setContacts([...contacts, addedContact]);
      setNewContact({ type_id: 1, value: '', name: '' });
      onSave();
    } catch (error) {
      toast.error('Erro ao adicionar contato');
      console.error(error);
    }
  };

  const handleDeleteContact = async (contact: Contact) => {
    // Abre um modal de confirmação
    const confirmed = window.confirm(`Tem certeza que deseja remover o contato ${contact.value}?`);
    
    if (!confirmed) {
      console.log('Deleção de contato cancelada pelo usuário');
      return;
    }

    console.log('Iniciando deleção de contato:', {
      contactId: contact.id,
      contactDetails: contact
    });

    try {
      if (!contact.id) {
        toast.error('ID do contato inválido');
        return;
      }

      console.log('Chamando deletePersonContact com:', contact.id);
      await PersonService.deletePersonContact(contact.id);
      
      console.log('Contato deletado com sucesso');
      const updatedContacts = contacts.filter(c => c.id !== contact.id);
      
      console.log('Atualizando lista de contatos:', {
        originalCount: contacts.length,
        newCount: updatedContacts.length
      });

      setContacts(updatedContacts);
      toast.success('Contato removido com sucesso');
      onSave();
    } catch (error) {
      console.error('Erro detalhado ao deletar contato:', {
        error,
        contactId: contact.id,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        errorName: error instanceof Error ? error.name : 'Sem nome de erro'
      });
      
      toast.error(`Erro ao remover contato: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleSelectContact = (contact: PersonContact) => {
    setNewContact({
      type_id: contact.contact_type === 'EMAIL' ? 1 : 
               contact.contact_type === 'PHONE' ? 2 : 3,
      value: contact.contact_value,
      name: contact.contact_name || '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contatos</h2>
          <button
            onClick={() => {
              setContacts([]);
              setSearchContacts([]);
              setSearchTerm('');
              setNewContact({ type_id: 1, value: '', name: '' });
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Adicionar Novo Contato</h3>
            <div className="space-y-4">
              <ContactSearchSelect 
                onSelectContact={handleSelectContact}
                placeholder="Buscar contato existente"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <select
                    value={newContact.type_id}
                    onChange={(e) => setNewContact({ ...newContact, type_id: Number(e.target.value) })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={1}>Email</option>
                    <option value={2}>Telefone</option>
                    <option value={3}>WhatsApp</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={newContact.value}
                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                    placeholder="Valor do contato"
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newContact.name || ''}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Nome do contato (opcional)"
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleAddContact}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Contato</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Contatos Cadastrados</h3>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {contact.type_id === 1 ? (
                    <Mail className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Phone className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{contact.value}</p>
                    {contact.name && (
                      <p className="text-sm text-gray-500">{contact.name}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Buscar Contatos</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar contatos"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={handleSearchContacts}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>
            {isSearching ? (
              <p>Buscando...</p>
            ) : (
              searchContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {contact.contact_type === 'EMAIL' ? (
                      <Mail className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Phone className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">{contact.contact_value}</p>
                      {contact.contact_name && (
                        <p className="text-sm text-gray-500">{contact.contact_name}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectExistingContact(contact)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Selecionar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};