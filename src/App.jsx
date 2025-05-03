import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import MenuBrowse from "./components/MenuBrowse/MenuBrowse.jsx";
import { CartProvider } from "./../src/components/CartContext/CartContext.jsx";

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <div className="main-content">
          <MenuBrowse />
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
