import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');

      if (token && userEmail) {
        // TODO: Uncomment when backend is ready
        // try {
        //   const response = await authAPI.getProfile();
        //   setUser(response.user);
        // } catch (error) {
        //   // Token might be invalid, clear it
        //   localStorage.removeItem('authToken');
        //   localStorage.removeItem('userEmail');
        // }

        // For now, simulate user from stored data
        setUser({
          id: 'demo-user',
          email: userEmail
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Uncomment when backend is ready
    // const response = await authAPI.login(email, password);
    // localStorage.setItem('authToken', response.token);
    // localStorage.setItem('userEmail', email);
    // setUser(response.user);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store auth state
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('userEmail', email);

    setUser({
      id: 'demo-user',
      email: email
    });
  };

  const signup = async (email: string, password: string) => {
    // TODO: Uncomment when backend is ready
    // const response = await authAPI.signup(email, password);
    // localStorage.setItem('authToken', response.token);
    // localStorage.setItem('userEmail', email);
    // setUser(response.user);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const logout = () => {
    // TODO: Uncomment when backend is ready
    // try {
    //   await authAPI.logout();
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
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
