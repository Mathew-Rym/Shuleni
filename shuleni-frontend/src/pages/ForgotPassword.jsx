import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { sendVerificationCode, verifyResetCode, resetPassword, clearResetState } from '../Store/slices/authSlice';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resetLoading, resetError, resetSuccess, verificationSent, codeVerified } = useSelector((state) => state.auth);
  
  const [step, setStep] = useState(1); // 1: Email input, 2: Code verification, 3: New password
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Clear reset state when component mounts
    dispatch(clearResetState());
  }, [dispatch]);

  useEffect(() => {
    // Handle step progression based on Redux state
    if (verificationSent && step === 1) {
      setStep(2);
      setSuccess(`Verification code sent to ${formData.email}`);
    }
    if (codeVerified && step === 2) {
      setStep(3);
      setSuccess('Code verified successfully!');
    }
    if (resetSuccess && step === 3) {
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [verificationSent, codeVerified, resetSuccess, step, formData.email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear success message when user starts typing
    if (success) setSuccess('');
  };

  // Step 1: Send verification email
  const handleSendCode = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(sendVerificationCode(formData.email)).unwrap();
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(verifyResetCode(formData.email, formData.verificationCode)).unwrap();
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch({ type: 'auth/resetPasswordFailure', payload: 'Passwords do not match' });
      return;
    }
    
    try {
      await dispatch(resetPassword(formData.email, formData.verificationCode, formData.newPassword)).unwrap();
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  const resendCode = async () => {
    try {
      await dispatch(sendVerificationCode(formData.email)).unwrap();
      setSuccess(`New verification code sent to ${formData.email}`);
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shuleni-card shadow-lg border-0">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <img 
                    src="/favicon.svg" 
                    alt="Shuleni Logo" 
                    width="60" 
                    height="60" 
                    className="mb-3"
                  />
                  <h3 className="fw-bold text-dark">
                    {step === 1 && 'Reset Your Password'}
                    {step === 2 && 'Verify Your Email'}
                    {step === 3 && 'Set New Password'}
                  </h3>
                  <p className="text-muted">
                    {step === 1 && 'Enter your email to receive a verification code'}
                    {step === 2 && 'Enter the 6-digit code sent to your email'}
                    {step === 3 && 'Create a new secure password'}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${step >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                         style={{ width: '40px', height: '40px' }}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className={`flex-grow-1 mx-2 border-top ${step >= 2 ? 'border-primary' : 'border-light'}`} style={{ height: '2px' }}></div>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${step >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                         style={{ width: '40px', height: '40px' }}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className={`flex-grow-1 mx-2 border-top ${step >= 3 ? 'border-primary' : 'border-light'}`} style={{ height: '2px' }}></div>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${step >= 3 ? 'bg-primary text-white' : 'bg-light text-muted'}`} 
                         style={{ width: '40px', height: '40px' }}>
                      <FontAwesomeIcon icon={faKey} />
                    </div>
                  </div>
                </div>

                {/* Error Alert */}
                {resetError && (
                  <Alert variant="danger" dismissible onClose={() => dispatch(clearResetState())}>
                    {resetError}
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </Alert>
                )}

                {/* Step 1: Email Input */}
                {step === 1 && (
                  <Form onSubmit={handleSendCode}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        size="lg"
                        required
                        className="border-2"
                      />
                      <Form.Text className="text-muted">
                        We'll send a verification code to this email address.
                      </Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
                        disabled={resetLoading}
                        className="fw-semibold"
                      >
                        {resetLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Sending Code...
                          </>
                        ) : (
                          'Send Verification Code'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}

                {/* Step 2: Code Verification */}
                {step === 2 && (
                  <Form onSubmit={handleVerifyCode}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Verification Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit code"
                        size="lg"
                        maxLength="6"
                        required
                        className="border-2 text-center"
                        style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                      />
                      <Form.Text className="text-muted">
                        Check your email for the verification code. It may take a few minutes to arrive.
                      </Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
                        disabled={resetLoading}
                        className="fw-semibold"
                      >
                        {resetLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Verifying...
                          </>
                        ) : (
                          'Verify Code'
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline-secondary" 
                        size="lg"
                        onClick={resendCode}
                        disabled={resetLoading}
                      >
                        Resend Code
                      </Button>
                    </div>
                  </Form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <Form onSubmit={handleResetPassword}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        size="lg"
                        required
                        className="border-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        size="lg"
                        required
                        className="border-2"
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 8 characters long.
                      </Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
                        disabled={resetLoading}
                        className="fw-semibold"
                      >
                        {resetLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Resetting Password...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </div>
                  </Form>
                )}

                {/* Back to Login */}
                <div className="text-center mt-4">
                  <Link to="/login" className="text-decoration-none d-inline-flex align-items-center">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
