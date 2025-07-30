import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Tab, 
  Tabs, 
  Form, 
  Button, 
  Card, 
  Row, 
  Col, 
  Alert,
  Badge,
  ListGroup,
  Accordion
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faBell, 
  faPalette, 
  faSignOutAlt,
  faCamera,
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
  faSave,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Store/slices/authSlice';
import { updateTeacherPhoto, updateStudentPhoto } from '../Store/slices/usersSlice';
import PhotoUpload from './PhotoUpload';

const SettingsModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      assignments: true,
      grades: true,
      attendance: true,
      announcements: true
    },
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [profilePhoto, setProfilePhoto] = useState(user?.avatar || null);

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (show && user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
      setProfilePhoto(user.avatar || null);
    }
  }, [show, user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Only admin can update names for students/teachers
    const canEditName = user?.role === 'admin' || user?.role === 'admin';
    
    if (!canEditName && profileForm.name !== user?.name) {
      alert('Only administrators can change names for students and teachers.');
      return;
    }
    
    // Dispatch update action
    console.log('Updating profile:', profileForm);
    // TODO: Implement profile update logic
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    console.log('Updating password');
    // TODO: Implement password update logic
    
    // Clear form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Updating settings:', settings);
    // TODO: Implement settings update logic
  };

  const handleLogout = () => {
    dispatch(logout());
    onHide();
  };

  const handlePhotoUpdate = (photoUrl) => {
    setProfilePhoto(photoUrl);
    
    // Update photo in Redux store based on user role
    if (user?.role === 'teacher') {
      dispatch(updateTeacherPhoto({ teacherId: user.id, photoUrl }));
    } else if (user?.role === 'student') {
      dispatch(updateStudentPhoto({ studentId: user.id, photoUrl }));
    }
    
    // TODO: Also update auth user photo
    console.log('Photo updated:', photoUrl);
  };

  const canEditProfile = () => {
    // Students and teachers can't edit their names or delete accounts
    return user?.role === 'admin';
  };

  const canUploadPhoto = () => {
    // All users can upload photos, but for students/teachers it's through admin
    return true;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
          Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="nav-fill"
          variant="underline"
        >
          {/* Profile Tab */}
          <Tab 
            eventKey="profile" 
            title={
              <span>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Profile
              </span>
            }
          >
            <div className="p-4">
              <Form onSubmit={handleProfileSubmit}>
                {/* Profile Photo Section */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={profilePhoto || 'https://via.placeholder.com/120/4A90E2/FFFFFF?text=' + (user?.name?.charAt(0) || 'U')}
                      alt="Profile"
                      className="rounded-circle"
                      width="120"
                      height="120"
                      style={{ objectFit: 'cover', border: '4px solid #e9ecef' }}
                    />
                    {canUploadPhoto() && (
                      <div className="mt-3">
                        <PhotoUpload
                          onPhotoUpdate={handlePhotoUpdate}
                          currentPhoto={profilePhoto}
                          variant="outline-primary"
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                  {!canEditProfile() && (
                    <Alert variant="info" className="mt-3 mb-4">
                      <small>
                        <FontAwesomeIcon icon={faBell} className="me-2" />
                        Profile changes for {user?.role}s can only be made by administrators.
                      </small>
                    </Alert>
                  )}
                </div>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        disabled={!canEditProfile()}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        disabled={!canEditProfile()}
                        required
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
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        disabled={!canEditProfile()}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        disabled={!canEditProfile()}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    disabled={!canEditProfile()}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>

                {canEditProfile() && (
                  <Button type="submit" variant="primary">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Changes
                  </Button>
                )}
              </Form>
            </div>
          </Tab>

          {/* Security Tab */}
          <Tab 
            eventKey="security" 
            title={
              <span>
                <FontAwesomeIcon icon={faLock} className="me-2" />
                Security
              </span>
            }
          >
            <div className="p-4">
              <Form onSubmit={handlePasswordSubmit}>
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">Change Password</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        >
                          <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                        </Button>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          minLength={8}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        >
                          <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                        </Button>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          minLength={8}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        >
                          <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                        </Button>
                      </div>
                    </Form.Group>

                    <Button type="submit" variant="warning">
                      <FontAwesomeIcon icon={faLock} className="me-2" />
                      Update Password
                    </Button>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h6 className="mb-0">Account Security</h6>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Two-Factor Authentication</strong>
                          <div className="small text-muted">Add an extra layer of security</div>
                        </div>
                        <Badge bg="secondary">Coming Soon</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Login Sessions</strong>
                          <div className="small text-muted">Manage your active sessions</div>
                        </div>
                        <Button variant="outline-primary" size="sm">View</Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Form>
            </div>
          </Tab>

          {/* Notifications Tab */}
          <Tab 
            eventKey="notifications" 
            title={
              <span>
                <FontAwesomeIcon icon={faBell} className="me-2" />
                Notifications
              </span>
            }
          >
            <div className="p-4">
              <Form onSubmit={handleSettingsSubmit}>
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">Notification Preferences</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>Delivery Methods</h6>
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          checked={settings.notifications.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, email: e.target.checked}
                          })}
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="push-notifications"
                          label="Push Notifications"
                          checked={settings.notifications.push}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, push: e.target.checked}
                          })}
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="sms-notifications"
                          label="SMS Notifications"
                          checked={settings.notifications.sms}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, sms: e.target.checked}
                          })}
                        />
                      </Col>
                      <Col md={6}>
                        <h6>Notification Types</h6>
                        <Form.Check
                          type="switch"
                          id="assignments-notifications"
                          label="Assignments"
                          checked={settings.notifications.assignments}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, assignments: e.target.checked}
                          })}
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="grades-notifications"
                          label="Grades"
                          checked={settings.notifications.grades}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, grades: e.target.checked}
                          })}
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="attendance-notifications"
                          label="Attendance"
                          checked={settings.notifications.attendance}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, attendance: e.target.checked}
                          })}
                          className="mb-2"
                        />
                        <Form.Check
                          type="switch"
                          id="announcements-notifications"
                          label="Announcements"
                          checked={settings.notifications.announcements}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, announcements: e.target.checked}
                          })}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Button type="submit" variant="primary">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Notification Settings
                </Button>
              </Form>
            </div>
          </Tab>

          {/* Preferences Tab */}
          <Tab 
            eventKey="preferences" 
            title={
              <span>
                <FontAwesomeIcon icon={faPalette} className="me-2" />
                Preferences
              </span>
            }
          >
            <div className="p-4">
              <Form onSubmit={handleSettingsSubmit}>
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">Appearance & Behavior</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Theme</Form.Label>
                      <Form.Select
                        value={settings.theme}
                        onChange={(e) => setSettings({...settings, theme: e.target.value})}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Language</Form.Label>
                      <Form.Select
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="sw">Kiswahili</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Timezone</Form.Label>
                      <Form.Select
                        value={settings.timezone}
                        onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      >
                        <option value="UTC">UTC</option>
                        <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Button type="submit" variant="primary">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Preferences
                </Button>
              </Form>
            </div>
          </Tab>

          {/* Logout Tab */}
          <Tab 
            eventKey="logout" 
            title={
              <span className="text-danger">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </span>
            }
          >
            <div className="p-4 text-center">
              <div className="mb-4">
                <FontAwesomeIcon icon={faSignOutAlt} size="3x" className="text-danger mb-3" />
                <h5>Sign Out of Your Account</h5>
                <p className="text-muted">
                  Are you sure you want to sign out? You'll need to sign in again to access your account.
                </p>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Sign Out
                </Button>
                <Button variant="secondary" onClick={onHide}>
                  Cancel
                </Button>
              </div>

              {/* Logout Confirmation Modal */}
              <Modal show={showLogoutConfirm} onHide={() => setShowLogoutConfirm(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to sign out of your account?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Sign Out
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
