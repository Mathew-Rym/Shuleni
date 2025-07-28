import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '👥',
      title: 'User-Friendly',
      description: 'Our interface is simple and intuitive for all users.',
      color: '#FF6B6B'
    },
    {
      icon: '⚛️',
      title: 'Comprehensive Tools',
      description: 'All necessary tools for managing schools in one place.',
      color: '#4ECDC4'
    },
    {
      icon: '',
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
              <h1 className="display-4 fw-bold mb-4">Welcome to Shuleni</h1>
              <p className="lead mb-4">
                Create, manage and grow your school community easily with our platform.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button 
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
                <Button 
                  variant="light"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="fw-bold"
                >
                  Create Your School
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
            <Button variant="primary" className="shuleni-btn-primary">
              Get Started
            </Button>
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
                    {feature.icon}
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
                  onClick={() => navigate('/login')}
                >
                  Start Your School Today
                </Button>
                <Button 
                  variant="outline-primary"
                  size="lg"
                  onClick={() => navigate('/demo')}
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
                <span className="fs-4 me-2"></span>
                <span className="fw-bold fs-5">Shuleni</span>
              </div>
              <p className="text-muted">
                Empowering education through innovative school management solutions.
              </p>
            </Col>
            <Col md={6}>
              <Row>
                <Col sm={6}>
                  <h6 className="fw-bold mb-3">Quick Links</h6>
                  <div className="d-flex flex-column">
                    <a href="#" className="text-muted text-decoration-none mb-2">Privacy Policy</a>
                    <a href="#" className="text-muted text-decoration-none mb-2">Terms of Use</a>
                    <a href="#" className="text-muted text-decoration-none mb-2">Contact Support</a>
                  </div>
                </Col>
                <Col sm={6}>
                  <h6 className="fw-bold mb-3">Support</h6>
                  <div className="d-flex flex-column">
                    <a href="#" className="text-muted text-decoration-none mb-2">Help Center</a>
                    <a href="#" className="text-muted text-decoration-none mb-2">FAQ</a>
                    <a href="#" className="text-muted text-decoration-none mb-2">Contact Us</a>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>
            <Col className="text-center">
              <p className="text-muted mb-0">
                © 2025 Shuleni School Management Platform. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;