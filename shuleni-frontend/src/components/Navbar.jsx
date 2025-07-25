// Main navigation bar component for Shuleni platform
import React, { useState } from 'react';
import { Navbar as BNavbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../Store/slices/authSlice';

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
            ☰
          </Button>
        )}

        {/* Brand logo */}
        <BNavbar.Brand 
          href="#" 
          className="text-white fw-bold fs-4"
          onClick={() => handleNavigation('/')}
          style={{ cursor: 'pointer' }}
        >
          🎓 Shuleni
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

          <Nav className="ms-auto">
            {/* Search bar */}
            {isAuthenticated && (
              <div className="d-flex me-3">
                <input
                  type="search"
                  placeholder="Search in site"
                  className="form-control form-control-sm"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                />
                <Button 
                  variant="link" 
                  className="text-white p-1"
                  style={{ textDecoration: 'none' }}
                >
                  🔍
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
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleNavigation('/settings')}>
                    Account Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
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