import React,  {useEffect} from 'react';
import { Container, Card, Table, ProgressBar, Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useNavigate, useParams} from 'react-router-dom';

const ExamOverview = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { classId } = useParams(); 
  const navigate = useNavigate();

  const fetchPerformanceData = async (classId) => {
  // Fetch data based on classId
  const response = await fetch(`/api/performance/${classId}`);
  const data = await response.json();
  setPerformanceData(data);
};

  useEffect(() => {
    // Fetch performance data for this specific class
    fetchPerformanceData(classId);
  }, [classId])
  // Mock performance data
  const performanceData = [
    { id: 1, exam: 'Algebra Final', date: '2025-06-15', score: 92, max: 100 },
    { id: 2, exam: 'Geometry Midterm', date: '2025-05-20', score: 85, max: 100 },
    { id: 3, exam: 'Calculus Quiz', date: '2025-04-10', score: 78, max: 100 },
    { id: 4, exam: 'Trigonometry Test', date: '2025-03-22', score: 91, max: 100 },
    { id: 5, exam: 'Linear Equations', date: '2025-02-15', score: 87, max: 100 },
  ];

  return (
      <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="class-list-page"></div>
    <div className="exam-performance-page">
      <Container fluid className="mt-4">
        <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
          &larr; Back to Dashboard
        </Button>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Card.Title>Exam Performance Overview</Card.Title>
              <Button variant="outline-primary">Download Full Report</Button>
            </div>
            
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.exam}</td>
                    <td>{exam.date}</td>
                    <td>{exam.score}/{exam.max}</td>
                    <td>
                      <ProgressBar 
                        now={(exam.score / exam.max) * 100} 
                        variant={(exam.score / exam.max) * 100 > 90 ? 'success' : 
                                 (exam.score / exam.max) * 100 > 75 ? 'info' : 'warning'} 
                        label={`${Math.round((exam.score / exam.max) * 100)}%`}
                        style={{ height: '20px' }}
                      />
                    </td>
                    <td>
                      <Button variant="outline-secondary" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            <div className="mt-4">
              <h5 className="mb-3">Performance Analysis</h5>
              <div className="d-flex justify-content-between">
                <Card className="text-center p-3" style={{ width: '18%' }}>
                  <h2 className="text-success">92%</h2>
                  <p className="mb-0">Highest Score</p>
                </Card>
                <Card className="text-center p-3" style={{ width: '18%' }}>
                  <h2 className="text-info">85%</h2>
                  <p className="mb-0">Average Score</p>
                </Card>
                <Card className="text-center p-3" style={{ width: '18%' }}>
                  <h2 className="text-warning">78%</h2>
                  <p className="mb-0">Lowest Score</p>
                </Card>
                <Card className="text-center p-3" style={{ width: '18%' }}>
                  <h2 className="text-primary">15</h2>
                  <p className="mb-0">Exams Taken</p>
                </Card>
                <Card className="text-center p-3" style={{ width: '18%' }}>
                  <h2 className="text-danger">3</h2>
                  <p className="mb-0">Pending</p>
                </Card>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
    </div>
  );
};

export default ExamOverview;