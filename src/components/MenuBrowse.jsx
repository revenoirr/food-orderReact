import React, { useState } from 'react';
import './../styles/MenuBrowse.scss';
import PhoneTooltip from './phoneToolTip.jsx'
import BurgerClassic from "./../assets/BurgerClassic.png";
import BurgerDreams from "./../assets/BurgerDreams.png";
import BurgerWaldo from "./../assets/BurgerWaldo.png";
import BurgerCali from "./../assets/BurgerCali.png";
import BurgerBaconBuddy from "./../assets/BurgerBaconBuddy.png";
import BurgerSpicy from "./../assets/BurgerSpicy.png";


const MenuBrowse = () => {
  const [activeTab, setActiveTab] = useState('desert');
  const [itemQuantities, setItemQuantities] = useState({});
  const phoneNumber = "555-123-4567";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const updateQuantity = (itemId, value) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  
  const menuItems = {
    desert: [
      { id: 'desert1', name: 'Burger Dreams', price: 9.20, image: BurgerDreams  , description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry' },
      { id: 'desert2', name: 'Burger Waldo', price: 10.00, image: BurgerWaldo, description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'desert3', name: 'Burger Call', price: 8.00, image: BurgerCali, description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'desert4', name: 'Burger Bacon Buddy', price: 9.99, image: BurgerBaconBuddy, description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'desert5', name: 'Burger Spicy', price: 9.20, image: BurgerSpicy, description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'desert6', name: 'Burger Classic', price: 8.00, image: BurgerClassic , description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' }
    ],
    dinner: [
      { id: 'dinner1', name: 'Steak Dinner', price: 15.99, image: '/dinner1.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'dinner2', name: 'Pasta Supreme', price: 12.50, image: '/dinner2.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'dinner3', name: 'Grilled Salmon', price: 14.75, image: '/dinner3.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'dinner4', name: 'Chicken Alfredo', price: 11.25, image: '/dinner4.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' }
    ],
    breakfast: [
      { id: 'breakfast1', name: 'Pancake Stack', price: 7.99, image: '/breakfast1.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'breakfast2', name: 'Breakfast Burrito', price: 8.50, image: '/breakfast2.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'breakfast3', name: 'Avocado Toast', price: 6.75, image: '/breakfast3.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' },
      { id: 'breakfast4', name: 'Egg Benedict', price: 9.25, image: '/breakfast4.jpg', description: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.' }
    ]
  };

  const handleAddToCart = (item) => {
    console.log(`Added to cart: ${item.name}, Quantity: ${itemQuantities[item.id] || 1}`);
    // TODO ADD TO CART
  };

  const renderMenuItems = (items) => {
    return (
      <div className="menu-items-grid">
        {items.map(item => (
          <div key={item.id} className="menu-item">
            <div className="menu-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="menu-item-details">
              <div className="menu-item-header">
                <h3 className="menu-item-name">{item.name}</h3>
                <span className="menu-item-price">${item.price.toFixed(2)} USD</span>
              </div>
              <p className="menu-item-description">{item.description}</p>
              <div className="menu-item-actions">
                <input
                  type="number"
                  min="1"
                  value={itemQuantities[item.id] || 1}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                />
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="menu-browse">
      <div className="container">
        <h1 className="menu-browse-title">Browse our menu</h1>
        
        <p className="menu-browse-description">
          Use our menu to place an order online, or{' '}
          <PhoneTooltip phoneNumber={phoneNumber}>
            phone
          </PhoneTooltip>{' '}
          our store to place a pickup order. Fast and fresh food.
        </p>
        
        <div className="menu-tabs">
          <button 
            className={`menu-tab ${activeTab === 'desert' ? 'active' : ''}`}
            onClick={() => handleTabChange('desert')}
          >
            Desert
          </button>
          <button 
            className={`menu-tab ${activeTab === 'dinner' ? 'active' : ''}`}
            onClick={() => handleTabChange('dinner')}
          >
            Dinner
          </button>
          <button 
            className={`menu-tab ${activeTab === 'breakfast' ? 'active' : ''}`}
            onClick={() => handleTabChange('breakfast')}
          >
            Breakfast
          </button>
        </div>
        
        <div className="tab-content">
          {renderMenuItems(menuItems[activeTab])}
        </div>
        
        <div className="menu-footer">
          <button className="see-more-btn">See more</button>
        </div>
      </div>
    </div>
  );
};

export default MenuBrowse;