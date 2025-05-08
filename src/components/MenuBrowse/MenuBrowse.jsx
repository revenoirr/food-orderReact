import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import "./MenuBrowse.scss";
import PhoneTooltip from "../phoneTooltip/phoneToolTip.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import Button from "../Button/Button.jsx";
import { useApi } from "../../services/api.jsx";
import { CartContext } from "../CartContext/CartContext.jsx";

const initialVisibleCount = 6;
const incrementCount = 6;

const MenuBrowse = () => {
  const { addToCart } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState("dessert");
  const [menuItems, setMenuItems] = useState({
    dessert: [],
    dinner: [],
    breakfast: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  
  const phoneNumber = "555-123-4567";
  const hasFetchedMealsRef = useRef(false);
  
  const { getMeals, loading, error: apiError } = useApi();

  const fetchMeals = useCallback(async () => {
    try {
      console.log("Fetching meals from API...");
      
      const meals = await getMeals();
      console.log("API response:", meals);

      const apiCategories = [...new Set(meals.map(meal => meal.category))];
      
      const categoryMapping = {};
      apiCategories.forEach(category => {
        categoryMapping[category] = category.toLowerCase();
      });

      const categorizedMeals = {};
      Object.values(categoryMapping).forEach(category => {
        categorizedMeals[category] = [];
      });

      meals.forEach((meal) => {
        const apiCategory = meal.category;
        const appCategory = categoryMapping[apiCategory];

        if (categorizedMeals[appCategory]) {
          categorizedMeals[appCategory].push(meal);
        }
      });

      console.log("Categorized meals:", categorizedMeals);
      setMenuItems(categorizedMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setError(`Error fetching menu data: ${error.message}`);
    }
  }, [getMeals]); 
  
  useEffect(() => {
    if (!hasFetchedMealsRef.current) {
      fetchMeals();
      hasFetchedMealsRef.current = true;
    }
  }, [fetchMeals]); 
  
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(initialVisibleCount);
  };

  const handleAddToCart = (item, quantity) => {
    addToCart(item, quantity);
    console.log(`Added to cart: ${item.meal}, Quantity: ${quantity}`);
  };

  const renderMenuItems = (items) => {
    if (isLoading) {
      return <div>Loading menu items...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    if (!items || items.length === 0) {
      return <div>No items available in this category</div>;
    }
  
    return (
      <div className="menu-items-grid">
        {items.slice(0, visibleCount).map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    );
  };

  const menuTabs = menuItems ? Object.keys(menuItems) : [];

  return (
    <div className="menu-browse">
      <div className="container">
        <h1 className="menu-browse-title">Browse our menu</h1>

        <p className="menu-browse-description">
          Use our menu to place an order online, or{" "}
          <PhoneTooltip phoneNumber={phoneNumber}>phone</PhoneTooltip>{" "}
          our store to place a pickup order. Fast and fresh food.
        </p>

        <div className="menu-tabs">
          {menuTabs.map((tab) => (
            <Button
              key={tab}
              variant="tab"
              active={activeTab === tab}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        <div className="tab-content">
          {renderMenuItems(menuItems[activeTab])}
        </div>

        <div className="menu-footer">
          {menuItems[activeTab] && menuItems[activeTab].length > visibleCount && (
            <Button
              variant="see-more"
              onClick={() => setVisibleCount(prevCount => prevCount + incrementCount)}
            >
              See more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuBrowse;