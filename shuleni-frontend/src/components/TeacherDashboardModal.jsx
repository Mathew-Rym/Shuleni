import React, { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Card, Button, Badge, Table, Form, Alert, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faChalkboardTeacher, faUserGraduate, faCalendarCheck,
  faTasks, faGraduationCap, faEdit, faSave, faEye, faEyeSlash, faBell,
  faBook, faUsers, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import PhotoUpload from './PhotoUpload';
import ClassManagement from './ClassManagement';
import SubjectManagement from './SubjectManagement';
import StudentSearch from './StudentSearch';

const TeacherDashboardModal = ({ show, onHide, teacherId, teacherData }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classes);
  const { students } = useSelector((state) => state.users);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [teacherPhoto, setTeacherPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, classes, students, schedule
  
  // Mock teacher dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 4,
    totalStudents: 89,
    todayClasses: 3,
    pendingAssignments: 12,
    recentActivity: [
      { type: 'attendance', message: 'Marked attendance for Math Class', time: '2 hours ago' },
      { type: 'assignment', message: 'Graded 15 assignments', time: '4 hours ago' },
      { type: 'announcement', message: 'Posted class announcement', time: '1 day ago' }
    ]
  });

  const [teacherClasses, setTeacherClasses] = useState([
    { id: 1, name: 'Mathematics 10A', students: 25, schedule: 'Mon, Wed, Fri 9:00 AM' },
    { id: 2, name: 'Physics 11B', students: 22, schedule: 'Tue, Thu 11:00 AM' },
    { id: 3, name: 'Advanced Math', students: 18, schedule: 'Mon, Wed 2:00 PM' },
    { id: 4, name: 'Basic Physics', students: 24, schedule: 'Tue, Fri 10:00 AM' }
  ]);

  const [teacherStudents, setTeacherStudents] = useState([
    { id: 1, name: 'Alice Johnson', class: 'Mathematics 10A', grade: 'A', attendance: '95%' },
    { id: 2, name: 'Bob Smith', class: 'Physics 11B', grade: 'B+', attendance: '87%' },
    { id: 3, name: 'Carol Williams', class: 'Advanced Math', grade: 'A-', attendance: '92%' },
    { id: 4, name: 'David Brown', class: 'Basic Physics', grade: 'B', attendance: '89%' }
  ]);

  useEffect(() => {
    if (teacherData) {
      setEditedData({ ...teacherData });
    }
  }, [teacherData]);

  const handleSave = () => {
    console.log('Saving teacher data:', editedData);
    setIsEditing(false);
    // Dispatch action to update teacher in store
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    setTeacherPhoto(newPhotoUrl);
    setEditedData(prev => ({
      ...prev,
      photo: newPhotoUrl
    }));
  };

  const renderDashboardView = () => (
    <Row className="g-4">
      {/* Teacher Stats */}
      <Col xl={3} lg={6} md={6} sm={6} xs={12}>
        <Card className="h-100 text-center border-0 shadow-sm">
          <Card.Body>
            <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" className="text-primary mb-2" />
            <h3 className="fw-bold text-primary">{dashboardData.totalClasses}</h3>
            <p className="text-muted mb-0">Total Classes</p>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} lg={6} md={6} sm={6} xs={12}>
        <Card className="h-100 text-center border-0 shadow-sm">
          <Card.Body>
            <FontAwesomeIcon icon={faUserGraduate} size="2x" className="text-success mb-2" />
            <h3 className="fw-bold text-success">{dashboardData.totalStudents}</h3>
            <p className="text-muted mb-0">Total Students</p>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} lg={6} md={6} sm={6} xs={12}>
        <Card className="h-100 text-center border-0 shadow-sm">
          <Card.Body>
            <FontAwesomeIcon icon={faCalendarCheck} size="2x" className="text-warning mb-2" />
            <h3 className="fw-bold text-warning">{dashboardData.todayClasses}</h3>
            <p className="text-muted mb-0">Today's Classes</p>
          </Card.Body>
        </Card>
      </Col>
      <Col xl={3} lg={6} md={6} sm={6} xs={12}>
        <Card className="h-100 text-center border-0 shadow-sm">
          <Card.Body>
            <FontAwesomeIcon icon={faTasks} size="2x" className="text-danger mb-2" />
            <h3 className="fw-bold text-danger">{dashboardData.pendingAssignments}</h3>
            <p className="text-muted mb-0">Pending Reviews</p>
          </Card.Body>
        </Card>
      </Col>

      {/* Recent Activity */}
      <Col lg={6}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-bold mb-3">Recent Activity</h5>
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="d-flex align-items-start mb-3">
                <div className="flex-shrink-0">
                  <div className="bg-primary rounded-circle p-2" style={{ width: '32px', height: '32px' }}>
                    <FontAwesomeIcon 
                      icon={activity.type === 'attendance' ? faCalendarCheck : 
                            activity.type === 'assignment' ? faTasks : faBell} 
                      className="text-white" 
                      size="sm" 
                    />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="fw-bold small">{activity.message}</div>
                  <div className="text-muted small">{activity.time}</div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>

      {/* Quick Actions */}
      <Col lg={6}>
        <Card className="h-100 border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              <Button variant="outline-primary" size="sm">
                <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                Take Attendance
              </Button>
              <Button variant="outline-success" size="sm">
                <FontAwesomeIcon icon={faTasks} className="me-2" />
                Create Assignment
              </Button>
              <Button variant="outline-warning" size="sm">
                <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                Grade Submissions
              </Button>
              <Button variant="outline-info" size="sm">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                View Students
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderClassesView = () => (
    <div>
      <Row className="mb-3">
        <Col>
          <h5 className="fw-bold">Assigned Classes</h5>
        </Col>
      </Row>
      <Row className="g-3">
        {teacherClasses.map((classItem) => (
          <Col lg={6} key={classItem.id}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold">{classItem.name}</h6>
                  <Badge bg="primary">{classItem.students} students</Badge>
                </div>
                <p className="text-muted small mb-2">{classItem.schedule}</p>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary">View Details</Button>
                  <Button size="sm" variant="outline-secondary">Take Attendance</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderStudentsView = () => (
    <div>
      <Row className="mb-3">
        <Col>
          <h5 className="fw-bold">Students Overview</h5>
        </Col>
      </Row>
      <Table responsive className="border-0">
        <thead className="bg-light">
          <tr>
            <th>Student Name</th>
            <th>Class</th>
            <th>Current Grade</th>
            <th>Attendance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teacherStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>
                <Badge bg={student.grade.startsWith('A') ? 'success' : 
                           student.grade.startsWith('B') ? 'primary' : 'warning'}>
                  {student.grade}
                </Badge>
              </td>
              <td>{student.attendance}</td>
              <td>
                <Button size="sm" variant="outline-primary">View Profile</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="border-0">
        <div className="d-flex align-items-center">
          <PhotoUpload
            currentPhoto={editedData.photo || teacherPhoto}
            onPhotoUpdate={handlePhotoUpdate}
            userRole="teacher"
            size={60}
            name={editedData.name || 'Teacher'}
            showEditButton={true}
            className="me-3"
          />
          <div>
            <Modal.Title className="mb-1">
              {isEditing ? (
                <Form.Control
                  type="text"
                  value={editedData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="fw-bold"
                />
              ) : (
                editedData.name || 'Teacher Dashboard'
              )}
            </Modal.Title>
            <p className="text-muted mb-0 small">
              {editedData.email || 'teacher@shuleni.com'} • Teacher Dashboard View
            </p>
          </div>
          <div className="ms-auto">
            {isEditing ? (
              <div className="d-flex gap-2">
                <Button size="sm" variant="success" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} className="me-1" />
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline-primary" onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faEdit} className="me-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Navigation Tabs */}
        <div className="border-bottom px-4 py-2">
          <Nav variant="pills" className="justify-content-center">
            <Nav.Item>
              <Nav.Link
                active={viewMode === 'dashboard'}
                onClick={() => setViewMode('dashboard')}
                className="me-2"
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={viewMode === 'classes'}
                onClick={() => setViewMode('classes')}
                className="me-2"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                Classes
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={viewMode === 'subjects'}
                onClick={() => setViewMode('subjects')}
                className="me-2"
              >
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Subjects
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={viewMode === 'students'}
                onClick={() => setViewMode('students')}
              >
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Students
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Content Area */}
        <Container fluid className="p-4">
          {viewMode === 'dashboard' && renderDashboardView()}
          {viewMode === 'classes' && <ClassManagement userRole="teacher" />}
          {viewMode === 'subjects' && <SubjectManagement userRole="teacher" />}
          {viewMode === 'students' && <StudentSearch userRole="teacher" />}
        </Container>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <div className="d-flex justify-content-between w-100">
          <div className="text-muted small">
            Last updated: {new Date().toLocaleString()} • Real-time data
          </div>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TeacherDashboardModal;
