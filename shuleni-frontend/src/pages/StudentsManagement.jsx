import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './StudentManagement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faEdit, 
  faTrash, 
  faEye, 
  faFilter,
  faDownload,
  faUpload,
  faUserGraduate,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faIdCard,
  faGraduationCap,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

// Available classes and subjects for student assignment
const availableClasses = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
  'Form 1', 'Form 2', 'Form 3', 'Form 4'
];

const availableSubjects = [
  'Math', 'Science', 'History', 'English', 'Kiswahili', 'Geography', 
  'Chemistry', 'Physics', 'Biology', 'Computer Science', 'Art', 'Music', 'Physical Education'
];

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample student data - replace with API calls
  useEffect(() => {
    // Simulate API call
    const sampleStudents = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.school.com',
        phone: '+1234567890',
        classes: ['Grade 1', 'Grade 2'],
        subjects: ['Math', 'Science', 'English'],
        admissionNumber: 'STU001',
        idNumber: '12345678',
        gender: 'Male',
        county: 'Nairobi',
        country: 'KENYAN',
        postalAddress: 'P.O. Box 123, Nairobi',
        canGraduate: false,
        dateOfBirth: '2008-05-15',
        address: '123 Main St, City',
        guardianName: 'Jane Doe',
        guardianPhone: '+1234567891',
        status: 'active',
        enrollmentDate: '2023-09-01',
        bloodGroup: 'O+',
        emergencyContact: 'Jane Doe - +1234567891'
      },
      {
        id: 2,
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@student.school.com',
        phone: '+1234567892',
        classes: ['Grade 3'],
        subjects: ['Art', 'Music', 'Kiswahili'],
        admissionNumber: 'STU002',
        idNumber: '87654321',
        gender: 'Female',
        county: 'Mombasa',
        country: 'KENYAN',
        postalAddress: 'P.O. Box 456, Mombasa',
        canGraduate: true,
        dateOfBirth: '2009-03-22',
        address: '456 Oak Ave, City',
        guardianName: 'Bob Johnson',
        guardianPhone: '+1234567893',
        status: 'active',
        enrollmentDate: '2023-09-01',
        bloodGroup: 'A+',
        emergencyContact: 'Bob Johnson - +1234567893'
      },
      {
        id: 3,
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@student.school.com',
        phone: '+1234567894',
        classes: ['Form 1', 'Form 2'],
        subjects: ['Chemistry', 'Physics', 'Biology', 'Computer Science'],
        admissionNumber: 'STU003',
        idNumber: '11223344',
        gender: 'Male',
        county: 'Kisumu',
        country: 'KENYAN',
        postalAddress: 'P.O. Box 789, Kisumu',
        canGraduate: false,
        dateOfBirth: '2007-11-08',
        address: '789 Pine St, City',
        guardianName: 'Sarah Wilson',
        guardianPhone: '+1234567895',
        status: 'inactive',
        enrollmentDate: '2022-09-01',
        bloodGroup: 'B+',
        emergencyContact: 'Sarah Wilson - +1234567895'
      }
    ];
    setStudents(sampleStudents);
    setFilteredStudents(sampleStudents);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = students.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = filterClass === '' || 
        (student.classes && student.classes.includes(filterClass));
      const matchesStatus = filterStatus === '' || student.status === filterStatus;
      
      return matchesSearch && matchesClass && matchesStatus;
    });
    setFilteredStudents(filtered);
  }, [students, searchTerm, filterClass, filterStatus]);

  // Modal handlers
  const handleShowModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // CRUD operations
  const handleSaveStudent = (studentData) => {
    if (modalMode === 'add') {
      const newStudent = {
        ...studentData,
        id: students.length + 1,
        admissionNumber: `STU${String(students.length + 1).padStart(3, '0')}`
      };
      setStudents([...students, newStudent]);
    } else if (modalMode === 'edit') {
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...studentData } : s));
    }
    handleCloseModal();
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  // Get unique classes for filter dropdown
  const uniqueClasses = [...new Set(
    students.flatMap(s => s.classes || [])
  )];

  return (
  <div className="d-flex min-vh-100">
    <Sidebar 
      isOpen={sidebarOpen} 
      onClose={() => setSidebarOpen(false)} 
    />
    
    <div className="flex-grow-1 d-flex flex-column">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      
      <div className="flex-grow-1 bg-light">
        <Container fluid className="py-4" style={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
          {/* Content remains the same */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">
                    <FontAwesomeIcon icon={faUserGraduate} className="me-3 text-primary" />
                    Student Management
                  </h2>
                  <p className="text-muted mt-2">Manage student information, enrollment, and records</p>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => handleShowModal('add')}
                  className="d-flex align-items-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add New Student
                </Button>
              </div>
            </Col>
          </Row>


      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faUserGraduate} className="fa-2x text-primary mb-2" />
              <h4 className="mb-0">{students.length}</h4>
              <small className="text-muted">Total Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faChartLine} className="fa-2x text-success mb-2" />
              <h4 className="mb-0">{students.filter(s => s.status === 'active').length}</h4>
              <small className="text-muted">Active Students</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faGraduationCap} className="fa-2x text-info mb-2" />
              <h4 className="mb-0">{uniqueClasses.length}</h4>
              <small className="text-muted">Classes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <FontAwesomeIcon icon={faIdCard} className="fa-2x text-warning mb-2" />
              <h4 className="mb-0">{students.filter(s => s.status === 'inactive').length}</h4>
              <small className="text-muted">Inactive Students</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search students by name, email, or admission number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    value={filterClass} 
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" className="w-100">
                      <FontAwesomeIcon icon={faFilter} className="me-2" />
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <FontAwesomeIcon icon={faDownload} className="me-2" />
                        Export CSV
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <FontAwesomeIcon icon={faUpload} className="me-2" />
                        Import Students
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                Students List ({filteredStudents.length} students)
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Admission No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Classes</th>
                    <th>Subjects</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.admissionNumber}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{student.firstName} {student.lastName}</strong>
                        </div>
                      </td>
                      <td>
                        <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                        {student.email}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {student.classes && student.classes.length > 0 ? (
                            student.classes.map((className, index) => (
                              <Badge key={index} bg="info" className="me-1 mb-1">
                                {className}
                              </Badge>
                            ))
                          ) : (
                            <Badge bg="secondary">No Classes</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {student.subjects && student.subjects.length > 0 ? (
                            student.subjects.slice(0, 3).map((subjectName, index) => (
                              <Badge key={index} bg="warning" className="me-1 mb-1">
                                {subjectName}
                              </Badge>
                            ))
                          ) : (
                            <Badge bg="secondary">No Subjects</Badge>
                          )}
                          {student.subjects && student.subjects.length > 3 && (
                            <Badge bg="secondary">+{student.subjects.length - 3} more</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                        {student.phone}
                      </td>
                      <td>
                        <Badge bg={student.status === 'active' ? 'success' : 'secondary'}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleShowModal('view', student)}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowModal('edit', student)}
                            title="Edit Student"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                            title="Delete Student"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faUserGraduate} className="fa-3x text-muted mb-3" />
                  <h5 className="text-muted">No students found</h5>
                  <p className="text-muted">Try adjusting your search criteria or add new students.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Student Modal */}
      <StudentModal
        show={showModal}
        mode={modalMode}
        student={selectedStudent}
        onHide={handleCloseModal}
        onSave={handleSaveStudent}
      />
    
        </Container>
      </div>
    </div>
  </div>
  );
};

