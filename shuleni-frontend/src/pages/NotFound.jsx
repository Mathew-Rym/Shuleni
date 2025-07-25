import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={6} className="text-center">
            <Card className="shuleni-card border-0 shadow-lg">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <h1 className="display-1 fw-bold text-primary">404</h1>
                  <h2 className="h4 fw-bold mb-3">Page Not Found</h2>
                  <p className="text-muted mb-4">
                    Oops! The page you're looking for doesn't exist or has been moved.
                  </p>
                </div>
                
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button 
                    variant="primary"
                    className="shuleni-btn-primary"
                    onClick={() => navigate('/')}
                  >
                    🏠 Return to Home
                  </Button>
                  <Button 
                    variant="outline-primary"
                    onClick={() => navigate(-1)}
                  >
                    ← Go Back
                  </Button>
                </div>
                
                <div className="mt-4 text-muted small">
                  <p>If you believe this is an error, please contact support.</p>
                  <p className="mb-0">
                    <strong>Path:</strong> {location.pathname}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
