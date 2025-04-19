import React, { Component } from "react";
import "./../MenuBrowse/MenuBrowse.scss";
import PhoneTooltip from "../phoneTooltip/phoneToolTip.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import Button from "../Button/Button.jsx";
import { getMeals } from "../../services/api.jsx";
import { CartContext } from "../CartContext/CartContext.jsx";

class MenuBrowse extends Component {
  static contextType = CartContext;

  constructor(props) {
    super(props);
    this.state = {
      activeTab: "desert",
      itemQuantities: {},
      menuItems: {
        desert: [],
        dinner: [],
        breakfast: [],
      },
      isLoading: true,
      error: null,
      visibleCount: 6,
    };

    this.phoneNumber = "555-123-4567";
    this.hasFetchedMeals = false;
  }

  componentDidMount() {
    if (!this.hasFetchedMeals) {
      this.fetchMeals();
      this.hasFetchedMeals = true;
    }
  }

  fetchMeals = async () => {
    try {
      console.log("Fetching meals from API...");
      const meals = await getMeals();
      console.log("API response:", meals);

      const categoryMapping = {
        Dessert: "desert",
        Dinner: "dinner",
        Breakfast: "breakfast",
      };

      const categorizedMeals = {
        desert: [],
        dinner: [],
        breakfast: [],
      };

      meals.forEach((meal) => {
        const apiCategory = meal.category;
        const appCategory = categoryMapping[apiCategory] || "desert";

        if (categorizedMeals[appCategory]) {
          categorizedMeals[appCategory].push(meal);
        }
      });

      console.log("Categorized meals:", categorizedMeals);

      this.setState({
        menuItems: categorizedMeals,
        isLoading: false,
      });
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
        desert: fallbackMeals.filter((meal) => meal.category === "Dessert"),
        dinner: fallbackMeals.filter((meal) => meal.category === "Dinner"),
        breakfast: fallbackMeals.filter(
          (meal) => meal.category === "Breakfast"
        ),
      };

      console.log("Using fallback meals:", categorizedMeals);

      this.setState({
        menuItems: categorizedMeals,
        isLoading: false,
        error: `${error.message} (Using sample data instead)`,
      });
    }
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab, visibleCount: 6 });
  };

  updateQuantity = (itemId, value) => {
    this.setState((prevState) => ({
      itemQuantities: {
        ...prevState.itemQuantities,
        [itemId]: value,
      },
    }));
  };

  handleAddToCart = (item) => {
    const { addToCart } = this.context;
    const quantity = parseInt(this.state.itemQuantities[item.id], 10) || 1;
  
    if (isNaN(quantity) || quantity < 1) return;
  
    addToCart(item, quantity);
    console.log(`Added to cart: ${item.meal}, Quantity: ${quantity}`);
  };
  
  

  renderMenuItems = (items) => {
    const { visibleCount } = this.state;
  
    if (this.state.isLoading) {
      return <div>Loading menu items...</div>;
    }
  
    if (this.state.error) {
      return <div>Error: {this.state.error}</div>;
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
            quantity={this.state.itemQuantities[item.id] || 1}
            onQuantityChange={(value) => this.updateQuantity(item.id, value)}
            onAddToCart={() => this.handleAddToCart(item)}
          />
        ))}
      </div>
    );
  };

  render() {
    const { activeTab, menuItems } = this.state;
    const menuTabs = ["desert", "dinner", "breakfast"];

    return (
      <div className="menu-browse">
        <div className="container">
          <h1 className="menu-browse-title">Browse our menu</h1>

          <p className="menu-browse-description">
            Use our menu to place an order online, or{" "}
            <PhoneTooltip phoneNumber={this.phoneNumber}>phone</PhoneTooltip>{" "}
            our store to place a pickup order. Fast and fresh food.
          </p>

          <div className="menu-tabs">
            {menuTabs.map((tab) => (
              <Button
                key={tab}
                variant="tab"
                active={activeTab === tab}
                disabled={true}   // unclicable button!!
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          <div className="tab-content">
            {this.renderMenuItems(menuItems[activeTab])}
          </div>

          <div className="menu-footer">
            {menuItems[activeTab].length > this.state.visibleCount && (
              <Button
                variant="see-more"
                className="see-more-btn"
                onClick={() =>
                  this.setState((prevState) => ({
                    visibleCount: prevState.visibleCount + 6,
                  }))
                }
              >
                See more
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MenuBrowse;
