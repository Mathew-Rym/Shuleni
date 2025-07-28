import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Accordion, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "What is Shuleni School Management Platform?",
          answer: "Shuleni is a comprehensive school management system designed specifically for Kenyan schools. It helps manage student records, attendance, examinations, communication, and administrative tasks in one integrated platform."
        },
        {
          question: "How much does Shuleni cost?",
          answer: "Shuleni offers flexible pricing plans based on school size and features needed. Contact our sales team for a customized quote that fits your school's budget and requirements."
        },
        {
          question: "Is Shuleni suitable for all types of schools in Kenya?",
          answer: "Yes, Shuleni is designed to work with primary schools, secondary schools, colleges, and universities across Kenya. It supports the Kenyan education system including CBC curriculum."
        }
      ]
    },
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I set up my school on Shuleni?",
          answer: "After registration, follow our setup wizard to configure your school details, create user accounts, set up classes, and import student data. Our support team provides free onboarding assistance."
        },
        {
          question: "Can I import existing student data?",
          answer: "Yes, Shuleni supports bulk import of student data from Excel/CSV files. Our team can help you migrate data from your existing system during setup."
        },
        {
          question: "How long does it take to get started?",
          answer: "Most schools are up and running within 1-2 weeks. This includes data migration, user training, and system configuration."
        }
      ]
    },
    {
      category: "Student Management",
      questions: [
        {
          question: "How do I add new students to the system?",
          answer: "You can add students individually through the student management section or import multiple students using our bulk upload feature with Excel/CSV files."
        },
        {
          question: "Can parents access their child's information?",
          answer: "Yes, parents receive login credentials to access their child's academic progress, attendance records, fee statements, and receive school communications."
        },
        {
          question: "How does the system handle student transfers?",
          answer: "Shuleni provides features to transfer students between classes, schools, or mark them as graduated/discontinued while maintaining their historical records."
        }
      ]
    },
    {
      category: "Attendance & Academics",
      questions: [
        {
          question: "How does attendance tracking work?",
          answer: "Teachers can mark attendance using mobile devices or computers. The system supports daily, lesson-wise, or custom attendance periods and generates automated reports."
        },
        {
          question: "Can the system handle CBC and 8-4-4 curricula?",
          answer: "Yes, Shuleni is designed to support both CBC (Competency-Based Curriculum) and the traditional 8-4-4 system used in Kenyan schools."
        },
        {
          question: "How are exam results managed?",
          answer: "Teachers can enter marks online, and the system automatically calculates grades, rankings, and generates report cards following Kenyan education standards."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "What internet connection do I need?",
          answer: "Shuleni works with basic internet connections. For optimal performance, we recommend at least 1Mbps for small schools and 5Mbps for larger institutions."
        },
        {
          question: "Is my school data secure?",
          answer: "Yes, we use bank-level encryption and store data in secure servers. Regular backups ensure your data is always protected and recoverable."
        },
        {
          question: "Can I access Shuleni on mobile devices?",
          answer: "Yes, Shuleni is fully responsive and works on smartphones, tablets, and computers. We also have mobile apps for iOS and Android."
        }
      ]
    },
    {
      category: "Fees & Payments",
      questions: [
        {
          question: "Does Shuleni handle fee management?",
          answer: "Yes, you can set fee structures, track payments, send fee reminders, and generate financial reports. Integration with M-Pesa and bank payments is available."
        },
        {
          question: "Can parents pay fees online?",
          answer: "Yes, parents can pay school fees through M-Pesa, bank transfers, or other integrated payment gateways directly from their parent portal."
        },
        {
          question: "How are fee balances tracked?",
          answer: "The system automatically tracks fee payments and outstanding balances, sending automated reminders to parents and generating financial reports for administrators."
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Frequently Asked Questions</h1>
              <p className="lead">Find answers to common questions about Shuleni</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-5">
        {/* Search Bar */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="lg"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Sections */}
        <Row>
          <Col>
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-5">
                  <h3 className="mb-4 text-primary">{category.category}</h3>
                  <Accordion>
                    {category.questions.map((qa, qaIndex) => (
                      <Accordion.Item 
                        key={qaIndex} 
                        eventKey={`${categoryIndex}-${qaIndex}`}
                        className="mb-3 border-0 shadow-sm"
                      >
                        <Accordion.Header>
                          <strong>{qa.question}</strong>
                        </Accordion.Header>
                        <Accordion.Body className="bg-light">
                          <p className="mb-0">{qa.answer}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <h4>No matching questions found</h4>
                <p className="text-muted">Try searching with different keywords</p>
              </div>
            )}
          </Col>
        </Row>

        {/* Contact Section */}
        <Row className="mt-5">
          <Col>
            <Card className="bg-primary text-white">
              <Card.Body className="text-center py-4">
                <h4>Still have questions?</h4>
                <p className="mb-4">Can't find the answer you're looking for? Our support team is here to help.</p>
                <div className="d-flex justify-content-center gap-3">
                  <Button as={Link} to="/contact-us" variant="light" size="lg">
                    Contact Support
                  </Button>
                  <Button as={Link} to="/help-center" variant="outline-light" size="lg">
                    Browse Help Center
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

export default FAQ;
