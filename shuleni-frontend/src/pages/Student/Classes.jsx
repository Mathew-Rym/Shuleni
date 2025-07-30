import React, { useState, useEffect} from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Badge, ProgressBar, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import LessonCard from '../../components/LessonCard'
import ClassMembers from '../../components/ClassMembers';
import Chat from '../../components/Chat';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import SettingsModal from '../../components/SettingsModal';

const fetchClassData = async (classId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    classDetails: {
      id: classId,
      name: "Mathematics 101",
      grade_level: "Grade 10",
      school_id: 1
    },
    resources: [
      { id: 1, class_id: classId, uploaded_by: 3, title: "Lesson 10 Notes", 
        description: "Notes for linear equations", file_url: "/resources/1", 
        created_at: "2025-07-20T10:30:00Z" },
      { id: 2, class_id: classId, uploaded_by: 3, title: "Algebra Guide", 
        description: "Comprehensive algebra reference", file_url: "/resources/2", 
        created_at: "2025-07-18T14:20:00Z" }
    ],
    lessons: [
      {
        id: 1,
        title: "Linear Equations Introduction",
        content: "This week we'll explore fundamental concepts of linear equations and their applications in real-world problems.",
        created_at: "2025-07-22T09:00:00Z",
        educator: "Dr. Smith"
      },
      {
        id: 2,
        title: "Algebraic Functions Review",
        content: "A comprehensive review of algebraic functions focusing on their properties and graphical representations.",
        created_at: "2025-07-20T11:30:00Z",
        educator: "Dr. Smith"
      }
    ],
    members: [
      { id: 1, name: "Nathan", role: "student", status: "online" },
      { id: 2, name: "John", role: "student", status: "offline" },
      { id: 3, name: "Dr. Smith", role: "educator", status: "online" },
      { id: 4, name: "Harry", role: "student", status: "offline" },
      { id: 5, name: "Dejon", role: "student", status: "online" }
    ],
    chatMessages: [
      { id: 1, class_id: classId, sender_id: 1, message: "Who knows the HW?", sent_at: "2025-07-22T10:30:00Z", user: { name: "Nathan" } },
      { id: 2, class_id: classId, sender_id: 4, message: "No Idea", sent_at: "2025-07-22T10:32:00Z", user: { name: "Harry" } },
      { id: 3, class_id: classId, sender_id: 5, message: "Where are you Guys?", sent_at: "2025-07-22T10:35:00Z", user: { name: "Dejon" } },
      { id: 4, class_id: classId, sender_id: 3, message: "Check the resources section for homework details", sent_at: "2025-07-22T10:40:00Z", user: { name: "Dr. Smith" } }
    ],
    exams: [
      {
        id: 1,
        title: "Algebraic Functions Quiz",
        questions: 20,
        dueDate: "2025-09-14",
        duration: 45,
        status: "pending"
      }
    ],
    performance: {
      overallScore: 78,
      testsTaken: 15,
      projectsCompleted: 95,
      annualExams: 12,
      taskClasses: 3
    }
  };
};

