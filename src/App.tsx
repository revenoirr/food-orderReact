import React from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import MenuBrowse from "./components/MenuBrowse/MenuBrowse";
import Home from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { CartProvider } from "./components/CartContext/CartContext";
import AuthProvider from "./components/AuthProvider/AuthProvider"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/menu" element={
                  <ProtectedRoute>
                    <MenuBrowse />
                  </ProtectedRoute>
                } />
                <Route path="/company" element={<div>Company Page</div>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;