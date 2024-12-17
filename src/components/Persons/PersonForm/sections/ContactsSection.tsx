import React, { useState } from 'react';
import { Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { PersonContact } from '../../../../types/person';
import { ContactSearchSelect } from '../../../Common/ContactSearchSelect';
import { PersonService } from '../../../../services/PersonService';
import { toast } from 'react-hot-toast';

interface ContactsSectionProps {
  contacts: PersonContact[];
  personId?: number;
  onChange: (contacts: PersonContact[]) => void;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({
  contacts,
  personId,
  onChange,
}) => {
  const [newContact, setNewContact] = useState<Partial<PersonContact>>({
    contact_type: 'EMAIL',
    contact_value: '',
    contact_name: '',
  });

  const formatContactValue = (type: string, value: string) => {
    switch (type) {
      case 'PHONE':
        // Formata telefone brasileiro
        return value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      case 'WHATSAPP':
        // Formata WhatsApp com DDD
        return value.replace(/(\d{2})(\d{4,5})(\d{4})/, '+55 ($1) $2-$3');
      default:
        return value;
    }
  };

  const handleAddContact = async () => {
    if (!newContact.contact_value) {
      toast.error('Preencha o valor do contato');
      return;
    }

    try {
      if (personId) {
        // Chama o endpoint para adicionar contato
        const addedContact = await PersonService.addContact(personId, {
          type_id: newContact.contact_type === 'EMAIL' ? 1 : 
                   newContact.contact_type === 'PHONE' ? 2 : 3,
          value: newContact.contact_value,
          name: newContact.contact_name || '',
        });

        // Adiciona o contato retornado pelo backend
        onChange([...contacts, addedContact]);
      } else {
        // Se não tiver personId, adiciona localmente
        onChange([...contacts, { 
          ...newContact, 
          person_contact_id: Date.now() 
        } as PersonContact]);
      }

      // Limpa o formulário
      setNewContact({ contact_type: 'EMAIL', contact_value: '', contact_name: '' });
      toast.success('Contato adicionado com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar contato');
      console.error(error);
    }
  };

  const handleRemoveContact = async (index: number) => {
    const contactToRemove = contacts[index];
    
    try {
      // Verifica se o contato tem person_contact_id para deletar
      if (contactToRemove.person_contact_id) {
        await PersonService.deletePersonContact(contactToRemove.person_contact_id);
      }
      
      // Remove o contato localmente
      onChange(contacts.filter((_, i) => i !== index));
      toast.success('Contato removido com sucesso');
    } catch (error) {
      toast.error('Erro ao remover contato');
      console.error(error);
    }
  };

  const handleSelectContact = (contact: PersonContact) => {
    setNewContact({
      contact_type: contact.contact_type,
      contact_value: contact.contact_value,
      contact_name: contact.contact_name || '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Contatos</h2>
      
      <div className="space-y-4">
        <ContactSearchSelect 
          onSelectContact={handleSelectContact}
          placeholder="Buscar contato existente"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              value={newContact.contact_type}
              onChange={(e) => setNewContact({ ...newContact, contact_type: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="EMAIL">Email</option>
              <option value="PHONE">Telefone</option>
              <option value="WHATSAPP">WhatsApp</option>
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
          <div>
            <input
              type="text"
              value={newContact.contact_name || ''}
              onChange={(e) => setNewContact({ ...newContact, contact_name: e.target.value })}
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

        <div className="mt-4 space-y-2">
          {contacts.map((contact, index) => (
            <div 
              key={contact.person_contact_id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {contact.contact_type === 'EMAIL' ? (
                  <Mail className="w-5 h-5 text-blue-500" />
                ) : contact.contact_type === 'PHONE' ? (
                  <Phone className="w-5 h-5 text-green-500" />
                ) : (
                  <Phone className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">{formatContactValue(contact.contact_type, contact.contact_value)}</p>
                  {contact.contact_name && (
                    <p className="text-sm text-gray-500">{contact.contact_name}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleRemoveContact(index)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};