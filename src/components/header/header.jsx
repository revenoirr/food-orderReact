import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/logo.svg";
import cartIcon from "../../assets/cart1.svg";
import { CartContext } from "../CartContext/CartContext.jsx";
import useAuth from "../../hooks/useAuth";


const Header = () => {
  const { cartCount } = useContext(CartContext);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <nav className="nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          
          <Link to="/menu" className={location.pathname === "/menu" ? "active" : ""}>Menu</Link>
          
          <Link to="/company" className={location.pathname === "/company" ? "active" : ""}>Company</Link>
          
          {currentUser ? (
            <a href="#" onClick={handleLogout} className="logout-link">Logout</a>
          ) : (
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
          )}
          
          {currentUser && (
            <span className="user-email">{currentUser.email}</span>
          )}
        </nav>

        <div className="cart">
          <img src={cartIcon} alt="Cart" />
          <span className="cart-count">{cartCount}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;