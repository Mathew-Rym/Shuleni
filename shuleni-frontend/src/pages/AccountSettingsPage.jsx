import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, ListGroup, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, faTrashAlt, faSignOutAlt, faFileExport,
  faHistory, faGlobe, faUserShield, faSave, faInfoCircle,
  faDesktop, faMobile, faTablet, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AccountSettingsPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Get user role from Redux store
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || 'student';
  
  // Language context
  const { currentLanguage, changeLanguage, t, availableLanguages } = useLanguage();
  
  // Check permissions
  const canDeleteAccount = userRole === 'admin';
  const canChangeSettings = userRole !== 'student';
  
  // Mock sessions data
  const activeSessions = [
    { 
      id: 1, 
      device: 'Chrome on Windows', 
      location: 'Nairobi, Kenya', 
      ip: '102.68.xx.xx', 
      lastActive: 'Current session',
      isCurrent: true,
      icon: faDesktop
    },
    { 
      id: 2, 
      device: 'Safari on iPhone', 
      location: 'Nairobi, Kenya', 
      ip: '102.68.xx.xx', 
      lastActive: 'Last active 2 hours ago',
      isCurrent: false,
      icon: faMobile
    },
    { 
      id: 3, 
      device: 'Chrome on iPad', 
      location: 'Mombasa, Kenya', 
      ip: '41.80.xx.xx', 
      lastActive: 'Last active yesterday',
      isCurrent: false,
      icon: faTablet
    }
  ];

  // Mock settings data - students have fixed settings
  const getDefaultSettings = () => {
    if (userRole === 'student') {
      return {
        language: currentLanguage,
        timezone: 'Africa/Nairobi',
        dataSharing: true, // Always on for students
        analyticsConsent: true // Always on for students
      };
    }
    return {
      language: currentLanguage,
      timezone: 'Africa/Nairobi',
      dataSharing: true,
      analyticsConsent: true
    };
  };

  const [settings, setSettings] = useState(getDefaultSettings());

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Handle language change
    if (name === 'language') {
      changeLanguage(value);
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic would go here
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  const handleSessionLogout = (sessionId) => {
    console.log(`Logging out session ${sessionId}`);
    // Logic to log out specific session would go here
    alert(`Session ${sessionId} logged out`);
  };

  const handleLogout = () => {
    // Logout logic would go here
    console.log('Logging out');
    setShowLogoutModal(false);
    // In a real app, this would redirect to login page
  };

  const handleAccountDelete = () => {
    // Account deletion logic would go here
    console.log('Deleting account');
    setShowDeleteModal(false);
    // In a real app, this would redirect to login page
  };

  const handleExportData = () => {
    // Data export logic would go here
    console.log('Exporting data');
    alert('Your data export is being prepared. You will receive an email when it is ready for download.');
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      
      <div className="flex-grow-1">
        <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} showSidebarToggle={true} />
        
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <h1 className="mb-1 fw-bold">{t('accountSettings')}</h1>
              <p className="text-muted">Manage your account settings and preferences</p>
            </Col>
          </Row>
          
          {showSuccessAlert && (
            <Alert variant="success" className="mb-4" dismissible onClose={() => setShowSuccessAlert(false)}>
              Your account settings have been updated successfully!
            </Alert>
          )}
          
          <Row>
            <Col md={6} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Preferences</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('language')}</Form.Label>
                      <Form.Select 
                        name="language" 
                        value={currentLanguage}
                        onChange={handleInputChange}
                        disabled={!canChangeSettings}
                      >
                        {availableLanguages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </Form.Select>
                      {userRole === 'student' && (
                        <Form.Text className="text-muted">
                          Language changes require administrator approval.
                        </Form.Text>
                      )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Timezone</Form.Label>
                      <Form.Select 
                        name="timezone" 
                        value={settings.timezone}
                        onChange={handleInputChange}
                      >
                        <option value="Africa/Nairobi">East Africa Time (GMT+3)</option>
                        <option value="Africa/Lagos">West Africa Time (GMT+1)</option>
                        <option value="Africa/Cairo">Egypt Standard Time (GMT+2)</option>
                        <option value="UTC">Coordinated Universal Time (UTC)</option>
                        <option value="Europe/London">British Standard Time (GMT)</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="switch"
                        id="data-sharing-switch"
                        label="Allow data sharing with school administrators"
                        name="dataSharing"
                        checked={settings.dataSharing}
                        onChange={handleInputChange}
                        disabled={userRole === 'student'}
                      />
                      <Form.Text className="text-muted">
                        {userRole === 'student' ? 
                          'Data sharing is automatically enabled for all students.' :
                          'This allows sharing of your usage statistics with your school administrators.'
                        }
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Check 
                        type="switch"
                        id="analytics-switch"
                        label="Allow anonymous usage for analytics"
                        name="analyticsConsent"
                        checked={settings.analyticsConsent}
                        onChange={handleInputChange}
                        disabled={userRole === 'student'}
                      />
                      <Form.Text className="text-muted">
                        {userRole === 'student' ? 
                          'Anonymous analytics is automatically enabled for all students.' :
                          'This helps us improve Shuleni by collecting anonymous usage data.'
                        }
                      </Form.Text>
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        <FontAwesomeIcon icon={faSave} className="me-2" /> Save Preferences
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mb-4">
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Active Sessions</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {activeSessions.map(session => (
                      <ListGroup.Item key={session.id} className="py-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-light rounded-circle p-2" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FontAwesomeIcon icon={session.icon} />
                            </div>
                          </div>
                          <div className="me-auto">
                            <div className="d-flex align-items-center mb-1">
                              <div className="fw-bold">{session.device}</div>
                              {session.isCurrent && (
                                <Badge bg="success" pill className="ms-2">Current</Badge>
                              )}
                            </div>
                            <div className="small text-muted">{session.location} • {session.ip}</div>
                            <div className="small text-muted">{session.lastActive}</div>
                          </div>
                          {!session.isCurrent && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleSessionLogout(session.id)}
                            >
                              Logout
                            </Button>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Log out of all sessions
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Data & Privacy</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3 mb-md-0">
                      <div className="d-flex">
                        <div className="me-3">
                          <FontAwesomeIcon 
                            icon={faFileExport} 
                            size="lg" 
                            className="text-primary"
                            style={{ width: '24px' }}
                          />
                        </div>
                        <div>
                          <h6>Export Your Data</h6>
                          <p className="text-muted mb-2">
                            Download a copy of your personal data including your profile information, activities, and grades.
                          </p>
                          <Button 
                            variant="outline-primary"
                            size="sm"
                            onClick={handleExportData}
                          >
                            <FontAwesomeIcon icon={faDownload} className="me-1" /> Request Data Export
                          </Button>
                        </div>
                      </div>
                    </Col>
                    {canDeleteAccount && (
                      <Col md={6}>
                        <div className="d-flex">
                          <div className="me-3">
                            <FontAwesomeIcon 
                              icon={faTrashAlt} 
                              size="lg" 
                              className="text-danger"
                              style={{ width: '24px' }}
                            />
                          </div>
                          <div>
                            <h6>Delete Your Account</h6>
                            <p className="text-muted mb-2">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Button 
                              variant="outline-danger"
                              size="sm"
                              onClick={() => setShowDeleteModal(true)}
                            >
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </Col>
                    )}
                    
                    {!canDeleteAccount && (
                      <Col md={6}>
                        <Alert variant="info" className="mb-0">
                          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                          {userRole === 'student' ? 
                            'Students cannot delete their accounts. Please contact your administrator if you need assistance.' :
                            'Only administrators can delete accounts. Please contact your administrator if needed.'
                          }
                        </Alert>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Delete Account Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center mb-3">
            <div 
              className="bg-danger-subtle rounded-circle p-3 me-3"
              style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FontAwesomeIcon icon={faInfoCircle} size="2x" className="text-danger" />
            </div>
            <div>
              <h5 className="mb-1">Are you absolutely sure?</h5>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>
          </div>
          <p>Deleting your account will:</p>
          <ul className="mb-4">
            <li>Remove your profile and personal information</li>
            <li>Remove your access to all schools and classes</li>
            <li>Delete all your submitted assignments and grades</li>
            <li>Cancel all your subscriptions and billing information</li>
          </ul>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="confirm-delete"
                label="I understand this action cannot be undone"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type "delete my account" to confirm:</Form.Label>
              <Form.Control type="text" placeholder="delete my account" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleAccountDelete}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Logout All Sessions Modal */}
      <Modal 
        show={showLogoutModal} 
        onHide={() => setShowLogoutModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Log Out of All Sessions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to log out of all devices? You will need to log back in on each device.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Log Out All
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AccountSettingsPage;
