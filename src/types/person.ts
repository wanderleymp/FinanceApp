import { BaseRecord } from '../components/CRUDBase/types';

export type PersonType = 'PF' | 'PJ';

export interface PersonDocument {
  person_document_id?: number;
  person_id?: number;
  document_value: string;
  document_type: string;
}

export interface PersonContact {
  id?: number;
  person_id?: number;
  contact_id?: number;
  contact_type: string;
  contact_value: string;
}

export interface PersonAddress {
  id?: number;
  person_id?: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  reference?: string;
  ibge?: number;
}

export interface Person {
  person_id: number;
  full_name: string;
  birth_date?: string | null;
  created_at: string;
  fantasy_name?: string | null;
  updated_at: string;
  active: boolean;
  person_type: PersonType | null;
  documents: PersonDocument[];
  contacts: PersonContact[];
  addresses: PersonAddress[];
}

export interface PersonsResponse {
  data: Person[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}