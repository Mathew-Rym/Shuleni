import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faArrowLeft, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { createSchool } from '../Store/slices/schoolsSlice';
import { loginUser } from '../Store/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateSchoolPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.schools);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schoolType: '',
    address: '',
    phone: '',
    email: '',
    established: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create the school
      await dispatch(createSchool({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        established: formData.established,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
      }));

     
      // TODO: Replace with actual API call to create admin account
      await dispatch(loginUser({
        email: formData.adminEmail,
        password: 'admin123', 
        role: 'admin'
      }));

      setShowSuccess(true);
      
    
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-lg border-0">
              <Card.Header className="card-header-custom text-center py-4">
                <h2 className="mb-0">
                  <FontAwesomeIcon icon={faSchool} className="me-2" />
                  Create Your School
                </h2>
                <p className="mb-0 mt-2 opacity-75">
                  Set up your educational institution on Shuleni
                </p>
              </Card.Header>
              
              <Card.Body className="p-4">
                {showSuccess && (
                  <Alert variant="success" className="mb-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    School created successfully! Redirecting to admin dashboard...
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <h5 className="text-primary-custom mb-3">
                      <i className="fas fa-building me-2"></i>
                      School Information
                    </h5>
                    
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>School Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter school name"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of your school"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>School Type *</Form.Label>
                          <Form.Select
                            name="schoolType"
                            value={formData.schoolType}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select school type</option>
                            <option value="primary">Primary School</option>
                            <option value="secondary">Secondary School</option>
                            <option value="high-school">High School</option>
                            <option value="college">College</option>
                            <option value="university">University</option>
                            <option value="technical">Technical Institute</option>
                            <option value="vocational">Vocational Training</option>
                            <option value="international">International School</option>
                            <option value="private">Private School</option>
                            <option value="public">Public School</option>
                            <option value="montessori">Montessori School</option>
                            <option value="special-needs">Special Needs School</option>
                            <option value="boarding">Boarding School</option>
                            <option value="online">Online School</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Established Year</Form.Label>
                          <Form.Control
                            type="number"
                            name="established"
                            value={formData.established}
                            onChange={handleChange}
                            placeholder="2024"
                            min="1800"
                            max="2024"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>School Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="info@school.com"
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
                            onChange={handleChange}
                            placeholder="+254 700 123456"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="School address"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-primary-custom mb-3">
                      <i className="fas fa-user-shield me-2"></i>
                      Administrator Information
                    </h5>
                    
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Admin Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="adminName"
                            value={formData.adminName}
                            onChange={handleChange}
                            placeholder="Enter admin full name"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Admin Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="adminEmail"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            placeholder="admin@school.com"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Admin Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="adminPhone"
                            value={formData.adminPhone}
                            onChange={handleChange}
                            placeholder="+254 700 123456"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleGoBack}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back to Home
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="me-2" />
                          Creating School...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSchool} className="me-2" />
                          Create School
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateSchoolPage;