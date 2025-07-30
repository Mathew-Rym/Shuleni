import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCalendarCheck, 
  faBook, 
  faAward,
  faChartLine,
  faClock,
  faBookmark,
  faDownload,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import SettingsModal from '../../components/SettingsModal';
import Calendar from '../../components/Calendar';
import DetailedReportModal from '../../components/DetailedReportModal';
import MonthlyAttendanceComponent from '../../components/MonthlyAttendanceComponent';
import { RealTimeProvider, useRealTime } from '../../contexts/RealTimeContext';
import { fetchClasses, fetchResources } from '../../Store/slices/classesSlice';
import { fetchDashboardData } from '../../Store/slices/dashboardSlice';
import { fetchEvents } from '../../Store/slices/calendarSlice';
import { fetchStudents } from '../../Store/slices/usersSlice';

// Events selector
const selectEvents = createSelector(
  [(state) => state.calendar],
  (calendar) => calendar.events || []
);

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { classes, resources } = useSelector((state) => state.classes);
  const { attendanceData } = useSelector((state) => state.dashboard);
  const { students } = useSelector((state) => state.users);
  const allEvents = useSelector(selectEvents);

  // Get current student data from users slice
  const currentStudent = students.find(s => s.email === user?.email) || students[0];

  // Filter events for students (show events targeted to students or both)
  const events = allEvents.filter(event => 
    !event.targetAudience || event.targetAudience === 'students' || event.targetAudience === 'both'
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDetailedReportModal, setShowDetailedReportModal] = useState(false);

  // Mock student data - in real app, this would come from user profile
  const studentData = {
    // Basic info
    admissionNo: 'ADM001',
    name: currentStudent?.name || user?.name || 'John Doe',
    idPassport: '12345678',
    gender: 'Male',
    dateOfBirth: '2005-03-15',
    county: 'Nairobi',
    country: 'Kenya',
    phoneNumber: '+254712345678',
    email: user?.email || 'john.doe@student.com',
    postalAddress: 'P.O. Box 12345-00100, Nairobi',
    canGraduate: true,
    bloodGroup: 'O+',
    
    // Academic info
    currentClasses: ['Math', 'Science', 'History', 'English'],
    grade: 'A-',
    attendance: 92,
    assignments: {
      completed: 8,
      pending: 3,
      total: 11
    },
    upcomingExams: [
      { subject: 'Mathematics', date: '2024-02-15', time: '10:00 AM' },
      { subject: 'Science', date: '2024-02-18', time: '2:00 PM' }
    ]
  };

  // Filter classes for current student
  const studentClasses = classes.filter(cls => 
    studentData.currentClasses.includes(cls.name)
  );

  // Filter resources for student's classes
  const studentResources = resources.filter(resource => 
    studentData.currentClasses.includes(resource.subject)
  );

  // Navigation handlers
  const handleNavigateToResources = () => {
    navigate('/resources');
  };

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchResources());
    dispatch(fetchDashboardData());
    dispatch(fetchEvents());
    dispatch(fetchStudents());
  }, [dispatch]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        showSidebarToggle={true}
        onOpenSettings={() => setShowSettingsModal(true)}
      />
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
              <div className="d-flex align-items-center">
                <img
                  src={currentStudent?.avatar || user?.avatar || 'https://via.placeholder.com/80/4A90E2/FFFFFF?text=JD'}
                  alt="Student"
                  className="rounded-circle me-4"
                  width="80"
                  height="80"
                />
                <div>
                  <h1 className="h3 fw-bold mb-1">{currentStudent?.name || user?.name || 'John Doe'}</h1>
                  <p className="text-muted mb-0">Welcome back to your learning dashboard</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Enhanced Student Performance Cards */}
          <Row className="g-4 mb-4">
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faAward} 
                      className="text-primary" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-primary mb-2">{studentData.grade}</h3>
                  <p className="text-muted mb-1">Current Grade</p>
                  <small className="text-success">
                    <FontAwesomeIcon icon={faChartLine} className="me-1" />
                    Improved
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faCalendarCheck} 
                      className="text-success" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-success mb-2">{studentData.attendance}%</h3>
                  <p className="text-muted mb-1">Attendance</p>
                  <small className="text-success">Excellent record</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faBook} 
                      className="text-warning" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-warning mb-2">{studentData.assignments.completed}/{studentData.assignments.total}</h3>
                  <p className="text-muted mb-1">Assignments</p>
                  <small className="text-warning">{studentData.assignments.pending} pending</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <FontAwesomeIcon 
                      icon={faGraduationCap} 
                      className="text-info" 
                      style={{ fontSize: '2.5rem' }}
                    />
                  </div>
                  <h3 className="fw-bold text-info mb-2">{studentClasses.length}</h3>
                  <p className="text-muted mb-1">Active Classes</p>
                  <small className="text-info">This semester</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Real-time Dashboard Components */}
          <Row className="g-4 mb-4">
            {/* Monthly Attendance Component */}
            <Col lg={8}>
              <MonthlyAttendanceComponent userRole="student" />
            </Col>
            
            {/* Quick Actions & Resources */}
            <Col lg={4}>
              <Card className="h-100 shuleni-card">
                <Card.Body>
                  <h6 className="fw-bold mb-3">
                    <FontAwesomeIcon icon={faDownload} className="me-2 text-primary" />
                    Quick Access
                  </h6>
                  
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      className="shuleni-btn-primary"
                      onClick={handleNavigateToResources}
                    >
                      <FontAwesomeIcon icon={faBook} className="me-2" />
                      View Resources
                    </Button>
                    
                    <Button 
                      variant="outline-primary"
                      onClick={() => setShowDetailedReportModal(true)}
                    >
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      My Progress Report
                    </Button>
                    
                    <Button variant="outline-secondary">
                      <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                      View Schedule
                    </Button>
                  </div>

                  <hr className="my-3" />
                  
                  <h6 className="fw-bold mb-3">Recent Downloads</h6>
                  <div className="small">
                    <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                      <div>
                        <div className="fw-semibold">Math Workbook Ch.5</div>
                        <small className="text-muted">Mathematics • PDF</small>
                      </div>
                      <Badge bg="success">Downloaded</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                      <div>
                        <div className="fw-semibold">Chemistry Lab Manual</div>
                        <small className="text-muted">Chemistry • PDF</small>
                      </div>
                      <Badge bg="success">Downloaded</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                      <div>
                        <div className="fw-semibold">English Essays Guide</div>
                        <small className="text-muted">English • DOCX</small>
                      </div>
                      <Badge bg="primary">New</Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {/* Student Information Card */}
            <Col lg={8}>
              <Card className="shuleni-card h-100">
                <Card.Header className="bg-primary text-white">
                  <h5 className="fw-bold mb-0">
                    <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                    Student Information
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-3">
                    {/* Basic Information */}
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Admission No</label>
                        <div className="fs-6 text-dark">{studentData.admissionNo}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Names</label>
                        <div className="fs-6 text-dark">{studentData.name}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">ID / Passport</label>
                        <div className="fs-6 text-dark">{studentData.idPassport}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Gender</label>
                        <div className="fs-6 text-dark">{studentData.gender}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Date of Birth</label>
                        <div className="fs-6 text-dark">{new Date(studentData.dateOfBirth).toLocaleDateString()}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">County</label>
                        <div className="fs-6 text-dark">{studentData.county}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Country</label>
                        <div className="fs-6 text-dark">{studentData.country}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Phone Number</label>
                        <div className="fs-6 text-dark">{studentData.phoneNumber}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Email</label>
                        <div className="fs-6 text-dark">{studentData.email}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Blood Group</label>
                        <div className="fs-6 text-dark">{studentData.bloodGroup}</div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Postal Address</label>
                        <div className="fs-6 text-dark">{studentData.postalAddress}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <label className="fw-bold text-muted small">Can Graduate</label>
                        <div className="fs-6">
                          <Badge bg={studentData.canGraduate ? 'success' : 'warning'}>
                            {studentData.canGraduate ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Monthly Attendance Chart */}
            <Col lg={4}>
              <Card className="shuleni-card h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Monthly Attendance</h5>
                  <p className="text-muted small mb-3">Attendance (%)</p>
                  
                  <div>
                    {attendanceData.slice(0, 6).map((data, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small>{data.month}</small>
                          <small>{data.attendance}%</small>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${data.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Classes Enrolled In */}
          <Row className="mb-4">
            <Col>
              <Card className="shuleni-card">
                <Card.Body>
                  <h5 className="fw-bold mb-4">Classes Enrolled In</h5>
                  
                  <Row className="g-3">
                    {studentClasses.map((classItem) => (
                      <Col lg={3} md={4} sm={6} key={classItem.id}>
                        <div className="class-card position-relative">
                          <img 
                            src={classItem.image}
                            alt={classItem.name}
                            className="w-100"
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white"
                               style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                            <h6 className="fw-bold mb-1">{classItem.name}</h6>
                            <small>{classItem.teacher}</small>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Available Resources */}
            <Col lg={8}>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold">Available Resources</h5>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" onClick={handleNavigateToResources}>
                        View All Resources
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted mb-4">A collection of notes, books, and learning materials.</p>
                  
                  <Row className="g-3">
                    {studentResources.slice(0, 3).map((resource) => (
                      <Col md={4} key={resource.id}>
                        <Card className="border h-100">
                          <Card.Body>
                            <div className="d-flex align-items-start">
                              <div className="me-3">
                                <div 
                                  className="rounded d-flex align-items-center justify-content-center"
                                  style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    backgroundColor: '#4A90E2',
                                    color: 'white',
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  <FontAwesomeIcon icon={faBook} />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold mb-2">{resource.title}</h6>
                                <p className="text-muted small mb-2">{resource.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <Badge bg="secondary">{resource.type}</Badge>
                                  <small className="text-muted">{resource.subject}</small>
                                </div>
                                <div className="mt-2 d-flex justify-content-between align-items-center">
                                  <small className="text-muted">By {resource.author}</small>
                                  <Button size="sm" variant="outline-primary">
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar Info */}
            <Col lg={4}>
              {/* Upcoming Exams */}
              <Card className="shuleni-card mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Upcoming Exams</h5>
                  {studentData.upcomingExams.map((exam, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <div className="fw-bold">{exam.subject}</div>
                      <div className="text-muted small">
                        📅 {exam.date} at {exam.time}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline-primary" size="sm" className="w-100">
                    View All Exams
                  </Button>
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card className="shuleni-card mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="sm">View Grades</Button>
                    <Button variant="outline-primary" size="sm">Submit Assignment</Button>
                    <Button variant="outline-primary" size="sm">Join Class Chat</Button>
                    <Button variant="outline-primary" size="sm">Download Resources</Button>
                    <Button variant="outline-primary" size="sm">Check Schedule</Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Assignment Progress */}
              <Card className="shuleni-card">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Assignment Progress</h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Completed</span>
                      <span>{studentData.assignments.completed}/{studentData.assignments.total}</span>
                    </div>
                    <ProgressBar 
                      now={(studentData.assignments.completed / studentData.assignments.total) * 100} 
                      variant="success"
                    />
                  </div>
                  <div className="text-center">
                    <Button variant="outline-primary" size="sm">
                      View All Assignments
                    </Button>
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

      {/* Settings Modal */}
      <SettingsModal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
      />

      {/* Detailed Report Modal */}
      <DetailedReportModal 
        show={showDetailedReportModal}
        onHide={() => setShowDetailedReportModal(false)}
        userRole="student"
      />
    </div>
  );
};

// Wrap the component with RealTimeProvider
const StudentDashboardWithRealTime = () => {
  return (
    <RealTimeProvider userRole="student">
      <StudentDashboard />
    </RealTimeProvider>
  );
};

export default StudentDashboardWithRealTime;