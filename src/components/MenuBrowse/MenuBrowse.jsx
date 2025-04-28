import React, { useState, useEffect, useContext } from "react";
import "./../MenuBrowse/MenuBrowse.scss";
import PhoneTooltip from "../phoneTooltip/phoneToolTip.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import Button from "../Button/Button.jsx";
import { getMeals } from "../../services/api.jsx";
import { CartContext } from "../CartContext/CartContext.jsx";

const MenuBrowse = () => {
  const { addToCart } = useContext(CartContext);
  
  const [activeTab, setActiveTab] = useState("dessert");
  const [itemQuantities, setItemQuantities] = useState({});
  const [menuItems, setMenuItems] = useState({
    dessert: [],
    dinner: [],
    breakfast: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  
  const phoneNumber = "555-123-4567";
  const hasFetchedMealsRef = React.useRef(false);

  useEffect(() => {
    if (!hasFetchedMealsRef.current) {
      fetchMeals();
      hasFetchedMealsRef.current = true;
    }
  }, []);

  const fetchMeals = async () => {
    try {
      console.log("Fetching meals from API...");
      const meals = await getMeals();
      console.log("API response:", meals);

      const categoryMapping = {
        Dessert: "dessert",
        Dinner: "dinner",
        Breakfast: "breakfast",
      };

      const categorizedMeals = {
        dessert: [],
        dinner: [],
        breakfast: [],
      };

      meals.forEach((meal) => {
        const apiCategory = meal.category;
        const appCategory = categoryMapping[apiCategory] || "dessert";

        if (categorizedMeals[appCategory]) {
          categorizedMeals[appCategory].push(meal);
        }
      });

      console.log("Categorized meals:", categorizedMeals);

      setMenuItems(categorizedMeals);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching meals:", error);

      const fallbackMeals = [
        {
          id: "1",
          meal: "Bakewell tart",
          category: "Dessert",
          area: "British",
          instructions: "Sample dessert instructions",
          img:
            "https://www.themealdb.com/images/media/meals/wyrqqq1468233628.jpg",
          price: 7.22,
        },
        {
          id: "2",
          meal: "Beef Wellington",
          category: "Dinner",
          area: "British",
          instructions: "Sample dinner instructions",
          img:
            "https://www.themealdb.com/images/media/meals/vvpprx1487325699.jpg",
          price: 15.99,
        },
        {
          id: "3",
          meal: "Pancakes",
          category: "Breakfast",
          area: "American",
          instructions: "Sample breakfast instructions",
          img:
            "https://www.themealdb.com/images/media/meals/sbx7n71587673021.jpg",
          price: 8.5,
        },
      ];

      const categorizedMeals = {
        dessert: fallbackMeals.filter((meal) => meal.category === "Dessert"),
        dinner: fallbackMeals.filter((meal) => meal.category === "Dinner"),
        breakfast: fallbackMeals.filter((meal) => meal.category === "Breakfast"),
      };

      console.log("Using fallback meals:", categorizedMeals);

      setMenuItems(categorizedMeals);
      setIsLoading(false);
      setError(`${error.message} (Using sample data instead)`);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(6);
  };

  const updateQuantity = (itemId, value) => {
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: value,
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = parseInt(itemQuantities[item.id], 10) || 1;
  
    if (isNaN(quantity) || quantity < 1) return;
  
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
            quantity={itemQuantities[item.id] || 1}
            onQuantityChange={(value) => updateQuantity(item.id, value)}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    );
  };

  const menuTabs = ["dessert", "dinner", "breakfast"];

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
          {menuItems[activeTab].length > visibleCount && (
            <Button
              variant="see-more"
              className="see-more-btn"
              onClick={() => setVisibleCount(prevCount => prevCount + 6)}
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