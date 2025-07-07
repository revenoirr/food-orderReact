import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  incrementQuantity, 
  decrementQuantity,
} from '../slices/cartSlice';

interface CartItem {
  id: string;
  meal: string;
  price: number;
  quantity: number;
  category: string;
  img?: string;
}

const createTestStore = (initialCartState: any = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        cartItems: [],
        cartCount: 0,
        total: 0,
        ...initialCartState,
      },
    },
  });
};

describe('cartSlice with React Testing Library', () => {
  const mockItem: CartItem = {
    id: '1',
    meal: 'Pizza',
    price: 12.99,
    quantity: 1,
    category: 'Italian',
    img: 'pizza.jpg'
  };

  describe('addToCart', () => {
    it('should add new item to empty cart', () => {
      const store = createTestStore();
      
      store.dispatch(addToCart({ item: mockItem, quantity: 2 }));
      const state = store.getState().cart;

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0]).toEqual({ ...mockItem, quantity: 2 });
      expect(state.cartCount).toBe(2);
      expect(state.total).toBe(25.98);
    });

    it('should increase quantity for existing item', () => {
      const store = createTestStore({
        cartItems: [{ ...mockItem, quantity: 1 }],
        cartCount: 1,
        total: 12.99
      });
      
      store.dispatch(addToCart({ item: mockItem, quantity: 3 }));
      const state = store.getState().cart;

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].quantity).toBe(4);
      expect(state.cartCount).toBe(4);
      expect(state.total).toBe(51.96);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const store = createTestStore({
        cartItems: [mockItem, { ...mockItem, id: '2', meal: 'Burger' }],
        cartCount: 2,
        total: 25.98
      });

      store.dispatch(removeFromCart('1'));
      const state = store.getState().cart;

      expect(state.cartItems).toHaveLength(1);
      expect(state.cartItems[0].id).toBe('2');
      expect(state.cartCount).toBe(1);
      expect(state.total).toBe(12.99);
    });

    it('should handle removing non-existent item', () => {
      const store = createTestStore();
      
      store.dispatch(removeFromCart('999'));
      const state = store.getState().cart;

      expect(state.cartItems).toHaveLength(0);
      expect(state.cartCount).toBe(0);
      expect(state.total).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = createTestStore({
        cartItems: [{ ...mockItem, quantity: 2 }],
        cartCount: 2,
        total: 25.98
      });

      store.dispatch(updateQuantity({ itemId: '1', newQuantity: 5 }));
      const state = store.getState().cart;

      expect(state.cartItems[0].quantity).toBe(5);
      expect(state.cartCount).toBe(5);
      expect(state.total).toBe(64.95);
    });

    it('should handle updating non-existent item', () => {
      const store = createTestStore();
      
      store.dispatch(updateQuantity({ itemId: '999', newQuantity: 5 }));
      const state = store.getState().cart;

      expect(state.cartItems).toHaveLength(0);
      expect(state.cartCount).toBe(0);
      expect(state.total).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const store = createTestStore({
        cartItems: [mockItem, { ...mockItem, id: '2' }],
        cartCount: 2,
        total: 25.98
      });

      store.dispatch(clearCart());
      const state = store.getState().cart;

      expect(state.cartItems).toHaveLength(0);
      expect(state.cartCount).toBe(0);
      expect(state.total).toBe(0);
    });
  });

  describe('incrementQuantity', () => {
    it('should increment item quantity by 1', () => {
      const store = createTestStore({
        cartItems: [{ ...mockItem, quantity: 2 }],
        cartCount: 2,
        total: 25.98
      });

      store.dispatch(incrementQuantity('1'));
      const state = store.getState().cart;

      expect(state.cartItems[0].quantity).toBe(3);
      expect(state.cartCount).toBe(3);
      expect(state.total).toBe(38.97);
    });
  });

  describe('decrementQuantity', () => {
    it('should decrement item quantity by 1', () => {
      const store = createTestStore({
        cartItems: [{ ...mockItem, quantity: 3 }],
        cartCount: 3,
        total: 38.97
      });

      store.dispatch(decrementQuantity('1'));
      const state = store.getState().cart;

      expect(state.cartItems[0].quantity).toBe(2);
      expect(state.cartCount).toBe(2);
      expect(state.total).toBe(25.98);
    });

    it('should not decrement below quantity 1', () => {
      const store = createTestStore({
        cartItems: [{ ...mockItem, quantity: 1 }],
        cartCount: 1,
        total: 12.99
      });

      store.dispatch(decrementQuantity('1'));
      const state = store.getState().cart;

      expect(state.cartItems[0].quantity).toBe(1);
      expect(state.cartCount).toBe(1);
      expect(state.total).toBe(12.99);
    });
  });
});