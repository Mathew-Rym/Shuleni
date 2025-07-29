import React from 'react';
import { Container, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Link, useParams } from 'react-router-dom';

const ResourceDetail = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  
  // Mock data for resource details
  const resource = {
    id: id,
    title: "Algebra Notes",
    description: "Complete algebra reference guide covering linear equations, quadratic functions, and polynomial operations.",
    type: "pdf",
    uploadedBy: "Dr. Smith",
    date: "2025-07-15",
    class: "Mathematics",
    pages: 24,
    size: "2.4 MB",
    content: `
      <h3>Chapter 1: Linear Equations</h3>
      <p>Linear equations are equations of the first order. A linear equation is an equation for a straight line.</p>
      
      <p>The general form of a linear equation in one variable is:</p>
      <p>ax + b = 0</p>
      <p>Where x is the variable, and a and b are constants with a ≠ 0.</p>
      
      <h4>Example 1:</h4>
      <p>Solve for x: 2x + 5 = 13</p>
      <p>Solution:</p>
      <p>2x + 5 = 13</p>
      <p>2x = 13 - 5</p>
      <p>2x = 8</p>
      <p>x = 4</p>
      
      <h3>Chapter 2: Quadratic Functions</h3>
      <p>A quadratic function is a polynomial function of degree 2. Its graph is a parabola.</p>
      <p>The standard form of a quadratic function is:</p>
      <p>f(x) = ax² + bx + c</p>
      <p>Where a, b, and c are constants with a ≠ 0.</p>
      
      <h4>Example 2:</h4>
      <p>Solve: x² - 5x + 6 = 0</p>
      <p>Solution:</p>
      <p>Factoring: (x - 2)(x - 3) = 0</p>
      <p>x = 2 or x = 3</p>
    `
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <i className="bi bi-file-earmark-pdf text-danger fs-1"></i>;
      case 'doc': return <i className="bi bi-file-earmark-word text-primary fs-1"></i>;
      case 'xlsx': return <i className="bi bi-file-earmark-excel text-success fs-1"></i>;
      case 'ppt': return <i className="bi bi-file-earmark-ppt text-warning fs-1"></i>;
      default: return <i className="bi bi-file-earmark fs-1"></i>;
    }
  };

  return (
     <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
    <div className="resource-detail-page bg-light min-vh-100">
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Link to="/resources" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Back to Resources
            </Link>
          </div>
          <div>
            <Button variant="outline-primary" className="me-2">
              <i className="bi bi-pencil me-1"></i>Edit
            </Button>
            <Button variant="primary">
              <i className="bi bi-download me-1"></i>Download
            </Button>
          </div>
        </div>
        
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="justify-content-center">
              <Col md={9} className="d-flex flex-column align-items-center">
                <div className="d-flex flex-column align-items-center mb-3">
                  {getFileIcon(resource.type)}
                  <div className="mt-3 text-center">
                    <h1 className="mb-1">{resource.title}</h1>
                    <p className="lead">{resource.description}</p>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
                  <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    <i className="bi bi-journal me-1"></i> {resource.class}
                  </Badge>
                  <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    <i className="bi bi-person me-1"></i> {resource.uploadedBy}
                  </Badge>
                  <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    <i className="bi bi-calendar me-1"></i> {resource.date}
                  </Badge>
                  <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    <i className="bi bi-file-text me-1"></i> {resource.pages} pages
                  </Badge>
                  <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    <i className="bi bi-hdd me-1"></i> {resource.size}
                  </Badge>
                </div>

                <div className="resource-content mt-4 p-3 border rounded bg-white w-100" style={{maxWidth: '700px'}}>
                  <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
    </div>
  );
};

export default ResourceDetail;