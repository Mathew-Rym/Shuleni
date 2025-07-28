import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using Shuleni platform",
      topics: [
        "Setting up your school profile",
        "Creating user accounts",
        "Basic navigation",
        "Dashboard overview"
      ]
    },
    {
      title: "Student Management",
      description: "Manage student information and enrollment",
      topics: [
        "Adding new students",
        "Managing student records",
        "Student enrollment process",
        "Generating student reports"
      ]
    },
    {
      title: "Class Management",
      description: "Organize and manage classes effectively",
      topics: [
        "Creating classes",
        "Assigning teachers",
        "Managing timetables",
        "Attendance tracking"
      ]
    },
    {
      title: "Exams & Assessment",
      description: "Handle examinations and grading",
      topics: [
        "Creating exam schedules",
        "Recording marks",
        "Generating report cards",
        "Performance analytics"
      ]
    },
    {
      title: "Communication",
      description: "Stay connected with your school community",
      topics: [
        "Sending notifications",
        "Parent-teacher communication",
        "Student messaging",
        "Announcements"
      ]
    },
    {
      title: "Technical Support",
      description: "Troubleshooting and technical assistance",
      topics: [
        "Login issues",
        "Browser compatibility",
        "Data backup",
        "System requirements"
      ]
    }
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Help Center</h1>
              <p className="lead">Get the support you need to make the most of Shuleni</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="text-center mb-5">
              <h2>How can we help you today?</h2>
              <p className="text-muted">Browse our help categories or search for specific topics</p>
            </div>
          </Col>
        </Row>

        <Row>
          {helpCategories.map((category, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-book text-primary"></i>
                    </div>
                    <h5 className="mb-0">{category.title}</h5>
                  </div>
                  <p className="text-muted mb-3">{category.description}</p>
                  <ul className="list-unstyled">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="mb-2">
                        <i className="fas fa-chevron-right text-primary me-2"></i>
                        <span className="text-decoration-none">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Row className="mt-5">
          <Col>
            <Card className="bg-primary text-white">
              <Card.Body className="text-center py-4">
                <h4>Still need help?</h4>
                <p className="mb-4">Can't find what you're looking for? Our support team is here to help.</p>
                <div className="d-flex justify-content-center gap-3">
                  <Button as={Link} to="/contact-us" variant="light" size="lg">
                    Contact Support
                  </Button>
                  <Button as={Link} to="/faq" variant="outline-light" size="lg">
                    View FAQ
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Back to Home */}
        <Row className="mt-4">
          <Col className="text-center">
            <Button as={Link} to="/" variant="outline-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HelpCenter;
