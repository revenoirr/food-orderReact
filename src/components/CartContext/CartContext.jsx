import { createContext, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartState, setCartState] = useState({
    cartItems: [],
    cartCount: 0,
  });

  const addToCart = (item, quantity) => {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1) return;
    
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
  
  const removeFromCart = (itemId) => {
    setCartState((prevState) => {
      const itemToRemove = prevState.cartItems.find(item => item.id === itemId);
      if (!itemToRemove) return prevState;
      
      return {
        cartItems: prevState.cartItems.filter(item => item.id !== itemId),
        cartCount: prevState.cartCount - itemToRemove.quantity
      };
    });
  };
  
  const updateQuantity = (itemId, newQuantity) => {
    const parsedQty = parseInt(newQuantity, 10);
    if (isNaN(parsedQty) || parsedQty < 0) return;
    
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

export { CartContext, CartProvider };