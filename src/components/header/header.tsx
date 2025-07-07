import React from "react";
import { NavLink } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/logo.svg";
import cartIcon from "../../assets/cart1.svg";
import { useCart } from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth.tsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

interface AuthContextType {
  currentUser: {
    email: string;
  } | null;
  logout: () => Promise<void>;
}

interface UseAuthReturn {
  currentUser: AuthContextType["currentUser"];
  logout: () => Promise<void>;
}

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const auth = useAuth();
  const { currentUser, logout } = auth as UseAuthReturn;

  const handleLogout = async (): Promise<void> => {
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
          <NavLink to="" end className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>

          <NavLink to="menu" className={({ isActive }) => isActive ? "active" : ""}>
            Menu
          </NavLink>

          <NavLink to="company" className={({ isActive }) => isActive ? "active" : ""}>
            Company
          </NavLink>

          {currentUser ? (
            <a href="#" onClick={handleLogout} className="logout-link">
              Logout
            </a>
          ) : (
            <NavLink to="login" className={({ isActive }) => isActive ? "active" : ""}>
              Login
            </NavLink>
          )}

          {currentUser && (
            <span className="user-email">{currentUser.email}</span>
          )}
        </nav>

        <ThemeToggle />

        <NavLink to="order" className="cart">
          <img src={cartIcon} alt="Cart" />
          <span className="cart-count">{cartCount}</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
