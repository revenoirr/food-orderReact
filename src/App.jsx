import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import MenuBrowse from "./components/MenuBrowse/MenuBrowse.jsx";
import Home from "./components/HomePage/HomePage.jsx";
import { CartProvider } from "./components/CartContext/CartContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<MenuBrowse />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;