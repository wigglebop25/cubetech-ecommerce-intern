const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getHeaders = (includeAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = sessionStorage.getItem('adminToken');
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

  // Customer Auth
  customerLogin: (data) => 
    fetch(`${API_URL}/customers/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),

  customerRegister: (data) => 
    fetch(`${API_URL}/customers/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),

  getCustomerProfile: () => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/customers/profile`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },

  updateCustomerProfile: (data) => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/customers/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    }).then(handleResponse);
  },

  // Wishlist
  getWishlist: () => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/wishlist`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },

  addToWishlist: (productId) => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId })
    }).then(handleResponse);
  },

  removeFromWishlist: (productId) => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },

  // Discount
  getDiscounts: () => 
    fetch(`${API_URL}/discounts`, { headers: getHeaders(true) }).then(handleResponse),

  getDiscount: (id) => 
    fetch(`${API_URL}/discounts/${id}`, { headers: getHeaders(true) }).then(handleResponse),

  createDiscount: (data) => 
    fetch(`${API_URL}/discounts`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }).then(handleResponse),

  updateDiscount: (id, data) => 
    fetch(`${API_URL}/discounts/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }).then(handleResponse),

  deleteDiscount: (id) => 
    fetch(`${API_URL}/discounts/${id}`, { method: 'DELETE', headers: getHeaders(true) }).then(handleResponse),

  validateDiscount: (code, orderTotal) => 
    fetch(`${API_URL}/discounts/validate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, orderTotal }) }).then(handleResponse),

  // Customer Orders
  getCustomerOrders: (params = '') => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/customer/orders?${params}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },

  getCustomerOrder: (id) => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/customer/orders/${id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },

  cancelCustomerOrder: (id) => {
    const token = localStorage.getItem('customerToken');
    return fetch(`${API_URL}/customer/orders/${id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then(handleResponse);
  },
};
