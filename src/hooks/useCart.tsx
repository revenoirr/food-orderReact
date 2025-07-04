import { useAppSelector, useAppDispatch } from '../hooks';
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateQuantity as updateQuantityAction, clearCart as clearCartAction } from '../slices/cartSlice';
import type { CartItem } from '../slices/cartSlice';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem, quantity: number | string) => void;
  removeFromCart: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, newQuantity: number | string) => void;
  clearCart: () => void;
}

export const useCart = (): CartContextType => {
  const dispatch = useAppDispatch();
  const { cartItems, cartCount } = useAppSelector(state => state.cart);

  const addToCart = (item: CartItem, quantity: number | string) => {
    const numQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
    dispatch(addToCartAction({ item, quantity: numQuantity }));
  };

  const removeFromCart = (itemId: string | number) => {
    dispatch(removeFromCartAction(itemId));
  };

  const updateQuantity = (itemId: string | number, newQuantity: number | string) => {
    const numQuantity = typeof newQuantity === 'string' ? parseInt(newQuantity, 10) : newQuantity;
    dispatch(updateQuantityAction({ itemId, newQuantity: numQuantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};

export { CartItem };