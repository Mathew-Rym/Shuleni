import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, faUsers, faPercentage, faDownload,
  faCheckCircle, faTimesCircle, faSync, faFilter,
  faArrowUp, faArrowDown, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useRealTime, useRoleBasedData } from '../contexts/RealTimeContext';

const MonthlyAttendanceComponent = ({ userRole, className = '', showTitle = true }) => {
  const { attendance, lastUpdated } = useRealTime();
  const roleBasedData = useRoleBasedData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detailed'

  // Generate months for dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years for dropdown (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  // Filter attendance data based on selected month/year and user role
  const getAttendanceData = () => {
    const filteredData = roleBasedData.attendance.monthly.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
    });

    // Calculate statistics
    const totalDays = filteredData.length;
    const totalPresent = filteredData.reduce((sum, item) => sum + item.present, 0);
    const totalAbsent = filteredData.reduce((sum, item) => sum + item.absent, 0);
    const totalStudents = filteredData.length > 0 ? filteredData[0].totalStudents : 0;
    const averageAttendance = totalDays > 0 ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0;

    return {
      data: filteredData,
      stats: {
        totalDays,
        totalPresent,
        totalAbsent,
        totalStudents,
        averageAttendance,
        bestDay: filteredData.reduce((best, current) => 
          (current.present / current.totalStudents) > (best.present / best.totalStudents) ? current : best, 
          filteredData[0] || {}
        ),
        worstDay: filteredData.reduce((worst, current) => 
          (current.present / current.totalStudents) < (worst.present / worst.totalStudents) ? current : worst, 
          filteredData[0] || {}
        )
      }
    };
  };

  const attendanceData = getAttendanceData();

  // Get attendance color based on percentage
  const getAttendanceColor = (present, total) => {
    const percentage = (present / total) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'danger';
  };

  // Get role-specific title
  const getTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'School-wide Monthly Attendance';
      case 'teacher':
        return 'My Classes Monthly Attendance';
      case 'student':
        return 'My Monthly Attendance';
      default:
        return 'Monthly Attendance';
    }
  };

  return (
    <Card className={`h-100 ${className}`}>
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {showTitle && (
              <h6 className="mb-0">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                {getTitle()}
              </h6>
            )}
          </div>
          <div className="d-flex align-items-center">
            <Badge bg="success" className="me-2">
              <FontAwesomeIcon icon={faSync} className="me-1" />
              Live
            </Badge>
            <small>Updated: {lastUpdated.toLocaleTimeString()}</small>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Controls */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              size="sm"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              size="sm"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value)}
              size="sm"
            >
              <option value="summary">Summary View</option>
              <option value="detailed">Detailed View</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="outline-primary" size="sm" className="w-100">
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </Col>
        </Row>

        {/* Summary Statistics */}
        {attendanceData.data.length > 0 ? (
          <>
            <Row className="mb-4">
              <Col md={3}>
                <div className="text-center p-2 bg-light rounded">
                  <h5 className="text-primary mb-1">{attendanceData.stats.averageAttendance}%</h5>
                  <small className="text-muted">Average Attendance</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center p-2 bg-light rounded">
                  <h5 className="text-success mb-1">{attendanceData.stats.totalPresent}</h5>
                  <small className="text-muted">Total Present</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center p-2 bg-light rounded">
                  <h5 className="text-danger mb-1">{attendanceData.stats.totalAbsent}</h5>
                  <small className="text-muted">Total Absent</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center p-2 bg-light rounded">
                  <h5 className="text-info mb-1">{attendanceData.stats.totalDays}</h5>
                  <small className="text-muted">School Days</small>
                </div>
              </Col>
            </Row>

            {/* Best and Worst Days */}
            <Row className="mb-3">
              <Col md={6}>
                <div className="p-2 bg-success bg-opacity-10 rounded">
                  <small className="text-success fw-bold">Best Attendance Day</small>
                  <div>
                    {new Date(attendanceData.stats.bestDay.date).toLocaleDateString()} - 
                    <Badge bg="success" className="ms-2">
                      {Math.round((attendanceData.stats.bestDay.present / attendanceData.stats.bestDay.totalStudents) * 100)}%
                    </Badge>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-2 bg-danger bg-opacity-10 rounded">
                  <small className="text-danger fw-bold">Lowest Attendance Day</small>
                  <div>
                    {new Date(attendanceData.stats.worstDay.date).toLocaleDateString()} - 
                    <Badge bg="danger" className="ms-2">
                      {Math.round((attendanceData.stats.worstDay.present / attendanceData.stats.worstDay.totalStudents) * 100)}%
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Detailed Table */}
            {viewMode === 'detailed' && (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table size="sm" striped hover>
                  <thead className="sticky-top bg-white">
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Total</th>
                      <th>Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.data.map((item, index) => {
                      const attendanceRate = (item.present / item.totalStudents) * 100;
                      const date = new Date(item.date);
                      
                      return (
                        <tr key={index}>
                          <td>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td>{date.toLocaleDateString('en-US', { weekday: 'short' })}</td>
                          <td>
                            <FontAwesomeIcon icon={faCheckCircle} className="text-success me-1" />
                            {item.present}
                          </td>
                          <td>
                            <FontAwesomeIcon icon={faTimesCircle} className="text-danger me-1" />
                            {item.absent}
                          </td>
                          <td>{item.totalStudents}</td>
                          <td>
                            <Badge bg={getAttendanceColor(item.present, item.totalStudents)}>
                              {Math.round(attendanceRate)}%
                            </Badge>
                          </td>
                          <td>
                            {attendanceRate >= 90 && (
                              <Badge bg="success">Excellent</Badge>
                            )}
                            {attendanceRate >= 75 && attendanceRate < 90 && (
                              <Badge bg="warning">Good</Badge>
                            )}
                            {attendanceRate < 75 && (
                              <Badge bg="danger">Needs Attention</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Summary View - Recent 7 days */}
            {viewMode === 'summary' && (
              <div>
                <h6 className="mb-3">Recent Attendance (Last 7 Days)</h6>
                <Table size="sm" hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Present/Total</th>
                      <th>Attendance Rate</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.data.slice(-7).map((item, index, array) => {
                      const attendanceRate = (item.present / item.totalStudents) * 100;
                      const prevRate = index > 0 ? (array[index - 1].present / array[index - 1].totalStudents) * 100 : attendanceRate;
                      const trendIcon = attendanceRate > prevRate ? faArrowUp : attendanceRate < prevRate ? faArrowDown : faArrowRight;
                      const trendColor = attendanceRate > prevRate ? 'text-success' : attendanceRate < prevRate ? 'text-danger' : 'text-muted';
                      
                      return (
                        <tr key={index}>
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                          <td>
                            <span className="text-success fw-bold">{item.present}</span>
                            <span className="text-muted">/{item.totalStudents}</span>
                          </td>
                          <td>
                            <Badge bg={getAttendanceColor(item.present, item.totalStudents)}>
                              {Math.round(attendanceRate)}%
                            </Badge>
                          </td>
                          <td>
                            <FontAwesomeIcon icon={trendIcon} className={trendColor} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="text-muted mb-3" />
            <h6>No attendance data available</h6>
            <p className="text-muted">
              No attendance records found for {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MonthlyAttendanceComponent;
