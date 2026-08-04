import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Products
  const fetchProducts = useCallback(async (params = '') => {
    setLoading(true);
    try {
      const data = await api.getProducts(params);
      setProducts(data.data || data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (product) => {
    const newProduct = await api.createProduct(product);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    const updated = await api.updateProduct(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Categories
  const fetchCategories = useCallback(async () => {
    const data = await api.getCategories();
    setCategories(data);
    return data;
  }, []);

  const addCategory = async (category) => {
    const newCategory = await api.createCategory(category);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = async (id, updates) => {
    const updated = await api.updateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCategory = async (id) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Orders
  const fetchOrders = useCallback(async (params = '') => {
    setLoading(true);
    try {
      const data = await api.getOrders(params);
      setOrders(data.data || data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
    return updated;
  };

  // Customers
  const fetchCustomers = useCallback(async () => {
    const data = await api.getCustomers();
    setCustomers(data);
    return data;
  }, []);

  // Stats
  const fetchStats = useCallback(async () => {
    const data = await api.getStats();
    setStats(data);
    return data;
  }, []);

  const value = {
    products, categories, orders, customers, stats, loading,
    fetchProducts, addProduct, updateProduct, deleteProduct,
    fetchCategories, addCategory, updateCategory, deleteCategory,
    fetchOrders, updateOrderStatus,
    fetchCustomers, fetchStats
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
