import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string | number;
  meal: string;
  price: number;
  quantity: number;
  category?: string;
  img?: string;
  instructions?: string;
}

interface CartState {
  cartItems: CartItem[]; 
  cartCount: number;     
  total: number;
}

const initialState: CartState = {
  cartItems: [],
  cartCount: 0,
  total: 0,
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateCartCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: CartItem; quantity: number }>) => {
      const { item, quantity } = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ ...item, quantity });
      }

      state.total = calculateTotal(state.cartItems);
      state.cartCount = calculateCartCount(state.cartItems);
    },

    removeFromCart: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);
      state.total = calculateTotal(state.cartItems);
      state.cartCount = calculateCartCount(state.cartItems);
    },

    updateQuantity: (state, action: PayloadAction<{ itemId: string | number; newQuantity: number }>) => {
      const { itemId, newQuantity } = action.payload;
      const item = state.cartItems.find(cartItem => cartItem.id === itemId);
      
      if (item) {
        item.quantity = newQuantity;
        state.total = calculateTotal(state.cartItems);
        state.cartCount = calculateCartCount(state.cartItems);
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.total = 0;
    },

    incrementQuantity: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;
      const item = state.cartItems.find(cartItem => cartItem.id === id);
      
      if (item) {
        item.quantity += 1;
        state.total = calculateTotal(state.cartItems);
        state.cartCount = calculateCartCount(state.cartItems);
      }
    },

    decrementQuantity: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;
      const item = state.cartItems.find(cartItem => cartItem.id === id);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.total = calculateTotal(state.cartItems);
        state.cartCount = calculateCartCount(state.cartItems);
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  incrementQuantity, 
  decrementQuantity 
} = cartSlice.actions;

export default cartSlice.reducer;