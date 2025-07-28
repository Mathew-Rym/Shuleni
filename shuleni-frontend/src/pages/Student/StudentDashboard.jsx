import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { fetchClasses, fetchResources } from '../../Store/slices/classesSlice';
import { fetchDashboardData } from '../../Store/slices/dashboardSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes, resources } = useSelector((state) => state.classes);
  const { attendanceData } = useSelector((state) => state.dashboard);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock student data - in real app, this would come from user profile
  const studentData = {
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

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchResources());
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <Container fluid className="py-4">
          {/* Welcome Header */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center">
                <img
                  src={user?.avatar || 'https://via.placeholder.com/80/4A90E2/FFFFFF?text=JD'}
                  alt="Student"
                  className="rounded-circle me-4"
                  width="80"
                  height="80"
                />
                <div>
                  <h1 className="h3 fw-bold mb-1">{user?.name || 'John Doe'}</h1>
                  <p className="text-muted mb-0">Welcome back to your learning dashboard</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Student Performance Cards */}
          <Row className="g-4 mb-4">
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentData.grade}</h3>
                  <p className="text-muted mb-0">Current Grade</p>
                  <small className="text-success">↑ Improved</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentData.attendance}%</h3>
                  <p className="text-muted mb-0">Attendance</p>
                  <small className="text-success">Excellent</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentData.assignments.completed}/{studentData.assignments.total}</h3>
                  <p className="text-muted mb-0">Assignments</p>
                  <small className="text-warning">{studentData.assignments.pending} pending</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{studentClasses.length}</h3>
                  <p className="text-muted mb-0">Active Classes</p>
                  <small className="text-info">This semester</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {/* Student Information Card */}
            <Col lg={8}>
              <Card className="shuleni-card h-100">
                <Card.Body className="p-4">
                  <div className="shuleni-hero rounded p-4 mb-4">
                    <h5 className="text-white fw-bold mb-3">Student Information</h5>
                    <p className="text-white opacity-75 mb-0">
                      {user?.name || 'John Doe'} is an exemplary student with consistent attendance and participation in class activities. 
                      His dedication to learning is evident in his performance across various subjects. He actively engages in 
                      extracurricular activities, contributing positively to the school community.
                    </p>
                  </div>
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
                      <Button variant="outline-primary" size="sm">Manage Permissions</Button>
                      <Button variant="primary" size="sm">Upload Resource</Button>
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
                                  📚
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
        </Container>
      </div>
    </div>
  );
};

export default StudentDashboard;