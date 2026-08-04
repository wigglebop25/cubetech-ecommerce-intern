const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getHeaders = (includeAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const api = {
  // Products
  getProducts: (params = '') => 
    fetch(`${API_URL}/products${params ? `?${params}` : ''}`).then(handleResponse),
  
  getProduct: (id) => 
    fetch(`${API_URL}/products/${id}`).then(handleResponse),
  
  createProduct: (data) => 
    fetch(`${API_URL}/products`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }).then(handleResponse),
  
  updateProduct: (id, data) => 
    fetch(`${API_URL}/products/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }).then(handleResponse),
  
  deleteProduct: (id) => 
    fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: getHeaders(true) }).then(handleResponse),

  // Categories
  getCategories: () => 
    fetch(`${API_URL}/categories`).then(handleResponse),
  
  createCategory: (data) => 
    fetch(`${API_URL}/categories`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }).then(handleResponse),
  
  updateCategory: (id, data) => 
    fetch(`${API_URL}/categories/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }).then(handleResponse),
  
  deleteCategory: (id) => 
    fetch(`${API_URL}/categories/${id}`, { method: 'DELETE', headers: getHeaders(true) }).then(handleResponse),

  // Orders
  getOrders: (params = '') => 
    fetch(`${API_URL}/orders${params ? `?${params}` : ''}`, { headers: getHeaders(true) }).then(handleResponse),
  
  getOrder: (id) => 
    fetch(`${API_URL}/orders/${id}`, { headers: getHeaders(true) }).then(handleResponse),
  
  createOrder: (data) => 
    fetch(`${API_URL}/orders`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
  
  updateOrderStatus: (id, status) => 
    fetch(`${API_URL}/orders/${id}/status`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify({ status }) }).then(handleResponse),

  // Customers
  getCustomers: () => 
    fetch(`${API_URL}/customers`, { headers: getHeaders(true) }).then(handleResponse),

  // Auth
  login: (data) => 
    fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),

  // Stats
  getStats: () => 
    fetch(`${API_URL}/stats`, { headers: getHeaders(true) }).then(handleResponse),

  // Analytics
  getDashboard: () => 
    fetch(`${API_URL}/analytics/dashboard`, { headers: getHeaders(true) }).then(handleResponse),

  // Health
  getHealth: () => 
    fetch(`${API_URL}/health`).then(handleResponse),
};
