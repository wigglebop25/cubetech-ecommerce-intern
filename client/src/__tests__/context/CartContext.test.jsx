import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 500,
  image: 'test.jpg',
  stock: 10
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].productId).toBe(1);
    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(500);
  });

  it('increases quantity when adding same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(1000);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });
    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(1);
    });
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });

  it('updates quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(2500);
  });

  it('removes item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2, name: 'Product 2' });
    });
    expect(result.current.cartItems).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });
});
