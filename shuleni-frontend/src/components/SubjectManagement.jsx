import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Table, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faBook, faGraduationCap, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubjects,
  fetchClasses,
  fetchClassSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  assignSubjectsToClass
} from '../Store/slices/classSubjectSlice';

const SubjectManagement = ({ userRole = 'admin' }) => {
  const dispatch = useDispatch();
  const { subjects, classes, classSubjects, loading, error } = useSelector((state) => state.classSubject);
  const { teachers } = useSelector((state) => state.users);
  
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    gradeLevels: [],
    isRequired: true,
    credits: 1
  });
  
  const [assignForm, setAssignForm] = useState({
    selectedClasses: [],
    teacherId: ''
  });

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
    dispatch(fetchClassSubjects());
  }, [dispatch]);

  const subjectCategories = [
    'Core', 'Science', 'Language', 'Mathematics', 'Social Studies', 
    'Arts', 'Physical Education', 'Technology', 'Elective'
  ];

  const gradeLevels = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Form 1', 'Form 2', 'Form 3', 'Form 4'
  ];

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      code: '',
      description: '',
      category: '',
      gradeLevels: [],
      isRequired: true,
      credits: 1
    });
    setShowSubjectModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
      category: subject.category,
      gradeLevels: subject.gradeLevels || [],
      isRequired: subject.isRequired !== false,
      credits: subject.credits || 1
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    
    const subjectData = {
      ...subjectForm,
      credits: parseInt(subjectForm.credits)
    };

    if (editingSubject) {
      dispatch(updateSubject({ ...subjectData, id: editingSubject.id }));
    } else {
      dispatch(createSubject(subjectData));
    }
    
    setShowSubjectModal(false);
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject? This will remove it from all classes.')) {
      dispatch(deleteSubject(subjectId));
    }
  };

  const handleAssignToClasses = (subject) => {
    setSelectedSubject(subject);
    
    // Get current classes for this subject
    const currentClasses = classSubjects
      .filter(cs => cs.subjectId === subject.id)
      .map(cs => cs.classId);
    
    setAssignForm({
      selectedClasses: currentClasses,
      teacherId: ''
    });
    
    setShowAssignModal(true);
  };

  const handleSaveAssignments = () => {
    if (selectedSubject && assignForm.selectedClasses.length > 0) {
      dispatch(assignSubjectsToClass({
        classIds: assignForm.selectedClasses,
        subjectIds: [selectedSubject.id],
        teacherId: assignForm.teacherId ? parseInt(assignForm.teacherId) : null
      }));
    }
    
    setShowAssignModal(false);
  };

  const handleGradeLevelChange = (level, checked) => {
    if (checked) {
      setSubjectForm(prev => ({
        ...prev,
        gradeLevels: [...prev.gradeLevels, level]
      }));
    } else {
      setSubjectForm(prev => ({
        ...prev,
        gradeLevels: prev.gradeLevels.filter(l => l !== level)
      }));
    }
  };

  const getSubjectClasses = (subjectId) => {
    return classSubjects
      .filter(cs => cs.subjectId === subjectId)
      .map(cs => {
        const classItem = classes.find(c => c.id === cs.classId);
        return classItem ? classItem.name : 'Unknown Class';
      });
  };

  const getSubjectTeachers = (subjectId) => {
    const uniqueTeacherIds = [...new Set(
      classSubjects
        .filter(cs => cs.subjectId === subjectId && cs.teacherId)
        .map(cs => cs.teacherId)
    )];
    
    return uniqueTeacherIds.map(teacherId => {
      const teacher = teachers.find(t => t.id === teacherId);
      return teacher ? teacher.name : 'Unknown Teacher';
    });
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || subject.category === filterCategory;
    const matchesLevel = !filterLevel || (subject.gradeLevels && subject.gradeLevels.includes(filterLevel));
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const canEdit = userRole === 'admin' || userRole === 'teacher';

  return (
    <div>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faBook} className="me-2" />
              Subject Management
            </h5>
            {canEdit && (
              <Button size="sm" variant="light" onClick={handleCreateSubject}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Subject
              </Button>
            )}
          </div>
        </Card.Header>
        
        <Card.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={4}>
              <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {subjectCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
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

          {/* Subjects Table */}
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Category</th>
                <th>Grade Levels</th>
                <th>Classes</th>
                <th>Teachers</th>
                <th>Credits</th>
                <th>Type</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="fw-bold">{subject.name}</td>
                  <td>
                    <Badge bg="dark">{subject.code}</Badge>
                  </td>
                  <td>
                    <Badge bg="info">{subject.category}</Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {subject.gradeLevels?.slice(0, 3).map((level, index) => (
                        <Badge key={index} bg="secondary" className="small">
                          {level}
                        </Badge>
                      ))}
                      {subject.gradeLevels?.length > 3 && (
                        <Badge bg="secondary" className="small">
                          +{subject.gradeLevels.length - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {getSubjectClasses(subject.id).slice(0, 2).map((className, index) => (
                        <Badge key={index} bg="primary" className="small">
                          {className}
                        </Badge>
                      ))}
                      {getSubjectClasses(subject.id).length > 2 && (
                        <Badge bg="primary" className="small">
                          +{getSubjectClasses(subject.id).length - 2}
                        </Badge>
                      )}
                      {getSubjectClasses(subject.id).length === 0 && (
                        <span className="text-muted small">Not assigned</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {getSubjectTeachers(subject.id).slice(0, 2).map((teacherName, index) => (
                        <Badge key={index} bg="success" className="small">
                          {teacherName}
                        </Badge>
                      ))}
                      {getSubjectTeachers(subject.id).length > 2 && (
                        <Badge bg="success" className="small">
                          +{getSubjectTeachers(subject.id).length - 2}
                        </Badge>
                      )}
                      {getSubjectTeachers(subject.id).length === 0 && (
                        <span className="text-muted small">No teacher</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge bg="warning" text="dark">{subject.credits || 1}</Badge>
                  </td>
                  <td>
                    <Badge bg={subject.isRequired !== false ? 'danger' : 'secondary'}>
                      {subject.isRequired !== false ? 'Required' : 'Elective'}
                    </Badge>
                  </td>
                  {canEdit && (
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEditSubject(subject)}
                          title="Edit Subject"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleAssignToClasses(subject)}
                          title="Assign to Classes"
                        >
                          <FontAwesomeIcon icon={faGraduationCap} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteSubject(subject.id)}
                          title="Delete Subject"
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

          {filteredSubjects.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No subjects found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Subject Modal */}
      <Modal show={showSubjectModal} onHide={() => setShowSubjectModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveSubject}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                    placeholder="e.g., Mathematics, English Language"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value.toUpperCase()})}
                    placeholder="e.g., MATH, ENG"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={subjectForm.category}
                    onChange={(e) => setSubjectForm({...subjectForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {subjectCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Credits</Form.Label>
                  <Form.Control
                    type="number"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={subjectForm.isRequired}
                    onChange={(e) => setSubjectForm({...subjectForm, isRequired: e.target.value === 'true'})}
                  >
                    <option value={true}>Required</option>
                    <option value={false}>Elective</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                placeholder="Brief description of the subject..."
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Grade Levels *</Form.Label>
              <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <Row>
                  {gradeLevels.map(level => (
                    <Col md={3} key={level}>
                      <Form.Check
                        type="checkbox"
                        id={`grade-${level}`}
                        label={level}
                        checked={subjectForm.gradeLevels.includes(level)}
                        onChange={(e) => handleGradeLevelChange(level, e.target.checked)}
                        className="mb-2"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
              <Form.Text className="text-muted">
                Select the grade levels where this subject will be taught.
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowSubjectModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Assign to Classes Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Assign {selectedSubject?.name} to Classes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <h6>Select Classes</h6>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded p-3">
                {classes
                  .filter(classItem => selectedSubject?.gradeLevels?.includes(classItem.level))
                  .map(classItem => (
                    <Form.Check
                      key={classItem.id}
                      type="checkbox"
                      id={`class-${classItem.id}`}
                      label={`${classItem.name} (${classItem.level})`}
                      checked={assignForm.selectedClasses.includes(classItem.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignForm(prev => ({
                            ...prev,
                            selectedClasses: [...prev.selectedClasses, classItem.id]
                          }));
                        } else {
                          setAssignForm(prev => ({
                            ...prev,
                            selectedClasses: prev.selectedClasses.filter(id => id !== classItem.id)
                          }));
                        }
                      }}
                      className="mb-2"
                    />
                  ))}
              </div>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Assign Teacher (Optional)</Form.Label>
                <Form.Select
                  value={assignForm.teacherId}
                  onChange={(e) => setAssignForm(prev => ({...prev, teacherId: e.target.value}))}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  The teacher will be assigned to teach this subject in all selected classes.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveAssignments}>
              Assign to Classes
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
