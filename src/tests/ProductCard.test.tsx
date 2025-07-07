import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import ProductCard, { Item, ProductCardProps } from '../components/ProductCard/ProductCard';
import cartReducer, { addToCart } from '../slices/cartSlice';
import { vi } from 'vitest';

import '@testing-library/jest-dom';

interface CartState {
  cartItems: any[];
  cartCount: number;
  total: number;
}

interface RootState {
  cart: CartState;
}

type TestStore = EnhancedStore<RootState>;

vi.mock('../Button/Button', () => ({
  default: ({ children, onClick, variant, className }: any) => (
    <button 
      onClick={onClick} 
      className={`${variant} ${className}`}
      data-testid={`button-${variant}`}
    >
      {children}
    </button>
  )
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

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
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('ProductCard Cart Functionality', () => {
  const mockItem: Item = {
    id: '1',
    meal: 'Pizza',
    price: 12.99,
    category: 'Italian',
    img: 'pizza.jpg',
    instructions: 'Delicious pizza with fresh ingredients'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Add to Cart functionality', () => {
    it('should add item to cart with default quantity of 1', () => {
      const { store } = renderWithProviders(<ProductCard item={mockItem} />);
      
      const addButton = screen.getByRole('button', { name: /add to cart/i });
      
      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartItems[0]).toEqual({
        id: '1',
        meal: 'Pizza',
        price: 12.99,
        category: 'Italian',  
        img: 'pizza.jpg',
        instructions: 'Delicious pizza with fresh ingredients',
        quantity: 1 
      });
      expect(state.cart.cartCount).toBe(1);
      expect(state.cart.total).toBe(12.99);
    });

    it('should add item to cart with custom quantity', () => {
      const { store } = renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton');
      const addButton = screen.getByRole('button', { name: /add to cart/i });

      fireEvent.change(quantityInput, { target: { value: '3' } });
      
      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartCount).toBe(3);
      expect(state.cart.total).toBe(38.97);
    });

    it('should generate ID for item without ID', () => {
      const itemWithoutId = { ...mockItem };
      delete itemWithoutId.id;
      
      const { store } = renderWithProviders(<ProductCard item={itemWithoutId} />);
      
      const addButton = screen.getByRole('button', { name: /add to cart/i });
      
      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartItems[0].id).toMatch(/Pizza-\d+/);
    });

    it('should reset quantity to 1 after adding to cart', () => {
      renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add to cart/i });

      fireEvent.change(quantityInput, { target: { value: '5' } });
      expect(quantityInput.value).toBe('5');

      act(() => {
        fireEvent.click(addButton);
      });

      expect(quantityInput.value).toBe('1');
    });

    it('should log correct message when adding to cart', () => {
      renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton');
      const addButton = screen.getByRole('button', { name: /add to cart/i });

      fireEvent.change(quantityInput, { target: { value: '2' } });
      
      act(() => {
        fireEvent.click(addButton);
      });

      expect(mockConsoleLog).toHaveBeenCalledWith('Added 2 Pizza(s) to cart');
    });
  });



  describe('Quantity input validation', () => {
    it('should enforce minimum quantity of 1', () => {
      renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.change(quantityInput, { target: { value: '0' } });
      fireEvent.blur(quantityInput);

      expect(quantityInput.value).toBe('1');
    });

    it('should enforce maximum quantity of 99', () => {
      renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.change(quantityInput, { target: { value: '150' } });

      expect(quantityInput.value).toBe('99');
    });

    it('should handle empty input by setting to 1', () => {
      renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.change(quantityInput, { target: { value: '' } });
      fireEvent.blur(quantityInput);

      expect(quantityInput.value).toBe('1');
    });

    it('should reject non-numeric input', () => {
      renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
      const initialValue = quantityInput.value;

      fireEvent.change(quantityInput, { target: { value: 'abc' } });

      expect(quantityInput.value).toBe(initialValue);
    });
  });

  describe('Multiple cart interactions', () => {
    it('should handle multiple additions to cart', () => {
      const { store } = renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton');
      const addButton = screen.getByRole('button', { name: /add to cart/i });

      fireEvent.change(quantityInput, { target: { value: '2' } });
      
      act(() => {
        fireEvent.click(addButton);
      });

      fireEvent.change(quantityInput, { target: { value: '3' } });
      
      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartCount).toBe(5);
      expect(state.cart.total).toBe(64.95);
    });

    it('should handle multiple separate additions to cart', () => {
      const { store } = renderWithProviders(<ProductCard item={mockItem} />);
      
      const addButton = screen.getByRole('button', { name: /add to cart/i });

      act(() => {
        fireEvent.click(addButton);
      });

      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.cartItems).toHaveLength(1);
      expect(state.cart.cartCount).toBe(2);
      expect(state.cart.total).toBe(25.98);
    });
  });

  describe('Edge cases', () => {
    it('should handle item without price', () => {
      const itemWithoutPrice = { ...mockItem, price: 0 };
      const { store } = renderWithProviders(<ProductCard item={itemWithoutPrice} />);
      
      const addButton = screen.getByRole('button', { name: /add to cart/i });
      
      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.total).toBe(0);
    });

    it('should handle adding item with large quantity', () => {
      const { store } = renderWithProviders(<ProductCard item={mockItem} />);
      
      const quantityInput = screen.getByRole('spinbutton');
      const addButton = screen.getByRole('button', { name: /add to cart/i });

      fireEvent.change(quantityInput, { target: { value: '99' } });
      
      act(() => {
        fireEvent.click(addButton);
      });

      const state = store.getState() as RootState;
      expect(state.cart.cartCount).toBe(99);
      expect(state.cart.total).toBe(1286.01); 
    });
  });
});