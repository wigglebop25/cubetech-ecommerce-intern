import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('adminUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken'));

  const isAuthenticated = !!token;

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    setUser(data.user);
    setToken(data.accessToken);
    sessionStorage.setItem('adminUser', JSON.stringify(data.user));
    sessionStorage.setItem('adminToken', data.accessToken);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
