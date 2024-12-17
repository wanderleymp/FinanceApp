import React, { useState, useEffect } from 'react';
import { X, Mail, MessageCircle, Plus } from 'lucide-react';
import { Person, PersonContact } from '../../../types/person';
import { PersonService } from '../../../services/PersonService';
import { toast } from 'react-hot-toast';

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
  const [contacts, setContacts] = useState<PersonContact[]>(person.contacts);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(person);
  const [newContact, setNewContact] = useState<Partial<PersonContact>>({
    contact_type: 'email',
    contact_value: '',
  });

  useEffect(() => {
    const openModal = (personToOpen: Person) => {
      setCurrentPerson(personToOpen);
      setContacts(personToOpen.contacts);
      console.log('Contacts received:', personToOpen.contacts);
    };

    const modalElement = document.getElementById('person-contacts-modal');
    if (modalElement) {
      (modalElement as any).openModal = openModal;
    }
  }, []);

  const handleAddContact = async () => {
    if (!currentPerson) return;
    try {
      if (!newContact.contact_value) {
        toast.error('Digite o valor do contato');
        return;
      }

      await PersonService.addContact(currentPerson.person_id, newContact);
      toast.success('Contato adicionado com sucesso');
      setNewContact({ contact_type: 'email', contact_value: '' });
      onSave();
    } catch (error) {
      toast.error('Erro ao adicionar contato');
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!currentPerson) return;
    try {
      await PersonService.deleteContact(currentPerson.person_id, contactId);
      toast.success('Contato removido com sucesso');
      setContacts(contacts.filter(c => c.contact_id !== contactId));
      onSave();
    } catch (error) {
      toast.error('Erro ao remover contato');
    }
  };

  if (!isOpen || !currentPerson) return null;

  return (
    <div 
      id="person-contacts-modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contatos</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Adicionar Novo Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  value={newContact.contact_type}
                  onChange={(e) => setNewContact({ ...newContact, contact_type: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="telefone">Telefone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  value={newContact.contact_value}
                  onChange={(e) => setNewContact({ ...newContact, contact_value: e.target.value })}
                  placeholder="Valor do contato"
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

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Contatos Cadastrados</h3>
            {contacts.map((contact) => (
              <div
                key={contact.contact_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {contact.contact_type === 'email' ? (
                    <Mail className="w-5 h-5 text-blue-500" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{contact.contact_value}</p>
                  </div>
                </div>
                <button
                  onClick={() => contact.contact_id && handleDeleteContact(contact.contact_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};