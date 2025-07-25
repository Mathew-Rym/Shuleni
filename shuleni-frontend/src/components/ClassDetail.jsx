import React, { useState } from 'react';
import { Modal, Card, Row, Col, Button, Form, Table, Badge, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateStudentGrade, updateStudentAttendance, updateStudentAssignment, addAnnouncementToClass } from '../Store/slices/classesSlice';

const ClassDetail = ({ show, onHide, classData, onNotification }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('students');
  const [editingStudent, setEditingStudent] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [gradeForm, setGradeForm] = useState({ grade: '', attendance: '', completed: '', total: '' });

  const handleStudentEdit = (student) => {
    setEditingStudent(student);
    setGradeForm({
      grade: student.grade,
      attendance: student.attendance,
      completed: student.assignments.completed,
      total: student.assignments.total
    });
  };

  const handleUpdateStudent = () => {
    if (editingStudent) {
      // Update grade
      dispatch(updateStudentGrade({
        classId: classData.id,
        studentId: editingStudent.id,
        newGrade: gradeForm.grade
      }));

      // Update attendance
      dispatch(updateStudentAttendance({
        classId: classData.id,
        studentId: editingStudent.id,
        newAttendance: parseInt(gradeForm.attendance)
      }));

      // Update assignments
      dispatch(updateStudentAssignment({
        classId: classData.id,
        studentId: editingStudent.id,
        assignmentData: {
          completed: parseInt(gradeForm.completed),
          total: parseInt(gradeForm.total)
        }
      }));

      // Show success notification
      if (onNotification) {
        onNotification('success', 'Student Updated', `${editingStudent.name}'s information has been updated successfully!`);
      }

      setEditingStudent(null);
      setGradeForm({ grade: '', attendance: '', completed: '', total: '' });
    }
  };

  const handleSendAnnouncement = () => {
    if (announcement.trim()) {
      dispatch(addAnnouncementToClass({
        classId: classData.id,
        announcement: {
          message: announcement,
          author: 'Teacher'
        }
      }));

      // Show success notification
      if (onNotification) {
        onNotification('success', 'Announcement Sent', 'Your announcement has been sent to all students in this class!');
      }

      setAnnouncement('');
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'primary';
    if (grade.includes('C')) return 'warning';
    return 'danger';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'success';
    if (attendance >= 85) return 'warning';
    return 'danger';
  };

  if (!classData) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="class-detail-modal">
      <Modal.Header closeButton style={{ backgroundColor: classData.color, color: 'white' }}>
        <Modal.Title>
          <div className="d-flex align-items-center flex-wrap">
            <div className="me-3">
              <h4 className="mb-0">{classData.name}</h4>
              <small className="opacity-75">{classData.grade} • {classData.studentsEnrolled?.length || 0} Students</small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Navigation Tabs - Enhanced Responsive */}
        <div className="border-bottom">
          <div className="d-flex flex-wrap">
            <button
              className={`btn btn-link text-decoration-none px-3 py-3 flex-grow-1 flex-sm-grow-0 ${activeTab === 'students' ? 'border-bottom border-primary text-primary' : 'text-muted'}`}
              onClick={() => setActiveTab('students')}
            >
              <i className="fas fa-users me-2 d-none d-sm-inline"></i>
              <span className="d-inline d-sm-inline">Students</span>
            </button>
            <button
              className={`btn btn-link text-decoration-none px-3 py-3 flex-grow-1 flex-sm-grow-0 ${activeTab === 'overview' ? 'border-bottom border-primary text-primary' : 'text-muted'}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-bar me-2 d-none d-sm-inline"></i>
              <span className="d-inline d-sm-inline">Overview</span>
            </button>
            <button
              className={`btn btn-link text-decoration-none px-3 py-3 flex-grow-1 flex-sm-grow-0 ${activeTab === 'announcements' ? 'border-bottom border-primary text-primary' : 'text-muted'}`}
              onClick={() => setActiveTab('announcements')}
            >
              <i className="fas fa-bullhorn me-2 d-none d-sm-inline"></i>
              <span className="d-inline d-sm-inline">Announcements</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Student Management</h5>
                <Badge bg="secondary">{classData.studentsEnrolled?.length || 0} Students Enrolled</Badge>
              </div>

              {editingStudent && (
                <Alert variant="info" className="mb-4">
                  <h6>Editing: {editingStudent.name}</h6>
                  <Row className="g-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Grade</Form.Label>
                        <Form.Select
                          value={gradeForm.grade}
                          onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                        >
                          <option value="A">A</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="B-">B-</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                          <option value="C-">C-</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Attendance (%)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="100"
                          value={gradeForm.attendance}
                          onChange={(e) => setGradeForm({...gradeForm, attendance: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Completed</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={gradeForm.completed}
                          onChange={(e) => setGradeForm({...gradeForm, completed: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Total</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={gradeForm.total}
                          onChange={(e) => setGradeForm({...gradeForm, total: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <div className="d-grid gap-2 w-100">
                        <Button variant="success" size="sm" onClick={handleUpdateStudent}>
                          Update
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => setEditingStudent(null)}>
                          Cancel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Alert>
              )}

              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Grade</th>
                      <th>Attendance</th>
                      <th>Assignments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.studentsEnrolled?.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                 style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="fw-bold">{student.name}</div>
                              <small className="text-muted">Student ID: {student.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getGradeColor(student.grade)}>{student.grade}</Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge bg={getAttendanceColor(student.attendance)} className="me-2">
                              {student.attendance}%
                            </Badge>
                            <div className="progress flex-grow-1" style={{ height: '6px' }}>
                              <div 
                                className={`progress-bar bg-${getAttendanceColor(student.attendance)}`}
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">
                            {student.assignments.completed}/{student.assignments.total}
                          </span>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div 
                              className="progress-bar bg-info"
                              style={{ width: `${(student.assignments.completed / student.assignments.total) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleStudentEdit(student)}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <Row className="g-4">
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <h3 className="text-primary">{classData.studentsEnrolled?.length || 0}</h3>
                      <p className="text-muted mb-0">Total Students</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <h3 className="text-success">
                        {classData.studentsEnrolled?.reduce((acc, s) => acc + s.attendance, 0) / (classData.studentsEnrolled?.length || 1)}%
                      </h3>
                      <p className="text-muted mb-0">Average Attendance</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <h3 className="text-info">
                        {classData.studentsEnrolled?.reduce((acc, s) => acc + s.assignments.completed, 0) || 0}
                      </h3>
                      <p className="text-muted mb-0">Total Assignments Completed</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mt-4">
                <h5>Class Information</h5>
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Schedule:</strong> {classData.schedule}</p>
                        <p><strong>Room:</strong> {classData.room}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Grade Level:</strong> {classData.grade}</p>
                        <p><strong>Subject:</strong> {classData.subject}</p>
                      </Col>
                    </Row>
                    <p><strong>Description:</strong> {classData.description}</p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div>
              <div className="mb-4">
                <h5>Send Announcement</h5>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type your announcement here..."
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                  />
                  <Button 
                    variant="primary" 
                    onClick={handleSendAnnouncement}
                    disabled={!announcement.trim()}
                  >
                    Send Announcement
                  </Button>
                </InputGroup>
              </div>

              <div>
                <h5>Recent Announcements</h5>
                {classData.announcements?.length > 0 ? (
                  classData.announcements.map((ann, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="mb-1">{ann.message}</p>
                            <small className="text-muted">By {ann.author}</small>
                          </div>
                          <small className="text-muted">
                            {new Date(ann.timestamp).toLocaleDateString()}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted">No announcements yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClassDetail;
