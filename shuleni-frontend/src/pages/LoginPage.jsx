import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../Store/slices/authSlice';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : 
                          user.role === 'teacher' ? '/teacher' : '/student';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      dispatch(loginUser(formData));
    }
  };

  const demoAccounts = [
    { email: 'admin@shuleni.com', password: 'admin123', role: 'Admin' },
    { email: 'teacher@shuleni.com', password: 'teacher123', role: 'Teacher' },
    { email: 'student@shuleni.com', password: 'student123', role: 'Student' }
  ];

  const handleDemoLogin = (demoAccount) => {
    setFormData({
      email: demoAccount.email,
      password: demoAccount.password
    });
    dispatch(loginUser({
      email: demoAccount.email,
      password: demoAccount.password
    }));
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation */}
      <Navbar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shuleni-card border-0 shadow-lg">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="shuleni-hero rounded p-4 mb-4">
                    <h2 className="text-white fw-bold mb-2">Login</h2>
                    <p className="text-white opacity-75 mb-0">Access your dashboard</p>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <strong>Login Failed:</strong> {error}
                    <Button 
                      variant="link" 
                      className="p-0 ms-2 text-danger"
                      onClick={() => dispatch(clearError())}
                    >
                      ✕
                    </Button>
                  </Alert>
                )}

                {/* Demo Accounts Info */}
                <Alert variant="info" className="mb-4">
                  <strong>Demo Accounts:</strong>
                  {demoAccounts.map((account, index) => (
                    <div key={index} className="mt-2">
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none small"
                        onClick={() => handleDemoLogin(account)}
                      >
                        <strong>{account.role}:</strong> {account.email} / {account.password}
                      </Button>
                    </div>
                  ))}
                </Alert>

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="shuleni-form-control"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="shuleni-form-control"
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      className="shuleni-btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Logging in...
                        </>
                      ) : (
                        'Log In'
                      )}
                    </Button>
                  </div>
                </Form>

                {/* Additional Links */}
                <div className="text-center mt-4">
                  <div className="mb-2">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot your password?
                    </Link>
                  </div>
                  <div>
                    <span className="text-muted">Don't have a school? </span>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none"
                      onClick={() => navigate('/create-school')}
                    >
                      Create one here
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <Container>
          <Row>
            <Col className="text-center">
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-4">
                <Link to="/privacy-policy" className="text-light text-decoration-none">Privacy Policy</Link>
                <Link to="/terms-of-use" className="text-light text-decoration-none">Terms of Service</Link>
                <Link to="/contact-us" className="text-light text-decoration-none">Contact Us</Link>
                <Link to="/faq" className="text-light text-decoration-none">FAQ</Link>
              </div>
              <p className="text-light mt-2 mb-0 small d-flex align-items-center justify-content-center">
                <img 
                  src="/favicon.svg" 
                  alt="Shuleni Logo" 
                  width="16" 
                  height="16" 
                  className="me-2"
                />
                © 2025 Shuleni School Management Platform
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LoginPage;