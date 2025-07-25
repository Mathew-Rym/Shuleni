import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Badge, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faUsers, faGraduationCap, faBook, 
  faEye, faEdit, faUserPlus, faDownload, faTags
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents } from '../Store/slices/usersSlice';
import { fetchClasses, fetchSubjects, fetchClassSubjects } from '../Store/slices/classSubjectSlice';

const StudentSearch = ({ userRole = 'admin' }) => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.users);
  const { classes, subjects, classSubjects } = useSelector((state) => state.classSubject);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchClassSubjects());
  }, [dispatch]);

  const gradeLevels = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Form 1', 'Form 2', 'Form 3', 'Form 4'
  ];

  const statusOptions = ['Active', 'Inactive', 'Graduated', 'Transferred'];

  // Get student's classes
  const getStudentClasses = (studentId) => {
    return classes.filter(classItem => 
      classItem.students && classItem.students.includes(studentId)
    );
  };

  // Get student's subjects through their classes
  const getStudentSubjects = (studentId) => {
    const studentClasses = getStudentClasses(studentId);
    const subjectIds = new Set();
    
    studentClasses.forEach(classItem => {
      const classSubjectRelations = classSubjects.filter(cs => cs.classId === classItem.id);
      classSubjectRelations.forEach(cs => subjectIds.add(cs.subjectId));
    });
    
    return subjects.filter(subject => subjectIds.has(subject.id));
  };

  // Get student's teachers through class-subject relationships
  const getStudentTeachers = (studentId) => {
    const studentClasses = getStudentClasses(studentId);
    const teacherIds = new Set();
    
    studentClasses.forEach(classItem => {
      if (classItem.teacherId) {
        teacherIds.add(classItem.teacherId);
      }
      
      // Also get subject teachers
      const classSubjectRelations = classSubjects.filter(cs => cs.classId === classItem.id);
      classSubjectRelations.forEach(cs => {
        if (cs.teacherId) {
          teacherIds.add(cs.teacherId);
        }
      });
    });
    
    return Array.from(teacherIds);
  };

  // Filter students based on search criteria
  const filteredStudents = students.filter(student => {
    // Text search
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.admissionNo && student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));

    // Class filter
    const studentClasses = getStudentClasses(student.id);
    const matchesClass = !selectedClass || 
      studentClasses.some(classItem => classItem.id === parseInt(selectedClass));

    // Subject filter (tag-based)
    const studentSubjects = getStudentSubjects(student.id);
    const matchesSubject = !selectedSubject || 
      studentSubjects.some(subject => subject.id === parseInt(selectedSubject));

    // Grade level filter
    const matchesLevel = !selectedLevel || 
      studentClasses.some(classItem => classItem.level === selectedLevel);

    // Status filter
    const matchesStatus = !selectedStatus || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesSubject && matchesLevel && matchesStatus;
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleExportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Admission No,Email,Grade Level,Classes,Subjects,Status\n" +
      filteredStudents.map(student => {
        const studentClasses = getStudentClasses(student.id);
        const studentSubjects = getStudentSubjects(student.id);
        return [
          student.name,
          student.admissionNo || '',
          student.email,
          studentClasses.map(c => c.level).join('; '),
          studentClasses.map(c => c.name).join('; '),
          studentSubjects.map(s => s.name).join('; '),
          student.status || 'Active'
        ].join(',');
      }).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_search_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedLevel('');
    setSelectedStatus('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedClass) count++;
    if (selectedSubject) count++;
    if (selectedLevel) count++;
    if (selectedStatus) count++;
    return count;
  };

  return (
    <div>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Student Search & Filter
            </h5>
            <div className="d-flex gap-2">
              <Button 
                size="sm" 
                variant="light" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Filters {getActiveFiltersCount() > 0 && (
                  <Badge bg="danger" className="ms-1">{getActiveFiltersCount()}</Badge>
                )}
              </Button>
              {filteredStudents.length > 0 && (
                <Button 
                  size="sm" 
                  variant="light" 
                  onClick={handleExportResults}
                >
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </Card.Header>
        
        <Card.Body>
          {/* Main Search */}
          <Row className="mb-3">
            <Col>
              <div className="position-relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
                />
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                  size="lg"
                />
              </div>
            </Col>
          </Row>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-3 border-light">
              <Card.Body className="bg-light">
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">
                        <FontAwesomeIcon icon={faGraduationCap} className="me-1" />
                        Class
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {classes.map(classItem => (
                          <option key={classItem.id} value={classItem.id}>
                            {classItem.name} ({classItem.level})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">
                        <FontAwesomeIcon icon={faBook} className="me-1" />
                        Subject
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="">All Subjects</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">
                        <FontAwesomeIcon icon={faTags} className="me-1" />
                        Grade Level
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                      >
                        <option value="">All Levels</option>
                        {gradeLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Status</Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">All Status</option>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button size="sm" variant="outline-secondary" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Results Summary */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Alert variant="info" className="mb-0 py-2">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Found <strong>{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? 's' : ''}
              {getActiveFiltersCount() > 0 && (
                <span className="ms-1">
                  matching your search criteria
                </span>
              )}
            </Alert>
          </div>

          {/* Results Table */}
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Admission No</th>
                <th>Classes (Tags)</th>
                <th>Subjects (Tags)</th>
                <th>Grade Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const studentClasses = getStudentClasses(student.id);
                const studentSubjects = getStudentSubjects(student.id);
                
                return (
                  <tr key={student.id}>
                    <td>
                      <div>
                        <div className="fw-bold">{student.name}</div>
                        <small className="text-muted">{student.email}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="dark">{student.admissionNo || 'N/A'}</Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {studentClasses.map((classItem, index) => (
                          <Badge 
                            key={index} 
                            bg="primary" 
                            className="small cursor-pointer"
                            title={`Click to filter by ${classItem.name}`}
                            onClick={() => setSelectedClass(classItem.id.toString())}
                          >
                            {classItem.name}
                          </Badge>
                        ))}
                        {studentClasses.length === 0 && (
                          <span className="text-muted small">No classes</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {studentSubjects.slice(0, 3).map((subject, index) => (
                          <Badge 
                            key={index} 
                            bg="success" 
                            className="small cursor-pointer"
                            title={`Click to filter by ${subject.name}`}
                            onClick={() => setSelectedSubject(subject.id.toString())}
                          >
                            {subject.code}
                          </Badge>
                        ))}
                        {studentSubjects.length > 3 && (
                          <Badge bg="success" className="small">
                            +{studentSubjects.length - 3}
                          </Badge>
                        )}
                        {studentSubjects.length === 0 && (
                          <span className="text-muted small">No subjects</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {studentClasses.length > 0 ? (
                        <Badge bg="info">
                          {studentClasses[0].level}
                        </Badge>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={
                        student.status === 'Active' ? 'success' : 
                        student.status === 'Inactive' ? 'warning' : 
                        'secondary'
                      }>
                        {student.status || 'Active'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => handleViewStudent(student)}
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        {(userRole === 'admin' || userRole === 'teacher') && (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            title="Edit Student"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faUsers} size="3x" className="text-muted mb-3" />
              <h5 className="text-muted">No Students Found</h5>
              <p className="text-muted">
                Try adjusting your search criteria or clearing filters to see more results.
              </p>
              {getActiveFiltersCount() > 0 && (
                <Button variant="outline-primary" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Student Details Modal */}
      <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Personal Information</h6>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Name:</td>
                        <td>{selectedStudent.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Email:</td>
                        <td>{selectedStudent.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Admission No:</td>
                        <td>{selectedStudent.admissionNo || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>
                          <Badge bg={
                            selectedStudent.status === 'Active' ? 'success' : 
                            selectedStudent.status === 'Inactive' ? 'warning' : 
                            'secondary'
                          }>
                            {selectedStudent.status || 'Active'}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h6>Academic Information</h6>
                  <div className="mb-3">
                    <strong>Classes:</strong>
                    <div className="mt-1">
                      {getStudentClasses(selectedStudent.id).map((classItem, index) => (
                        <Badge key={index} bg="primary" className="me-1 mb-1">
                          {classItem.name} ({classItem.level})
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Subjects:</strong>
                    <div className="mt-1">
                      {getStudentSubjects(selectedStudent.id).map((subject, index) => (
                        <Badge key={index} bg="success" className="me-1 mb-1">
                          {subject.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStudentModal(false)}>
            Close
          </Button>
          {(userRole === 'admin' || userRole === 'teacher') && (
            <Button variant="primary">
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit Student
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentSearch;
