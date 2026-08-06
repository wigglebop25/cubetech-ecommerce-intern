import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CustomerAuthProvider, useCustomerAuth } from '../../context/CustomerAuthContext';

vi.mock('../../services/api', () => ({
  api: {
    customerLogin: vi.fn(),
    customerRegister: vi.fn(),
    getCustomerProfile: vi.fn(),
  }
}));

import { api } from '../../services/api';

const wrapper = ({ children }) => <CustomerAuthProvider>{children}</CustomerAuthProvider>;

describe('CustomerAuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useCustomerAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.customer).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('logs in and stores token', async () => {
    api.customerLogin.mockResolvedValue({
      customer: { id: 1, name: 'Test User', email: 'test@test.com' },
      token: 'fake-jwt-token'
    });

    const { result } = renderHook(() => useCustomerAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.customer.name).toBe('Test User');
    expect(result.current.token).toBe('fake-jwt-token');
    expect(localStorage.getItem('customerToken')).toBe('fake-jwt-token');
  });

  it('logs out and clears storage', async () => {
    api.customerLogin.mockResolvedValue({
      customer: { id: 1, name: 'Test User', email: 'test@test.com' },
      token: 'fake-jwt-token'
    });

    const { result } = renderHook(() => useCustomerAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.customer).toBeNull();
    expect(localStorage.getItem('customerToken')).toBeNull();
  });

  it('registers and auto-logs in', async () => {
    api.customerRegister.mockResolvedValue({
      customer: { id: 2, name: 'New User', email: 'new@test.com' },
      token: 'new-jwt-token'
    });

    const { result } = renderHook(() => useCustomerAuth(), { wrapper });

    await act(async () => {
      await result.current.register('New User', 'new@test.com', 'password123', '09171234567');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.customer.name).toBe('New User');
  });

  it('persists login from localStorage', () => {
    localStorage.setItem('customerToken', 'saved-token');
    localStorage.setItem('customerUser', JSON.stringify({ id: 1, name: 'Saved User' }));

    const { result } = renderHook(() => useCustomerAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.customer.name).toBe('Saved User');
    expect(result.current.token).toBe('saved-token');
  });
});
