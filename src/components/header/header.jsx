import React, { Component } from "react";
import "./../header/header.scss";
import logo from "../../assets/logo.svg";
import cartIcon from "../../assets/cart1.svg";
import { CartContext }  from "../CartContext/CartContext.jsx";

class Header extends Component {
  static contextType = CartContext;

  render() {
    const { cartCount } = this.context;

    return (
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>

          <nav className="nav">
            <a href="/" className="active">Home</a>
            <a href="/menu">Menu</a>
            <a href="/company">Company</a>
            <a href="/login">Login</a>
          </nav>

          <div className="cart">
            <img src={cartIcon} alt="Cart" />
            <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
