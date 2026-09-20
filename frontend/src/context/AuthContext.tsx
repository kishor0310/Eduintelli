import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User | null>;
  quickLoginAs: (role: UserRole, customStudentId?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('eduintelli_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check current session on initial mount
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('eduintelli_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('eduintelli_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        localStorage.removeItem('eduintelli_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string = 'Demo@123') => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('eduintelli_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
      else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginAs = async (role: UserRole, customStudentId?: string) => {
    let email = 'student@demo.com';
    if (role === 'TEACHER') {
      email = 'teacher@demo.com';
    } else if (role === 'ADMIN') {
      email = 'admin@demo.com';
    } else if (customStudentId === 'std-02') {
      email = 'jordan.hayes@demo.com'; // High Risk student
    } else if (customStudentId === 'std-03') {
      email = 'priya.sharma@demo.com'; // Medium Risk student
    }

    await login(email, 'Demo@123');
  };

  const logout = () => {
    localStorage.removeItem('eduintelli_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        quickLoginAs,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
