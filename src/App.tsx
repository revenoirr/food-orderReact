// App.tsx

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import MenuBrowse from "./components/MenuBrowse/MenuBrowse";
import Home from "./components/HomePage/HomePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
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
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;