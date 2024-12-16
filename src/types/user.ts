import { BaseRecord } from '../components/CRUDBase/types';

export interface UserLicense {
  id: number;
  name: string;
}

export interface User {
  user_id: number;
  person_id: number;
  profile_id: number | null;
  username: string;
  last_login: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  person_name: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}