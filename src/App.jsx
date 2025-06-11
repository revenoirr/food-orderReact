import React from "react";
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import MenuBrowse from "./components/MenuBrowse/MenuBrowse.jsx";
import Home from "./components/HomePage/HomePage.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import { CartProvider } from "./components/CartContext/CartContext.jsx";
import AuthProvider from "./components/AuthProvider/AuthProvider.jsx"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
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
}

export default App;