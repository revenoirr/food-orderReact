import React from "react";
import "./../ProductCard/ProductCard.scss";
import Button from "../Button/Button.jsx";

const ProductCard = ({ item, quantity, onQuantityChange, onAddToCart }) => {
  if (!item) {
    console.error("ProductCard received null or undefined item");
    return null;
  }

  console.log("Rendering ProductCard for:", item);

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
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d+$/.test(value)) {
                const num = Math.min(99, Math.max(1, Number(value)));
                onQuantityChange(num);
              } else if (value === "") {
                onQuantityChange("");
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "" || Number(e.target.value) < 1) {
                onQuantityChange(item.id, 1);
              }
            }}
          />

          <Button
            variant="primary"
            onClick={() => onAddToCart(item)}
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