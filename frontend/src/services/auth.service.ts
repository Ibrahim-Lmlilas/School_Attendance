import { apiClient } from '../utils/api-client';
import type { User, LoginResponse, UserResponse } from '../types/auth.types';

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Login failed');
  }

  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.data.user));

  return response.data.data;
};

// Client-side only logout - JWT is stateless
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<UserResponse>('/auth/me');
  
  if (!response.data.success) {
    throw new Error('Failed to fetch user');
  }

  return response.data.data.user;
};
