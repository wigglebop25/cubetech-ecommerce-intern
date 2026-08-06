import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('customerUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('customerToken'));

  const isAuthenticated = !!token;

  const login = async (email, password) => {
    const data = await api.customerLogin({ email, password });
    setCustomer(data.customer);
    setToken(data.token);
    localStorage.setItem('customerUser', JSON.stringify(data.customer));
    localStorage.setItem('customerToken', data.token);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.customerRegister({ name, email, password, phone });
    setCustomer(data.customer);
    setToken(data.token);
    localStorage.setItem('customerUser', JSON.stringify(data.customer));
    localStorage.setItem('customerToken', data.token);
    return data;
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('customerUser');
    localStorage.removeItem('customerToken');
  };

  const getProfile = useCallback(async () => {
    if (!token) return null;
    try {
      const data = await api.getCustomerProfile();
      setCustomer(data);
      localStorage.setItem('customerUser', JSON.stringify(data));
      return data;
    } catch {
      logout();
      return null;
    }
  }, [token]);

  const value = {
    customer,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile
  };

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return context;
}
