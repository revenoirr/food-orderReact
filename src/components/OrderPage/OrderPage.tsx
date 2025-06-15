import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../../slices/cartSlice";
import Button from "../Button/Button";
import "./OrderPage.scss";

interface CartItem {
  id: string | number;
  quantity: number;
  [key: string]: any;
}

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
}

interface RootState {
  cart: CartState;
}

interface OrderFormData {
  street: string;
  house: string;
  phone: string;
  email: string;
}

interface UpdateQuantityPayload {
  itemId: string | number;
  newQuantity: number | string;
}

const OrderPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartCount = useSelector((state: RootState) => state.cart.cartCount);

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const [formData, setFormData] = useState<OrderFormData>({
    street: "",
    house: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ itemId: id, newQuantity } as any));
    }
  };

  const handleRemoveItem = (id: string | number) => {
    dispatch(removeFromCart(id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems,
        total: cartTotal,
        customerInfo: formData,
        orderDate: new Date().toISOString(),
      };

      console.log("Submitting order:", orderData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("Order placed successfully!");

      setFormData({
        street: "",
        house: "",
        phone: "",
        email: "",
      });
      
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.street && formData.house && formData.phone && formData.email;

  if (cartItems.length === 0) {
    return (
      <div className="order-page">
        <div className="container">
          <h1 className="order-title">Your Cart</h1>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Button variant="primary" onClick={() => window.history.back()}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="container">
        <h1 className="order-title">Finish your order</h1>
        
        <div className="order-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.img ? (
                    <img src={item.img} alt={item.meal || 'Menu item'} />
                  ) : (
                    <div className="placeholder-image">
                      <span>No image</span>
                    </div>
                  )}
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.meal || 'Menu Item'}</h3>
                  <div className="cart-item-price">
                    ${item.price ? item.price.toFixed(2) : "0.00"} USD
                  </div>
                </div>
                
                <div className="cart-item-quantity">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                </div>
                
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <form className="order-form" onSubmit={handleSubmitOrder}>
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                placeholder="Enter your street address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="house">House</label>
              <input
                type="text"
                id="house"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
                required
                placeholder="House number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Your email address"
              />
            </div>

            <div className="order-summary">
              <div className="total-amount">
                Total: ${cartTotal.toFixed(2)} USD
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting}
              className="order-submit-btn"
            >
              {isSubmitting ? "Placing Order..." : "Order"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;