import React from 'react';
import { Link } from 'react-router-dom';
import './notFoundPage.scss';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-animation">
          <div className="glitch-wrapper">
            <div className="glitch" data-text="404">404</div>
          </div>
        </div>
        
        <div className="error-info">
          <h1 className="error-title">This page does not exist</h1>
          <p className="error-description">
            Oops! It looks like this page has gone into space. 
                Let's bring you back down to earth. ≧ ﹏ ≦
          </p>
        </div>

        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <span className="btn-text">Back home</span>
            <span className="btn-icon">🏠</span>
          </Link>
          <Link to="/menu" className="btn btn-secondary">
            <span className="btn-text">Check menu</span>
            <span className="btn-icon">🍽️</span>
          </Link>
        </div>

        <div className="decorative-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;