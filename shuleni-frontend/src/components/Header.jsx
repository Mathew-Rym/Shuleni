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
      <Navbar bg="blue" expand="lg" className="border-bottom">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <h3 className="mb-0">Shuleni</h3>
          </Navbar.Brand>
          
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/resources">Resources</Nav.Link>
            <Nav.Link as={Link} to="/classes">Classes</Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            {isAdmin && (
              <Button variant="outline-primary" bg ="light" size="sm" className="me-2"
                onClick={handleShowSidebar}
              >  Open Sidebar</Button>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;