import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--dark-color);
  color: white;
  padding: 1rem 0;
  box-shadow: var(--box-shadow);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  margin-left: 1.5rem;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  margin-left: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 1rem;
  padding: 0;

  &:hover {
    color: var(--primary-color);
  }
`;

const UserInfo = styled.span`
  margin-right: 1rem;
  color: #ddd;
`;

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">ガントチャートツール</Logo>
        <Nav>
          {user ? (
            <>
              <UserInfo>{user.name}</UserInfo>
              <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login">ログイン</NavLink>
              <NavLink to="/register">登録</NavLink>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;