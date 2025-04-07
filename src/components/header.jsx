import React from "react";
import "./../styles/header.scss"; 
import logo from "./../assets/logo.svg"; 
import cartIcon from "./../assets/cart1.svg"; 

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="/" className="active">Home</a>
          <a href="/menu">Menu</a>
          <a href="/company">Company</a>
          <a href="/login">Login</a>
        </nav>

        {/* Cart */}
        <div className="cart">
          <img src={cartIcon} alt="Cart" />
          <span className="cart-count">0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;