// Student Modal Component
const StudentModal = ({ show, mode, student, onHide, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    classes: [],
    subjects: [],
    dateOfBirth: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    status: 'active',
    bloodGroup: '',
    emergencyContact: '',
    admissionNumber: '',
    idNumber: '',
    gender: '',
    county: '',
    country: '',
    postalAddress: '',
    canGraduate: false
  });

  useEffect(() => {
    if (student && (mode === 'edit' || mode === 'view')) {
      setFormData({
        ...student,
        classes: student.classes || [],
        subjects: student.subjects || []
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        classes: [],
        subjects: [],
        dateOfBirth: '',
        address: '',
        guardianName: '',
        guardianPhone: '',
        status: 'active',
        bloodGroup: '',
        emergencyContact: '',
        admissionNumber: '',
        idNumber: '',
        gender: '',
        county: '',
        country: '',
        postalAddress: '',
        canGraduate: false
      });
    }
  }, [student, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClassSelection = (className) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  const handleSubjectSelection = (subjectName) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectName)
        ? prev.subjects.filter(s => s !== subjectName)
        : [...prev.subjects, subjectName]
    }));
  };

  const isReadOnly = mode === 'view';

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
          {mode === 'add' ? 'Add New Student' : 
           mode === 'edit' ? 'Edit Student' : 'Student Details'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            {/* Class Assignment Section */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assign Classes</Form.Label>
                <div 
                  style={{ 
                    border: '1px solid #ced4da', 
                    borderRadius: '0.375rem', 
                    padding: '10px', 
                    maxHeight: '200px', 
                    overflowY: 'auto' 
                  }}
                >
                  {availableClasses.map((className, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`class-${index}`}
                      label={className}
                      checked={formData.classes.includes(className)}
                      onChange={() => handleClassSelection(className)}
                      disabled={isReadOnly}
                      className="mb-2"
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assign Subjects</Form.Label>
                <div 
                  style={{ 
                    border: '1px solid #ced4da', 
                    borderRadius: '0.375rem', 
                    padding: '10px', 
                    maxHeight: '200px', 
                    overflowY: 'auto' 
                  }}
                >
                  {availableSubjects.map((subjectName, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={`subject-${index}`}
                      label={subjectName}
                      checked={formData.subjects.includes(subjectName)}
                      onChange={() => handleSubjectSelection(subjectName)}
                      disabled={isReadOnly}
                      className="mb-2"
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Guardian Name</Form.Label>
                <Form.Control
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Guardian Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Blood Group</Form.Label>
                <Form.Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={isReadOnly}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Admission Number</Form.Label>
                <Form.Control
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  placeholder="e.g., STU-2025-001"
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>ID/Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter ID or passport number"
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isReadOnly}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>County</Form.Label>
                <Form.Control
                  type="text"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  placeholder="e.g., Nairobi, Mombasa"
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., KENYAN"
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Can Graduate</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="canGraduate"
                  checked={formData.canGraduate}
                  onChange={(e) => setFormData({...formData, canGraduate: e.target.checked})}
                  label="Student eligible for graduation"
                  disabled={isReadOnly}
                  className="mt-2"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Postal Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  placeholder="Enter full postal address"
                  readOnly={isReadOnly}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isReadOnly}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button variant="primary" type="submit">
              {mode === 'add' ? 'Add Student' : 'Save Changes'}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentsManagement;
