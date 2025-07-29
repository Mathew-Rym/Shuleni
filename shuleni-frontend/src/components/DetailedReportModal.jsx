import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Modal, Table, 
  Badge, Alert, Nav, Tab, ProgressBar 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faCalendarAlt, faUsers, faBookOpen, faClipboardList,
  faCheckCircle, faTimesCircle, faSync, faClock, faDownload,
  faGraduationCap, faChalkboardTeacher, faSchool, faPercentage
} from '@fortawesome/free-solid-svg-icons';
import { useRealTime, useRoleBasedData } from '../contexts/RealTimeContext';

// Chart.js components with proper imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const DetailedReportModal = ({ show, onHide, userRole }) => {
  const { state, detailedReport, lastUpdated } = useRealTime();
  const roleBasedData = useRoleBasedData();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month'); // day, week, month

  // Real-time data based on time range
  const getTimeRangeData = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (timeRange) {
      case 'day':
        return {
          exams: detailedReport.examsThisMonth.filter(exam => 
            new Date(exam.conductedAt) >= today
          ),
          resources: detailedReport.resourcesUploaded.filter(resource => 
            new Date(resource.uploadedAt) >= today
          ),
          classes: detailedReport.activeClassesToday,
          attendance: roleBasedData.attendance.daily
        };
      case 'week':
        return {
          exams: detailedReport.examsThisMonth.filter(exam => 
            new Date(exam.conductedAt) >= thisWeek
          ),
          resources: detailedReport.resourcesUploaded.filter(resource => 
            new Date(resource.uploadedAt) >= thisWeek
          ),
          classes: detailedReport.activeClassesWeek,
          attendance: roleBasedData.attendance.weekly
        };
      case 'month':
      default:
        return {
          exams: detailedReport.examsThisMonth,
          resources: detailedReport.resourcesUploaded,
          classes: detailedReport.activeClassesMonth,
          attendance: roleBasedData.attendance.monthly
        };
    }
  };

  const timeRangeData = getTimeRangeData();

  // Chart data for attendance
  const attendanceChartData = {
    labels: timeRangeData.attendance.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ).slice(-10), // Last 10 days
    datasets: [
      {
        label: 'Present',
        data: timeRangeData.attendance.map(item => item.present).slice(-10),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Absent',
        data: timeRangeData.attendance.map(item => item.absent).slice(-10),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Chart data for exams by subject
  const examsBySubject = timeRangeData.exams.reduce((acc, exam) => {
    acc[exam.subject] = (acc[exam.subject] || 0) + 1;
    return acc;
  }, {});

  const examsChartData = {
    labels: Object.keys(examsBySubject),
    datasets: [
      {
        label: 'Exams Conducted',
        data: Object.values(examsBySubject),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ]
      }
    ]
  };

  // Chart data for resources by type
  const resourcesByType = timeRangeData.resources.reduce((acc, resource) => {
    const type = resource.resourceType || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const resourcesChartData = {
    labels: Object.keys(resourcesByType).map(type => 
      type.replace('_', ' ').toUpperCase()
    ),
    datasets: [
      {
        data: Object.values(resourcesByType),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  // Calculate statistics
  const stats = {
    totalExams: timeRangeData.exams.length,
    totalResources: timeRangeData.resources.length,
    totalClasses: timeRangeData.classes.length,
    averageAttendance: timeRangeData.attendance.length > 0 
      ? Math.round(
          timeRangeData.attendance.reduce((sum, item) => 
            sum + (item.present / item.totalStudents * 100), 0
          ) / timeRangeData.attendance.length
        )
      : 0,
    completedExams: timeRangeData.exams.filter(exam => exam.completed === exam.totalStudents).length,
    averageExamScore: timeRangeData.exams.length > 0
      ? Math.round(
          timeRangeData.exams.reduce((sum, exam) => sum + exam.averageScore, 0) / timeRangeData.exams.length
        )
      : 0
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faChartLine} className="me-2" />
          Real-time Detailed Report
          <Badge bg="success" className="ms-3">
            <FontAwesomeIcon icon={faSync} className="me-1" />
            Live Data
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* Time Range Selector */}
        <div className="p-3 bg-light border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">Time Range:</h6>
              <Nav variant="pills" className="mt-2">
                <Nav.Item>
                  <Nav.Link 
                    active={timeRange === 'day'} 
                    onClick={() => setTimeRange('day')}
                  >
                    Today
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={timeRange === 'week'} 
                    onClick={() => setTimeRange('week')}
                  >
                    This Week
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={timeRange === 'month'} 
                    onClick={() => setTimeRange('month')}
                  >
                    This Month
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <div className="text-end">
              <small className="text-muted">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                Last Updated: {lastUpdated.toLocaleTimeString()}
              </small>
            </div>
          </div>
        </div>

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="px-3">
            <Nav.Item>
              <Nav.Link eventKey="overview">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="attendance">Attendance</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="exams">Exams</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="resources">Resources</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="classes">Active Classes</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="p-4">
            {/* Overview Tab */}
            <Tab.Pane eventKey="overview">
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center h-100 border-primary">
                    <Card.Body>
                      <FontAwesomeIcon icon={faClipboardList} size="2x" className="text-primary mb-2" />
                      <h4 className="text-primary">{stats.totalExams}</h4>
                      <p className="mb-0">Exams Conducted</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center h-100 border-success">
                    <Card.Body>
                      <FontAwesomeIcon icon={faBookOpen} size="2x" className="text-success mb-2" />
                      <h4 className="text-success">{stats.totalResources}</h4>
                      <p className="mb-0">Resources Uploaded</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center h-100 border-warning">
                    <Card.Body>
                      <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" className="text-warning mb-2" />
                      <h4 className="text-warning">{stats.totalClasses}</h4>
                      <p className="mb-0">Active Classes</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center h-100 border-info">
                    <Card.Body>
                      <FontAwesomeIcon icon={faPercentage} size="2x" className="text-info mb-2" />
                      <h4 className="text-info">{stats.averageAttendance}%</h4>
                      <p className="mb-0">Average Attendance</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Attendance Trend</h6>
                    </Card.Header>
                    <Card.Body>
                      <Line data={attendanceChartData} options={{
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Quick Stats</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Completed Exams:</span>
                          <Badge bg="success">{stats.completedExams}/{stats.totalExams}</Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Avg. Exam Score:</span>
                          <Badge bg="primary">{stats.averageExamScore}%</Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span>Attendance Rate:</span>
                        <ProgressBar 
                          now={stats.averageAttendance} 
                          label={`${stats.averageAttendance}%`}
                          variant={stats.averageAttendance > 80 ? 'success' : stats.averageAttendance > 60 ? 'warning' : 'danger'}
                          className="mt-1"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Attendance Tab */}
            <Tab.Pane eventKey="attendance">
              <Row>
                <Col md={8}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Daily Attendance Tracking</h6>
                    </Card.Header>
                    <Card.Body>
                      <Line data={attendanceChartData} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Attendance Summary</h6>
                    </Card.Header>
                    <Card.Body>
                      <Table size="sm" striped>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Present</th>
                            <th>Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timeRangeData.attendance.slice(-7).map((item, index) => (
                            <tr key={index}>
                              <td>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                              <td>{item.present}/{item.totalStudents}</td>
                              <td>
                                <Badge bg={
                                  (item.present / item.totalStudents * 100) > 80 ? 'success' : 
                                  (item.present / item.totalStudents * 100) > 60 ? 'warning' : 'danger'
                                }>
                                  {Math.round(item.present / item.totalStudents * 100)}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Exams Tab */}
            <Tab.Pane eventKey="exams">
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Exams by Subject</h6>
                    </Card.Header>
                    <Card.Body>
                      <Bar data={examsChartData} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Recent Exams</h6>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {timeRangeData.exams.length === 0 ? (
                        <Alert variant="info">No exams conducted in this period</Alert>
                      ) : (
                        <Table size="sm" striped>
                          <thead>
                            <tr>
                              <th>Exam</th>
                              <th>Class</th>
                              <th>Date</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeRangeData.exams.map((exam, index) => (
                              <tr key={index}>
                                <td>{exam.title}</td>
                                <td>{exam.class}</td>
                                <td>{new Date(exam.conductedAt).toLocaleDateString()}</td>
                                <td>
                                  <Badge bg={exam.averageScore > 75 ? 'success' : exam.averageScore > 60 ? 'warning' : 'danger'}>
                                    {exam.averageScore}%
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Resources Tab */}
            <Tab.Pane eventKey="resources">
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Resources by Type</h6>
                    </Card.Header>
                    <Card.Body>
                      <Doughnut data={resourcesChartData} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Recently Uploaded Resources</h6>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {timeRangeData.resources.length === 0 ? (
                        <Alert variant="info">No resources uploaded in this period</Alert>
                      ) : (
                        <Table size="sm" striped>
                          <thead>
                            <tr>
                              <th>Resource</th>
                              <th>Subject</th>
                              <th>Uploaded</th>
                              <th>Downloads</th>
                            </tr>
                          </thead>
                          <tbody>
                            {timeRangeData.resources.map((resource, index) => (
                              <tr key={index}>
                                <td>{resource.name}</td>
                                <td>{resource.subject}</td>
                                <td>{new Date(resource.uploadedAt).toLocaleDateString()}</td>
                                <td>
                                  <Badge bg="primary">
                                    <FontAwesomeIcon icon={faDownload} className="me-1" />
                                    {resource.downloads || 0}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Active Classes Tab */}
            <Tab.Pane eventKey="classes">
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Active Classes</h6>
                </Card.Header>
                <Card.Body>
                  {timeRangeData.classes.length === 0 ? (
                    <Alert variant="info">No active classes in this period</Alert>
                  ) : (
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Class Name</th>
                          <th>Teacher</th>
                          <th>Subject</th>
                          <th>Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeRangeData.classes.map((classItem, index) => (
                          <tr key={index}>
                            <td>{classItem.name}</td>
                            <td>{classItem.teacher}</td>
                            <td>{classItem.subject}</td>
                            <td>{classItem.time}</td>
                            <td>
                              <Badge bg="success">
                                <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                Active
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary">
          <FontAwesomeIcon icon={faDownload} className="me-2" />
          Export Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailedReportModal;
