import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/logo.svg";
import cartIcon from "../../assets/cart1.svg";
import { useCart } from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth.tsx";

interface AuthContextType {
  currentUser: {
    email: string;
  } | null;
  logout: () => Promise<void>;
}

interface UseAuthReturn {
  currentUser: AuthContextType['currentUser'];
  logout: () => Promise<void>;
}

const Header: React.FC = () => {
  const { cartCount } = useCart();
  
  const auth = useAuth();
  const { currentUser, logout } = auth as UseAuthReturn;
  const location = useLocation();

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

        <Link to="/order" className="cart">
          <img src={cartIcon} alt="Cart" />
          <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;