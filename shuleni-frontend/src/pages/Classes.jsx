import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import LessonCard from '../components/LessonCard';
import ClassMembers from '../components/ClassMembers';
import Chat from '../components/Chat';

const Class= () => {
    const { classId } = useParams();
    const [activeTab, setActiveTab] = useState('stream');
    const [isLoading, setIsLoading] = useState(true);
    const [classData, setClassData] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

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

  if (isLoading)
    return(
      <div className="class-page">
      
       <Container fluid className="mt-3">
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
              className="rounded-0 border-bottom-0"
              onClick={() => setActiveTab('resources')}
            >
              Resources
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
          <Col md={6} className="mb-4">
            <ClassMembers members={classData.members} />
          </Col>
          <Col md={6} className="mb-4">
            <Chat 
              messages={chatMessages} 
              onSendMessage={handleSendMessage} 
              currentUser={currentUser} 
            />
          </Col>
        </Row>
      </Container>

      <FooterComponent />

        </div>

    )
}

export default Class;