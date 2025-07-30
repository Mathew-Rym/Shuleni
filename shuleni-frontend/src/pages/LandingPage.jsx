import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTools, faHeadset } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const features = [
    {
      icon: faUsers,
      title: 'User-Friendly',
      description: 'Our interface is simple and intuitive for all users.',
      color: '#FF6B6B'
    },
    {
      icon: faTools,
      title: 'Comprehensive Tools',
      description: 'All necessary tools for managing schools in one place.',
      color: '#4ECDC4'
    },
    {
      icon: faHeadset,
      title: '24/7 Support',
      description: 'We provide around-the-clock support to ensure your success.',
      color: '#45B7D1'
    }
  ];

  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="shuleni-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="mb-4">
                <img 
                  src="/favicon.svg" 
                  alt="Shuleni Logo" 
                  width="80" 
                  height="80" 
                  className="mb-3"
                />
              </div>
              <h1 className="display-4 fw-bold mb-4 text-dark">Welcome to Shuleni</h1>
              <p className="lead mb-4 text-secondary">
                Create, manage and grow your school community easily with our platform.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button 
                  variant="outline-primary"
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="border-2"
                >
                  Learn More
                </Button>
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="fw-bold border-2"
                >
                  Login
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Why Choose Us Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-5 fw-bold">Why Choose Us?</h2>
            <p className="lead text-muted">
              Learn about the key features that make our platform stand out.
            </p>
        
          </Col>
        </Row>

        {/* Features Grid */}
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className="shuleni-card h-100 border-0 text-center p-4">
                <Card.Body>
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: feature.color,
                      fontSize: '2rem'
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      style={{ fontSize: '2rem', color: 'white' }}
                    />
                  </div>
                  <Card.Title className="h4 fw-bold">{feature.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h3 className="display-6 fw-bold mb-3">Ready to Get Started?</h3>
              <p className="lead text-muted mb-4">
                Join thousands of schools already using Shuleni to manage their educational communities.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button 
                  variant="primary"
                  size="lg"
                  className="shuleni-btn-primary"
                  onClick={() => navigate('/create-school')}
                >
                  Start Your School Today
                </Button>
                <Button 
                  variant="outline-primary"
                  size="lg"
                  onClick={() => setShowVideoModal(true)}
                >
                  Watch Demo
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="/favicon.svg" 
                  alt="Shuleni Logo" 
                  width="24" 
                  height="24" 
                  className="me-2"
                />
                <span className="fw-bold fs-5 text-white">Shuleni</span>
              </div>
              <p className="text-light">
                Empowering education through innovative school management solutions.
              </p>
            </Col>
            <Col md={6}>
              <Row>
                <Col sm={6}>
                  <h6 className="fw-bold mb-3 text-white">Quick Links</h6>
                  <div className="d-flex flex-column">
                    <Link to="/privacy-policy" className="text-light text-decoration-none mb-2 hover-text-primary">Privacy Policy</Link>
                    <Link to="/terms-of-use" className="text-light text-decoration-none mb-2 hover-text-primary">Terms of Use</Link>
                    <Link to="/contact-support" className="text-light text-decoration-none mb-2 hover-text-primary">Contact Support</Link>
                  </div>
                </Col>
                <Col sm={6}>
                  <h6 className="fw-bold mb-3 text-white">Support</h6>
                  <div className="d-flex flex-column">
                    <Link to="/help-center" className="text-light text-decoration-none mb-2 hover-text-primary">Help Center</Link>
                    <Link to="/faq" className="text-light text-decoration-none mb-2 hover-text-primary">FAQ</Link>
                    <Link to="/contact-us" className="text-light text-decoration-none mb-2 hover-text-primary">Contact Us</Link>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>
            <Col className="text-center">
              <p className="text-light mb-0 d-flex align-items-center justify-content-center">
                <img 
                  src="/favicon.svg" 
                  alt="Shuleni Logo" 
                  width="20" 
                  height="20" 
                  className="me-2"
                />
                © 2025 Shuleni School Management Platform. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Video Modal */}
      <Modal 
        show={showVideoModal} 
        onHide={() => setShowVideoModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Shuleni Demo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/n_6eelBgMHs"
              title="Shuleni Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LandingPage;