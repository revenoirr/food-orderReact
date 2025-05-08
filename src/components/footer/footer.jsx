import React from "react";
import "./../footer/footer.scss";
import logo from "../../assets/logo.svg";

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
              <li><span className="non-clickable-link">Home</span></li>
              <li><span className="non-clickable-link">Order</span></li>
              <li><span className="non-clickable-link">FAQ</span></li>
              <li><span className="non-clickable-link">Contact</span></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>TEMPLATE</h3>
            <ul>
              <li><a href="https://www.google.com/">Style Guide</a></li>
              <li><a href="https://www.google.com/">Changelog</a></li>
              <li><a href="https://www.google.com/">Licence</a></li>
              <li><a href="https://www.google.com/">Webflow University</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>FLOWBASE</h3>
            <ul>
              <li><span className="non-clickable-link">More Cloneables</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-credits">
          <span>Built by <span className="flowbase-link">Flowbase</span> · Powered by <span className="webflow-link">Webflow</span></span>
        </div>
        <div className="social-icons">
          <span className="social-icon instagram" aria-label="Instagram"></span>
          <span className="social-icon twitter" aria-label="Twitter"></span>
          <span className="social-icon youtube" aria-label="YouTube"></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;