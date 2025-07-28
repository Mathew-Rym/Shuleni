import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    setShowAlert(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  const developers = [
    {
      name: "Rym",
      role: "Frontend Developer",
      email: "mathew.njuguna@student.moringaschool.com",
      phone: "+254 ",
      specialization: "React.js, UI/UX Design"
    },
    {
      name: "Neville",
      role: "Frontend Developer", 
      email: "neville.nganga@student.moringaschool.com",
      phone: "+254 ",
      specialization: "JavaScript, User Experience"
    },
    {
      name: "Clavis",
      role: "Backend Developer",
      email: "calvis.onyango@student.moringaschool.com", 
      phone: "+254 ",
      specialization: "Python, Flask, Database Design"
    },
    {
      name: "Sharon",
      role: "Backend Developer",
      email: "sharon.njue@student.moringaschool.com",
      phone: "+254 ", 
      specialization: "API Development, System Architecture"
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Contact Us</h1>
              <p className="lead">Get in touch with our team for support and inquiries</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-5">
        {showAlert && (
          <Alert variant="success" className="mb-4">
            Thank you for contacting us! We'll get back to you within 24 hours.
          </Alert>
        )}

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="mb-4">Send us a Message</h3>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
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
                        <Form.Label>Email Address</Form.Label>
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
                        <Form.Label>Subject</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Pricing</option>
                          <option value="feature">Feature Request</option>
                          <option value="demo">Request Demo</option>
                          <option value="partnership">Partnership</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us how we can help you..."
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" size="lg">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="mb-4">Get in Touch</h4>
                <div className="mb-3">
                  <h6 className="text-primary">Office Address</h6>
                  <p className="text-muted mb-0">
                    Shuleni Solutions Ltd.<br />
                    AppleWood, 7th Floor<br />
                   Ngong Road<br />
                    Nairobi, Kenya
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-primary">Phone</h6>
                  <p className="text-muted mb-0">+254 </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-primary">Email</h6>
                  <p className="text-muted mb-0">info@shuleni.co.ke</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-primary">Business Hours</h6>
                  <p className="text-muted mb-0">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4">Quick Support</h4>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/help-center" variant="outline-primary">
                    <i className="fas fa-book me-2"></i>
                    Help Center
                  </Button>
                  <Button as={Link} to="/faq" variant="outline-primary">
                    <i className="fas fa-question-circle me-2"></i>
                    FAQ
                  </Button>
                  <Button as={Link} to="/contact-support" variant="outline-primary">
                    <i className="fas fa-headset me-2"></i>
                    Technical Support
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Development Team */}
        <Row className="mt-5">
          <Col>
            <h3 className="text-center mb-4">Meet Our Development Team</h3>
            <p className="text-center text-muted mb-5">
              The talented software developers behind Shuleni School Management Platform
            </p>
            <Row>
              {developers.map((dev, index) => (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm text-center">
                    <Card.Body className="p-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                           style={{width: '80px', height: '80px'}}>
                        <i className="fas fa-user-circle fa-3x text-primary"></i>
                      </div>
                      <h5 className="fw-bold">{dev.name}</h5>
                      <p className="text-primary mb-2">{dev.role}</p>
                      <p className="text-muted small mb-3">{dev.specialization}</p>
                      <div className="text-start">
                        <p className="mb-1">
                          <i className="fas fa-envelope text-primary me-2"></i>
                          <small>{dev.email}</small>
                        </p>
                        <p className="mb-0">
                          <i className="fas fa-phone text-primary me-2"></i>
                          <small>{dev.phone}</small>
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
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

export default ContactUs;
