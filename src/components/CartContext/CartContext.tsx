import React, { createContext, useState, ReactNode } from "react";

interface CartItem {
  id: string | number;
  quantity: number;
  [key: string]: any; 
}

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem, quantity: number | string) => void;
  removeFromCart: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, newQuantity: number | string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, setCartState] = useState<CartState>({
    cartItems: [],
    cartCount: 0,
  });

  const addToCart = (item: CartItem, quantity: number | string) => {
    const parsedQty = parseInt(quantity.toString(), 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      console.error("Invalid quantity provided to addToCart:", quantity);
      return;
    }
    
    setCartState((prevState) => {
      const existingItemIndex = prevState.cartItems.findIndex(i => i.id === item.id);
      
      let updatedItems;
      let newCount;
      
      if (existingItemIndex >= 0) {
        updatedItems = [...prevState.cartItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + parsedQty
        };
        newCount = prevState.cartCount + parsedQty;
      } else {
        updatedItems = [...prevState.cartItems, { ...item, quantity: parsedQty }];
        newCount = prevState.cartCount + parsedQty;
      }
      
      return {
        cartItems: updatedItems,
        cartCount: newCount
      };
    });
  };
  
  const removeFromCart = (itemId: string | number) => {
    setCartState((prevState) => {
      const itemToRemove = prevState.cartItems.find(item => item.id === itemId);
      if (!itemToRemove) return prevState;
      
      return {
        cartItems: prevState.cartItems.filter(item => item.id !== itemId),
        cartCount: prevState.cartCount - itemToRemove.quantity
      };
    });
  };
  
  const updateQuantity = (itemId: string | number, newQuantity: number | string) => {
    const parsedQty = parseInt(newQuantity.toString(), 10);
    if (isNaN(parsedQty) || parsedQty < 0) {
      console.error("Invalid quantity provided to updateQuantity:", newQuantity);
      return;
    }
    
    setCartState((prevState) => {
      const existingItemIndex = prevState.cartItems.findIndex(item => item.id === itemId);
      if (existingItemIndex === -1) return prevState;
      
      const item = prevState.cartItems[existingItemIndex];
      const quantityDifference = parsedQty - item.quantity;
      
      if (parsedQty === 0) {
        return {
          cartItems: prevState.cartItems.filter(item => item.id !== itemId),
          cartCount: prevState.cartCount - item.quantity
        };
      }
      
      const updatedItems = [...prevState.cartItems];
      updatedItems[existingItemIndex] = {
        ...item,
        quantity: parsedQty
      };
      
      return {
        cartItems: updatedItems,
        cartCount: prevState.cartCount + quantityDifference
      };
    });
  };
  
  const clearCart = () => {
    setCartState({
      cartItems: [],
      cartCount: 0
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: cartState.cartItems,
        cartCount: cartState.cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext, CartProvider, useCart };
export type { CartItem, CartContextType };