import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Table, Alert, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PhotoUpload from '../components/PhotoUpload';
import ClassDetail from '../components/ClassDetail';
import NotificationSystem, { useNotifications } from '../components/NotificationSystem';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../Store/slices/usersSlice';
import { fetchClasses, addAssignment, gradeAssignment, addAnnouncement, updateAttendance } from '../Store/slices/classesSlice';
import { updateUserAvatar } from '../Store/slices/authSlice';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { user } = useSelector((state) => state.auth);
  const { students } = useSelector((state) => state.users);
  const { classes } = useSelector((state) => state.classes);
  const { notifications, addNotification, removeNotification } = useNotifications();

  // States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [teacherPhoto, setTeacherPhoto] = useState(null);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // New modal states for enhanced functionality
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedAttendanceClass, setSelectedAttendanceClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  
  const [studentForm, setStudentForm] = useState({
    name: '', 
    email: '', 
    class: '', 
    dateOfBirth: '', 
    parentName: '', 
    phone: '',
    photo: '',
    admissionNo: '',
    idNumber: '',
    gender: '',
    county: '',
    country: '',
    postalAddress: '',
    canGraduate: false
  });

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    classId: '',
    attachments: []
  });

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    classId: '',
    priority: 'normal'
  });

  // Grading state
  const [gradingData, setGradingData] = useState({
    assignmentId: '',
    classId: '',
    submissions: []
  });

  // Teacher's classes (filtered by teacher)    
  const teacherClasses = classes.filter(cls => cls.teacher === user?.name);
  const teacherStudents = students.filter(student => 
    teacherClasses.some(cls => cls.name === student.class)
  );

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
    
    // Initialize teacher photo from user avatar
    if (user?.avatar) {
      setTeacherPhoto(user.avatar);
    }
  }, [dispatch, user?.avatar]);

  const handleTeacherPhotoUpdate = (newPhotoUrl) => {
    setTeacherPhoto(newPhotoUrl);
    // Update the user avatar in the auth state for navbar display
    dispatch(updateUserAvatar(newPhotoUrl));
    // In a real app, you would also update this in your backend
    console.log('Teacher photo updated:', newPhotoUrl);
  };

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
    setStudentForm({ 
      name: '', 
      email: '', 
      class: '', 
      dateOfBirth: '', 
      parentName: '', 
      phone: '',
      photo: '',
      admissionNo: '',
      idNumber: '',
      gender: '',
      county: '',
      country: '',
      postalAddress: '',
      canGraduate: false
    });
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name || '',
      email: student.email || '',
      class: student.class || '',
      dateOfBirth: student.dateOfBirth || '',
      parentName: student.parentName || '',
      phone: student.phone || '',
      photo: student.photo || '',
      admissionNo: student.admissionNo || '',
      idNumber: student.idNumber || '',
      gender: student.gender || '',
      county: student.county || '',
      country: student.country || '',
      postalAddress: student.postalAddress || '',
      canGraduate: student.canGraduate || false
    });
    setShowStudentModal(true);
  };

  const handleAddNewStudent = () => {
    setEditingStudent(null);
    setStudentForm({ 
      name: '', 
      email: '', 
      class: '', 
      dateOfBirth: '', 
      parentName: '', 
      phone: '',
      photo: '',
      admissionNo: '',
      idNumber: '',
      gender: '',
      county: '',
      country: '',
      postalAddress: '',
      canGraduate: false
    });
    setShowStudentModal(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      dispatch(deleteStudent(studentId));
    }
  };

  const handleClassClick = (classData) => {
    addNotification('info', 'Loading Class', `Opening ${classData.name} details...`);
    setSelectedClass(classData);
    setShowClassDetail(true);
    setTimeout(() => {
      addNotification('success', 'Class Loaded', `${classData.name} is ready for management!`);
    }, 500);
  };

  const handleCloseClassDetail = () => {
    setShowClassDetail(false);
    setSelectedClass(null);
  };

  // ==================== NEW ENHANCED FUNCTIONALITY ====================

  // Attendance Management
  const handleTakeAttendance = () => {
    if (teacherClasses.length === 0) {
      addNotification('warning', 'No Classes', 'You need to have classes assigned to take attendance.');
      return;
    }
    
    // Initialize attendance data for all classes
    const initAttendance = {};
    teacherClasses.forEach(cls => {
      initAttendance[cls.id] = {};
      cls.studentsEnrolled?.forEach(student => {
        initAttendance[cls.id][student.id] = 'present'; // Default to present
      });
    });
    
    setAttendanceData(initAttendance);
    setShowAttendanceModal(true);
    addNotification('info', 'Attendance Ready', 'Select classes and mark student attendance.');
  };

  const handleAttendanceSubmit = () => {
    let totalMarked = 0;
    Object.keys(attendanceData).forEach(classId => {
      const classAttendance = attendanceData[classId];
      Object.keys(classAttendance).forEach(studentId => {
        dispatch(updateAttendance({
          classId: parseInt(classId),
          studentId: parseInt(studentId),
          status: classAttendance[studentId],
          date: new Date().toISOString().split('T')[0]
        }));
        totalMarked++;
      });
    });
    
    setShowAttendanceModal(false);
    addNotification('success', 'Attendance Saved', `Attendance marked for ${totalMarked} students across all classes.`);
  };

  const updateStudentAttendance = (classId, studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [studentId]: status
      }
    }));
  };

  // Assignment Management
  const handleCreateAssignment = () => {
    if (teacherClasses.length === 0) {
      addNotification('warning', 'No Classes', 'You need to have classes assigned to create assignments.');
      return;
    }
    setShowAssignmentModal(true);
    addNotification('info', 'Create Assignment', 'Fill out the assignment details and attach files if needed.');
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!assignmentForm.classId) {
      addNotification('warning', 'Select Class', 'Please select a class for this assignment.');
      return;
    }

    const newAssignment = {
      id: Date.now(),
      ...assignmentForm,
      teacherId: user?.id,
      teacherName: user?.name,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    dispatch(addAssignment(newAssignment));
    setShowAssignmentModal(false);
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      maxPoints: 100,
      classId: '',
      attachments: []
    });
    
    const selectedClassName = teacherClasses.find(cls => cls.id === parseInt(assignmentForm.classId))?.name;
    addNotification('success', 'Assignment Created', `"${assignmentForm.title}" has been assigned to ${selectedClassName}!`);
  };

  // File upload handler for assignments
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // In real app, upload to server
    }));
    
    setAssignmentForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...fileData]
    }));
    
    addNotification('success', 'Files Added', `${files.length} file(s) attached to assignment.`);
  };

  // Announcement Management
  const handleSendAnnouncement = () => {
    if (teacherClasses.length === 0) {
      addNotification('warning', 'No Classes', 'You need to have classes assigned to send announcements.');
      return;
    }
    setShowAnnouncementModal(true);
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!announcementForm.classId) {
      addNotification('warning', 'Select Class', 'Please select a class to send this announcement to.');
      return;
    }

    const newAnnouncement = {
      id: Date.now(),
      ...announcementForm,
      teacherId: user?.id,
      teacherName: user?.name,
      createdAt: new Date().toISOString(),
      readBy: []
    };

    dispatch(addAnnouncement(newAnnouncement));
    setShowAnnouncementModal(false);
    setAnnouncementForm({
      title: '',
      message: '',
      classId: '',
      priority: 'normal'
    });

    const selectedClassName = teacherClasses.find(cls => cls.id === parseInt(announcementForm.classId))?.name;
    addNotification('success', 'Announcement Sent', `Your announcement has been sent to all students in ${selectedClassName}!`);
  };

  // Grading Management
  const handleGradeSubmissions = () => {
    // Get all assignments with submissions from teacher's classes
    const assignmentsWithSubmissions = [];
    teacherClasses.forEach(cls => {
      if (cls.assignments) {
        cls.assignments.forEach(assignment => {
          if (assignment.submissions && assignment.submissions.length > 0) {
            assignmentsWithSubmissions.push({
              ...assignment,
              className: cls.name,
              classId: cls.id
            });
          }
        });
      }
    });

    if (assignmentsWithSubmissions.length === 0) {
      addNotification('info', 'No Submissions', 'There are no pending assignment submissions to grade.');
      return;
    }

    setGradingData({
      assignmentId: '',
      classId: '',
      submissions: assignmentsWithSubmissions
    });
    setShowGradingModal(true);
  };

  const handleGradeStudent = (submissionId, grade, feedback) => {
    dispatch(gradeAssignment({
      submissionId,
      grade,
      feedback,
      gradedBy: user?.name,
      gradedAt: new Date().toISOString()
    }));
    
    addNotification('success', 'Grade Submitted', `Grade and feedback have been saved successfully.`);
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
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <PhotoUpload
                    currentPhoto={teacherPhoto || user?.avatar}
                    onPhotoUpdate={handleTeacherPhotoUpdate}
                    userRole="teacher"
                    size={80}
                    name={user?.name || 'Teacher'}
                    className="me-3"
                  />
                  <div>
                    <h1 className="h3 fw-bold mb-1">Welcome, {user?.name}!</h1>
                    <p className="text-muted mb-0">Manage your classes and students effectively.</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Teacher Stats - Enhanced Responsive */}
          <Row className="g-4 mb-4">
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{teacherClasses.length}</h3>
                  <p className="text-muted mb-0">{t('myClasses')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{teacherStudents.length}</h3>
                  <p className="text-muted mb-0">My Students</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">95%</h3>
                  <p className="text-muted mb-0">Attendance Rate</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">12</h3>
                  <p className="text-muted mb-0">Assignments</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* My Classes Section */}
          <Row className="mb-4">
            <Col>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                    <h5 className="fw-bold mb-2 mb-md-0">Manage Your Classes</h5>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                      <Badge bg="primary" className="me-2">{teacherClasses.length} Classes</Badge>
                      <Button variant="primary">View All Classes</Button>
                    </div>
                  </div>
                  <p className="text-muted mb-4">Click on a class to manage its students, grades, and announcements</p>
                  
                  <Row className="g-3">
                    {teacherClasses.length > 0 ? teacherClasses.map((classItem) => (
                      <Col xxl={3} xl={4} lg={6} md={6} sm={6} xs={12} key={classItem.id}>
                        <div 
                          className="class-card position-relative" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleClassClick(classItem)}
                        >
                          <img 
                            src={classItem.image}
                            alt={classItem.name}
                            className="w-100 rounded"
                            style={{ height: '120px', objectFit: 'cover' }}
                          />
                          <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white rounded-bottom"
                               style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                            <h6 className="fw-bold mb-1">{classItem.name}</h6>
                            <small className="d-block">{classItem.studentsEnrolled?.length || 0} students</small>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <Badge bg="light" text="dark" className="text-xs">
                                {classItem.grade}
                              </Badge>
                              <small className="opacity-75">{classItem.room}</small>
                            </div>
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
                      onClick={handleAddNewStudent}
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
                    <Button 
                      variant="outline-primary"
                      onClick={handleTakeAttendance}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="fas fa-check-square me-2"></i>
                      {t('takeAttendance')}
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={() => document.getElementById('resourceUpload').click()}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="fas fa-upload me-2"></i>
                      Upload Resource
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={handleCreateAssignment}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="fas fa-tasks me-2"></i>
                      {t('createAssignment')}
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={handleGradeSubmissions}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="fas fa-star me-2"></i>
                      {t('gradeAssignments')}
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={handleSendAnnouncement}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="fas fa-bullhorn me-2"></i>
                      {t('makeAnnouncement')}
                    </Button>
                  </div>
                  
                  {/* Hidden file input for resource upload */}
                  <input
                    id="resourceUpload"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      addNotification('success', 'Resources Uploaded', `${files.length} file(s) uploaded successfully!`);
                      // In real app, handle file upload to server
                    }}
                  />
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
        </Container>
        </div>

        {/* Student Modal */}
      <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingStudent ? 'Edit Student' : 'Add New Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleStudentSubmit}>
            {/* Photo Upload Section */}
            <div className="text-center mb-4">
              <PhotoUpload
                currentPhoto={studentForm.photo}
                onPhotoUpdate={(newPhotoUrl) => setStudentForm({...studentForm, photo: newPhotoUrl})}
                userRole="student"
                size={100}
                name={studentForm.name || 'New Student'}
                showEditButton={true}
              />
              <p className="text-muted mt-2">Student Profile Photo</p>
            </div>
            
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
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    value={studentForm.class}
                    onChange={(e) => setStudentForm({...studentForm, class: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="English">English</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="Geography">Geography</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="Physical Education">Physical Education</option>
                    {teacherClasses.map((cls) => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </Form.Select>
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
            
            {/* Additional Student Information Fields */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Admission Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentForm.admissionNo}
                    onChange={(e) => setStudentForm({...studentForm, admissionNo: e.target.value})}
                    placeholder="e.g., STU-2025-001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID/Passport Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentForm.idNumber}
                    onChange={(e) => setStudentForm({...studentForm, idNumber: e.target.value})}
                    placeholder="Enter ID or passport number"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>County</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentForm.county}
                    onChange={(e) => setStudentForm({...studentForm, county: e.target.value})}
                    placeholder="e.g., Nairobi, Mombasa"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentForm.country}
                    onChange={(e) => setStudentForm({...studentForm, country: e.target.value})}
                    placeholder="e.g., KENYAN"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Can Graduate</Form.Label>
                  <Form.Check
                    type="checkbox"
                    checked={studentForm.canGraduate}
                    onChange={(e) => setStudentForm({...studentForm, canGraduate: e.target.checked})}
                    label="Student eligible for graduation"
                    className="mt-2"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Postal Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={studentForm.postalAddress}
                onChange={(e) => setStudentForm({...studentForm, postalAddress: e.target.value})}
                placeholder="Enter full postal address"
              />
            </Form.Group>
            
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

      {/* Class Detail Modal */}
      <ClassDetail
        show={showClassDetail}
        onHide={handleCloseClassDetail}
        classData={selectedClass}
        onNotification={addNotification}
      />

      {/* ==================== NEW ENHANCED MODALS ==================== */}

      {/* Attendance Modal */}
      <Modal show={showAttendanceModal} onHide={() => setShowAttendanceModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-check-square me-2 text-primary"></i>
            Take Attendance
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Mark attendance for all your classes. Students are marked as Present by default.
          </Alert>
          
          <Tabs defaultActiveKey={teacherClasses[0]?.id} className="mb-3">
            {teacherClasses.map((classItem) => (
              <Tab eventKey={classItem.id} title={`${classItem.name} (${classItem.studentsEnrolled?.length || 0})`} key={classItem.id}>
                <div className="mt-3">
                  <h6 className="fw-bold mb-3">
                    {classItem.name} - {classItem.grade}
                    <Badge bg="primary" className="ms-2">{classItem.studentsEnrolled?.length || 0} students</Badge>
                  </h6>
                  
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classItem.studentsEnrolled?.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                   style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="fw-bold">{student.name}</div>
                                <small className="text-muted">Current: {student.attendance}%</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge 
                              bg={attendanceData[classItem.id]?.[student.id] === 'present' ? 'success' : 
                                  attendanceData[classItem.id]?.[student.id] === 'absent' ? 'danger' : 'warning'}
                            >
                              {attendanceData[classItem.id]?.[student.id] || 'present'}
                            </Badge>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                size="sm"
                                variant={attendanceData[classItem.id]?.[student.id] === 'present' ? 'success' : 'outline-success'}
                                onClick={() => updateStudentAttendance(classItem.id, student.id, 'present')}
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={attendanceData[classItem.id]?.[student.id] === 'absent' ? 'danger' : 'outline-danger'}
                                onClick={() => updateStudentAttendance(classItem.id, student.id, 'absent')}
                              >
                                Absent
                              </Button>
                              <Button
                                size="sm"
                                variant={attendanceData[classItem.id]?.[student.id] === 'late' ? 'warning' : 'outline-warning'}
                                onClick={() => updateStudentAttendance(classItem.id, student.id, 'late')}
                              >
                                Late
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            ))}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAttendanceModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAttendanceSubmit}>
            <i className="fas fa-save me-2"></i>
            Save Attendance
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assignment Creation Modal */}
      <Modal show={showAssignmentModal} onHide={() => setShowAssignmentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-tasks me-2 text-primary"></i>
            Create New Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAssignmentSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Assignment Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                    placeholder="Enter assignment title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={assignmentForm.maxPoints}
                    onChange={(e) => setAssignmentForm({...assignmentForm, maxPoints: parseInt(e.target.value)})}
                    min="1"
                    max="1000"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class *</Form.Label>
                  <Form.Select
                    value={assignmentForm.classId}
                    onChange={(e) => setAssignmentForm({...assignmentForm, classId: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    {teacherClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.grade} ({cls.studentsEnrolled?.length || 0} students)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                placeholder="Provide detailed instructions for the assignment..."
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Attachments</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png"
              />
              <Form.Text className="text-muted">
                Upload supporting materials, worksheets, or reference documents
              </Form.Text>
              
              {assignmentForm.attachments.length > 0 && (
                <div className="mt-2">
                  <strong>Attached Files:</strong>
                  <ul className="list-unstyled mt-2">
                    {assignmentForm.attachments.map((file, index) => (
                      <li key={index} className="d-flex align-items-center mb-1">
                        <i className="fas fa-file me-2 text-primary"></i>
                        <span className="me-2">{file.name}</span>
                        <Badge bg="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="ms-2"
                          onClick={() => {
                            setAssignmentForm(prev => ({
                              ...prev,
                              attachments: prev.attachments.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAssignmentModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <i className="fas fa-plus me-2"></i>
                Create Assignment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Announcement Modal */}
      <Modal show={showAnnouncementModal} onHide={() => setShowAnnouncementModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-bullhorn me-2 text-primary"></i>
            Send Announcement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAnnouncementSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Class *</Form.Label>
                  <Form.Select
                    value={announcementForm.classId}
                    onChange={(e) => setAnnouncementForm({...announcementForm, classId: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    {teacherClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.grade} ({cls.studentsEnrolled?.length || 0} students)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Announcement Title *</Form.Label>
              <Form.Control
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                placeholder="Enter announcement title"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})}
                placeholder="Type your announcement message here..."
                required
              />
            </Form.Group>
            
            {announcementForm.classId && (
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                This announcement will be sent to all {
                  teacherClasses.find(cls => cls.id === parseInt(announcementForm.classId))?.studentsEnrolled?.length || 0
                } students in {
                  teacherClasses.find(cls => cls.id === parseInt(announcementForm.classId))?.name
                }.
              </Alert>
            )}
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAnnouncementModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <i className="fas fa-paper-plane me-2"></i>
                Send Announcement
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Grading Modal */}
      <Modal show={showGradingModal} onHide={() => setShowGradingModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-star me-2 text-primary"></i>
            Grade Submissions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            Review and grade student submissions. You can view PDFs, provide feedback, and assign grades.
          </Alert>
          
          {gradingData.submissions.length > 0 ? (
            <div>
              {gradingData.submissions.map((assignment) => (
                <Card key={assignment.id} className="mb-4">
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{assignment.title}</h6>
                        <small className="text-muted">{assignment.className} • Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                      </div>
                      <Badge bg="primary">{assignment.submissions?.length || 0} submissions</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Submitted</th>
                          <th>File</th>
                          <th>Grade</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignment.submissions?.map((submission) => (
                          <tr key={submission.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                     style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>
                                  {submission.studentName.split(' ').map(n => n[0]).join('')}
                                </div>
                                {submission.studentName}
                              </div>
                            </td>
                            <td>
                              <small>{new Date(submission.submittedAt).toLocaleString()}</small>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  // In real app, open PDF viewer
                                  addNotification('info', 'Opening File', `Opening ${submission.fileName} for review...`);
                                }}
                              >
                                <i className="fas fa-file-pdf me-1"></i>
                                {submission.fileName}
                              </Button>
                            </td>
                            <td>
                              {submission.grade ? (
                                <Badge bg="success">{submission.grade}/{assignment.maxPoints}</Badge>
                              ) : (
                                <Badge bg="warning">Pending</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => {
                                    const grade = prompt(`Enter grade for ${submission.studentName} (max: ${assignment.maxPoints}):`, submission.grade || '');
                                    const feedback = prompt('Enter feedback (optional):', submission.feedback || '');
                                    if (grade !== null) {
                                      handleGradeStudent(submission.id, grade, feedback);
                                    }
                                  }}
                                >
                                  <i className="fas fa-edit me-1"></i>
                                  Grade
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() => {
                                    addNotification('info', 'Feedback', submission.feedback || 'No feedback provided yet.');
                                  }}
                                >
                                  <i className="fas fa-comment me-1"></i>
                                  Feedback
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No Submissions to Grade</h5>
              <p className="text-muted">When students submit assignments, they will appear here for grading.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGradingModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications} 
        onClose={removeNotification} 
      />
      </div>
    </div>
  );
};

export default TeacherDashboard;