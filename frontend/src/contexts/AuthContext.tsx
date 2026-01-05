import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth.types';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/auth.service';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = getCurrentUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { user: loggedInUser } = await loginService(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  /**
   * Logout function
   * Calls the logout service and clears user state
   */
  const logout = async (): Promise<void> => {
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user state even if API call fails
      setUser(null);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
