import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MenuBrowse.scss";
import PhoneTooltip from "../PhoneTooltip/phoneToolTip.tsx";
import ProductCard, { Item } from "../ProductCard/ProductCard.tsx";
import Button from "../Button/Button.tsx";
import { useApi } from "../../services/api.tsx";

interface Meal {
  id: string | number;
  meal: string;
  price: number;
  category: string;
  quantity?: number;  
  img?: string;
  instructions?: string;
}

interface CategoryMapping {
  [key: string]: string;
}

interface MenuItems {
  [category: string]: Meal[];
}

interface ApiHookResult {
  getMeals: () => Promise<Meal[]>;
  loading: boolean;
  error: string | null;
}

const initialVisibleCount = 6;
const incrementCount = 6;

const MenuBrowse: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dessert");
  const [menuItems, setMenuItems] = useState<MenuItems>({
    dessert: [],
    dinner: [],
    breakfast: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(initialVisibleCount);
  
  const phoneNumber = "555-123-4567";
  const hasFetchedMealsRef = useRef<boolean>(false);
  
  const { getMeals, loading, error: apiError } = useApi() as ApiHookResult;

  const fetchMeals = useCallback(async (): Promise<void> => {
    try {
      console.log("Fetching meals from API...");
      
      const meals = await getMeals();
      console.log("API response:", meals);

      const apiCategories = Array.from(new Set(meals.map(meal => meal.category)));
      
      const categoryMapping: CategoryMapping = {};
      apiCategories.forEach(category => {
        categoryMapping[category] = category.toLowerCase();
      });

      const categorizedMeals: MenuItems = {};
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
      setError(`Error fetching menu data: ${(error as Error).message}`);
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

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
    setVisibleCount(initialVisibleCount);
  };

  const renderMenuItems = (items: Meal[] | undefined): React.ReactNode => {
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
            item={item as Item}
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