
import React from "react";
import "./../styles/footer.scss";
import logo from "./../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <p className="footer-description">
            Takeaway & Delivery template<br />
            for small - medium businesses.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>COMPANY</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/order">Order</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>TEMPLATE</h3>
            <ul>
              <li><a href="/style-guide">Style Guide</a></li>
              <li><a href="/changelog">Changelog</a></li>
              <li><a href="/licence">Licence</a></li>
              <li><a href="/webflow-university">Webflow University</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>FLOWBASE</h3>
            <ul>
              <li><a href="/more-cloneables">More Cloneables</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-icons">
          <a href="#" className="social-icon instagram" aria-label="Instagram"></a>
          <a href="#" className="social-icon twitter" aria-label="Twitter"></a>
          <a href="#" className="social-icon youtube" aria-label="YouTube"></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;