const Class= () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stream');
    const [isLoading, setIsLoading] = useState(true);
    const [classData, setClassData] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);


    const currentUser = {
    id: 1,
    name: "Nathan",
    email: "nathan@example.com",
    role: "student",
    school_id: 1
  };

  useEffect(() => {
    const loadClassData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchClassData(classId);
        setClassData(data);
        setChatMessages(data.chatMessages);
      } catch (error) {
        console.error("Failed to load class data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassData();
  }, [classId]);

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      id: chatMessages.length + 1,
      class_id: classId,
      sender_id: currentUser.id,
      message: messageContent,
      sent_at: new Date().toISOString(),
      user: { name: currentUser.name }
    };
    
    setChatMessages([...chatMessages, newMessage]);
  }; 

  const handleTakeExam = (examId) => {
    navigate(`/exam-taking/${examId}`);
  };

  const handleViewPerformance = () => {
    navigate(`/exam-overview/${classId}`);
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar onOpenSettings={() => setShowSettingsModal(true)} />
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ marginLeft: '250px', minHeight: '60vh' }}>
            <h2>Loading class data...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar onOpenSettings={() => setShowSettingsModal(true)} />
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ marginLeft: '250px', minHeight: '60vh' }}>
            <h2>Class data not found.</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-vh-100 bg-light">
        <Navbar onOpenSettings={() => setShowSettingsModal(true)} />
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
            <Container fluid className="p-4">
              <div className="mb-4">
                <h1 className="mb-1">{classData.classDetails.name}</h1>
                <p className="text-muted">Grade: {classData.classDetails.grade_level}</p>
                <div className="d-flex border-bottom">
                  <Button
                    variant={activeTab === 'stream' ? 'primary' : 'light'}
                    className="me-2 rounded-0 border-bottom-0"
                    onClick={() => setActiveTab('stream')}
                  >
                    Stream
                  </Button>
                  <Button
                    variant={activeTab === 'resources' ? 'primary' : 'light'}
                    className="me-2 rounded-0 border-bottom-0"
                    onClick={() => setActiveTab('resources')}
                  >
                    Resources
                  </Button>
                  <Button
                    variant={activeTab === 'examinations' ? 'primary' : 'light'}
                    className="rounded-0 border-bottom-0"
                    onClick={() => setActiveTab('examinations')}
                  >
                    Examinations
                  </Button>
                </div>
              </div>

        {activeTab === 'resources' && (
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Class Resources</Card.Title>
              <Card.Text className="text-muted">
                Access learning materials and references for this class
              </Card.Text>
              <ListGroup horizontal className="flex-wrap">
                {classData.resources.map(resource => (
                  <ListGroup.Item
                    key={resource.id}
                    action
                    as="a"
                    href={resource.file_url}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>{resource.title}</span>
                    <i className="bi bi-download ms-2"></i>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'examinations' && (
          <Row>
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-4">Pending Exams</Card.Title>
                  
                  {classData.exams.length > 0 ? (
                    classData.exams.map(exam => (
                      <div key={exam.id} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4>{exam.title}</h4>
                          <Badge bg={exam.status === 'pending' ? 'warning' : 'success'} pill>
                            {exam.status === 'pending' ? 'Pending' : 'Completed'}
                          </Badge>
                        </div>
                        
                        <div className="d-flex mb-3">
                          <div className="me-4">
                            <h6>Questions: {exam.questions}</h6>
                            <p className="text-muted mb-0">Due: {exam.dueDate}</p>
                          </div>
                          <div>
                            <h6>Time: {exam.duration} Mins</h6>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleTakeExam(exam.id)}
                            >
                              Take Exam
                            </Button>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center mt-3">
                          <ProgressBar 
                            now={50} 
                            variant="info" 
                            style={{ height: '8px', width: '100%' }} 
                          />
                          <small className="ms-2 text-muted">2 days remaining</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Card className="text-center py-4 bg-light">
                      <Card.Body>
                        <h5 className="text-muted">No Pending Exams</h5>
                        <p>You're all caught up with your exams!</p>
                      </Card.Body>
                    </Card>
                  )}
                  
                  <Card className="mt-4 bg-light border-0">
                    <Card.Body className="text-center py-3">
                      <h5 className="mb-0">You Have {classData.exams.length} Pending Exam{classData.exams.length !== 1 ? 's' : ''}</h5>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-4">Exam Performance Overview</Card.Title>
                  
                  <p className="text-muted mb-4">
                    Quick tests on your own results. Download detailed reports for comprehensive analysis.
                  </p>
                  
                  <Table borderless className="mb-4">
                    <thead>
                      <tr>
                        <th>Test Source</th>
                        <th>January Score</th>
                        <th>Project Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{classData.performance.testsTaken}</td>
                        <td><Badge bg="success">{classData.performance.overallScore}%</Badge></td>
                        <td>{classData.performance.projectsCompleted}</td>
                      </tr>
                    </tbody>
                  </Table>
                  
                  <Table borderless>
                    <thead>
                      <tr>
                        <th>Launch Source</th>
                        <th>Annual Exam</th>
                        <th>Task Classes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>60</td>
                        <td>{classData.performance.annualExams}</td>
                        <td>{classData.performance.taskClasses}</td>
                      </tr>
                    </tbody>
                  </Table>
                  
                  <div className="text-center mt-4">
                    <Button 
                      variant="primary"
                      onClick={handleViewPerformance}
                    >
                      View Full Performance Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === 'stream' && (
          <>
            {classData.lessons.map(lesson => (
              <LessonCard
                key={lesson.id}
                title={lesson.title}
                content={lesson.content}
                date={lesson.created_at}
                educator={lesson.educator}
              />
            ))}
          </>
        )}

        <Row>
          <Col xs={12} className="mb-4">
            <ClassMembers members={classData.members} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="mb-4">
            <Chat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
            />
          </Col>
        </Row>
            </Container>
          </div>
        </div>
        
        <SettingsModal
          show={showSettingsModal}
          onHide={() => setShowSettingsModal(false)}
        />
      </div>
  );
}

export default Class;