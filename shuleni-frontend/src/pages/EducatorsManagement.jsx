import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Form, 
  Modal, 
  Alert, 
  Badge, 
  Dropdown, 
  ButtonGroup,
  Spinner,
  Image,
  Accordion
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faFilter, 
  faSearch, 
  faChalkboardTeacher, 
  faGraduationCap,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faTimes,
  faCheck,
  faEye,
  faUsers,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from '../Store/slices/usersSlice';
import PhotoUpload from '../components/PhotoUpload';
import './EducatorsManagement.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const EducatorsManagement = () => {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector(state => state.users);

  // Sidebar state management for auto-hide functionality
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subjects: [],
    classes: [],
    qualifications: '',
    experience: '',
    avatar: ''
  });

  // Available subjects and classes (you can move this to a separate slice later)
  const availableSubjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Literature', 'Art',
    'Physical Education', 'Computer Science', 'Music'
  ];

  const availableClasses = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  // Load teachers on component mount
  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !filterClass || (teacher.classes && teacher.classes.some(cls => 
      cls.toLowerCase().includes(filterClass.toLowerCase())
    ));
    const matchesSubject = !filterSubject || (teacher.subjects && teacher.subjects.some(sub => 
      sub.toLowerCase().includes(filterSubject.toLowerCase())
    ));
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multi-select for subjects and classes
  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Handle photo update
  const handlePhotoUpdate = (photoUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: photoUrl
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      subjects: [],
      classes: [],
      qualifications: '',
      experience: '',
      avatar: ''
    });
  };

  // Handle add teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTeacher(formData));
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  // Handle edit teacher
  const handleEditTeacher = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTeacher({ ...formData, id: selectedTeacher.id }));
      setShowEditModal(false);
      resetForm();
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  // Handle delete teacher
  const handleDeleteTeacher = async () => {
    try {
      await dispatch(deleteTeacher(selectedTeacher.id));
      setShowDeleteModal(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  // Open edit modal with teacher data
  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      address: teacher.address || '',
      subjects: teacher.subjects || [],
      classes: teacher.classes || [],
      qualifications: teacher.qualifications || '',
      experience: teacher.experience || '',
      avatar: teacher.avatar || ''
    });
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  // Open delete modal
  const openDeleteModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        autoHide={true}
        onHover={setSidebarHovered}
      />
      
      <div className={`main-content ${sidebarHovered ? 'sidebar-expanded' : ''}`}>
        <div className="educators-management-page d-flex min-vh-100">
          <div className="flex-grow-1 p-3 p-md-4">
            <Container fluid>
              {/* Header */}
              <Row className="mb-4">
                <Col>
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h1 className="h3 mb-2">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="me-3 text-primary" />
                        Educators Management
                      </h1>
                      <p className="text-muted mb-0">Manage teachers, assign classes, and oversee educational staff</p>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowAddModal(true)}
                      className="mt-2 mt-md-0"
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add Teacher
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Statistics Cards */}
              <Row className="mb-4">
                <Col xs={12} sm={6} lg={3} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" className="text-primary mb-2" />
                      <h4 className="fw-bold text-primary">{teachers.length}</h4>
                      <p className="text-muted mb-0">Total Teachers</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <FontAwesomeIcon icon={faUsers} size="2x" className="text-success mb-2" />
                      <h4 className="fw-bold text-success">{teachers.filter(t => t.status === 'active').length}</h4>
                      <p className="text-muted mb-0">Active Teachers</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <FontAwesomeIcon icon={faBook} size="2x" className="text-info mb-2" />
                      <h4 className="fw-bold text-info">{[...new Set(teachers.flatMap(t => t.subjects || []))].length}</h4>
                      <p className="text-muted mb-0">Subjects Taught</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6} lg={3} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <FontAwesomeIcon icon={faGraduationCap} size="2x" className="text-warning mb-2" />
                      <h4 className="fw-bold text-warning">{[...new Set(teachers.flatMap(t => t.classes || []))].length}</h4>
                      <p className="text-muted mb-0">Classes Assigned</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Search and Filter */}
              <Row className="mb-4">
                <Col>
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col xs={12} md={6} lg={4} className="mb-3 mb-md-0">
                          <div className="position-relative">
                            <FontAwesomeIcon 
                              icon={faSearch} 
                              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
                            />
                            <Form.Control
                              type="text"
                              placeholder="Search teachers by name or email..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="ps-5"
                            />
                          </div>
                        </Col>
                        <Col xs={12} md={6} lg={4} className="mb-3 mb-lg-0">
                          <ButtonGroup className="w-100">
                            <Button 
                              variant={showFilters ? "primary" : "outline-primary"}
                              onClick={() => setShowFilters(!showFilters)}
                            >
                              <FontAwesomeIcon icon={faFilter} className="me-2" />
                              Filters
                            </Button>
                            {(filterClass || filterSubject) && (
                              <Button 
                                variant="outline-secondary"
                                onClick={() => {
                                  setFilterClass('');
                                  setFilterSubject('');
                                }}
                              >
                                Clear
                              </Button>
                            )}
                          </ButtonGroup>
                        </Col>
                        <Col xs={12} lg={4}>
                          <div className="text-muted text-center text-lg-end">
                            Showing {filteredTeachers.length} of {teachers.length} teachers
                          </div>
                        </Col>
                      </Row>

                      {/* Filter Controls */}
                      {showFilters && (
                        <Row className="mt-3 pt-3 border-top">
                          <Col xs={12} md={6} className="mb-3 mb-md-0">
                            <Form.Label>Filter by Class</Form.Label>
                            <Form.Select
                              value={filterClass}
                              onChange={(e) => setFilterClass(e.target.value)}
                            >
                              <option value="">All Classes</option>
                              {availableClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Label>Filter by Subject</Form.Label>
                            <Form.Select
                              value={filterSubject}
                              onChange={(e) => setFilterSubject(e.target.value)}
                            >
                              <option value="">All Subjects</option>
                              {availableSubjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                              ))}
                            </Form.Select>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Error Display */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Teachers Table */}
              <Row>
                <Col>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                      {loading ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <Table hover className="mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th className="border-0 ps-4">Teacher</th>
                                <th className="border-0 d-none d-md-table-cell">Contact</th>
                                <th className="border-0 d-none d-lg-table-cell">Subjects</th>
                                <th className="border-0 d-none d-lg-table-cell">Classes</th>
                                <th className="border-0 d-none d-xl-table-cell">Experience</th>
                                <th className="border-0 d-none d-md-table-cell">Status</th>
                                <th className="border-0 pe-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTeachers.length === 0 ? (
                                <tr>
                                  <td colSpan="7" className="text-center py-5 text-muted">
                                    {searchTerm || filterClass || filterSubject 
                                      ? 'No teachers match your search criteria'
                                      : 'No teachers found. Add your first teacher to get started.'
                                    }
                                  </td>
                                </tr>
                              ) : (
                                filteredTeachers.map((teacher) => (
                                  <tr key={teacher.id}>
                                    <td className="ps-4">
                                      <div className="d-flex align-items-center">
                                        <Image
                                          src={teacher.avatar || `https://via.placeholder.com/40/9B59B6/FFFFFF?text=${teacher.name?.split(' ').map(n => n[0]).join('')}`}
                                          alt={teacher.name}
                                          width="40"
                                          height="40"
                                          className="rounded-circle me-3"
                                        />
                                        <div>
                                          <div className="fw-semibold">{teacher.name}</div>
                                          <small className="text-muted">{teacher.email}</small>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                      <div>
                                        <div className="small">
                                          <FontAwesomeIcon icon={faPhone} className="me-1 text-muted" />
                                          {teacher.phone || 'N/A'}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="d-none d-lg-table-cell">
                                      <div className="d-flex flex-wrap gap-1">
                                        {(teacher.subjects || []).slice(0, 2).map((subject, index) => (
                                          <Badge key={index} bg="primary" className="small">
                                            {subject}
                                          </Badge>
                                        ))}
                                        {(teacher.subjects || []).length > 2 && (
                                          <Badge bg="secondary" className="small">
                                            +{(teacher.subjects || []).length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    </td>
                                    <td className="d-none d-lg-table-cell">
                                      <div className="d-flex flex-wrap gap-1">
                                        {(teacher.classes || []).slice(0, 2).map((cls, index) => (
                                          <Badge key={index} bg="success" className="small">
                                            {cls}
                                          </Badge>
                                        ))}
                                        {(teacher.classes || []).length > 2 && (
                                          <Badge bg="secondary" className="small">
                                            +{(teacher.classes || []).length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    </td>
                                    <td className="d-none d-xl-table-cell">
                                      <span className="text-muted">{teacher.experience || 'N/A'}</span>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                      <Badge bg={teacher.status === 'active' ? 'success' : 'danger'}>
                                        {teacher.status === 'active' ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </td>
                                    <td className="pe-4">
                                      <ButtonGroup size="sm">
                                        <Button
                                          variant="outline-info"
                                          onClick={() => openViewModal(teacher)}
                                          title="View Details"
                                        >
                                          <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button
                                          variant="outline-primary"
                                          onClick={() => openEditModal(teacher)}
                                          title="Edit Teacher"
                                        >
                                          <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                          variant="outline-danger"
                                          onClick={() => openDeleteModal(teacher)}
                                          title="Delete Teacher"
                                        >
                                          <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                      </ButtonGroup>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>

            {/* Add Teacher Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>
                  <FontAwesomeIcon icon={faPlus} className="me-2 text-primary" />
                  Add New Teacher
                </Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleAddTeacher}>
                <Modal.Body>
                  <Row>
                    <Col xs={12} className="text-center mb-4">
                      <PhotoUpload
                        currentPhoto={formData.avatar}
                        onPhotoUpdate={handlePhotoUpdate}
                        size="lg"
                      />
                      <small className="text-muted d-block mt-2">Upload teacher's profile photo</small>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter teacher's full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter email address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Experience</Form.Label>
                        <Form.Control
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="e.g., 5 years"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Qualifications</Form.Label>
                        <Form.Control
                          type="text"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleInputChange}
                          placeholder="e.g., M.Ed Mathematics, B.Sc Physics"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Subjects to Teach</Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {availableSubjects.map(subject => (
                            <Form.Check
                              key={subject}
                              type="checkbox"
                              id={`subject-${subject}`}
                              label={subject}
                              checked={formData.subjects.includes(subject)}
                              onChange={() => handleMultiSelect('subjects', subject)}
                              className="mb-1"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Classes to Assign</Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {availableClasses.map(cls => (
                            <Form.Check
                              key={cls}
                              type="checkbox"
                              id={`class-${cls}`}
                              label={cls}
                              checked={formData.classes.includes(cls)}
                              onChange={() => handleMultiSelect('classes', cls)}
                              className="mb-1"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-2" />
                        Add Teacher
                      </>
                    )}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            {/* Edit Teacher Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>
                  <FontAwesomeIcon icon={faEdit} className="me-2 text-primary" />
                  Edit Teacher
                </Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleEditTeacher}>
                <Modal.Body>
                  <Row>
                    <Col xs={12} className="text-center mb-4">
                      <PhotoUpload
                        currentPhoto={formData.avatar}
                        onPhotoUpdate={handlePhotoUpdate}
                        size="lg"
                      />
                      <small className="text-muted d-block mt-2">Update teacher's profile photo</small>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter teacher's full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter email address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Experience</Form.Label>
                        <Form.Control
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="e.g., 5 years"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Qualifications</Form.Label>
                        <Form.Control
                          type="text"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleInputChange}
                          placeholder="e.g., M.Ed Mathematics, B.Sc Physics"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Subjects to Teach</Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {availableSubjects.map(subject => (
                            <Form.Check
                              key={subject}
                              type="checkbox"
                              id={`edit-subject-${subject}`}
                              label={subject}
                              checked={formData.subjects.includes(subject)}
                              onChange={() => handleMultiSelect('subjects', subject)}
                              className="mb-1"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Classes to Assign</Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {availableClasses.map(cls => (
                            <Form.Check
                              key={cls}
                              type="checkbox"
                              id={`edit-class-${cls}`}
                              label={cls}
                              checked={formData.classes.includes(cls)}
                              onChange={() => handleMultiSelect('classes', cls)}
                              className="mb-1"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="me-2" />
                        Update Teacher
                      </>
                    )}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            {/* View Teacher Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>
                  <FontAwesomeIcon icon={faEye} className="me-2 text-info" />
                  Teacher Details
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedTeacher && (
                  <Row>
                    <Col xs={12} md={4} className="text-center mb-4">
                      <Image
                        src={selectedTeacher.avatar || `https://via.placeholder.com/150/9B59B6/FFFFFF?text=${selectedTeacher.name?.split(' ').map(n => n[0]).join('')}`}
                        alt={selectedTeacher.name}
                        width="150"
                        height="150"
                        className="rounded-circle mb-3"
                      />
                      <h4>{selectedTeacher.name}</h4>
                      <Badge bg={selectedTeacher.status === 'active' ? 'success' : 'danger'} className="mb-2">
                        {selectedTeacher.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </Col>
                    <Col xs={12} md={8}>
                      <Row>
                        <Col xs={12} className="mb-3">
                          <strong>
                            <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                            Email:
                          </strong>
                          <div>{selectedTeacher.email}</div>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <strong>
                            <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                            Phone:
                          </strong>
                          <div>{selectedTeacher.phone || 'Not provided'}</div>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <strong>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-muted" />
                            Address:
                          </strong>
                          <div>{selectedTeacher.address || 'Not provided'}</div>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <strong>
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-muted" />
                            Hire Date:
                          </strong>
                          <div>{selectedTeacher.hireDate || 'Not available'}</div>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <strong>
                            <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-muted" />
                            Qualifications:
                          </strong>
                          <div>{selectedTeacher.qualifications || 'Not provided'}</div>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <strong>Experience:</strong>
                          <div>{selectedTeacher.experience || 'Not provided'}</div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12}>
                      <hr />
                      <Row>
                        <Col xs={12} md={6} className="mb-3">
                          <strong>Subjects Teaching:</strong>
                          <div className="mt-2">
                            {(selectedTeacher.subjects || []).length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {selectedTeacher.subjects.map((subject, index) => (
                                  <Badge key={index} bg="primary">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">No subjects assigned</span>
                            )}
                          </div>
                        </Col>
                        <Col xs={12} md={6} className="mb-3">
                          <strong>Classes Assigned:</strong>
                          <div className="mt-2">
                            {(selectedTeacher.classes || []).length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {selectedTeacher.classes.map((cls, index) => (
                                  <Badge key={index} bg="success">
                                    {cls}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">No classes assigned</span>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedTeacher);
                }}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit Teacher
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="text-danger">
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Confirm Delete
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedTeacher && (
                  <div>
                    <Alert variant="warning">
                      <strong>Warning:</strong> This action cannot be undone.
                    </Alert>
                    <p>
                      Are you sure you want to delete <strong>{selectedTeacher.name}</strong>?
                    </p>
                    <p className="text-muted">
                      This will:
                    </p>
                    <ul className="text-muted">
                      <li>Remove the teacher's account permanently</li>
                      <li>Delete their dashboard access</li>
                      <li>Unassign them from all classes</li>
                      <li>Remove their profile and data</li>
                    </ul>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteTeacher} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="me-2" />
                      Delete Teacher
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorsManagement;
