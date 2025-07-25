import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DemoVideoModal from '../components/DemoVideoModal';
import { useLanguage } from '../contexts/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faToolbox, faHeadset, faPlay } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { t } = useLanguage();

  // Debug element to check if page is rendering
  console.log('LandingPage is rendering');

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const handleCloseDemoModal = () => {
    setShowDemoModal(false);
  };

  const features = [
    {
      icon: faUsers,
      title: t('userFriendly'),
      description: t('userFriendlyDesc'),
      color: '#FF6B6B'
    },
    {
      icon: faToolbox,
      title: t('comprehensiveTools'),
      description: t('comprehensiveToolsDesc'),
      color: '#4ECDC4'
    },
    {
      icon: faHeadset,
      title: t('support247'),
      description: t('support247Desc'),
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
              <h1 className="display-4 fw-bold mb-4">{t('landingHeroTitle')}</h1>
              <p className="lead mb-4">
                {t('landingHeroSubtitle')}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button 
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="fw-bold px-4 py-3 border-2"
                  style={{ boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                >
                  {t('learnMore')}
                </Button>
                <Button 
                  variant="light"
                  size="lg"
                  onClick={handleWatchDemo}
                  className="fw-bold px-4 py-3"
                  style={{ 
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
                    background: 'linear-gradient(to right, #ffffff, #f0f0f0)'
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} className="me-2" />
                  {t('watchDemo')}
                </Button>
                <Button 
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate('/create-school')}
                  className="fw-bold px-4 py-3 border-2"
                  style={{ boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                >
                  {t('createYourSchool')}
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
            <h2 className="display-5 fw-bold">{t('whyChooseUs')}</h2>
            <p className="lead text-muted">
              {t('whyChooseUsSubtitle')}
            </p>
            <Button variant="primary" className="shuleni-btn-primary">
              {t('getStarted')}
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
                      fontSize: '2rem',
                      color: 'white'
                    }}
                  >
                    <FontAwesomeIcon icon={feature.icon} />
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
              <h3 className="display-6 fw-bold mb-3">{t('readyToStart')}</h3>
              <p className="lead text-muted mb-4">
                {t('readyToStartDesc')}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button 
                  variant="primary"
                  size="lg"
                  className="shuleni-btn-primary"
                  onClick={() => navigate('/login')}
                >
                  {t('startSchoolToday')}
                </Button>
                <Button 
                  variant="outline-primary"
                  size="lg"
                  onClick={handleWatchDemo}
                  className="d-flex align-items-center"
                >
                  <FontAwesomeIcon icon={faPlay} className="me-2" />
                  {t('watchDemo')}
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
                  <h6 className="fw-bold mb-3">{t('quickLinks')}</h6>
                  <div className="d-flex flex-column">
                    <button 
                      className="btn btn-link text-muted text-decoration-none mb-2 p-0 text-start"
                      onClick={() => navigate('/privacy')}
                    >
                      {t('privacyPolicy')}
                    </button>
                    <button 
                      className="btn btn-link text-muted text-decoration-none mb-2 p-0 text-start"
                      onClick={() => navigate('/terms')}
                    >
                      {t('termsOfUse')}
                    </button>
                    <button 
                      className="btn btn-link text-muted text-decoration-none mb-2 p-0 text-start"
                      onClick={() => navigate('/contact')}
                    >
                      {t('contactSupport')}
                    </button>
                  </div>
                </Col>
                <Col sm={6}>
                  <h6 className="fw-bold mb-3">{t('support')}</h6>
                  <div className="d-flex flex-column">
                    <button 
                      className="btn btn-link text-muted text-decoration-none mb-2 p-0 text-start"
                      onClick={() => navigate('/about')}
                    >
                      {t('helpCenter')}
                    </button>
                    <button 
                      className="btn btn-link text-muted text-decoration-none mb-2 p-0 text-start"
                      onClick={() => navigate('/about')}
                    >
                      {t('faq')}
                    </button>
                    <button 
                      className="btn btn-link text-muted text-decoration-none mb-2 p-0 text-start"
                      onClick={() => navigate('/contact')}
                    >
                      {t('contactUs')}
                    </button>
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

      {/* Demo Video Modal */}
      <DemoVideoModal 
        show={showDemoModal} 
        onHide={handleCloseDemoModal} 
      />
    </div>
  );
};

export default LandingPage;