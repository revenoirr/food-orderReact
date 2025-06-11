import React from 'react';
import styled from 'styled-components';
import HomePageImage from "../../assets/homepageImage.png";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  
  @media (max-width: 968px) {
    flex-direction: column;
    padding: 40px 20px;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  max-width: 500px;
  
  @media (max-width: 968px) {
    max-width: 100%;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const MainHeading = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HighlightedText = styled.span`
  color: #10b6ad;
`;

const SubText = styled.p`
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 30px;
`;

const TrustpilotContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const TrustpilotLogo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  margin-right: 10px;
  
  svg {
    margin-right: 5px;
    fill: #00B67A;
  }
`;

const RatingText = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const GreenText = styled.span`
  color: #00b67a;
  font-weight: 600;
`;

const ImageSection = styled.div`
  flex: 1;
  position: relative;
  max-width: 600px;
  
  @media (max-width: 968px) {
    max-width: 100%;
    width: 100%;
  }
`;

const MainImage = styled.div`
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <ContentSection>
        <MainHeading>
          Beautiful food & takeaway, <HighlightedText>delivered</HighlightedText> to your door.
        </MainHeading>
        <SubText>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </SubText>

        <Button variant="primary" onClick={() => navigate("/menu")}>
          Place an Order
        </Button>

        <TrustpilotContainer>
          <TrustpilotLogo>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Trustpilot
          </TrustpilotLogo>
          <RatingText>
            <GreenText>4.8 out of 5</GreenText> based on 2000+ reviews
          </RatingText>
        </TrustpilotContainer>
      </ContentSection>

      <ImageSection>
        <MainImage>
          <img src={HomePageImage} alt="Homepage" />
        </MainImage>
      </ImageSection>
    </HomeContainer>
  );
};

export default Home;