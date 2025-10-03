import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      console.log('Logging in with:', email, password);

      // For demo purposes, accept any email/password
      if (email && password) {
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<boolean> => {
    try {
      // Simulate API call
      console.log('Registering with:', email, password, name);

      // For demo purposes, accept any valid inputs
      if (email && password && name) {
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call
      console.log('Resetting password for:', email);
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
