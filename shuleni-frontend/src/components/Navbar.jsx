// Main navigation bar component for Shuleni platform
import React, { useState } from 'react';
import { Navbar as BNavbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../Store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faGraduationCap, 
  faSearch, 
  faUserCog, 
  faCog, 
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ toggleSidebar, showSidebarToggle = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <BNavbar expand="lg" className="shuleni-nav sticky-top">
      <Container fluid>
        {/* Sidebar toggle button for mobile */}
        {showSidebarToggle && (
          <Button
            variant="link"
            className="d-md-none text-white me-2 p-0"
            onClick={toggleSidebar}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        )}

        {/* Brand logo */}
        <BNavbar.Brand 
          href="#" 
          className="text-white fw-bold fs-4"
          onClick={() => handleNavigation('/')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faGraduationCap} className="me-2" /> Shuleni
        </BNavbar.Brand>

        <BNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </BNavbar.Toggle>

        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link 
                  href="#" 
                  className="text-white"
                  onClick={() => handleNavigation('/')}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  href="#" 
                  className="text-white"
                  onClick={() => handleNavigation('/classes')}
                >
                  Classes
                </Nav.Link>
                <Nav.Link 
                  href="#" 
                  className="text-white"
                  onClick={() => handleNavigation('/resources')}
                >
                  Resources
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto d-flex align-items-center">
            {/* Language Switcher */}
            <div className="me-3">
              <LanguageSwitcher />
            </div>
            
            {/* Search bar */}
            {isAuthenticated && (
              <div className="d-flex me-3">
                <input
                  type="search"
                  placeholder="Search in site"
                  className="form-control form-control-sm"
                  style={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #2563eb',
                    borderRight: 'none',
                    color: '#1e293b',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <Button 
                  variant="primary" 
                  className="p-1 d-flex align-items-center"
                  style={{ 
                    borderTopLeftRadius: 0, 
                    borderBottomLeftRadius: 0,
                    border: '2px solid #2563eb',
                    borderLeft: 'none',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </div>
            )}

            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="link" 
                  className="text-white text-decoration-none d-flex align-items-center"
                  id="user-dropdown"
                >
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40/FFFFFF/4A90E2?text=U'}
                    alt="Profile"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <span className="d-none d-sm-inline">{user?.name || 'User'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="fw-bold">{user?.name}</div>
                    <div className="text-muted small">{user?.email}</div>
                    <div className="text-capitalize small">Role: {user?.role}</div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => handleNavigation('/profile')}>
                    <FontAwesomeIcon icon={faUserCog} className="me-2" /> Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleNavigation('/settings')}>
                    <FontAwesomeIcon icon={faCog} className="me-2" /> Account Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div>
                <Button 
                  variant="outline-light" 
                  className="me-2"
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="light" 
                  onClick={() => handleNavigation('/create-school')}
                >
                  Create A School
                </Button>
              </div>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};

export default Navbar;