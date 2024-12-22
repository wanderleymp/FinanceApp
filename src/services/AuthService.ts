import { jwtDecode } from 'jwt-decode';
import { LoginCredentials, LoginResponse, User, DecodedToken, UserData } from '../types/auth';
import apiService from './ApiService';
import { messages } from '../constants/messages';

export class AuthService {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';
  private static readonly TOKEN_EXPIRY_THRESHOLD = 5 * 60; // 5 minutes in seconds

  public static async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', {
        username,
        password
      });

      console.log('Login Response:', response.data);

      if (response.data.accessToken) {
        localStorage.setItem(this.TOKEN_KEY, response.data.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.data.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  public static async getCurrentUser(): Promise<User> {
    try {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      // Fallback to fetching from server if no stored user
      const response = await apiService.get<User>('/auth/me');
      return response;
    } catch (error) {
      console.error('Get Current User Error:', error);
      throw new Error(messages.auth.sessionExpired);
    }
  };

  public static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  public static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public static getUserData(): UserData | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  public static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      
      // If token is about to expire, try to refresh it
      if (decoded.exp - currentTime < this.TOKEN_EXPIRY_THRESHOLD) {
        this.refreshToken();
        return false;
      }
      
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  private static setupTokenRefresh(token: string): void {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const expiresIn = decoded.exp - Date.now() / 1000;
      
      if (expiresIn > this.TOKEN_EXPIRY_THRESHOLD) {
        // Set timeout to refresh token before it expires
        setTimeout(
          () => this.refreshToken(),
          (expiresIn - this.TOKEN_EXPIRY_THRESHOLD) * 1000
        );
      } else {
        // Token is about to expire, refresh it immediately
        this.refreshToken();
      }
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
  }

  private static async refreshToken(): Promise<void> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/refresh', {
        refresh_token: localStorage.getItem(this.REFRESH_TOKEN_KEY)
      });
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      this.setupTokenRefresh(response.accessToken);
    } catch (error) {
      this.logout();
      throw new Error(messages.auth.tokenRefreshError);
    }
  }

  public static async validateToken(): Promise<boolean> {
    try {
      await apiService.get('/auth/validate');
      return true;
    } catch {
      return false;
    }
  }
}