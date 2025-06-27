import React, { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCart } from '../hooks/useCart';
import cartReducer from '../slices/cartSlice';

const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        cartItems: [],
        cartCount: 0,
        total: 0,
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (store: any) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(() => useCart(), { wrapper });
};

describe('useCart hook', () => {
  const mockItem = {
    id: '1',
    meal: 'Pizza',
    price: 12.99,
    quantity: 1,
    category: 'Italian',
  };

  describe('addToCart', () => {
    it('should add item with number quantity', () => {
      const store = createMockStore();
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.addToCart(mockItem, 2);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
      expect(result.current.cartCount).toBe(2);
    });

    it('should add item with string quantity', () => {
      const store = createMockStore();
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.addToCart(mockItem, '3');
      });

      expect(result.current.cartItems[0].quantity).toBe(3);
      expect(result.current.cartCount).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item with string ID', () => {
      const store = createMockStore({
        cartItems: [mockItem],
        cartCount: 1,
        total: 12.99,
      });
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.removeFromCart('1');
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.cartCount).toBe(0);
    });

    it('should remove item with number ID', () => {
      const itemWithNumId = { ...mockItem, id: 123 };
      const store = createMockStore({
        cartItems: [itemWithNumId],
        cartCount: 1,
        total: 12.99,
      });
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.removeFromCart(123);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity with number', () => {
      const store = createMockStore({
        cartItems: [{ ...mockItem, quantity: 2 }],
        cartCount: 2,
        total: 25.98,
      });
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.updateQuantity('1', 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
      expect(result.current.cartCount).toBe(5);
    });

    it('should update quantity with string', () => {
      const store = createMockStore({
        cartItems: [{ ...mockItem, quantity: 2 }],
        cartCount: 2,
        total: 25.98,
      });
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.updateQuantity('1', '4');
      });

      expect(result.current.cartItems[0].quantity).toBe(4);
      expect(result.current.cartCount).toBe(4);
    });
  });

  describe('clearCart', () => {
    it('should clear all items', () => {
      const store = createMockStore({
        cartItems: [mockItem, { ...mockItem, id: '2' }],
        cartCount: 2,
        total: 25.98,
      });
      const { result } = renderWithProvider(store);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.cartCount).toBe(0);
    });
  });

  describe('initial state', () => {
    it('should return empty cart initially', () => {
      const store = createMockStore();
      const { result } = renderWithProvider(store);

      expect(result.current.cartItems).toEqual([]);
      expect(result.current.cartCount).toBe(0);
    });

    it('should return existing cart items', () => {
      const store = createMockStore({
        cartItems: [mockItem],
        cartCount: 1,
        total: 12.99,
      });
      const { result } = renderWithProvider(store);

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toEqual(mockItem);
      expect(result.current.cartCount).toBe(1);
    });
  });
});