import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faUsers, 
  faChalkboardTeacher, 
  faBook,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faCalendarCheck,
  faUpload,
  faChartLine,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SettingsModal from '../components/SettingsModal';
import Calendar from '../components/Calendar';
import DetailedReportModal from '../components/DetailedReportModal';
import MonthlyAttendanceComponent from '../components/MonthlyAttendanceComponent';
import { RealTimeProvider, useRealTime } from '../contexts/RealTimeContext';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../Store/slices/usersSlice';
import { fetchClasses } from '../Store/slices/classesSlice';
import { fetchEvents } from '../Store/slices/calendarSlice';

// Events selector
const selectEvents = createSelector(
  [(state) => state.calendar],
  (calendar) => calendar.events || []
);

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.users);
  const { classes } = useSelector((state) => state.classes);
  const allEvents = useSelector(selectEvents);

  // Filter events for teachers (show events targeted to teachers or both)
  const events = allEvents.filter(event => 
    !event.targetAudience || event.targetAudience === 'teachers' || event.targetAudience === 'both'
  );

  // States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailedReportModal, setShowDetailedReportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', class: '', dateOfBirth: '', parentName: '', phone: ''
  });

  // Teacher's classes (filtered by teacher)    
  const teacherClasses = classes.filter(cls => cls.teacher === user?.name);
  const teacherStudents = students.filter(student => 
    teacherClasses.some(cls => cls.name === student.class)
  );

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
    dispatch(fetchEvents());
  }, [dispatch]);

  // Student management functions
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(updateStudent({ ...studentForm, id: editingStudent.id }));
    } else {
      dispatch(createStudent(studentForm));
    }
    setShowStudentModal(false);
    setEditingStudent(null);
    setStudentForm({ name: '', email: '', class: '', dateOfBirth: '', parentName: '', phone: '' });
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      class: student.class,
      dateOfBirth: student.dateOfBirth,
      parentName: student.parentName,
      phone: student.phone
    });
    setShowStudentModal(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      dispatch(deleteStudent(studentId));
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onOpenSettings={() => setShowSettingsModal(true)}
      />
      
      <div className="main-content">
        <Container fluid className="py-4">
          {/* Welcome Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 fw-bold">Welcome, {user?.name}!</h1>
                  <p className="text-muted">Manage your classes and students effectively.</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Enhanced Teacher Stats */}
          <Row className="g-4 mb-4">
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faChalkboardTeacher} 
                      className="text-primary" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-primary mb-2">{teacherClasses.length}</h3>
                  <p className="text-muted mb-1">My Classes</p>
                  <small className="text-success">Active teaching load</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faUsers} 
                      className="text-success" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-success mb-2">{teacherStudents.length}</h3>
                  <p className="text-muted mb-1">My Students</p>
                  <small className="text-success">Under your guidance</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faGraduationCap} 
                      className="text-warning" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-warning mb-2">95%</h3>
                  <p className="text-muted mb-1">Attendance Rate</p>
                  <small className="text-warning">Excellent performance</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faBook} 
                      className="text-info" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-info mb-2">12</h3>
                  <p className="text-muted mb-1">Assignments</p>
                  <small className="text-info">Ready for review</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Real-time Dashboard Components */}
          <Row className="g-4 mb-4">
            {/* Monthly Attendance Component */}
            <Col lg={8}>
              <MonthlyAttendanceComponent userRole="teacher" />
            </Col>
            
            {/* Quick Actions & Report */}
            <Col lg={4}>
              <Card className="h-100 shuleni-card">
                <Card.Body>
                  <h6 className="fw-bold mb-3">
                    <FontAwesomeIcon icon={faClipboardList} className="me-2 text-primary" />
                    Quick Actions
                  </h6>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className="shuleni-btn-primary"
                      onClick={() => window.open('/resources', '_blank')}
                    >
                      <FontAwesomeIcon icon={faUpload} className="me-2" />
                      Upload Resources
                    </Button>
                    
                    <Button 
                      variant="outline-primary"
                      onClick={() => setShowDetailedReportModal(true)}
                    >
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      View Detailed Report
                    </Button>
                    
                    <Button variant="outline-secondary">
                      <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                      Take Attendance
                    </Button>
                  </div>

                  <hr className="my-3" />
                  
                  <h6 className="fw-bold mb-3">Today's Schedule</h6>
                  <div className="small">
                    {teacherClasses.slice(0, 3).map((classItem, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                        <div>
                          <div className="fw-semibold">{classItem.name}</div>
                          <small className="text-muted">Subject: {classItem.subject || 'N/A'}</small>
                        </div>
                        <Badge bg="primary">Active</Badge>
                      </div>
                    ))}
                    {teacherClasses.length === 0 && (
                      <p className="text-muted text-center">No classes today</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* My Classes Section */}
          <Row className="mb-4">
            <Col>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold">Manage Your Classes</h5>
                    <Button variant="primary">View All Classes</Button>
                  </div>
                  <p className="text-muted mb-4">Expand on a class's profile to manage its resources and examinations</p>
                  
                  <Row className="g-3">
                    {teacherClasses.length > 0 ? teacherClasses.map((classItem) => (
                      <Col lg={3} md={4} sm={6} key={classItem.id}>
                        <div className="class-card position-relative">
                          <img 
                            src={classItem.image}
                            alt={classItem.name}
                            className="w-100"
                            style={{ height: '120px', objectFit: 'cover' }}
                          />
                          <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
                               style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                            <h6 className="fw-bold mb-1">{classItem.name}</h6>
                            <small>{classItem.students} students</small>
                          </div>
                        </div>
                      </Col>
                    )) : (
                      <Col>
                        <p className="text-muted text-center">No classes assigned yet.</p>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Students Management */}
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold">Manage Your Students</h5>
                    <Button 
                      className="shuleni-btn-primary"
                      onClick={() => setShowStudentModal(true)}
                    >
                      Add Student
                    </Button>
                  </div>
                  <p className="text-muted mb-4">Expand on a student's profile to see their attendance and grades</p>
                  
                  {/* Students Grid */}
                  {teacherStudents.length > 0 ? (
                    <Row className="g-3">
                      {teacherStudents.slice(0, 9).map((student) => (
                        <Col lg={4} md={6} key={student.id}>
                          <Card className="border h-100">
                            <Card.Body className="text-center">
                              <img 
                                src={student.avatar}
                                alt={student.name}
                                className="student-avatar mb-3"
                              />
                              <h6 className="fw-bold">{student.name}</h6>
                              <Badge bg="primary" className="mb-2">{student.class}</Badge>
                              <div className="d-flex justify-content-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger"
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p className="text-muted text-center">No students found in your classes.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Quick Actions */}
              <Card className="shuleni-card mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary">Take Attendance</Button>
                    <Button variant="outline-primary">Upload Resource</Button>
                    <Button variant="outline-primary">Create Assignment</Button>
                    <Button variant="outline-primary">Grade Submissions</Button>
                    <Button variant="outline-primary">Send Announcement</Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Recent Activity */}
              <Card className="shuleni-card">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Recent Activity</h5>
                  <div className="small">
                    <div className="mb-2 pb-2 border-bottom">
                      <div className="fw-bold">Attendance Taken</div>
                      <div className="text-muted">Math Class - Today 9:00 AM</div>
                    </div>
                    <div className="mb-2 pb-2 border-bottom">
                      <div className="fw-bold">Assignment Graded</div>
                      <div className="text-muted">25 submissions - Yesterday</div>
                    </div>
                    <div className="mb-2">
                      <div className="fw-bold">Resource Uploaded</div>
                      <div className="text-muted">Algebra Notes - 2 days ago</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* School Calendar */}
          <Row>
            <Col>
              <Card className="shuleni-card">
                <Card.Header>
                  <h5 className="fw-bold mb-0">
                    <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                    School Calendar
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Calendar 
                    events={events}
                    isAdmin={false}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Student Modal */}
      <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingStudent ? 'Edit Student' : 'Add New Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleStudentSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    value={studentForm.class}
                    onChange={(e) => setStudentForm({...studentForm, class: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    {teacherClasses.map((cls) => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Parent/Guardian Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm({...studentForm, parentName: e.target.value})}
                    placeholder="Enter parent's name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowStudentModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="shuleni-btn-primary">
                {editingStudent ? 'Update Student' : 'Add Student'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Settings Modal */}
      <SettingsModal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
      />

      {/* Detailed Report Modal */}
      <DetailedReportModal 
        show={showDetailedReportModal}
        onHide={() => setShowDetailedReportModal(false)}
        userRole="teacher"
      />
    </div>
  );
};

// Wrap the component with RealTimeProvider
const TeacherDashboardWithRealTime = () => {
  return (
    <RealTimeProvider userRole="teacher">
      <TeacherDashboard />
    </RealTimeProvider>
  );
};

export default TeacherDashboardWithRealTime;