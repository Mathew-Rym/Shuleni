import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    priority: '',
    category: '',
    description: '',
    attachments: null
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Support ticket submitted:', formData);
    setShowAlert(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      school: '',
      priority: '',
      category: '',
      description: '',
      attachments: null
    });
    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  const supportCategories = [
    { value: 'login', label: 'Login Issues' },
    { value: 'performance', label: 'System Performance' },
    { value: 'data', label: 'Data Management' },
    { value: 'reports', label: 'Reports & Analytics' },
    { value: 'attendance', label: 'Attendance Tracking' },
    { value: 'exams', label: 'Examination Management' },
    { value: 'fees', label: 'Fee Management' },
    { value: 'communication', label: 'Communication Tools' },
    { value: 'mobile', label: 'Mobile App Issues' },
    { value: 'integration', label: 'Third-party Integration' },
    { value: 'training', label: 'Training & Onboarding' },
    { value: 'other', label: 'Other' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', description: 'General questions, minor issues', color: 'success' },
    { value: 'medium', label: 'Medium', description: 'Non-critical functionality issues', color: 'warning' },
    { value: 'high', label: 'High', description: 'Significant impact on operations', color: 'danger' },
    { value: 'urgent', label: 'Urgent', description: 'System down, critical data loss', color: 'dark' }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Technical Support</h1>
              <p className="lead">Get technical assistance for Shuleni platform</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-5">
        {showAlert && (
          <Alert variant="success" className="mb-4">
            <Alert.Heading>Support Ticket Created!</Alert.Heading>
            <p className="mb-0">
              Your support ticket has been submitted successfully. Our technical team will respond 
              within 2-24 hours depending on the priority level. You will receive email updates 
              on the progress of your ticket.
            </p>
          </Alert>
        )}

        <Row>
          {/* Support Form */}
          <Col lg={8} className="mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="mb-4">Submit a Support Ticket</h3>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +254 700 000 000"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>School Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="school"
                          value={formData.school}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your school name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Issue Category <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select category</option>
                          {supportCategories.map((cat, index) => (
                            <option key={index} value={cat.value}>{cat.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority Level <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select priority</option>
                          {priorityLevels.map((priority, index) => (
                            <option key={index} value={priority.value}>
                              {priority.label} - {priority.description}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Issue Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Please describe the issue in detail. Include:
- What you were trying to do
- What happened instead
- Any error messages you saw
- Steps to reproduce the issue
- Screenshots (if applicable)"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Attachments</Form.Label>
                    <Form.Control
                      type="file"
                      name="attachments"
                      onChange={handleInputChange}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <Form.Text className="text-muted">
                      Attach screenshots, error logs, or relevant documents (Max 10MB, formats: JPG, PNG, PDF, DOC, XLS)
                    </Form.Text>
                  </Form.Group>

                  <Button type="submit" variant="primary" size="lg">
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Support Ticket
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Support Information */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="mb-4">Response Times</h4>
                {priorityLevels.map((priority, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <Badge bg={priority.color} className="mb-1">{priority.label}</Badge>
                      <small className="text-muted">
                        {priority.value === 'urgent' ? '< 2 hours' :
                         priority.value === 'high' ? '< 4 hours' :
                         priority.value === 'medium' ? '< 12 hours' : '< 24 hours'}
                      </small>
                    </div>
                    <small className="text-muted">{priority.description}</small>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="mb-4">Emergency Contact</h4>
                <p className="text-muted mb-3">
                  For system outages or critical issues affecting multiple users:
                </p>
                <div className="mb-3">
                  <h6 className="text-primary">24/7 Emergency Hotline</h6>
                  <p className="text-muted mb-0">+254 </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-primary">WhatsApp Support</h6>
                  <p className="text-muted mb-0">+254 </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-primary">Email</h6>
                  <p className="text-muted mb-0">emergency@shuleni.co.ke</p>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4">Before You Submit</h4>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/faq" variant="outline-primary" size="sm">
                    <i className="fas fa-question-circle me-2"></i>
                    Check FAQ
                  </Button>
                  <Button as={Link} to="/help-center" variant="outline-primary" size="sm">
                    <i className="fas fa-book me-2"></i>
                    Browse Help Center
                  </Button>
                  <Button 
                    href="https://status.shuleni.co.ke" 
                    target="_blank" 
                    variant="outline-primary" 
                    size="sm"
                  >
                    <i className="fas fa-server me-2"></i>
                    System Status
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Common Issues */}
        <Row className="mt-5">
          <Col>
            <h3 className="mb-4">Common Issues & Quick Fixes</h3>
            <Row>
              <Col md={6} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="fas fa-sign-in-alt fa-2x text-primary mb-3"></i>
                    <h5>Login Problems</h5>
                    <p className="text-muted small">
                      Try clearing browser cache, check caps lock, or use password reset
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="fas fa-tachometer-alt fa-2x text-primary mb-3"></i>
                    <h5>Slow Loading</h5>
                    <p className="text-muted small">
                      Check internet connection, try different browser, or contact IT admin
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="fas fa-mobile-alt fa-2x text-primary mb-3"></i>
                    <h5>Mobile Issues</h5>
                    <p className="text-muted small">
                      Update app, restart device, or try mobile web browser
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="fas fa-file-alt fa-2x text-primary mb-3"></i>
                    <h5>Report Issues</h5>
                    <p className="text-muted small">
                      Refresh page, check date filters, or try generating again
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Back to Home */}
        <Row className="mt-5">
          <Col className="text-center">
            <Button as={Link} to="/" variant="outline-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactSupport;