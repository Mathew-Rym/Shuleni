import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadset, 
  faArrowLeft, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faClock,
  faUsers,
  faQuestionCircle,
  faBug,
  faLightbulb,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const ContactSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Support request:', formData);
    setShowSuccess(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      school: '',
      category: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  const supportCategories = [
    { value: 'technical', label: 'Technical Issue', icon: faBug },
    { value: 'account', label: 'Account Support', icon: faUsers },
    { value: 'billing', label: 'Billing Question', icon: faEnvelope },
    { value: 'feature', label: 'Feature Request', icon: faLightbulb },
    { value: 'general', label: 'General Inquiry', icon: faQuestionCircle },
    { value: 'urgent', label: 'Urgent Issue', icon: faExclamationTriangle }
  ];

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="d-flex align-items-center mb-4">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate(-1)}
                className="me-3"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </Button>
              <div>
                <h1 className="mb-2">
                  <FontAwesomeIcon icon={faHeadset} className="me-2 text-primary" />
                  Contact Support
                </h1>
                <p className="text-muted mb-0">We're here to help you succeed with Shuleni</p>
              </div>
            </div>

            {showSuccess && (
              <Alert variant="success" className="mb-4" dismissible onClose={() => setShowSuccess(false)}>
                <strong>Thank you!</strong> Your support request has been submitted. We'll get back to you within 24 hours.
              </Alert>
            )}

            <Row>
              {/* Contact Information */}
              <Col lg={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="text-primary mb-4">Get in Touch</h4>
                    
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#e3f2fd' }}
                        >
                          <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">Email Support</h6>
                          <a href="mailto:support@shuleni.com" className="text-muted text-decoration-none">
                            support@shuleni.com
                          </a>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#e8f5e8' }}
                        >
                          <FontAwesomeIcon icon={faPhone} className="text-success" />
                        </div>
                        <div>
                          <h6 className="mb-1">Phone Support</h6>
                          <a href="tel:+254700748536" className="text-muted text-decoration-none">
                            +254-700-SHULENI
                          </a>
                          <br />
                          <small className="text-muted">(+254-700-748-5364)</small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#fff3e0' }}
                        >
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-warning" />
                        </div>
                        <div>
                          <h6 className="mb-1">Office Address</h6>
                          <p className="text-muted mb-0">
                            123 Education Avenue<br />
                            Nairobi, Kenya<br />
                            P.O. Box 12345-00100
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#f3e5f5' }}
                        >
                          <FontAwesomeIcon icon={faClock} className="text-purple" />
                        </div>
                        <div>
                          <h6 className="mb-1">Support Hours</h6>
                          <p className="text-muted mb-0">
                            Monday - Friday: 8AM - 6PM EAT<br />
                            Saturday: 9AM - 2PM EAT<br />
                            <small>Emergency support 24/7</small>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-top pt-4">
                      <h6 className="mb-3">Quick Links</h6>
                      <div className="d-flex flex-column gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate('/about')}
                          className="text-start"
                        >
                          📚 User Guide & Documentation
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          className="text-start"
                          onClick={() => window.open('https://status.shuleni.com', '_blank')}
                        >
                          🟢 System Status
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          className="text-start"
                          onClick={() => navigate('/faq')}
                        >
                          ❓ Frequently Asked Questions
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Support Form */}
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h4 className="text-primary mb-4">Submit a Support Request</h4>
                    
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name *</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>School/Organization</Form.Label>
                            <Form.Control
                              type="text"
                              name="school"
                              value={formData.school}
                              onChange={handleChange}
                              placeholder="Enter your school name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Priority Level</Form.Label>
                            <Form.Select
                              name="priority"
                              value={formData.priority}
                              onChange={handleChange}
                            >
                              <option value="low">Low - General inquiry</option>
                              <option value="medium">Medium - Standard support</option>
                              <option value="high">High - Affecting multiple users</option>
                              <option value="urgent">Urgent - System down/critical</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Support Category *</Form.Label>
                        <Row>
                          {supportCategories.map((category) => (
                            <Col md={4} key={category.value} className="mb-2">
                              <Form.Check
                                type="radio"
                                id={category.value}
                                name="category"
                                value={category.value}
                                checked={formData.category === category.value}
                                onChange={handleChange}
                                label={
                                  <span>
                                    <FontAwesomeIcon 
                                      icon={category.icon} 
                                      className="me-2 text-primary" 
                                    />
                                    {category.label}
                                  </span>
                                }
                                required
                              />
                            </Col>
                          ))}
                        </Row>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Subject *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Message *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please provide detailed information about your issue or question. Include any error messages, steps to reproduce the problem, and your browser/device information if relevant."
                          required
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          * Required fields. We typically respond within 24 hours.
                        </small>
                        <Button 
                          type="submit" 
                          variant="primary" 
                          size="lg"
                          className="px-4"
                        >
                          Submit Request
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Founder Information */}
                <Card className="border-0 shadow-sm mt-4">
                  <Card.Body className="p-4">
                    <h5 className="text-primary mb-3">Meet the Shuleni Team</h5>
                    <Row>
                      <Col md={6}>
                        <div className="d-flex align-items-center mb-3">
                          <div 
                            className="rounded-circle me-3 bg-primary d-flex align-items-center justify-content-center"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <span className="text-white fw-bold">RK</span>
                          </div>
                          <div>
                            <h6 className="mb-1">Dr. Robert Kimani</h6>
                            <p className="text-muted mb-0">Co-Founder & CEO</p>
                            <small className="text-muted">
                              Former Education Minister, 15+ years in EdTech
                            </small>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center mb-3">
                          <div 
                            className="rounded-circle me-3 bg-success d-flex align-items-center justify-content-center"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <span className="text-white fw-bold">AN</span>
                          </div>
                          <div>
                            <h6 className="mb-1">Prof. Amina Nyong'o</h6>
                            <p className="text-muted mb-0">Co-Founder & CTO</p>
                            <small className="text-muted">
                              Software Engineering PhD, AI/ML Expert
                            </small>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <p className="text-muted mb-0">
                      <strong>Our Mission:</strong> Democratizing quality education through innovative technology 
                      that connects communities and empowers learners across Africa and beyond.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactSupport;
