import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const ExamTaking = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock exam data
  const mockExam = {
    id: examId,
    class_id: 101,
    title: "Mathematics Midterm Exam",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), 
    duration_minutes: 60,
    created_by: 1,
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 1,
        text: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        type: "multiple_choice"
      },
      {
        id: 2,
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        type: "multiple_choice"
      },
      {
        id: 3,
        text: "Explain the Pythagorean theorem",
        options: [],
        type: "essay"
      }
    ]
  };

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setExam(mockExam);
        const initialAnswers = {};
        mockExam.questions.forEach(question => {
          initialAnswers[question.id] = question.type === 'essay' ? '' : null;
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
        navigate('/classes');
      }
    };

    fetchExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (!exam) return;
    const endTime = new Date(exam.end_time).getTime();
    const now = new Date().getTime();
    setTimeRemaining(Math.max(0, endTime - now));

 
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);
      
      if (remaining === 0 && !isSubmitted) {
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, isSubmitted]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError('Failed to submit exam. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exam) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading exam...</span>
          </div>
          <p className="mt-3">Loading exam details...</p>
        </div>
      </Container>
    );
  }

  if (isSubmitted) {
    return (
      <Container className="my-5">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="text-success mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </div>
            <Card.Title className="mb-3">Exam Submitted Successfully!</Card.Title>
            <p className="text-muted mb-4">
              Your answers for the {exam.title} have been submitted. 
              Results will be available once graded by your instructor.
            </p>
            <Button variant="primary" onClick={() => navigate(`/class/${exam.class_id}`)}>
              Return to Class
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const progressPercentage = 100 - (timeRemaining / (exam.duration_minutes * 60 * 1000)) * 100;

  return (
    <Container className="my-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">{exam.title}</Card.Title>
            <div className="d-flex align-items-center">
              <span className="me-2">Time Remaining:</span>
              <span className="fw-bold fs-5 text-danger">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <ProgressBar 
            now={progressPercentage} 
            variant={progressPercentage > 80 ? "danger" : progressPercentage > 60 ? "warning" : "primary"}
            animated 
            className="mb-3"
          />
          
          <div className="d-flex justify-content-between text-muted small">
            <span>Started: {new Date(exam.start_time).toLocaleString()}</span>
            <span>Ends: {new Date(exam.end_time).toLocaleString()}</span>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Exam Questions</Card.Title>
          
          <p className="text-muted mb-4">
            Answer the following questions carefully. Make sure to review your answers before submitting.
          </p>
          
          {exam.questions.map((question, index) => (
            <div key={question.id} className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '30px', height: '30px' }}>
                  {index + 1}
                </div>
                <h5 className="ms-2 mb-0">Question {index + 1}</h5>
              </div>
              
              <p className="mb-3">{question.text}</p>
              
              {question.type === 'multiple_choice' && (
                <ListGroup className="mb-3">
                  {question.options.map((option, optIndex) => (
                    <ListGroup.Item 
                      key={optIndex} 
                      action 
                      active={answers[question.id] === optIndex}
                      onClick={() => handleAnswerChange(question.id, optIndex)}
                      className="d-flex align-items-center"
                    >
                      <div className="me-3">
                        <span className="fw-bold">{String.fromCharCode(65 + optIndex)})</span>
                      </div>
                      <div>{option}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              
              <h6 className="mt-4 mb-3">Answer for Question {index + 1}</h6>
              
              {question.type === 'essay' ? (
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Type your answer here..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mb-4"
                />
              ) : (
                <Form.Control
                  type="text"
                  placeholder="Enter your answer (e.g., C)"
                  value={answers[question.id] !== null && answers[question.id] !== undefined 
                    ? String.fromCharCode(65 + answers[question.id]) 
                    : ''}
                  onChange={(e) => {
                    const letter = e.target.value.toUpperCase();
                    if (/^[A-D]$/.test(letter)) {
                      handleAnswerChange(question.id, letter.charCodeAt(0) - 65);
                    } else if (e.target.value === '') {
                      handleAnswerChange(question.id, null);
                    }
                  }}
                  className="mb-4"
                />
              )}
              
              <hr className="my-4" />
            </div>
          ))}
          
          {submitError && (
            <Alert variant="danger" className="mb-4">
              {submitError}
            </Alert>
          )}
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant={timeRemaining === 0 ? "secondary" : "primary"} 
              size="lg" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : timeRemaining === 0 ? (
                "Time's Up! Submit Now"
              ) : (
                "Submit Exam"
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExamTaking;