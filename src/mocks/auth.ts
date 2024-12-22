import { LoginResponse, User } from '../types/auth';

export const mockUser: User = {
  id: 1,
  username: 'admin',
  profile_id: 1,
  full_name: 'Administrador',
  role: 'admin'
};

export const mockLoginResponse: LoginResponse = {
  accessToken: 'mock_access_token',
  refreshToken: 'mock_refresh_token',
  user: {
    user_id: 1,
    username: 'admin',
    profile_id: 1
  }
};
