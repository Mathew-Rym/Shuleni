import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Alert, Image, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCog, faKey, faBell, faShieldAlt, 
  faEnvelope, faPhone, faSave, faCamera, faMapMarkerAlt, 
  faCalendarAlt, faIdCard, faExclamationTriangle, faEdit,
  faGraduationCap, faUserGraduate, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserAvatar } from '../Store/slices/authSlice';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PhotoUpload from '../components/PhotoUpload';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [activeSession, setActiveSession] = useState({
    deviceInfo: '',
    ipAddress: '',
    macAddress: '',
    location: '',
    lastActivity: new Date(),
    isOnline: true
  });
  
  // Get user role from Redux store
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || 'student';
  
    const getUserData = () => {
    const baseAvatar = user?.avatar || 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=U';
    
    switch (userRole) {
      case 'admin': return {
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@shuleni.com',
        phone: '+254700123456',
        role: 'Administrator',
        avatar: baseAvatar,
        department: 'Administration',
        staffId: 'ADM-001',
        joinDate: '2020-01-15',
        privileges: ['Full Access', 'User Management', 'System Settings'],
        emergencyContact: '+254711234567'
      };
      case 'teacher': return {
        name: user?.name || 'Teacher User',
        email: user?.email || 'teacher@shuleni.com',
        phone: '+254721234567',
        role: 'Teacher',
        avatar: baseAvatar,
        subject: 'Mathematics',
        teacherId: 'TCH-001',
        qualifications: 'M.Ed Mathematics',
        experience: '8 years',
        classes: ['10A', '10B', '11A'],
        department: 'Mathematics Department'
      };
      default: return {
        name: user?.name || 'Student User',
        email: user?.email || 'student@shuleni.com',
        phone: '+254720521291',
        role: 'Student',
        avatar: baseAvatar,
        admissionNumber: 'STU-2025-001',
        idNumber: '12345678',
        gender: 'Male',
        birthdate: '2008-05-15',
        county: 'Nairobi',
        country: 'Kenya',
        postalAddress: 'P.O. Box 12345, Nairobi',
        canGraduate: true,
        joinDate: '2023-08-15',
        currentGrade: 'Grade 10',
        subjects: ['Mathematics', 'English', 'Science', 'History'],
        class: '10A'
      };
    }
  };
  
  const getTeacherData = () => ({
    name: 'Jane Smith',
    email: 'jane.smith@shuleni.com',
    phone: '+254721234567',
    role: 'Teacher',
    avatar: 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=JS',
    address: '123 Teacher St, Nairobi, Kenya',
    birthdate: '1985-05-15',
    bio: 'Passionate mathematics teacher with over 10 years of experience.',
    idNumber: 'TCH-2025-001',
    joinDate: '2020-08-15',
    subjects: ['Mathematics', 'Physics'],
    qualifications: 'Masters in Mathematics Education',
    department: 'Science & Mathematics',
    emergencyContact: 'Jane Doe (+1-234-567-8902)'
  });
  
  const [userData, setUserData] = useState(getUserData());
  const [formData, setFormData] = useState({...userData});
  
  // Permission checks
  const canEdit = userRole === 'admin' || userRole === 'teacher';
  const canEditOthers = userRole === 'admin';
  const canChangePhoto = userRole === 'admin' || userRole === 'teacher';

  // Device and session detection
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      let deviceType = 'Unknown';
      
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        deviceType = 'Tablet';
      } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
        deviceType = 'Mobile';
      } else {
        deviceType = 'Desktop';
      }
      
      return {
        type: deviceType,
        browser: getBrowserInfo(),
        os: getOSInfo(),
        userAgent: userAgent
      };
    };

    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
      if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
      if (userAgent.indexOf('Safari') > -1) return 'Safari';
      if (userAgent.indexOf('Edge') > -1) return 'Edge';
      return 'Unknown';
    };

    const getOSInfo = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf('Windows') > -1) return 'Windows';
      if (userAgent.indexOf('Mac') > -1) return 'macOS';
      if (userAgent.indexOf('Linux') > -1) return 'Linux';
      if (userAgent.indexOf('Android') > -1) return 'Android';
      if (userAgent.indexOf('iOS') > -1) return 'iOS';
      return 'Unknown';
    };

    const getNetworkInfo = async () => {
      try {
        // Get IP address from external service
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Get location info
        const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const locationData = await locationResponse.json();
        
        return {
          ip: ipData.ip,
          location: `${locationData.city}, ${locationData.country_name}`,
          timezone: locationData.timezone
        };
      } catch (error) {
        console.log('Network info not available');
        return {
          ip: 'Not available',
          location: 'Unknown',
          timezone: 'Unknown'
        };
      }
    };

    const initializeSession = async () => {
      const device = detectDevice();
      const network = await getNetworkInfo();
      
      setActiveSession({
        deviceInfo: `${device.type} - ${device.browser} on ${device.os}`,
        ipAddress: network.ip,
        macAddress: 'Not accessible in browser', // MAC address not accessible in browser for security
        location: network.location,
        lastActivity: new Date(),
        isOnline: true,
        timezone: network.timezone
      });
    };

    initializeSession();

    // Update last activity periodically
    const activityInterval = setInterval(() => {
      setActiveSession(prev => ({
        ...prev,
        lastActivity: new Date(),
        isOnline: true
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(activityInterval);
  }, []);

  // Initialize user photo from auth state
  useEffect(() => {
    if (user?.avatar) {
      setUserPhoto(user.avatar);
      setFormData(prev => ({
        ...prev,
        avatar: user.avatar
      }));
    }
  }, [user?.avatar]);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUserPhoto(newPhotoUrl);
    setFormData({
      ...formData,
      avatar: newPhotoUrl
    });
    // Update the user avatar in the auth state for navbar display
    dispatch(updateUserAvatar(newPhotoUrl));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to backend
    setUserData({...formData});
    setShowConfirmationModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmationModal(false);
    setShowSuccessAlert(true);
    
    // Ensure avatar is updated in the auth state
    if (formData.avatar) {
      dispatch(updateUserAvatar(formData.avatar));
    }
    
    setTimeout(() => {
      setShowSuccessAlert(false);
      // Navigate back to respective dashboard based on user role
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }, 2000);
  };

  const handlePhotoUpload = (event) => {
    if (!canChangePhoto) {
      alert('You do not have permission to change photos. Please contact your administrator.');
      return;
    }
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          avatar: e.target.result
        });
        setUserData({
          ...userData,
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRequestChange = () => {
    if (userRole === 'student') {
      setShowRequestModal(true);
    }
  };

  const submitChangeRequest = () => {
    // In a real app, this would send a request to admin
    alert(`Change request submitted: "${requestMessage}". An administrator will review your request.`);
    setShowRequestModal(false);
    setRequestMessage('');
  };

  const handleNotificationSettings = (e) => {
    e.preventDefault();
    // Notification settings logic would go here
    alert('Notification settings would be saved here.');
  };

  const renderStudentProfile = () => (
    <div className="p-3">
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">Student Information</h5>
                {!canEdit && (
                  <Button variant="outline-warning" size="sm" onClick={handleRequestChange}>
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Request Changes
                  </Button>
                )}
              </div>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th scope="row" style={{ width: '30%' }}>Admission No</th>
                    <td>{userData.admissionNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">Full Names</th>
                    <td>{userData.name}</td>
                  </tr>
                  <tr>
                    <th scope="row">ID/Passport Number</th>
                    <td>{userData.idNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">Gender</th>
                    <td>{userData.gender}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date of Birth</th>
                    <td>{new Date(userData.birthdate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th scope="row">County</th>
                    <td>{userData.county}</td>
                  </tr>
                  <tr>
                    <th scope="row">Country</th>
                    <td>{userData.country}</td>
                  </tr>
                  <tr>
                    <th scope="row">Phone Number</th>
                    <td>{userData.phone}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{userData.email}</td>
                  </tr>
                  <tr>
                    <th scope="row">Postal Address</th>
                    <td>{userData.postalAddress}</td>
                  </tr>
                  <tr>
                    <th scope="row">Can Graduate</th>
                    <td>
                      <span className={`badge ${userData.canGraduate ? 'bg-success' : 'bg-warning'}`}>
                        {userData.canGraduate ? 'Yes' : 'Pending Requirements'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="card-title mb-3">Academic Information</h5>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th scope="row" style={{ width: '30%' }}>Joined</th>
                    <td>{new Date(userData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <th scope="row">Current Grade</th>
                    <td>{userData.currentGrade}</td>
                  </tr>
                  <tr>
                    <th scope="row">Class</th>
                    <td>{userData.class}</td>
                  </tr>
                  <tr>
                    <th scope="row">Subjects</th>
                    <td>{userData.subjects.join(', ')}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
        return (
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <PhotoUpload
                currentPhoto={userPhoto || user?.avatar || userData.avatar}
                onPhotoUpdate={handlePhotoUpdate}
                userRole={userRole}
                size={150}
                name={userData.name}
                showEditButton={canChangePhoto}
              />
              <h4 className="mt-3 mb-1">{userData.name}</h4>
              <p className="text-muted">{userData.role}</p>
            </div>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Control 
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control 
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control 
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control 
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio/About Me</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
              </Button>
            </div>
          </Form>
        );

  const renderProfileContent = () => {
    switch(activeTab) {
      case 'profile':
        if (userRole === 'student') {
          return renderStudentProfile();
        } else {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-4 position-relative">
                <img 
                  src={userData.avatar}
                  alt={userData.name}
                  className="rounded-circle"
                  width="150"
                  height="150"
                  style={{ border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                />
                {canChangePhoto && (
                  <div 
                    className="position-absolute"
                    style={{ 
                      bottom: '10px', 
                      right: '50%', 
                      transform: 'translateX(60px)',
                      background: 'var(--primary-color)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                    onClick={() => document.getElementById('photo-upload').click()}
                  >
                    <FontAwesomeIcon icon={faCamera} className="text-white" />
                  </div>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control 
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Control 
                      type="text"
                      name="role"
                      value={formData.role}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {canEdit && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant="primary" type="submit">
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                  </Button>
                </div>
              )}
              
              {!canEdit && userRole === 'student' && (
                <Alert variant="info" className="mt-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  To make changes to your profile, please contact your administrator or use the "Request Changes" button.
                </Alert>
              )}
            </Form>
          );
        }
      
      case 'security':
        if (userRole === 'student') {
          return (
            <Alert variant="warning">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Students cannot change passwords directly. Please contact your administrator for password reset requests.
            </Alert>
          );
        }
        return (
          <div>
            <h5 className="mb-4">Change Password</h5>
            <Form onSubmit={(e) => {
              e.preventDefault();
              alert('Password change functionality would be implemented here.');
            }}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" required />
                <Form.Text className="text-muted">
                  Password must be at least 8 characters with letters, numbers and special characters.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faKey} className="me-2" /> Update Password
                </Button>
              </div>
            </Form>
          </div>
        );
        return (
          <div>
            <h5 className="mb-4">Change Password</h5>
            <Form onSubmit={handlePasswordChange}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" required />
                <Form.Text className="text-muted">
                  Password must be at least 8 characters with letters, numbers and special characters.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faKey} className="me-2" /> Update Password
                </Button>
              </div>
            </Form>
            
            <hr className="my-4" />
            
            <h5 className="mb-4">Two-Factor Authentication</h5>
            <div className="d-flex align-items-center mb-4">
              <div className="me-auto">
                <div className="fw-bold">Protect your account with 2FA</div>
                <div className="text-muted">Add an extra layer of security to your account</div>
              </div>
              <Form.Check 
                type="switch"
                id="2fa-switch"
              />
            </div>
            <Button variant="outline-primary">
              <FontAwesomeIcon icon={faShieldAlt} className="me-2" /> Setup 2FA
            </Button>
            
            <hr className="my-4" />
            
            <h5 className="mb-4">Active Sessions</h5>
            <Card className="border-0 bg-light">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className={`badge ${activeSession.isOnline ? 'bg-success' : 'bg-secondary'} me-3`}>
                      {activeSession.isOnline ? 'Online' : 'Offline'}
                    </div>
                    <div>
                      <div className="fw-bold">Current Session</div>
                      <small className="text-muted">{activeSession.deviceInfo}</small>
                    </div>
                  </div>
                  <Button variant="outline-danger" size="sm">
                    End Session
                  </Button>
                </div>
                
                <Row className="g-3">
                  <Col md={6}>
                    <div className="small">
                      <strong>IP Address:</strong><br />
                      <span className="text-muted">{activeSession.ipAddress}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="small">
                      <strong>Location:</strong><br />
                      <span className="text-muted">{activeSession.location}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="small">
                      <strong>MAC Address:</strong><br />
                      <span className="text-muted">{activeSession.macAddress}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="small">
                      <strong>Last Activity:</strong><br />
                      <span className="text-muted">{activeSession.lastActivity.toLocaleString()}</span>
                    </div>
                  </Col>
                </Row>
                
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small fw-bold">Session Management</div>
                      <div className="small text-muted">Manage all active sessions across devices</div>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      View All Sessions
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        );
        
      case 'notifications':
        return (
          <Form onSubmit={handleNotificationSettings}>
            <h5 className="mb-4">Notification Preferences</h5>
            
            <div className="mb-4">
              <h6 className="mb-3">Email Notifications</h6>
              <Form.Check 
                type="checkbox"
                label="School announcements"
                id="email-announcements"
                className="mb-2"
                defaultChecked
              />
              <Form.Check 
                type="checkbox"
                label="Class updates"
                id="email-classes"
                className="mb-2"
                defaultChecked
              />
              <Form.Check 
                type="checkbox"
                label="Calendar events"
                id="email-calendar"
                className="mb-2"
                defaultChecked
              />
              <Form.Check 
                type="checkbox"
                label="Direct messages"
                id="email-messages"
                className="mb-2"
                defaultChecked
              />
            </div>
            
            <div className="mb-4">
              <h6 className="mb-3">Push Notifications</h6>
              <Form.Check 
                type="checkbox"
                label="School announcements"
                id="push-announcements"
                className="mb-2"
                defaultChecked
              />
              <Form.Check 
                type="checkbox"
                label="Class updates"
                id="push-classes"
                className="mb-2"
                defaultChecked
              />
              <Form.Check 
                type="checkbox"
                label="Calendar events"
                id="push-calendar"
                className="mb-2"
                defaultChecked
              />
              <Form.Check 
                type="checkbox"
                label="Direct messages"
                id="push-messages"
                className="mb-2"
                defaultChecked
              />
            </div>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-2" /> Save Preferences
              </Button>
            </div>
          </Form>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      
      <div className="flex-grow-1">
        <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} showSidebarToggle={true} />
        
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center mb-3">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => navigate(-1)}
                  className="me-3"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back
                </Button>
                <div>
                  <h1 className="mb-1 fw-bold">Profile Settings</h1>
                  <p className="text-muted mb-0">Manage your account information and settings</p>
                </div>
              </div>
            </Col>
          </Row>
          
          {showSuccessAlert && (
            <Alert variant="success" className="mb-4" dismissible onClose={() => setShowSuccessAlert(false)}>
              Your profile has been updated successfully!
            </Alert>
          )}
          
          <Row>
            <Col md={3} lg={3} xl={2} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body className="p-0">
                  <Nav className="flex-column">
                    <Nav.Link 
                      className={`p-3 border-start border-4 ${activeTab === 'profile' ? 'border-primary fw-bold' : 'border-white'}`}
                      active={activeTab === 'profile'}
                      onClick={() => setActiveTab('profile')}
                    >
                      <FontAwesomeIcon icon={faUser} className="me-2" /> Profile
                    </Nav.Link>
                    <Nav.Link 
                      className={`p-3 border-start border-4 ${activeTab === 'security' ? 'border-primary fw-bold' : 'border-white'}`}
                      active={activeTab === 'security'}
                      onClick={() => setActiveTab('security')}
                    >
                      <FontAwesomeIcon icon={faKey} className="me-2" /> Security
                    </Nav.Link>
                    <Nav.Link 
                      className={`p-3 border-start border-4 ${activeTab === 'notifications' ? 'border-primary fw-bold' : 'border-white'}`}
                      active={activeTab === 'notifications'}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <FontAwesomeIcon icon={faBell} className="me-2" /> Notifications
                    </Nav.Link>
                  </Nav>
                </Card.Body>
              </Card>
              
              {activeTab === 'profile' && (
                <Card className="shadow-sm mt-4">
                  <Card.Body>
                    <h6 className="mb-3 fw-bold">Professional Info</h6>
                    <div className="mb-3">
                      <div className="small text-muted">Department</div>
                      <div>{userData.department}</div>
                    </div>
                    <div className="mb-3">
                      <div className="small text-muted">Subjects</div>
                      <div>{userData.subjects.join(', ')}</div>
                    </div>
                    <div className="mb-3">
                      <div className="small text-muted">Qualifications</div>
                      <div>{userData.qualifications}</div>
                    </div>
                    <div>
                      <div className="small text-muted">Joined</div>
                      <div>{new Date(userData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
            
            <Col md={9} lg={9} xl={10}>
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  {renderProfileContent()}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Change Request Modal for Students */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Profile Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please describe the changes you would like to make to your profile:</p>
          <Form.Control
            as="textarea"
            rows={4}
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Describe the changes you need..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitChangeRequest}>
            Submit Request
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Save Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faSave} className="me-2 text-success" />
            Confirm Save Changes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FontAwesomeIcon icon={faSave} size="3x" className="text-success mb-3" />
            <h5>Save Profile Changes?</h5>
            <p className="text-muted">
              Are you sure you want to save all the changes made to your profile? 
              After saving, you will be redirected back to your dashboard.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmSave}>
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Yes, Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePage;
