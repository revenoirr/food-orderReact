import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string | number;
  quantity: number;
  [key: string]: any; 
}

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
}

const initialState: CartState = {
  cartItems: [],
  cartCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: CartItem; quantity: number | string }>) => {
      const { item, quantity } = action.payload;
      const parsedQty = parseInt(quantity.toString(), 10);
      
      if (isNaN(parsedQty) || parsedQty < 1) {
        console.error("Invalid quantity provided to addToCart:", quantity);
        return;
      }
      
      const existingItemIndex = state.cartItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].quantity += parsedQty;
        state.cartCount += parsedQty;
      } else {
        state.cartItems.push({ ...item, quantity: parsedQty });
        state.cartCount += parsedQty;
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      const itemId = action.payload;
      const itemToRemove = state.cartItems.find(item => item.id === itemId);
      
      if (itemToRemove) {
        state.cartItems = state.cartItems.filter(item => item.id !== itemId);
        state.cartCount -= itemToRemove.quantity;
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ itemId: string | number; newQuantity: number | string }>) => {
      const { itemId, newQuantity } = action.payload;
      const parsedQty = parseInt(newQuantity.toString(), 10);
      
      if (isNaN(parsedQty) || parsedQty < 0) {
        console.error("Invalid quantity provided to updateQuantity:", newQuantity);
        return;
      }
      
      const existingItemIndex = state.cartItems.findIndex(item => item.id === itemId);
      if (existingItemIndex === -1) return;
      
      const item = state.cartItems[existingItemIndex];
      const quantityDifference = parsedQty - item.quantity;
      
      if (parsedQty === 0) {
        state.cartItems = state.cartItems.filter(item => item.id !== itemId);
        state.cartCount -= item.quantity;
      } else {
        state.cartItems[existingItemIndex].quantity = parsedQty;
        state.cartCount += quantityDifference;
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


export type { CartItem };