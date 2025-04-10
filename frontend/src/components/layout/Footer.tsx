import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--dark-color);
  color: white;
  text-align: center;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  position: relative;
  bottom: 0;
  width: 100%;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <p>ガントチャートツール &copy; {currentYear}</p>
    </FooterContainer>
  );
};

export default Footer;