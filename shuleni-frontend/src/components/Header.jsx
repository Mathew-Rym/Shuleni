import React from 'react';
import { Navbar, Nav, Badge, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const isAdmin = true; 

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);
  return (
    <>
      <Navbar bg="light" expand="lg" className="border-bottom navbar-custom" fixed="top">
        <Container fluid className="px-3 px-lg-4">
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <span className="d-none d-sm-inline">Shuleni</span>
            <span className="d-inline d-sm-none">S</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="px-2 px-lg-3">
                <i className="fas fa-home me-1 d-lg-none"></i>
                <span>Home</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/resources" className="px-2 px-lg-3">
                <i className="fas fa-book me-1 d-lg-none"></i>
                <span>Resources</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/classes" className="px-2 px-lg-3">
                <i className="fas fa-chalkboard me-1 d-lg-none"></i>
                <span>Classes</span>
              </Nav.Link>
            </Nav>
            
            <div className="d-flex align-items-center flex-column flex-lg-row gap-2">
              {isAdmin && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="w-100 w-lg-auto"
                  onClick={handleShowSidebar}
                >
                  <i className="fas fa-bars me-2"></i>
                  <span className="d-none d-sm-inline">Open Sidebar</span>
                  <span className="d-inline d-sm-none">Menu</span>
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Add spacing for fixed navbar */}
      <div style={{ paddingTop: '76px' }}></div>
    </>
  );
};

export default Header;