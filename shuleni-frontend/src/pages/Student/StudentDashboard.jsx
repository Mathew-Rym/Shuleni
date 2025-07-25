import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import PhotoUpload from '../../components/PhotoUpload';
import Calendar from '../../components/Calendar';
import NotificationSystem, { useNotifications } from '../../components/NotificationSystem';
import { fetchClasses, fetchResources } from '../../Store/slices/classesSlice';
import { fetchDashboardData } from '../../Store/slices/dashboardSlice';
import { fetchEvents } from '../../Store/slices/calendarSlice';
import { updateUserAvatar } from '../../Store/slices/authSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes, resources } = useSelector((state) => state.classes);
  const { attendanceData } = useSelector((state) => state.dashboard);
  const { events } = useSelector((state) => state.calendar);
  const { notifications, addNotification, removeNotification } = useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [studentData, setStudentData] = useState({
    currentClasses: ['Basic Mathematics', 'Earth Science', 'Advanced Mathematics', 'Chemistry & Physics'], // Updated to match new class names
    grades: {
      'Basic Mathematics': { grade: 'A-', percentage: 87 },
      'Earth Science': { grade: 'B+', percentage: 85 },
      'Advanced Mathematics': { grade: 'A', percentage: 92 },
      'Chemistry & Physics': { grade: 'B', percentage: 83 }
    },
    overallGrade: 'A-',
    attendance: 92,
    assignments: {
      completed: 28,
      pending: 5,
      total: 33
    },
    upcomingExams: [
      { subject: 'Advanced Mathematics', date: '2024-02-15', time: '10:00 AM', grade: '10th Grade' },
      { subject: 'Chemistry & Physics', date: '2024-02-18', time: '2:00 PM', grade: '10th Grade' },
      { subject: 'Basic Mathematics', date: '2024-02-20', time: '9:00 AM', grade: '9th Grade' }
    ],
    recentActivities: [
      { type: 'grade', subject: 'Advanced Mathematics', message: 'New grade posted: A', time: '2 hours ago' },
      { type: 'assignment', subject: 'Chemistry & Physics', message: 'Assignment submitted', time: '5 hours ago' },
      { type: 'resource', subject: 'Earth Science', message: 'New resource available', time: '1 day ago' }
    ]
  });

  // Mock student data - in real app, this would come from user profile - REMOVED since now using state

  // Filter classes for current student - now supporting multiple grades
  const studentClasses = classes.filter(cls => 
    studentData.currentClasses.includes(cls.name)
  );

  // Group classes by grade level
  const classesByGrade = studentClasses.reduce((acc, cls) => {
    if (!acc[cls.gradeLevel]) {
      acc[cls.gradeLevel] = [];
    }
    acc[cls.gradeLevel].push(cls);
    return acc;
  }, {});

  // Filter resources for student's classes
  const studentResources = resources.filter(resource => 
    studentData.currentClasses.some(className => 
      resource.subject.toLowerCase().includes(className.toLowerCase()) ||
      className.toLowerCase().includes(resource.subject.toLowerCase())
    )
  );

  // Real-time button handlers
  const handleViewGrades = () => {
    // Mock real-time grade fetch
    addNotification('info', 'Loading Grades', 'Fetching your latest grades...');
    console.log('Fetching latest grades...');
    dispatch(fetchClasses()); // Refetch to get latest data
    setTimeout(() => {
      addNotification('success', 'Grades Updated', 'Your latest grades have been loaded successfully!');
    }, 1000);
  };

  const handleSubmitAssignment = () => {
    // Mock assignment submission
    addNotification('info', 'Submitting', 'Submitting your assignment...');
    console.log('Submitting assignment...');
    
    // Update assignment count in real-time
    setTimeout(() => {
      setStudentData(prev => ({
        ...prev,
        assignments: {
          ...prev.assignments,
          completed: prev.assignments.completed + 1,
          pending: prev.assignments.pending - 1
        }
      }));
      addNotification('success', 'Assignment Submitted', 'Your assignment has been submitted successfully!');
    }, 1500);
  };

  const handleJoinClassChat = () => {
    addNotification('info', 'Joining Chat', 'Connecting to class chat...');
    console.log('Joining class chat...');
    setTimeout(() => {
      addNotification('success', 'Chat Joined', 'You have joined the class chat successfully!');
    }, 1000);
  };

  const handleDownloadResource = (resourceId) => {
    addNotification('info', 'Downloading', 'Downloading resource...');
    console.log(`Downloading resource ${resourceId}...`);
    setTimeout(() => {
      addNotification('success', 'Download Complete', 'Resource downloaded successfully!');
    }, 2000);
  };

  const handleCheckSchedule = () => {
    addNotification('info', 'Loading Schedule', 'Fetching your latest schedule...');
    console.log('Checking latest schedule...');
    setTimeout(() => {
      addNotification('success', 'Schedule Updated', 'Your schedule has been refreshed!');
    }, 1000);
  };

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchResources());
    dispatch(fetchDashboardData());
    dispatch(fetchEvents());
    
    // Initialize student photo from user avatar
    if (user?.avatar) {
      setStudentPhoto(user.avatar);
    }
  }, [dispatch, user?.avatar]);

  const handleStudentPhotoUpdate = (newPhotoUrl) => {
    setStudentPhoto(newPhotoUrl);
    // Update the user avatar in the auth state for navbar display
    dispatch(updateUserAvatar(newPhotoUrl));
    // Note: Students can upload photos but changes need admin approval
    console.log('Student photo updated (pending approval):', newPhotoUrl);
  };

  return (
    <div className="d-flex min-vh-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
        
        <div className="flex-grow-1 bg-light">
          <Container fluid className="py-4">
          {/* Welcome Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center">
                <PhotoUpload
                  currentPhoto={studentPhoto || user?.avatar}
                  onPhotoUpdate={handleStudentPhotoUpdate}
                  userRole="student"
                  size={80}
                  name={user?.name || 'Student'}
                  className="me-4"
                  showEditButton={true}
                />
                <div>
                  <h1 className="h3 fw-bold mb-1">{user?.name || 'John Doe'}</h1>
                  <p className="text-muted mb-0">Welcome back to your learning dashboard</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Student Performance Cards - Enhanced Responsive */}
          <Row className="g-4 mb-4">
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentData.overallGrade}</h3>
                  <p className="text-muted mb-0">Overall Grade</p>
                  <small className="text-success">↑ Improved</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentData.attendance}%</h3>
                  <p className="text-muted mb-0">Attendance</p>
                  <small className="text-success">Excellent</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentData.assignments.completed}/{studentData.assignments.total}</h3>
                  <p className="text-muted mb-0">Assignments</p>
                  <small className="text-warning">{studentData.assignments.pending} pending</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{Object.keys(classesByGrade).length}</h3>
                  <p className="text-muted mb-0">Grade Levels</p>
                  <small className="text-info">{studentClasses.length} total classes</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {/* Student Information Card - Enhanced Responsive */}
            <Col xxl={8} xl={8} lg={12} md={12} sm={12} xs={12}>
              <Card className="shuleni-card h-100">
                <Card.Body className="p-4">
                  <div className="bg-primary rounded p-4 mb-4" style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}>
                    <h5 className="text-white fw-bold mb-4">Student Information</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Admission No:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.admissionNo || 'STU-2025-001'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Full Names:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.name || 'John Doe'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>ID/Passport:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.idNumber || '12345678'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Gender:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.gender || 'Male'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Date of Birth:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.dateOfBirth || '1/15/2005'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>County:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.county || 'Nairobi'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Country:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.country || 'KENYAN'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Phone Number:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.phone || '+254712345678'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Email:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.email || 'student@shuleni.com'}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <strong className="text-white d-block mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>Parent/Guardian:</strong>
                          <span className="text-white" style={{ fontSize: '14px', fontWeight: '500' }}>{user?.parentName || 'Jane Doe'}</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Monthly Attendance Chart - Enhanced Responsive */}
            <Col xxl={4} xl={4} lg={6} md={12} sm={12} xs={12}>
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

            {/* Calendar - Important Dates */}
            <Col xxl={4} xl={4} lg={6} md={12} sm={12} xs={12}>
              <Calendar 
                events={events}
                isAdmin={false}
                className=""
              />
            </Col>
          </Row>

          {/* Classes Enrolled In - Multiple Grades */}
          <Row className="mb-4">
            <Col>
              <Card className="shuleni-card">
                <Card.Body>
                  <h5 className="fw-bold mb-4">Classes Enrolled In</h5>
                  
                  {/* Display classes grouped by grade */}
                  {Object.entries(classesByGrade).map(([gradeLevel, gradeClasses]) => (
                    <div key={gradeLevel} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-primary mb-0">
                          Grade {gradeLevel} Classes
                        </h6>
                        <Badge bg="primary">{gradeClasses.length} classes</Badge>
                      </div>
                      
                      <Row className="g-3">
                        {gradeClasses.map((classItem) => (
                          <Col xxl={3} xl={4} lg={6} md={6} sm={6} xs={12} key={classItem.id}>
                            <div className="class-card position-relative" style={{ cursor: 'pointer' }}>
                              <img 
                                src={classItem.image}
                                alt={classItem.name}
                                className="w-100 rounded"
                                style={{ height: '150px', objectFit: 'cover' }}
                              />
                              <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white rounded-bottom"
                                   style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                <h6 className="fw-bold mb-1">{classItem.name}</h6>
                                <small className="d-block">{classItem.teacher}</small>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                  <small>{classItem.schedule.split(' - ')[1]}</small>
                                  {studentData.grades[classItem.name] && (
                                    <Badge bg="success" className="ms-1">
                                      {studentData.grades[classItem.name].grade}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                  
                  {studentClasses.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted">No classes enrolled yet.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Announcements and Assignments Section */}
          <Row className="g-4 mb-4">
            {/* Recent Announcements */}
            <Col xxl={6} xl={6} lg={12} md={12} sm={12} xs={12}>
              <Card className="shuleni-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      <i className="fas fa-bullhorn me-2 text-primary"></i>
                      Recent Announcements
                    </h5>
                    <Badge bg="primary">{
                      studentClasses.reduce((total, cls) => 
                        total + (cls.announcements?.length || 0), 0
                      )
                    }</Badge>
                  </div>
                  <p className="text-muted mb-3">Important updates from your teachers</p>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {studentClasses.filter(cls => cls.announcements?.length > 0)
                      .flatMap(cls => cls.announcements.map(announcement => ({...announcement, className: cls.name})))
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((announcement) => (
                        <div key={announcement.id} className="mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold mb-0">{announcement.title}</h6>
                            <Badge bg={
                              announcement.priority === 'urgent' ? 'danger' :
                              announcement.priority === 'important' ? 'warning' : 'secondary'
                            }>
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className="mb-2">{announcement.message}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-primary">{announcement.className}</small>
                            <small className="text-muted">
                              {announcement.teacherName} • {new Date(announcement.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    
                    {studentClasses.every(cls => !cls.announcements?.length) && (
                      <div className="text-center py-4">
                        <i className="fas fa-bell-slash fa-2x text-muted mb-2"></i>
                        <p className="text-muted">No announcements yet</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Assignment Status */}
            <Col xxl={6} xl={6} lg={12} md={12} sm={12} xs={12}>
              <Card className="shuleni-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      <i className="fas fa-tasks me-2 text-primary"></i>
                      Assignment Status
                    </h5>
                    <Badge bg="warning">{
                      studentClasses.reduce((total, cls) => 
                        total + (cls.assignments?.length || 0), 0
                      )
                    }</Badge>
                  </div>
                  <p className="text-muted mb-3">Track your assignment progress</p>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {studentClasses.filter(cls => cls.assignments?.length > 0)
                      .flatMap(cls => cls.assignments.map(assignment => ({...assignment, className: cls.name})))
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .map((assignment) => (
                        <div key={assignment.id} className="mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold mb-0">{assignment.title}</h6>
                            <Badge bg={
                              new Date(assignment.dueDate) < new Date() ? 'danger' :
                              new Date(assignment.dueDate) < new Date(Date.now() + 7*24*60*60*1000) ? 'warning' : 'success'
                            }>
                              {new Date(assignment.dueDate) < new Date() ? 'Overdue' : 'Active'}
                            </Badge>
                          </div>
                          <p className="mb-2 small">{assignment.description}</p>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-primary">{assignment.className}</small>
                            <small className="text-muted">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small">Max Points: {assignment.maxPoints}</span>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                // Mock file upload for student submission
                                const fileName = prompt('Enter filename for your submission:', 'my_assignment.pdf');
                                if (fileName) {
                                  addNotification('success', 'Assignment Submitted', 
                                    `Your assignment "${assignment.title}" has been submitted successfully!`);
                                }
                              }}
                            >
                              <i className="fas fa-upload me-1"></i>
                              Submit
                            </Button>
                          </div>
                        </div>
                      ))}
                    
                    {studentClasses.every(cls => !cls.assignments?.length) && (
                      <div className="text-center py-4">
                        <i className="fas fa-clipboard-check fa-2x text-muted mb-2"></i>
                        <p className="text-muted">No assignments available</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Available Resources - Enhanced Responsive */}
            <Col xxl={8} xl={8} lg={12} md={12} sm={12} xs={12}>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                    <h5 className="fw-bold mb-2 mb-md-0">Available Resources</h5>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button variant="outline-primary" size="sm">Manage Permissions</Button>
                      <Button variant="primary" size="sm">Upload Resource</Button>
                    </div>
                  </div>
                  <p className="text-muted mb-4">A collection of notes, books, and learning materials.</p>
                  
                  <Row className="g-3">
                    {studentResources.slice(0, 3).map((resource) => (
                      <Col xxl={4} xl={6} lg={6} md={6} sm={12} xs={12} key={resource.id}>
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
                                  📚
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold mb-2">{resource.title}</h6>
                                <p className="text-muted small mb-2">{resource.description}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <Badge bg="secondary">{resource.type}</Badge>
                                  <small className="text-muted">{resource.subject}</small>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">By {resource.author}</small>
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    onClick={() => handleDownloadResource(resource.id)}
                                  >
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

            {/* Sidebar Info - Enhanced Responsive */}
            <Col xxl={4} xl={4} lg={12} md={12} sm={12} xs={12}>
              {/* Upcoming Exams */}
              <Card className="shuleni-card mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Upcoming Exams</h5>
                  {studentData.upcomingExams.map((exam, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{exam.subject}</div>
                          <div className="text-muted small">
                            📅 {exam.date} at {exam.time}
                          </div>
                          <Badge bg="info" size="sm" className="mt-1">
                            {exam.grade}
                          </Badge>
                        </div>
                        <Button variant="outline-primary" size="sm">
                          Prepare
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline-primary" size="sm" className="w-100">
                    View All Exams
                  </Button>
                </Card.Body>
              </Card>

              {/* Quick Actions with Real-time Updates */}
              <Card className="shuleni-card mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={handleViewGrades}
                    >
                      <i className="fas fa-chart-line me-2"></i>View Grades
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={handleSubmitAssignment}
                      disabled={studentData.assignments.pending === 0}
                    >
                      <i className="fas fa-upload me-2"></i>Submit Assignment
                      {studentData.assignments.pending > 0 && (
                        <Badge bg="warning" className="ms-2">{studentData.assignments.pending}</Badge>
                      )}
                    </Button>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={handleJoinClassChat}
                    >
                      <i className="fas fa-comments me-2"></i>Join Class Chat
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleDownloadResource('latest')}
                    >
                      <i className="fas fa-download me-2"></i>Download Resources
                    </Button>
                    <Button 
                      variant="outline-dark" 
                      size="sm"
                      onClick={handleCheckSchedule}
                    >
                      <i className="fas fa-calendar me-2"></i>Check Schedule
                    </Button>
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
        </Container>
        </div>
      </div>

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </div>
  );
};

export default StudentDashboard;