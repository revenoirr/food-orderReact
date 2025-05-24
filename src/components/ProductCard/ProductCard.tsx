import React, { useState, ChangeEvent } from "react";
import "./../ProductCard/ProductCard.scss";
import Button from "../Button/Button";

// Define the interface for the menu item
export interface Item {
  id?: string | number;
  meal: string;
  price: number;
  category?: string;  // Added to match Meal type in MenuBrowse
  img?: string;
  instructions?: string;
  // Add other properties that might be in the item object
}

// Define the props interface for the ProductCard component
export interface ProductCardProps {
  item: Item;
  onAddToCart: (item: Item, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!item) {
    return null; 
  }

  const handleQuantityChange = (value: number): void => {
    if (typeof value === 'number') {
      setQuantity(value);
    }
  };

  const handleAddToCart = (): void => {
    onAddToCart(item, quantity);
  };

  return (
    <div className="menu-item">
      <div className="menu-item-image">
        {item.img ? (
          <img src={item.img} alt={item.meal} />
        ) : (
          <div className="placeholder-image">No image available</div>
        )}
      </div>

      <div className="menu-item-details">
        <div className="menu-item-header">
          <h3 className="menu-item-name">{item.meal}</h3>
          <div className="menu-item-price">
            ${item.price ? item.price.toFixed(2) : "0.00"}
          </div>
        </div>

        <p className="menu-item-description">
          {item.instructions
            ? item.instructions.length > 100
              ? `${item.instructions.substring(0, 100)}...`
              : item.instructions
            : "No description available"}
        </p>

        <div className="menu-item-actions">
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (/^\d+$/.test(value)) {
                const num = Math.min(99, Math.max(1, Number(value)));
                handleQuantityChange(num);
              }
            }}
            onBlur={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === "" || Number(e.target.value) < 1) {
                handleQuantityChange(1);
              }
            }}
          />

          <Button
            variant="primary"
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;