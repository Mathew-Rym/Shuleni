import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PhotoUpload from '../components/PhotoUpload';
import Calendar from '../components/Calendar';
import TeacherDashboardModal from '../components/TeacherDashboardModal';
import ClassManagement from '../components/ClassManagement';
import SubjectManagement from '../components/SubjectManagement';
import StudentSearch from '../components/StudentSearch';
import { fetchDashboardData } from '../Store/slices/dashboardSlice';
import { fetchStudents, fetchTeachers, createStudent, createTeacher, updateStudent, updateTeacher, deleteStudent, deleteTeacher, assignClassesToTeacher, assignTeacherToMultipleClasses } from '../Store/slices/usersSlice';
import { fetchClasses, createClass, assignTeacherToClass } from '../Store/slices/classesSlice';
import { fetchEvents, createEvent, updateEventData, deleteEventData } from '../Store/slices/calendarSlice';
import { updateUserAvatar } from '../Store/slices/authSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { metrics, attendanceData, loading } = useSelector((state) => state.dashboard);
  const { students, teachers } = useSelector((state) => state.users);
  const { classes } = useSelector((state) => state.classes);
  const { events } = useSelector((state) => state.calendar);

  
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showClassAssignmentModal, setShowClassAssignmentModal] = useState(false);
  const [showTeacherDetailsModal, setShowTeacherDetailsModal] = useState(false);
  const [showTeacherDashboardModal, setShowTeacherDashboardModal] = useState(false);
  const [selectedTeacherForDashboard, setSelectedTeacherForDashboard] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminPhoto, setAdminPhoto] = useState(null);
  const [studentPhotos, setStudentPhotos] = useState({});
  const [teacherPhotos, setTeacherPhotos] = useState({});
  const [activeTab, setActiveTab] = useState('students');

  
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', dateOfBirth: '', parentName: '', phone: '', address: '', class: '', photo: '',
    admissionNo: '', idNumber: '', gender: '', county: '', country: '', postalAddress: '', canGraduate: false
  });
  const [teacherForm, setTeacherForm] = useState({
    name: '', email: '', subject: '', phone: '', address: '', qualifications: '', experience: '', photo: '', assignedClasses: []
  });
  const [classForm, setClassForm] = useState({
    name: '', teacher: '', grade: '', description: '', schedule: '', room: ''
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'general',
    priority: 'medium'
  });

 
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
    dispatch(fetchClasses());
    dispatch(fetchEvents());
    
    // Initialize admin photo from user avatar
    if (user?.avatar) {
      setAdminPhoto(user.avatar);
    }
  }, [dispatch, user?.avatar]);

  const handleAdminPhotoUpdate = (newPhotoUrl) => {
    setAdminPhoto(newPhotoUrl);
    // Update the user avatar in the auth state for navbar display
    dispatch(updateUserAvatar(newPhotoUrl));
    // BACKEND TODO: Update admin photo via PUT /api/admin/profile endpoint
    console.log('Admin photo updated:', newPhotoUrl);
  };

  const handleStudentPhotoUpdate = (studentId, newPhotoUrl) => {
    setStudentPhotos(prev => ({
      ...prev,
      [studentId]: newPhotoUrl
    }));
    console.log(`Student ${studentId} photo updated:`, newPhotoUrl);
  };

  const handleTeacherPhotoUpdate = (teacherId, newPhotoUrl) => {
    setTeacherPhotos(prev => ({
      ...prev,
      [teacherId]: newPhotoUrl
    }));
    console.log(`Teacher ${teacherId} photo updated:`, newPhotoUrl);
  };

  
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const studentData = {
      ...studentForm,
      // Auto-generate admission number if not provided
      admissionNo: studentForm.admissionNo || `STU-2025-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      // Set default values if not provided
      country: studentForm.country || 'KENYAN',
      county: studentForm.county || 'Nairobi'
    };
    
    if (editingStudent) {
      dispatch(updateStudent({ ...studentData, id: editingStudent.id }));
    } else {
      dispatch(createStudent(studentData));
      setTimeout(() => {
        alert(`Student "${studentData.name}" added successfully!\n\nAutomatic Dashboard Access Created:\n- Email: ${studentData.email}\n- Role: Student\n- Dashboard: Accessible immediately\n- Admission No: ${studentData.admissionNo}\n\nThe student can now log in and access their personalized dashboard with their complete information visible.`);
      }, 500);
    }
    
    setShowStudentModal(false);
    setEditingStudent(null);
    setStudentForm({ 
      name: '', email: '', dateOfBirth: '', parentName: '', phone: '', address: '', class: '', photo: '',
      admissionNo: '', idNumber: '', gender: '', county: '', country: '', postalAddress: '', canGraduate: false
    });
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      parentName: student.parentName,
      phone: student.phone,
      address: student.address,
      class: student.class,
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
      dateOfBirth: '',
      parentName: '',
      phone: '',
      address: '',
      class: '',
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
    if (window.confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudent(studentId));
    }
  };

  
  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    const teacherData = {
      ...teacherForm,
      assignedClasses: selectedClasses
    };
    
    if (editingTeacher) {
      dispatch(updateTeacher({ ...teacherData, id: editingTeacher.id }));
      // Update class assignments
      dispatch(assignClassesToTeacher({ 
        teacherId: editingTeacher.id, 
        classIds: selectedClasses.map(c => c.id) 
      }));
      
      // Update classes to show assigned teacher
      selectedClasses.forEach(cls => {
        dispatch(assignTeacherToClass({
          classId: cls.id,
          teacherId: editingTeacher.id,
          teacherName: editingTeacher.name
        }));
      });
    } else {
      // Create new teacher
      const newTeacherId = Date.now();
      const newTeacherData = { ...teacherData, id: newTeacherId };
      
      dispatch(createTeacher(newTeacherData));
      
      // Assign classes to new teacher
      if (selectedClasses.length > 0) {
        dispatch(assignClassesToTeacher({ 
          teacherId: newTeacherId, 
          classIds: selectedClasses.map(c => c.id) 
        }));
        
        // Update classes to show assigned teacher
        selectedClasses.forEach(cls => {
          dispatch(assignTeacherToClass({
            classId: cls.id,
            teacherId: newTeacherId,
            teacherName: teacherData.name
          }));
        });
      }
    }
    
    setShowTeacherModal(false);
    setEditingTeacher(null);
    setSelectedClasses([]);
    setTeacherForm({ name: '', email: '', subject: '', phone: '', address: '', qualifications: '', experience: '', photo: '', assignedClasses: [] });
    
    // Show success message and navigate to teacher dashboard option
    if (!editingTeacher) {
      setTimeout(() => {
        const classNames = selectedClasses.map(c => c.name).join(', ');
        const message = `Teacher "${teacherData.name}" created successfully!\n\n✅ Dashboard Access Created:\n- Email: ${teacherData.email}\n- Role: Teacher\n- Dashboard URL: /teacher?id=${newTeacherId || 'ID'}\n\n✅ Classes Assigned (${selectedClasses.length}):\n${classNames || 'None'}\n\n🎯 The teacher can now log in and manage their assigned classes immediately!\n\nWould you like to open their dashboard?`;
        
        if (window.confirm(message)) {
          handleOpenTeacherDashboard(teacherData);
        }
      }, 500);
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      ...eventForm,
      date: eventForm.date,
      id: editingEvent ? editingEvent.id : Date.now()
    };
    
    if (editingEvent) {
      handleEventEdit(eventData);
    } else {
      handleEventAdd(eventData);
    }
    
    setShowEventModal(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'general',
      priority: 'medium'
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      priority: event.priority
    });
    setShowEventModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      phone: teacher.phone,
      address: teacher.address,
      qualifications: teacher.qualifications,
      experience: teacher.experience,
      assignedClasses: teacher.classes || []
    });
    // Set selected classes for editing
    if (teacher.classes) {
      const teacherClasses = classes.filter(cls => teacher.classes.includes(cls.id));
      setSelectedClasses(teacherClasses);
    }
    setShowTeacherModal(true);
  };

  const handleViewTeacherDashboard = (teacher) => {
    setSelectedTeacherForDashboard(teacher);
    setShowTeacherDashboardModal(true);
  };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      dispatch(deleteTeacher(teacherId));
    }
  };

  // New teacher management functions
  const handleOpenTeacherDashboard = (teacher) => {
    // Simulate opening teacher dashboard with their credentials
    const teacherDashboardUrl = `/teacher?id=${teacher.id}&email=${teacher.email}`;
    window.open(teacherDashboardUrl, '_blank');
  };

  const handleViewTeacherDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherDetailsModal(true);
  };

  const handleAssignClasses = (teacher) => {
    setSelectedTeacher(teacher);
    const teacherClasses = classes.filter(cls => teacher.classes?.includes(cls.id)) || [];
    setSelectedClasses(teacherClasses);
    setShowClassAssignmentModal(true);
  };

  const handleClassAssignmentSubmit = () => {
    if (selectedTeacher) {
      // Update teacher's assigned classes
      dispatch(assignClassesToTeacher({
        teacherId: selectedTeacher.id,
        classIds: selectedClasses.map(c => c.id)
      }));
      
      // Update classes to show assigned teacher
      selectedClasses.forEach(cls => {
        dispatch(assignTeacherToClass({
          classId: cls.id,
          teacherId: selectedTeacher.id,
          teacherName: selectedTeacher.name
        }));
      });
      
      setShowClassAssignmentModal(false);
      setSelectedTeacher(null);
      setSelectedClasses([]);
      
      // Show success message
      setTimeout(() => {
        alert(`Successfully assigned ${selectedClasses.length} classes to ${selectedTeacher.name}!\n\nThe teacher's dashboard has been automatically updated with their new classes.`);
      }, 300);
    }
  };

  const toggleClassSelection = (classItem) => {
    setSelectedClasses(prev => {
      const isSelected = prev.find(c => c.id === classItem.id);
      if (isSelected) {
        return prev.filter(c => c.id !== classItem.id);
      } else {
        return [...prev, classItem];
      }
    });
  };

  const handleCreateTeacherAndDashboard = () => {
    setShowTeacherModal(true);
  };

  
  const handleClassSubmit = (e) => {
    e.preventDefault();
    dispatch(createClass(classForm));
    setShowClassModal(false);
    setClassForm({ name: '', teacher: '', grade: '', description: '', schedule: '', room: '' });
  };

  // Calendar event handlers
  const handleEventAdd = (eventData) => {
    dispatch(createEvent(eventData));
  };

  const handleEventEdit = (eventData) => {
    dispatch(updateEventData(eventData));
  };

  const handleEventDelete = (eventId) => {
    dispatch(deleteEventData(eventId));
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
                    currentPhoto={adminPhoto || user?.avatar}
                    onPhotoUpdate={handleAdminPhotoUpdate}
                    userRole="admin"
                    size={80}
                    name={user?.name || 'Admin User'}
                    className="me-3"
                  />
                  <div>
                    <h1 className="h3 fw-bold mb-1">Welcome, {user?.name || 'Administrator'}</h1>
                    <p className="text-muted mb-0">Manage students, teachers, and resources efficiently.</p>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" onClick={() => window.location.reload()}>
                    Access Existing School
                  </Button>
                  <Button className="shuleni-btn-primary">
                    Create New School
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Metrics Cards - Enhanced Responsive */}
          <Row className="g-4 mb-4">
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{metrics.totalStudents}</h3>
                  <p className="text-muted mb-0">Total Students</p>
                  <small className="text-success">↑ 5% from last month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{metrics.totalTeachers}</h3>
                  <p className="text-muted mb-0">Total Teachers</p>
                  <small className="text-success">↑ 2% from last month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{metrics.attendanceRate}%</h3>
                  <p className="text-muted mb-0">Attendance Rate</p>
                  <small className="text-success">↑ 3% from last month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="shuleni-card h-100 text-center">
                <Card.Body>
                  <h3 className="fw-bold text-primary">{metrics.activeClasses}</h3>
                  <p className="text-muted mb-0">Active Classes</p>
                  <small className="text-success">Steady</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Management Navigation Tabs */}
          <Row className="g-4 mb-4">
            <Col>
              <Card className="shuleni-card">
                <Card.Body className="p-0">
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="nav-fill border-bottom-0"
                  >
                    <Tab eventKey="students" title="Students Management">
                      <div className="p-4">
                        <StudentSearch userRole="admin" />
                      </div>
                    </Tab>
                    <Tab eventKey="classes" title="Classes Management">
                      <div className="p-4">
                        <ClassManagement userRole="admin" />
                      </div>
                    </Tab>
                    <Tab eventKey="subjects" title="Subjects Management">
                      <div className="p-4">
                        <SubjectManagement userRole="admin" />
                      </div>
                    </Tab>
                    <Tab eventKey="teachers" title="Teachers Management">
                      <div className="p-4">
                        <Row className="g-4">
                          <Col>
                            <Card className="shadow-sm border-0">
                              <Card.Header className="bg-warning text-dark">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h5 className="mb-0">Teacher Management</h5>
                                  <Button 
                                    size="sm" 
                                    variant="dark"
                                    onClick={handleAddNewTeacher}
                                  >
                                    Add Teacher
                                  </Button>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <Table responsive hover>
                                  <thead className="table-light">
                                    <tr>
                                      <th>Teacher</th>
                                      <th>Subject</th>
                                      <th>Classes</th>
                                      <th>Phone</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {teachers.slice(0, 10).map((teacher) => (
                                      <tr key={teacher.id}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <PhotoUpload
                                              currentPhoto={teacherPhotos[teacher.id]}
                                              onPhotoUpdate={(photo) => handleTeacherPhotoUpdate(teacher.id, photo)}
                                              userRole="teacher"
                                              size={40}
                                              name={teacher.name}
                                              showEditButton={false}
                                              className="me-3"
                                            />
                                            <div>
                                              <div className="fw-bold">{teacher.name}</div>
                                              <small className="text-muted">{teacher.email}</small>
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <Badge bg="info">{teacher.subject}</Badge>
                                        </td>
                                        <td>
                                          <Badge bg="secondary">
                                            {teacher.assignedClasses?.length || 0} classes
                                          </Badge>
                                        </td>
                                        <td>{teacher.phone}</td>
                                        <td>
                                          <div className="d-flex gap-1">
                                            <Button
                                              size="sm"
                                              variant="outline-primary"
                                              onClick={() => handleViewTeacherDashboard(teacher)}
                                              title="View Dashboard"
                                            >
                                              View Dashboard
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline-secondary"
                                              onClick={() => handleEditTeacher(teacher)}
                                              title="Edit Teacher"
                                            >
                                              Edit
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                    <Tab eventKey="overview" title="Dashboard Overview">
                      <div className="p-4">
                        <Row className="g-4 mb-4">
                          <Col lg={6}>
                            <Card className="shuleni-card h-100">
                              <Card.Body>
                                <h5 className="fw-bold mb-3">School Performance Metrics</h5>
                                <p className="text-muted">Key metrics to monitor your school's performance.</p>
                                <Button variant="primary">View Detailed Report</Button>
                                
                                <Row className="mt-4">
                                  <Col sm={4}>
                                    <div className="text-center">
                                      <h4 className="fw-bold">{metrics.examsCompleted}</h4>
                                      <small className="text-muted">Exams Conducted</small>
                                    </div>
                                  </Col>
                                  <Col sm={4}>
                                    <div className="text-center">
                                      <h4 className="fw-bold">{metrics.resourcesUploaded}</h4>
                                      <small className="text-muted">Resources Uploaded</small>
                                    </div>
                                  </Col>
                                  <Col sm={4}>
                                    <div className="text-center">
                                      <h4 className="fw-bold">{metrics.activeClasses}</h4>
                                      <small className="text-muted">Active Classes</small>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>

                          <Col lg={6}>
                            <Card className="shuleni-card h-100">
                              <Card.Body>
                                <h5 className="fw-bold mb-3">Monthly Attendance</h5>
                                <p className="text-muted">Attendance (%)</p>
                                
                                {/* Simple attendance chart using CSS bars */}
                                <div className="mt-4">
                                  {attendanceData.map((data, index) => (
                                    <div key={index} className="mb-3">
                                      <div className="d-flex justify-content-between mb-1">
                                        <small>{data.month}</small>
                                        <small>{data.attendance}%</small>
                                      </div>
                                      <div className="progress" style={{ height: '8px' }}>
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

                        <Row className="g-4">
                          <Col>
                            <Calendar events={events} />
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col lg={6}>
              <Card className="shuleni-card h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">School Performance Metrics</h5>
                  <p className="text-muted">Key metrics to monitor your school's performance.</p>
                  <Button variant="primary">View Detailed Report</Button>
                  
                  <Row className="mt-4">
                    <Col sm={4}>
                      <div className="text-center">
                        <h4 className="fw-bold">{metrics.examsCompleted}</h4>
                        <small className="text-muted">Exams Conducted</small>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h4 className="fw-bold">{metrics.resourcesUploaded}</h4>
                        <small className="text-muted">Resources Uploaded</small>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h4 className="fw-bold">{metrics.activeClasses}</h4>
                        <small className="text-muted">Active Classes</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="shuleni-card h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Monthly Attendance</h5>
                  <p className="text-muted">Attendance (%)</p>
                  
                  {/* Simple attendance chart using CSS bars */}
                  <div className="mt-4">
                    {attendanceData.map((data, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small>{data.month}</small>
                          <small>{data.attendance}%</small>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
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

          {/* Add New Student Section */}
          <Row className="g-4 mb-4">
            <Col lg={6}>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">Manage Students</h5>
                    <Button 
                      className="shuleni-btn-primary"
                      onClick={handleAddNewStudent}
                    >
                      Add Student
                    </Button>
                  </div>
                  <p className="text-muted mb-4">Fill in the details to add a new student.</p>
                  
                  {/* Students Table */}
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Email</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 5).map((student) => (
                          <tr key={student.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <PhotoUpload
                                  currentPhoto={studentPhotos[student.id] || student.avatar}
                                  onPhotoUpdate={(newPhotoUrl) => handleStudentPhotoUpdate(student.id, newPhotoUrl)}
                                  userRole="student"
                                  size={32}
                                  name={student.name}
                                  className="me-2"
                                  showEditButton={true}
                                />
                                <span>{student.name}</span>
                              </div>
                            </td>
                            <td>
                              <Badge bg="primary">{student.class}</Badge>
                            </td>
                            <td>{student.email}</td>
                            <td>
                              <div className="d-flex gap-1">
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
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Enhanced Teacher Management Section */}
            <Col lg={6}>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">Manage Teachers & Dashboards</h5>
                    <div className="d-flex gap-2">
                      <Button 
                        className="shuleni-btn-primary"
                        onClick={handleCreateTeacherAndDashboard}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add Teacher
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted mb-4">Add teachers, assign classes, and manage their dashboards automatically.</p>
                  
                  {/* Enhanced Teachers Table */}
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Subject</th>
                          <th>Classes</th>
                          <th>Dashboard</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <PhotoUpload
                                  currentPhoto={teacherPhotos[teacher.id] || teacher.avatar}
                                  onPhotoUpdate={(newPhotoUrl) => handleTeacherPhotoUpdate(teacher.id, newPhotoUrl)}
                                  userRole="teacher"
                                  size={32}
                                  name={teacher.name}
                                  className="me-2"
                                  showEditButton={true}
                                />
                                <div>
                                  <div className="fw-bold">{teacher.name}</div>
                                  <small className="text-muted">{teacher.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <Badge bg="success">{teacher.subject}</Badge>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                {teacher.classes && teacher.classes.length > 0 ? (
                                  classes
                                    .filter(cls => teacher.classes.includes(cls.id))
                                    .slice(0, 2)
                                    .map((cls) => (
                                      <Badge key={cls.id} bg="info" className="small">
                                        {cls.name}
                                      </Badge>
                                    ))
                                ) : (
                                  <small className="text-muted">No classes</small>
                                )}
                                {teacher.classes && teacher.classes.length > 2 && (
                                  <Badge bg="secondary" className="small">
                                    +{teacher.classes.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => handleViewTeacherDashboard(teacher)}
                                title="View Teacher Dashboard"
                              >
                                <i className="fas fa-tachometer-alt me-1"></i>
                                Dashboard
                              </Button>
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => handleEditTeacher(teacher)}
                                  title="Edit Teacher"
                                >
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-info"
                                  onClick={() => handleAssignClasses(teacher)}
                                  title="Assign Classes"
                                >
                                  <i className="fas fa-chalkboard-teacher"></i>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-secondary"
                                  onClick={() => handleViewTeacherDetails(teacher)}
                                  title="View Details"
                                >
                                  <i className="fas fa-eye"></i>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger"
                                  onClick={() => handleDeleteTeacher(teacher.id)}
                                  title="Delete Teacher"
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {teachers.length === 0 && (
                    <div className="text-center py-4">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <h6 className="text-muted">No Teachers Added Yet</h6>
                      <p className="text-muted">Add your first teacher to get started with class management.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Calendar Management Section */}
          <Row className="mt-4">
            <Col lg={12}>
              <Card className="shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">
                      <i className="fas fa-calendar-alt me-2"></i>
                      Calendar Management
                    </h5>
                    <Button 
                      className="shuleni-btn-primary"
                      onClick={() => setShowEventModal(true)}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Event
                    </Button>
                  </div>
                  <p className="text-muted mb-4">
                    Create and manage important dates that students can view on their dashboards.
                  </p>
                  
                  {/* Calendar Component */}
                  <Calendar 
                    events={events}
                    onEventAdd={handleEventAdd}
                    onEventEdit={handleEditEvent}
                    onEventDelete={handleEventDelete}
                    isAdmin={true}
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
            
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={studentForm.address}
                onChange={(e) => setStudentForm({...studentForm, address: e.target.value})}
                placeholder="Enter address"
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

      {/* Teacher Modal */}
      <Modal show={showTeacherModal} onHide={() => setShowTeacherModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTeacherSubmit}>
            {/* Photo Upload Section */}
            <div className="text-center mb-4">
              <PhotoUpload
                currentPhoto={teacherForm.photo}
                onPhotoUpdate={(newPhotoUrl) => setTeacherForm({...teacherForm, photo: newPhotoUrl})}
                userRole="teacher"
                size={100}
                name={teacherForm.name || 'New Teacher'}
                showEditButton={true}
              />
              <p className="text-muted mt-2">Teacher Profile Photo</p>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teacher Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
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
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})}
                    placeholder="Enter subject taught"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualifications</Form.Label>
                  <Form.Control
                    type="text"
                    value={teacherForm.qualifications}
                    onChange={(e) => setTeacherForm({...teacherForm, qualifications: e.target.value})}
                    placeholder="Enter qualifications"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    type="text"
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})}
                    placeholder="Years of experience"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={teacherForm.address}
                onChange={(e) => setTeacherForm({...teacherForm, address: e.target.value})}
                placeholder="Enter address"
              />
            </Form.Group>
            
            {/* Class Assignment Section */}
            <div className="border rounded p-3 mb-3">
              <h6 className="fw-bold mb-3">
                <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
                Assign Classes
              </h6>
              <p className="text-muted small mb-3">Select classes that this teacher will manage. Teacher dashboard will be automatically updated.</p>
              
              {classes.length > 0 ? (
                <Row>
                  {classes.map((classItem) => (
                    <Col md={6} key={classItem.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        id={`class-${classItem.id}`}
                        checked={selectedClasses.some(c => c.id === classItem.id)}
                        onChange={() => toggleClassSelection(classItem)}
                        label={
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded me-2" 
                              style={{ 
                                width: '12px', 
                                height: '12px', 
                                backgroundColor: classItem.color || '#007bff' 
                              }}
                            ></div>
                            <div>
                              <div className="fw-bold small">{classItem.name}</div>
                              <small className="text-muted">
                                {classItem.grade} • {classItem.studentsEnrolled?.length || 0} students
                              </small>
                            </div>
                          </div>
                        }
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-3">
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                  <p className="text-muted mb-0">No classes available. Create classes first to assign to teachers.</p>
                </div>
              )}
              
              {selectedClasses.length > 0 && (
                <div className="mt-3 p-2 bg-light rounded">
                  <strong className="small">Selected Classes ({selectedClasses.length}):</strong>
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {selectedClasses.map((cls) => (
                      <Badge key={cls.id} bg="primary" className="small">
                        {cls.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {!editingTeacher && (
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Auto-Dashboard Creation:</strong> A teacher dashboard with login credentials will be automatically created. 
                The teacher will receive access to manage their assigned classes immediately.
              </Alert>
            )}
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowTeacherModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="shuleni-btn-primary">
                <i className="fas fa-plus me-2"></i>
                {editingTeacher ? 'Update Teacher' : 'Create Teacher & Dashboard'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Class Assignment Modal */}
      <Modal show={showClassAssignmentModal} onHide={() => setShowClassAssignmentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
            Assign Classes to {selectedTeacher?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Current Teacher Information:</h6>
            <div className="d-flex align-items-center p-3 bg-light rounded">
              <img 
                src={selectedTeacher?.avatar} 
                alt={selectedTeacher?.name}
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div>
                <div className="fw-bold">{selectedTeacher?.name}</div>
                <div className="text-muted">{selectedTeacher?.subject} • {selectedTeacher?.email}</div>
              </div>
            </div>
          </div>
          
          <h6 className="mb-3">Available Classes:</h6>
          {classes.length > 0 ? (
            <Row>
              {classes.map((classItem) => (
                <Col md={6} key={classItem.id} className="mb-3">
                  <Card 
                    className={`h-100 cursor-pointer ${selectedClasses.some(c => c.id === classItem.id) ? 'border-primary' : ''}`}
                    onClick={() => toggleClassSelection(classItem)}
                  >
                    <Card.Body className="p-3">
                      <Form.Check
                        type="checkbox"
                        checked={selectedClasses.some(c => c.id === classItem.id)}
                        onChange={() => toggleClassSelection(classItem)}
                        label={
                          <div>
                            <div className="fw-bold">{classItem.name}</div>
                            <div className="text-muted small">{classItem.grade}</div>
                            <div className="text-muted small">
                              <i className="fas fa-users me-1"></i>
                              {classItem.studentsEnrolled?.length || 0} students
                            </div>
                            <div className="text-muted small">
                              <i className="fas fa-door-open me-1"></i>
                              {classItem.room}
                            </div>
                          </div>
                        }
                      />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
              <h6>No Classes Available</h6>
              <p className="text-muted">Create some classes first before assigning them to teachers.</p>
            </div>
          )}
          
          {selectedClasses.length > 0 && (
            <div className="mt-4 p-3 bg-success bg-opacity-10 rounded">
              <h6 className="text-success">
                <i className="fas fa-check-circle me-2"></i>
                Classes to Assign ({selectedClasses.length}):
              </h6>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {selectedClasses.map((cls) => (
                  <Badge key={cls.id} bg="success" className="p-2">
                    {cls.name} ({cls.grade})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClassAssignmentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleClassAssignmentSubmit}
            disabled={selectedClasses.length === 0}
          >
            <i className="fas fa-save me-2"></i>
            Assign Classes ({selectedClasses.length})
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Teacher Details Modal */}
      <Modal show={showTeacherDetailsModal} onHide={() => setShowTeacherDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-tie me-2 text-primary"></i>
            Teacher Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeacher && (
            <div>
              {/* Teacher Profile Section */}
              <div className="text-center mb-4">
                <img 
                  src={selectedTeacher.avatar} 
                  alt={selectedTeacher.name}
                  className="rounded-circle mb-3"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <h4 className="fw-bold">{selectedTeacher.name}</h4>
                <p className="text-muted">{selectedTeacher.subject} Teacher</p>
              </div>
              
              {/* Teacher Information */}
              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <p className="text-muted mb-0">{selectedTeacher.email}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Phone:</strong>
                    <p className="text-muted mb-0">{selectedTeacher.phone || 'Not provided'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Hire Date:</strong>
                    <p className="text-muted mb-0">{selectedTeacher.hireDate || 'Not specified'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Qualifications:</strong>
                    <p className="text-muted mb-0">{selectedTeacher.qualifications || 'Not provided'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Experience:</strong>
                    <p className="text-muted mb-0">{selectedTeacher.experience || 'Not specified'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <Badge bg={selectedTeacher.status === 'active' ? 'success' : 'secondary'}>
                      {selectedTeacher.status || 'Active'}
                    </Badge>
                  </div>
                </Col>
              </Row>
              
              {/* Assigned Classes */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  <i className="fas fa-chalkboard-teacher me-2"></i>
                  Assigned Classes ({selectedTeacher.classes?.length || 0})
                </h6>
                {selectedTeacher.classes && selectedTeacher.classes.length > 0 ? (
                  <Row>
                    {classes
                      .filter(cls => selectedTeacher.classes.includes(cls.id))
                      .map((cls) => (
                        <Col md={6} key={cls.id} className="mb-3">
                          <Card className="h-100">
                            <Card.Body className="p-3">
                              <div className="d-flex align-items-center mb-2">
                                <div 
                                  className="rounded me-2" 
                                  style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    backgroundColor: cls.color || '#007bff' 
                                  }}
                                ></div>
                                <h6 className="mb-0">{cls.name}</h6>
                              </div>
                              <p className="text-muted small mb-1">{cls.grade}</p>
                              <p className="text-muted small mb-0">
                                <i className="fas fa-users me-1"></i>
                                {cls.studentsEnrolled?.length || 0} students
                              </p>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                ) : (
                  <div className="text-center py-3">
                    <i className="fas fa-chalkboard fa-2x text-muted mb-2"></i>
                    <p className="text-muted">No classes assigned yet.</p>
                  </div>
                )}
              </div>
              
              {/* Dashboard Access Info */}
              <Alert variant="info">
                <h6 className="mb-2">
                  <i className="fas fa-laptop me-2"></i>
                  Dashboard Access
                </h6>
                <p className="mb-2">
                  <strong>Login Email:</strong> {selectedTeacher.email}
                </p>
                <p className="mb-2">
                  <strong>Dashboard URL:</strong> /teacher?id={selectedTeacher.id}
                </p>
                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => handleOpenTeacherDashboard(selectedTeacher)}
                  >
                    <i className="fas fa-external-link-alt me-1"></i>
                    Open Dashboard
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-secondary"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/teacher?id=${selectedTeacher.id}`)}
                  >
                    <i className="fas fa-copy me-1"></i>
                    Copy Dashboard URL
                  </Button>
                </div>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTeacherDetailsModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowTeacherDetailsModal(false);
              handleEditTeacher(selectedTeacher);
            }}
          >
            <i className="fas fa-edit me-2"></i>
            Edit Teacher
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEventSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="meeting">Meeting</option>
                    <option value="event">School Event</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                placeholder="Event description..."
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={eventForm.priority}
                onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowEventModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="shuleni-btn-primary">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Teacher Dashboard Modal */}
      <TeacherDashboardModal
        show={showTeacherDashboardModal}
        onHide={() => setShowTeacherDashboardModal(false)}
        teacherId={selectedTeacherForDashboard?.id}
        teacherData={selectedTeacherForDashboard}
      />
      </div>
    </div>
  );
};

export default AdminDashboard;