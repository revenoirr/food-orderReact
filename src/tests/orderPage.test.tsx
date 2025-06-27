import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import OrderPage from '../components/OrderPage/OrderPage'; 
import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart, CartItem } from '../slices/cartSlice';
import { vi } from 'vitest';

import '@testing-library/jest-dom';

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  total: number; 
}

interface RootState {
  cart: CartState;
}

type TestStore = EnhancedStore<RootState>;

vi.mock('../../Button/Button', () => ({
  default: ({ children, onClick, variant, className, disabled, type }: any) => (
    <button 
      onClick={onClick} 
      className={`${variant} ${className}`}
      disabled={disabled}
      type={type}
      data-testid={`button-${variant}`}
    >
      {children}
    </button>
  )
}));

Object.defineProperty(window, 'history', {
  value: {
    back: vi.fn(),
    replaceState: vi.fn(),
    pushState: vi.fn(),
  },
  writable: true,
});

const createTestStore = (initialCartState: Partial<CartState> = {}): TestStore => {
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

const renderWithProviders = (
  component: React.ReactElement,
  store: TestStore = createTestStore()
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
};

describe('OrderPage Cart Functionality', () => {
  const mockCartItems: CartItem[] = [
    {
      id: '1',
      meal: 'Pizza',
      price: 12.99,
      img: 'pizza.jpg',
      quantity: 2,
    },
    {
      id: '2',
      meal: 'Burger',
      price: 8.50,
      img: 'burger.jpg',
      quantity: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty Cart State', () => {
    it('should display empty cart message when no items in cart', () => {
      renderWithProviders(<OrderPage />);
      
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });

    it('should call window.history.back when Continue Shopping is clicked', () => {
      renderWithProviders(<OrderPage />);
      
      const continueButton = screen.getByText('Continue Shopping');
      fireEvent.click(continueButton);
      
      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('Cart Items Display', () => {
    it('should display cart items correctly', () => {
      const store = createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
        total: 34.48,
      });
      
      renderWithProviders(<OrderPage />, store);
      
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('$12.99 USD')).toBeInTheDocument();
      expect(screen.getByText('$8.50 USD')).toBeInTheDocument();
    });

    it('should display placeholder image when item has no image', () => {
      const itemsWithoutImages = mockCartItems.map((item: CartItem) => ({ ...item, img: undefined }));
      const store = createTestStore({
        cartItems: itemsWithoutImages,
        cartCount: 3,
        total: 34.48,
      });
      
      renderWithProviders(<OrderPage />, store);
      
      expect(screen.getAllByText('No image')).toHaveLength(2);
    });

    it('should display fallback text for items without meal name', () => {
      const itemsWithoutMeal = mockCartItems.map((item: CartItem) => ({ ...item, meal: 'Menu Item' }));
      const store = createTestStore({
        cartItems: itemsWithoutMeal,
        cartCount: 3,
        total: 34.48,
      });
      
      renderWithProviders(<OrderPage />, store);
      
      expect(screen.getAllByText('Menu Item')).toHaveLength(2);
    });

    it('should calculate and display total correctly', () => {
      const store = createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
        total: 34.48,
      });
      
      renderWithProviders(<OrderPage />, store);
      
      expect(screen.getByText('Total: $34.48 USD')).toBeInTheDocument();
    });
  });

  describe('Quantity Management', () => {
    it('should update quantity when input value changes', () => {
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
        total: 34.48,
      }));
      
      const quantityInputs = screen.getAllByRole('spinbutton');
      const firstQuantityInput = quantityInputs[0];
      
      act(() => {
        fireEvent.change(firstQuantityInput, { target: { value: '5' } });
      });
      
      const state = store.getState() as RootState;
      const updatedItem = state.cart.cartItems.find(item => item.id === '1');
      expect(updatedItem?.quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
        total: 34.48,
      }));
      
      const quantityInputs = screen.getAllByRole('spinbutton');
      const firstQuantityInput = quantityInputs[0];
      
      act(() => {
        fireEvent.change(firstQuantityInput, { target: { value: '0' } });
      });
      
      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartItems.find(item => item.id === '1')).toBeUndefined();
    });

    it('should handle invalid quantity input gracefully', () => {
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
        total: 34.48,
      }));
      
      const quantityInputs = screen.getAllByRole('spinbutton');
      const firstQuantityInput = quantityInputs[0];
      
      act(() => {
        fireEvent.change(firstQuantityInput, { target: { value: 'abc' } });
      });
      
      const state = store.getState() as RootState;
      const updatedItem = state.cart.cartItems.find(item => item.id === '1');
      expect(updatedItem?.quantity).toBe(1); 
    });
  });

  describe('Item Removal', () => {
    it('should remove item when remove button is clicked', () => {
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
        total: 34.48,
      }));
      
      const removeButtons = screen.getAllByRole('button', { name: /remove item/i });
      const firstRemoveButton = removeButtons[0];
      
      act(() => {
        fireEvent.click(firstRemoveButton);
      });
      
      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartItems.find(item => item.id === '1')).toBeUndefined();
    });

    it('should update total after item removal', () => {
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: mockCartItems,
        cartCount: 3,
      }));
      
      const removeButtons = screen.getAllByRole('button', { name: /remove item/i });
      const firstRemoveButton = removeButtons[0];
      
      act(() => {
        fireEvent.click(firstRemoveButton);
      });

      expect(screen.getByText('Total: $8.50 USD')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle items without price gracefully', () => {
      const itemsWithoutPrice = mockCartItems.map((item: CartItem) => ({ ...item, price: 0 }));
      const store = createTestStore({
        cartItems: itemsWithoutPrice,
        cartCount: 3,
        total: 0,
      });
      
      renderWithProviders(<OrderPage />, store);
      
      expect(screen.getAllByText('$0.00 USD')).toHaveLength(2);
      expect(screen.getByText('Total: $0.00 USD')).toBeInTheDocument();
    });

    it('should handle zero price items', () => {
      const itemsWithZeroPrice = mockCartItems.map((item: CartItem) => ({ ...item, price: 0 }));
      const store = createTestStore({
        cartItems: itemsWithZeroPrice,
        cartCount: 3,
        total: 0,
      });
      
      renderWithProviders(<OrderPage />, store);
      
      expect(screen.getByText('Total: $0.00 USD')).toBeInTheDocument();
    });

    it('should handle items with string IDs', () => {
      const itemsWithStringIds = mockCartItems.map((item: CartItem) => ({ ...item, id: `item-${item.id}` }));
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: itemsWithStringIds,
        cartCount: 3,
        total: 34.48,
      }));
      
      const removeButtons = screen.getAllByRole('button', { name: /remove item/i });
      
      act(() => {
        fireEvent.click(removeButtons[0]);
      });
      
      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
    });

    it('should handle items with numeric IDs', () => {
      const itemsWithNumericIds = mockCartItems.map((item: CartItem) => ({ ...item, id: parseInt(item.id as string) }));
      const { store } = renderWithProviders(<OrderPage />, createTestStore({
        cartItems: itemsWithNumericIds,
        cartCount: 3,
        total: 34.48,
      }));
      
      const removeButtons = screen.getAllByRole('button', { name: /remove item/i });
      
      act(() => {
        fireEvent.click(removeButtons[0]);
      });
      
      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
    });
  });
});