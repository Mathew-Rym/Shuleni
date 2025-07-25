import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Table, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faChalkboardTeacher, faUsers, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClasses,
  fetchSubjects,
  fetchClassSubjects,
  createClass,
  updateClass,
  deleteClass,
  assignSubjectsToClass,
  addStudentsToClass,
  removeStudentsFromClass
} from '../Store/slices/classSubjectSlice';

const ClassManagement = ({ userRole = 'admin' }) => {
  const dispatch = useDispatch();
  const { classes, subjects, classSubjects, loading, error } = useSelector((state) => state.classSubject);
  const { students, teachers } = useSelector((state) => state.users);
  
  const [showClassModal, setShowClassModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  
  const [classForm, setClassForm] = useState({
    name: '',
    level: '',
    teacherId: '',
    classroom: '',
    schedule: '',
    maxStudents: 30
  });
  
  const [assignForm, setAssignForm] = useState({
    selectedSubjects: [],
    selectedStudents: []
  });

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchClassSubjects());
  }, [dispatch]);

  const gradeLevels = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Form 1', 'Form 2', 'Form 3', 'Form 4'
  ];

  const handleCreateClass = () => {
    setEditingClass(null);
    setClassForm({
      name: '',
      level: '',
      teacherId: '',
      classroom: '',
      schedule: '',
      maxStudents: 30
    });
    setShowClassModal(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setClassForm({
      name: classItem.name,
      level: classItem.level,
      teacherId: classItem.teacherId || '',
      classroom: classItem.classroom || '',
      schedule: classItem.schedule || '',
      maxStudents: classItem.maxStudents || 30
    });
    setShowClassModal(true);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === parseInt(classForm.teacherId));
    
    const classData = {
      ...classForm,
      teacherName: teacher ? teacher.name : '',
      teacherId: classForm.teacherId ? parseInt(classForm.teacherId) : null
    };

    if (editingClass) {
      dispatch(updateClass({ ...classData, id: editingClass.id }));
    } else {
      dispatch(createClass(classData));
    }
    
    setShowClassModal(false);
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class? This will remove all associated subjects and students.')) {
      dispatch(deleteClass(classId));
    }
  };

  const handleAssignSubjectsAndStudents = (classItem) => {
    setSelectedClass(classItem);
    
    // Get current subjects for this class
    const currentSubjects = classSubjects
      .filter(cs => cs.classId === classItem.id)
      .map(cs => cs.subjectId);
    
    setAssignForm({
      selectedSubjects: currentSubjects,
      selectedStudents: classItem.students || []
    });
    
    setShowAssignModal(true);
  };

  const handleSaveAssignments = () => {
    if (selectedClass) {
      // Assign subjects to class
      dispatch(assignSubjectsToClass({
        classId: selectedClass.id,
        subjectIds: assignForm.selectedSubjects,
        teacherId: selectedClass.teacherId
      }));
      
      // Update students in class
      dispatch(addStudentsToClass({
        classId: selectedClass.id,
        studentIds: assignForm.selectedStudents
      }));
    }
    
    setShowAssignModal(false);
  };

  const getClassSubjects = (classId) => {
    return classSubjects
      .filter(cs => cs.classId === classId)
      .map(cs => {
        const subject = subjects.find(s => s.id === cs.subjectId);
        return subject ? subject.name : 'Unknown Subject';
      });
  };

  const getClassStudents = (classItem) => {
    if (!classItem.students) return [];
    return students.filter(s => classItem.students.includes(s.id));
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (classItem.teacherName && classItem.teacherName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = !filterLevel || classItem.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const canEdit = userRole === 'admin' || userRole === 'teacher';

  return (
    <div>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
              Class Management
            </h5>
            {canEdit && (
              <Button size="sm" variant="light" onClick={handleCreateClass}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Class
              </Button>
            )}
          </div>
        </Card.Header>
        
        <Card.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={6}>
              <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search classes or teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={6}>
              <Form.Select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All Grade Levels</option>
                {gradeLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Classes Table */}
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Class Name</th>
                <th>Level</th>
                <th>Teacher</th>
                <th>Subjects</th>
                <th>Students</th>
                <th>Classroom</th>
                <th>Status</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classItem) => (
                <tr key={classItem.id}>
                  <td className="fw-bold">{classItem.name}</td>
                  <td>
                    <Badge bg="info">{classItem.level}</Badge>
                  </td>
                  <td>
                    {classItem.teacherName ? (
                      <span className="text-success">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="me-1" />
                        {classItem.teacherName}
                      </span>
                    ) : (
                      <span className="text-muted">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {getClassSubjects(classItem.id).map((subject, index) => (
                        <Badge key={index} bg="secondary" className="small">
                          {subject}
                        </Badge>
                      ))}
                      {getClassSubjects(classItem.id).length === 0 && (
                        <span className="text-muted small">No subjects</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge bg="primary">
                      <FontAwesomeIcon icon={faUsers} className="me-1" />
                      {classItem.studentsCount || 0}
                    </Badge>
                  </td>
                  <td>{classItem.classroom || 'TBA'}</td>
                  <td>
                    <Badge bg={classItem.status === 'active' ? 'success' : 'secondary'}>
                      {classItem.status}
                    </Badge>
                  </td>
                  {canEdit && (
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEditClass(classItem)}
                          title="Edit Class"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleAssignSubjectsAndStudents(classItem)}
                          title="Assign Subjects & Students"
                        >
                          <FontAwesomeIcon icon={faUsers} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteClass(classItem.id)}
                          title="Delete Class"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredClasses.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No classes found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Class Modal */}
      <Modal show={showClassModal} onHide={() => setShowClassModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingClass ? 'Edit Class' : 'Create New Class'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveClass}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={classForm.name}
                    onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                    placeholder="e.g., Grade 6A, Form 1B"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Grade Level *</Form.Label>
                  <Form.Select
                    value={classForm.level}
                    onChange={(e) => setClassForm({...classForm, level: e.target.value})}
                    required
                  >
                    <option value="">Select Grade Level</option>
                    {gradeLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class Teacher</Form.Label>
                  <Form.Select
                    value={classForm.teacherId}
                    onChange={(e) => setClassForm({...classForm, teacherId: e.target.value})}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Classroom</Form.Label>
                  <Form.Control
                    type="text"
                    value={classForm.classroom}
                    onChange={(e) => setClassForm({...classForm, classroom: e.target.value})}
                    placeholder="e.g., Room 101"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Schedule</Form.Label>
                  <Form.Control
                    type="text"
                    value={classForm.schedule}
                    onChange={(e) => setClassForm({...classForm, schedule: e.target.value})}
                    placeholder="e.g., Mon-Fri 8:00 AM - 2:00 PM"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Students</Form.Label>
                  <Form.Control
                    type="number"
                    value={classForm.maxStudents}
                    onChange={(e) => setClassForm({...classForm, maxStudents: parseInt(e.target.value)})}
                    min="1"
                    max="50"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowClassModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingClass ? 'Update Class' : 'Create Class'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Assign Subjects & Students Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Assign Subjects & Students to {selectedClass?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h6>Select Subjects</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded p-3">
                {subjects
                  .filter(subject => subject.gradeLevels.includes(selectedClass?.level))
                  .map(subject => (
                    <Form.Check
                      key={subject.id}
                      type="checkbox"
                      id={`subject-${subject.id}`}
                      label={`${subject.name} (${subject.code})`}
                      checked={assignForm.selectedSubjects.includes(subject.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignForm(prev => ({
                            ...prev,
                            selectedSubjects: [...prev.selectedSubjects, subject.id]
                          }));
                        } else {
                          setAssignForm(prev => ({
                            ...prev,
                            selectedSubjects: prev.selectedSubjects.filter(id => id !== subject.id)
                          }));
                        }
                      }}
                      className="mb-2"
                    />
                  ))}
              </div>
            </Col>
            <Col md={6}>
              <h6>Select Students</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded p-3">
                {students.map(student => (
                  <Form.Check
                    key={student.id}
                    type="checkbox"
                    id={`student-${student.id}`}
                    label={`${student.name} (${student.admissionNo})`}
                    checked={assignForm.selectedStudents.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAssignForm(prev => ({
                          ...prev,
                          selectedStudents: [...prev.selectedStudents, student.id]
                        }));
                      } else {
                        setAssignForm(prev => ({
                          ...prev,
                          selectedStudents: prev.selectedStudents.filter(id => id !== student.id)
                        }));
                      }
                    }}
                    className="mb-2"
                  />
                ))}
              </div>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveAssignments}>
              Save Assignments
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClassManagement;
