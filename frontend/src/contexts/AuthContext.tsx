import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to load the user profile based on the stored token
  const loadProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
          try {
              const userProfile = await authAPI.getProfile();
              setUser(userProfile);
          } catch (error) {
              console.error("Auth check failed:", error);
              localStorage.removeItem('authToken');
              setUser(null); // Clear user if token is invalid
          }
      }
      setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []); // Run only on initial mount

  const login = async (email: string, password: string) => {
    // 1. Get the token
    const response = await authAPI.login(email, password);
    localStorage.setItem('authToken', response.access_token);
    
    // 2. Fetch the user profile and update state
    await loadProfile(); 
    // This will update the user state and trigger Index.tsx to redirect/show dashboard
  };

  const signup = async (username: string, email: string, password: string) => {
    await authAPI.signup(username, email, password);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};