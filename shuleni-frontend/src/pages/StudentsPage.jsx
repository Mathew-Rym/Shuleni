import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Modal, Alert, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faEdit, faTrash, faEnvelope, faPhone, 
  faUserGraduate, faFileAlt, faCalendarAlt, faInfoCircle, 
  faFilter, faSort, faDownload, faEye, faChevronRight, faSave,
  faExclamationTriangle, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const StudentsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      class: '12th Grade',
      admissionId: 'STU-2025-001',
      avatar: 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=JS',
      status: 'active',
      attendance: '95%',
      subjects: ['Mathematics', 'Physics', 'English', 'History'],
      parentName: 'David Smith',
      parentContact: '+1-234-567-8901',
      joinDate: '2023-09-01',
    },
    {
      id: 2,
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      class: '11th Grade',
      admissionId: 'STU-2025-002',
      avatar: 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=EJ',
      status: 'active',
      attendance: '92%',
      subjects: ['Biology', 'Chemistry', 'Literature', 'Art'],
      parentName: 'Sarah Johnson',
      parentContact: '+1-234-567-8902',
      joinDate: '2023-09-05',
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      class: '10th Grade',
      admissionId: 'STU-2025-003',
      avatar: 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=MC',
      status: 'inactive',
      attendance: '78%',
      subjects: ['Computer Science', 'Mathematics', 'Physics', 'Economics'],
      parentName: 'Wei Chen',
      parentContact: '+1-234-567-8903',
      joinDate: '2023-09-10',
    },
    {
      id: 4,
      name: 'Sophia Patel',
      email: 'sophia.p@example.com',
      class: '12th Grade',
      admissionId: 'STU-2025-004',
      avatar: 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=SP',
      status: 'active',
      attendance: '97%',
      subjects: ['Economics', 'Politics', 'History', 'Geography'],
      parentName: 'Raj Patel',
      parentContact: '+1-234-567-8904',
      joinDate: '2023-08-15',
    },
    {
      id: 5,
      name: 'Mohammed Ali',
      email: 'mohammed.a@example.com',
      class: '10th Grade',
      admissionId: 'STU-2025-005',
      avatar: 'https://via.placeholder.com/150/FFFFFF/4A90E2?text=MA',
      status: 'active',
      attendance: '89%',
      subjects: ['Arabic', 'Mathematics', 'Science', 'Physical Education'],
      parentName: 'Fatima Ali',
      parentContact: '+1-234-567-8905',
      joinDate: '2023-09-02',
    },
  ];

  // Load student data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter students based on search term
  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      // Filter out the deleted student
      const updatedStudents = students.filter(student => student.id !== id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStudent(null);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    // In a real app, this would save to backend
    // For now, just update the UI
    if (currentStudent) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === currentStudent.id ? currentStudent : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } else {
      // Add new student
      const newStudent = {
        id: students.length + 1,
        name: e.target.name.value,
        email: e.target.email.value,
        class: e.target.class.value,
        admissionId: `STU-2025-00${students.length + 1}`,
        avatar: `https://via.placeholder.com/150/FFFFFF/4A90E2?text=${e.target.name.value.substring(0, 2).toUpperCase()}`,
        status: 'active',
        attendance: '0%',
        subjects: [],
        parentName: e.target.parentName.value,
        parentContact: e.target.parentContact.value,
        joinDate: new Date().toISOString().split('T')[0],
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    }
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({
      ...currentStudent,
      [name]: value
    });
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      
      <div className="flex-grow-1">
        <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} showSidebarToggle={true} />
        
        <Container fluid className="py-4">
          <Row className="mb-4 align-items-center">
            <Col>
              <h1 className="mb-0 fw-bold">
                <FontAwesomeIcon icon={faUserGraduate} className="me-2 text-primary" /> Students
              </h1>
              <p className="text-muted">Manage all your students in one place</p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                onClick={() => {
                  setCurrentStudent(null);
                  setShowModal(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Student
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm">
            <Card.Body>
              <Row className="mb-3">
                <Col md={6} className="mb-2 mb-md-0">
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="position-absolute text-muted" 
                      style={{ top: '11px', left: '10px' }} 
                    />
                    <Form.Control
                      type="search"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="ps-4"
                    />
                  </div>
                </Col>
                <Col md={6} className="d-flex justify-content-md-end">
                  <Button variant="outline-secondary">
                    <FontAwesomeIcon icon={faFilter} className="me-2" /> Filter
                  </Button>
                </Col>
              </Row>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading students...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Class</th>
                          <th>ID</th>
                          <th>Status</th>
                          <th>Attendance</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(student => (
                            <tr key={student.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={student.avatar}
                                    alt={student.name}
                                    width="40"
                                    height="40"
                                    className="rounded-circle me-3"
                                  />
                                  <div>
                                    <div className="fw-bold">{student.name}</div>
                                    <div className="small text-muted">{student.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{student.class}</td>
                              <td>{student.admissionId}</td>
                              <td>
                                <Badge bg={student.status === 'active' ? 'success' : 'secondary'} pill>
                                  {student.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td>{student.attendance}</td>
                              <td className="text-end">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="me-2"
                                  onClick={() => handleEdit(student)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDelete(student.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No students found matching your search
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      Showing {filteredStudents.length} of {students.length} students
                    </div>
                    <div>
                      {/* Pagination could go here */}
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Container>

        {/* Add/Edit Student Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Form onSubmit={handleSaveStudent}>
            <Modal.Header closeButton>
              <Modal.Title>{currentStudent ? 'Edit Student' : 'Add New Student'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      required
                      defaultValue={currentStudent?.name || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      required
                      defaultValue={currentStudent?.email || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Class</Form.Label>
                    <Form.Select 
                      name="class"
                      required
                      defaultValue={currentStudent?.class || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select class</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      name="status"
                      defaultValue={currentStudent?.status || 'active'}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Parent/Guardian Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="parentName"
                      defaultValue={currentStudent?.parentName || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Parent Contact</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="parentContact"
                      defaultValue={currentStudent?.parentContact || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit">
                {currentStudent ? 'Update Student' : 'Add Student'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default StudentsPage;
