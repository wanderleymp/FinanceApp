import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { PersonContact } from '../../types/person';
import { PersonService } from '../../services/PersonService';

interface ContactSearchSelectProps {
  onSelectContact: (contact: PersonContact) => void;
  placeholder?: string;
  className?: string;
}

export const ContactSearchSelect: React.FC<ContactSearchSelectProps> = ({
  onSelectContact,
  placeholder = 'Buscar contato',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<PersonContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<PersonContact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      const results = await PersonService.searchContacts(searchTerm);
      setContacts(results);
      setIsOpen(results.length > 0);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      setContacts([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contact: PersonContact) => {
    setSelectedContact(contact);
    setSearchTerm(`${contact.contact_type}: ${contact.contact_value}`);
    setIsOpen(false);
    onSelectContact(contact);
  };

  const handleClear = () => {
    setSelectedContact(null);
    setSearchTerm('');
    setContacts([]);
  };

  const formatContactDisplay = (contact: PersonContact) => {
    const formattedValue = contact.contact_type === 'PHONE' 
      ? contact.contact_value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
      : contact.contact_value;
    
    return `${contact.contact_type}: ${formattedValue}`;
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {selectedContact ? (
              <button 
                type="button" 
                onClick={handleClear}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSearch}
                disabled={isLoading}
                className="text-gray-400 hover:text-blue-500 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && contacts.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="font-medium">{formatContactDisplay(contact)}</span>
                {contact.contact_name && (
                  <p className="text-xs text-gray-500">{contact.contact_name}</p>
                )}
              </div>
              {selectedContact?.id === contact.id && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
