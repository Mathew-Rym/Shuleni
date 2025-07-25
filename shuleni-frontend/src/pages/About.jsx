import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faChalkboardTeacher, 
  faUserGraduate, 
  faBookOpen, 
  faVideo, 
  faComments,
  faChartLine,
  faShieldAlt,
  faGlobe,
  faMobile,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: faChalkboardTeacher,
      title: "Teacher Management",
      description: "Comprehensive teacher dashboard with class management, student tracking, and resource sharing capabilities."
    },
    {
      icon: faUserGraduate,
      title: "Student Portal",
      description: "Intuitive student interface for accessing resources, submitting assignments, and tracking progress."
    },
    {
      icon: faUsers,
      title: "School Administration",
      description: "Powerful admin tools for managing schools, users, classes, and system-wide settings."
    },
    {
      icon: faVideo,
      title: "Video Learning",
      description: "Integrated video conferencing and recorded lesson playback for enhanced learning experiences."
    },
    {
      icon: faComments,
      title: "Real-time Chat",
      description: "Instant messaging system for teachers, students, and administrators to communicate effectively."
    },
    {
      icon: faBookOpen,
      title: "Resource Library",
      description: "Centralized repository for educational materials, documents, and learning resources."
    },
    {
      icon: faChartLine,
      title: "Analytics & Reports",
      description: "Detailed insights into student performance, attendance, and educational outcomes."
    },
    {
      icon: faShieldAlt,
      title: "Security & Privacy",
      description: "Enterprise-grade security with role-based access controls and data protection."
    },
    {
      icon: faGlobe,
      title: "Multi-language Support",
      description: "Internationalization support with real-time language switching for global accessibility."
    }
  ];

  const benefits = [
    {
      title: "For Schools",
      points: [
        "Streamlined administration and management",
        "Improved teacher-student communication",
        "Comprehensive reporting and analytics",
        "Cost-effective digital transformation"
      ]
    },
    {
      title: "For Teachers",
      points: [
        "Simplified class and student management",
        "Easy resource sharing and assignment distribution",
        "Real-time student progress tracking",
        "Professional development tools"
      ]
    },
    {
      title: "For Students",
      points: [
        "Centralized access to all learning materials",
        "Interactive learning experiences",
        "Direct communication with teachers",
        "Progress tracking and achievement recognition"
      ]
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Back Button */}
      <Container className="pt-3">
        <Button 
          variant="link" 
          onClick={() => navigate(-1)}
          className="d-flex align-items-center text-decoration-none p-0 mb-3"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
        </Button>
      </Container>
      
      {/* Hero Section */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '100px 0 80px'
        }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Revolutionizing Education Management
              </h1>
              <p className="lead mb-4">
                Shuleni is a comprehensive school management platform designed to connect 
                teachers, students, and administrators in a seamless digital learning environment.
              </p>
              <Button 
                variant="light"
                size="lg"
                onClick={() => navigate('/create-school')}
                className="fw-bold px-5 py-3"
                style={{ 
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                  background: 'linear-gradient(to right, #ffffff, #f8f9fa)'
                }}
              >
                Start Your Journey
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold mb-3">Powerful Features</h2>
            <p className="lead text-muted">
              Everything you need to manage your educational institution effectively
            </p>
          </Col>
        </Row>
        
        <Row>
          {features.map((feature, index) => (
            <Col lg={4} md={6} className="mb-4" key={index}>
              <Card className="h-100 border-0 shadow-sm hover-shadow-lg transition-all">
                <Card.Body className="text-center p-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    <FontAwesomeIcon icon={feature.icon} size="lg" />
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Benefits Section */}
      <div className="bg-white py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3">Benefits for Everyone</h2>
              <p className="lead text-muted">
                Shuleni transforms the educational experience for all stakeholders
              </p>
            </Col>
          </Row>
          
          <Row>
            {benefits.map((benefit, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold mb-4 text-primary">{benefit.title}</h4>
                    <ul className="list-unstyled">
                      {benefit.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="mb-2 d-flex align-items-start">
                          <FontAwesomeIcon 
                            icon={faShieldAlt} 
                            className="text-success me-2 mt-1" 
                            size="sm" 
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Technology Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold mb-3">Built with Modern Technology</h2>
            <p className="lead text-muted">
              Leveraging cutting-edge technologies for a reliable and scalable platform
            </p>
          </Col>
        </Row>
        
        <Row className="justify-content-center">
          <Col lg={8}>
            <Row>
              <Col md={6} className="mb-4">
                <Card className="border-0 bg-light h-100">
                  <Card.Body className="text-center p-4">
                    <FontAwesomeIcon 
                      icon={faMobile} 
                      size="2x" 
                      className="text-primary mb-3" 
                    />
                    <h5 className="fw-bold">Responsive Design</h5>
                    <p className="text-muted mb-0">
                      Fully responsive interface that works seamlessly across all devices and screen sizes.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="border-0 bg-light h-100">
                  <Card.Body className="text-center p-4">
                    <FontAwesomeIcon 
                      icon={faGlobe} 
                      size="2x" 
                      className="text-primary mb-3" 
                    />
                    <h5 className="fw-bold">Cloud-Based</h5>
                    <p className="text-muted mb-0">
                      Secure cloud infrastructure ensuring 99.9% uptime and global accessibility.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Call to Action */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 0'
        }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-4">
                Ready to Transform Your School?
              </h2>
              <p className="lead mb-4">
                Join hundreds of schools already using Shuleni to enhance their educational experience.
                Get started today and see the difference modern school management can make.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button 
                  variant="light"
                  size="lg"
                  onClick={() => navigate('/create-school')}
                  className="fw-bold px-5 py-3"
                  style={{ 
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                    background: 'linear-gradient(to right, #ffffff, #f8f9fa)'
                  }}
                >
                  Create Your School
                </Button>
                <Button 
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="fw-bold px-5 py-3 border-2"
                  style={{ boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                >
                  Sign In
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;
