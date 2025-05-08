import React from 'react';
import { Link } from 'react-router-dom';
import '../HomePage/HomePage.scss';
import HomePageImage from "../../assets/homepageImage.png";

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-section">
        <h1 className="main-heading">
          Beautiful food & takeaway, <span className="highlighted-text">delivered</span> to your door.
        </h1>
        <p className="sub-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500.
        </p>
        
        <Link to="/menu" className="order-button">Place an Order</Link>
        
        <div className="trustpilot-container">
          <div className="trustpilot-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#00b67a">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Trustpilot
          </div>
          <div className="rating-text">
            <span className="green-text">4.8 out of 5</span> based on 2000+ reviews
          </div>
        </div>
      </div>
      
      <div className="image-section">
        <div className="main-image">
          <img 
            src={HomePageImage}
            alt="Food delivery with burgers and fries" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = HomePageImage;
            }}
          />
        </div>
        
        <div className="decorative-dots"></div>
      </div>
    </div>
  );
};

export default Home;