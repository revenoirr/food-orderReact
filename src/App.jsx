import Header from "./components/header";
import Footer from "./components/footer";
import MenuBrowse from "./components/MenuBrowse";

function App() {
  return (
    <div className="app">
      <Header />
      {}
      <div className="main-content">
        <MenuBrowse />
        {}
      </div>
      <Footer />
    </div>
  );
}

export default App;