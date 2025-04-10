import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaPlus, FaTasks, FaUserFriends } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: var(--dark-color);
  color: white;
  min-height: calc(100vh - 60px - 40px);
  transition: all 0.3s ease;
`;

const SidebarTitle = styled.h3`
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface NavItemProps {
  active: boolean;
}

const NavItem = styled.li<NavItemProps>`
  a {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    color: ${(props) => (props.active ? 'white' : '#ddd')};
    text-decoration: none;
    transition: all 0.3s ease;
    background-color: ${(props) => (props.active ? 'rgba(52, 152, 219, 0.2)' : 'transparent')};
    border-left: 4px solid ${(props) => (props.active ? 'var(--primary-color)' : 'transparent')};

    &:hover {
      background-color: rgba(52, 152, 219, 0.1);
      color: white;
    }

    svg {
      margin-right: 10px;
    }
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <SidebarContainer>
      <SidebarTitle>メニュー</SidebarTitle>
      <NavList>
        <NavItem active={pathname === '/'}>
          <Link to="/">
            <FaHome /> プロジェクト一覧
          </Link>
        </NavItem>
        <NavItem active={pathname === '/projects/new'}>
          <Link to="/projects/new">
            <FaPlus /> 新規プロジェクト
          </Link>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;