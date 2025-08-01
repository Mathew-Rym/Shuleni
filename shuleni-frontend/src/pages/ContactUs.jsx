import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub, FaEnvelope, FaUserTie, FaCode, FaServer, FaTools } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    attachment: null
  });
  const [showAlert, setShowAlert] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    if (e.target.name === 'attachment') {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          attachment: file
        });
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      attachment: null
    });
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object to handle file upload
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      // Here you would typically send the form data to your backend
      console.log('Contact form submitted:', formData);
      
      // Example of how you might send the form data to an API endpoint:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });
      
      setShowAlert(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        attachment: null
      });
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show error message to user, etc.)
    }
  };
{/* Development Team */}
  const developers = [
    {
      name: "Rym Mathew",
      role: "Team Lead — Frontend & Backend Supervision",
      email: "rymmathew@gmail.com",
      secondaryEmail: "mathew.njuguna@student.moringaschool.com",
      github: "Mathew-Rym",
      specialization: "React.js, UI/UX Design, Redux Toolkit, API Integration",
      roleDescription: "Led the full development team, oversaw both frontend and backend progress, implemented core UI architecture with React, managed Redux state, ensured seamless API integration, and coordinated collaboration, version control, and deadlines across all contributors.",
      image: "/images/team/rym.jpg"
    },
    {
      name: "Neville Ng'ang'a",
      role: "Frontend Developer",
      email: "neville.nganga@student.moringaschool.com",
      github: "NevilleM23",
      specialization: "JavaScript, User Experience",
      roleDescription: "Developed UI components, contributed to layouts and styling, and supported responsiveness and user experience features.",
      image: "/images/team/neville.jpg"
    },
    {
      name: "Sharon Njue",
      role: "Backend Developer (Lead)",
      email: "sharon.njue@student.moringaschool.com",
      github: "RoseofKendy",
      specialization: "Flask, API Development, System Design",
      roleDescription: "Led backend development, built and maintained APIs, handled user authentication, and managed database integration.",
      image: "/images/team/sharon.jpg"
    },
    {
      name: "Calvis Onyango",
      role: "Backend Developer (Support)",
      email: "calvis.onyango@student.moringaschool.com",
      github: "Calvis265",
      specialization: "Flask, PostgreSQL",
      roleDescription: "Contributed to backend routes, supported system setup, and assisted in database configuration and testing.",
      image: "/images/team/calvis.jpg"
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

        {/* Team Section */}
        <section className="mb-5">
          <h3 className="text-center mb-4">Meet Our Development Team</h3>
          <p className="text-center text-muted mb-5">
              The talented software developers behind Shuleni School Management Platform
            </p>
          <Row className="g-4">
            {developers.map((dev, index) => (
              <Col key={index} md={6} lg={3}>
                <Card className="h-100 shadow-sm">
                  <div className="text-center p-3">
                    <div className="position-relative d-inline-block mb-3">
                      <Image 
                        src={dev.image} 
                        alt={dev.name}
                        roundedCircle 
                        width={150} 
                        height={150}
                        className="border border-3 border-primary"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=0D6EFD&color=fff&size=150`;
                        }}
                      />
                      {dev.role.includes('Lead') && (
                        <div className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2">
                          {dev.role.includes('Frontend') || dev.role.includes('Backend') ? (
                            <FaServer size={20} />
                          ) : (
                            <FaUserTie size={20} />
                          )}
                        </div>
                      )}
                    </div>
                    <Card.Title className="h5 mb-1">{dev.name}</Card.Title>
                    <p className="text-muted mb-2">{dev.role}</p>
                    <p className="small text-muted">
                      <FaCode className="me-1" /> {dev.specialization}
                    </p>
                  </div>
                  <Card.Body className="pt-0">
                    <div className="d-flex flex-column">
                      <a href={`mailto:${dev.email}`} className="text-decoration-none mb-2">
                        <FaEnvelope className="me-2 text-primary" />
                        {dev.email}
                      </a>
                      {dev.secondaryEmail && (
                        <a href={`mailto:${dev.secondaryEmail}`} className="text-decoration-none mb-2 small text-muted">
                          <FaEnvelope className="me-2" />
                          {dev.secondaryEmail}
                        </a>
                      )}
                      <a 
                        href={`https://github.com/${dev.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none d-flex align-items-center"
                      >
                        <FaGithub className="me-2" />
                        <span>github.com/{dev.github}</span>
                      </a>
                    </div>
                    <div className="mt-3 pt-2 border-top">
                      <p className="small text-muted mb-0">{dev.roleDescription}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <Row className="mt-5">
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

                  <Form.Group className="mb-4">
                    <Form.Label>Attachment (Optional)</Form.Label>
                    {preview ? (
                      <div className="mb-2">
                        <Image 
                          src={preview} 
                          alt="Preview" 
                          fluid 
                          className="mb-2" 
                          style={{ maxHeight: '150px' }}
                        />
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={handleRemoveFile}
                          className="d-block"
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="file"
                          name="attachment"
                          onChange={handleInputChange}
                          ref={fileInputRef}
                          accept="image/*,.pdf,.doc,.docx"
                          className="form-control"
                        />
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      You can attach files (images, PDF, Word) up to 5MB
                    </Form.Text>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    className="w-100"
                  >
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
