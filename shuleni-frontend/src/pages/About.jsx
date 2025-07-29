import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faUsers, 
  faChartLine, 
  faHeart,
  faGlobe,
  faLaptop,
  faBookOpen,
  faMobile
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

const About = () => {
  const navigate = useNavigate();

  const statistics = [
    {
      icon: faGraduationCap,
      number: "50,000+",
      label: "Students Served",
      color: "#FF6B6B"
    },
    {
      icon: faUsers,
      number: "2,500+",
      label: "Teachers Connected",
      color: "#4ECDC4"
    },
    {
      icon: faChartLine,
      number: "98%",
      label: "Performance Improvement",
      color: "#45B7D1"
    },
    {
      icon: faHeart,
      number: "500+",
      label: "Schools Transformed",
      color: "#96CEB4"
    }
  ];

  const features = [
    {
      icon: faGlobe,
      title: "Localized for Kenya",
      description: "Built specifically for the Kenyan education system, including CBC curriculum support, KNEC integration, and local language support (English and Kiswahili)."
    },
    {
      icon: faLaptop,
      title: "Digital Transformation",
      description: "Helping Kenyan schools transition from paper-based systems to digital platforms, supporting Kenya's Vision 2030 digital literacy goals."
    },
    {
      icon: faBookOpen,
      title: "CBC Curriculum Ready",
      description: "Fully aligned with Kenya's Competency-Based Curriculum (CBC), supporting formative and summative assessments as per KICD guidelines."
    },
    {
      icon: faMobile,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices, considering Kenya's mobile-first internet usage patterns and affordable smartphone accessibility."
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <img 
                src="/favicon.svg" 
                alt="Shuleni Logo" 
                width="80" 
                height="80" 
                className="mb-4"
              />
              <h1 className="display-4 fw-bold mb-4">About Shuleni</h1>
              <p className="lead mb-4">
                Transforming Education Across Kenya Through Innovation and Technology
              </p>
              <p className="fs-5">
                From Nairobi to Mombasa, Kisumu to Eldoret - we're empowering Kenyan schools 
                to achieve excellence in the digital age.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-5">
        <Row>
          <Col lg={10} className="mx-auto">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-4">Our Mission</h2>
              <p className="lead text-muted">
                To democratize quality education management across Kenya by providing 
                accessible, affordable, and innovative school management solutions that 
                align with Kenya's educational goals and cultural values.
              </p>
            </div>
            
            <Row className="g-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold mb-3">🇰🇪 Built for Kenya</h4>
                    <p className="text-muted">
                      Understanding the unique challenges of Kenyan schools - from rural 
                      primary schools in Turkana to urban secondary schools in Nairobi. 
                      We've designed Shuleni to work within Kenya's educational framework 
                      and infrastructure realities.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold mb-3">🌍 Vision 2030 Aligned</h4>
                    <p className="text-muted">
                      Supporting Kenya's Vision 2030 by enhancing digital literacy, 
                      improving educational outcomes, and ensuring every Kenyan child 
                      has access to quality education management tools regardless of 
                      their school's location or economic status.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Statistics Section */}
      <div className="bg-white py-5">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="fw-bold">Our Impact Across Kenya</h2>
              <p className="lead text-muted">
                Making a difference in schools from Coast to Western, Central to Northern Kenya
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {statistics.map((stat, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="text-center h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <FontAwesomeIcon 
                      icon={stat.icon} 
                      style={{ color: stat.color, fontSize: '3rem' }} 
                      className="mb-3"
                    />
                    <h3 className="fw-bold" style={{ color: stat.color }}>
                      {stat.number}
                    </h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row>
          <Col className="text-center mb-5">
            <h2 className="fw-bold">Why Kenyan Schools Choose Shuleni</h2>
            <p className="lead text-muted">
              Designed with Kenya's educational landscape in mind
            </p>
          </Col>
        </Row>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={6} key={index}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start">
                    <FontAwesomeIcon 
                      icon={feature.icon} 
                      className="text-primary me-3 mt-1" 
                      style={{ fontSize: '1.5rem' }}
                    />
                    <div>
                      <h5 className="fw-bold mb-2">{feature.title}</h5>
                      <p className="text-muted mb-0">{feature.description}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Kenya-Specific Section */}
      <div className="bg-light py-5">
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <div className="text-center mb-5">
                <h2 className="fw-bold">Supporting Kenya's Educational Goals</h2>
              </div>
              <Row className="g-4">
                <Col md={4}>
                  <div className="text-center">
                    <h4 className="fw-bold text-primary">📚 CBC Integration</h4>
                    <p className="text-muted">
                      Full support for Kenya's Competency-Based Curriculum with 
                      subject tracking, learning area management, and assessment tools 
                      aligned with KICD guidelines.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <h4 className="fw-bold text-primary">🏫 School Types</h4>
                    <p className="text-muted">
                      Supporting all Kenyan school types: Public Primary & Secondary, 
                      Private Schools, Boarding Schools, Day Schools, and Special Needs 
                      Education institutions.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <h4 className="fw-bold text-primary">💰 Affordable Pricing</h4>
                    <p className="text-muted">
                      Flexible pricing models designed for Kenyan schools, including 
                      special rates for public schools and rural institutions to ensure 
                      accessibility across all regions.
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 className="fw-bold mb-4">Ready to Transform Your School?</h2>
              <p className="lead mb-4">
                Join thousands of Kenyan schools already using Shuleni to improve 
                their educational management and student outcomes.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Button 
                  variant="light" 
                  size="lg" 
                  className="px-4 me-md-2"
                  onClick={() => navigate('/create-school')}
                >
                  Start Your Free Trial
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4"
                  onClick={() => navigate('/contact-support')}
                >
                  Contact Our Kenya Team
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
            <Col className="text-center">
              <p className="text-light mb-0 d-flex align-items-center justify-content-center">
                <img 
                  src="/favicon.svg" 
                  alt="Shuleni Logo" 
                  width="20" 
                  height="20" 
                  className="me-2"
                />
                © 2025 Shuleni School Management Platform. Proudly serving Kenyan schools.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default About;
