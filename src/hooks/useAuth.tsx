import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { mockDatabase } from '../services/mockDatabase';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = mockDatabase.getCurrentUser();
    if (currentUser) {
      // Refresh user data from database
      const updatedUser = mockDatabase.getUserById(currentUser.id);
      if (updatedUser) {
        setUser(updatedUser);
        mockDatabase.setCurrentUser(updatedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    mockDatabase.setCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    mockDatabase.clearCurrentUser();
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = mockDatabase.updateUser(user.id, updates);
    if (updatedUser) {
      setUser(updatedUser);
      mockDatabase.setCurrentUser(updatedUser);
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};