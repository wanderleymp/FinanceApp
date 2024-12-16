import React, { createContext, useCallback, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthService } from '../services/AuthService';
import { messages } from '../constants/messages';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  checkAuth: async () => {},
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isInitialCheckRef = useRef(false);

  const loadUserData = useCallback(async () => {
    try {
      console.log('Loading User Data');
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Load User Data Error:', error);
      
      // Use stored user data if getCurrentUser fails
      const storedUserJson = localStorage.getItem('user');
      if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson);
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
      }
    }
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    console.log('Checking Authentication');
    if (AuthService.isAuthenticated()) {
      console.log('Token Exists');
      await loadUserData();
    } else {
      console.log('No Token Found');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [loadUserData, navigate]);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login with:', username);
      const response = await AuthService.login(username, password);
      
      if (response.accessToken) {
        console.log('Login successful, user data:', response.user);
        setUser(response.user);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        console.error('No access token received');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      toast.error('Falha no login. Verifique suas credenciais.');
    }
  };

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success(messages.auth.logoutSuccess);
  }, [navigate]);

  useEffect(() => {
    if (!isInitialCheckRef.current) {
      console.log('AuthProvider Initial Check');
      checkAuth();
      isInitialCheckRef.current = true;
    }
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};