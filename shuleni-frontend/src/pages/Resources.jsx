import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, ListGroup, Form, Modal, Alert, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faEdit, 
  faTrash, 
  faEye, 
  faUpload, 
  faFile, 
  faFilePdf, 
  faFileWord, 
  faFileExcel, 
  faFilePowerpoint,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const Resources = () => {
  const [selectedClass, setSelectedClass] = useState('math');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileDescription, setNewFileDescription] = useState('');
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [resources, setResources] = useState({
    math: {
      name: "Mathematics",
      resources: [
        { id: 1, title: "Algebra Notes", description: "Complete algebra reference guide", type: "pdf", uploadedBy: "Dr. Smith", date: "2025-07-15", fileUrl: "/files/algebra-notes.pdf" },
        { id: 2, title: "Calculus Homework", description: "Week 3 solutions", type: "doc", uploadedBy: "Prof. Johnson", date: "2025-07-10", fileUrl: "/files/calculus-hw.doc" },
        { id: 3, title: "Geometry Formulas", description: "Essential formulas cheat sheet", type: "pdf", uploadedBy: "Dr. Smith", date: "2025-07-05", fileUrl: "/files/geometry-formulas.pdf" }
      ]
    },
    science: {
      name: "Science",
      resources: [
        { id: 4, title: "Biology Notes", description: "Cell structure and functions", type: "pdf", uploadedBy: "Dr. Lee", date: "2025-07-12", fileUrl: "/files/biology-notes.pdf" },
        { id: 5, title: "Chemistry Lab", description: "Experiment #3 results", type: "xlsx", uploadedBy: "Prof. Davis", date: "2025-07-08", fileUrl: "/files/chemistry-lab.xlsx" }
      ]
    },
    history: {
      name: "History",
      resources: [
        { id: 6, title: "Ancient Civilizations", description: "Overview of early societies", type: "pdf", uploadedBy: "Dr. Wilson", date: "2025-07-18", fileUrl: "/files/ancient-civilizations.pdf" },
        { id: 7, title: "World War II", description: "Key events timeline", type: "ppt", uploadedBy: "Prof. Brown", date: "2025-07-14", fileUrl: "/files/wwii-timeline.ppt" }
      ]
    }
  });
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      setNewFileName(file.name);
    }
  };

  // Download handler
  const handleDownload = (resource) => {
    // Create a blob URL and trigger download
    const link = document.createElement('a');
    link.href = resource.fileUrl || '#';
    link.download = `${resource.title}.${resource.type}`;
    link.target = '_blank';
    
    // For demo purposes, create a mock file
    const content = `Mock content for ${resource.title}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Edit handler
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setNewFileName(resource.title);
    setNewFileDescription(resource.description);
    setShowEditModal(true);
  };

  // Delete handler
  const handleDelete = (resource) => {
    setDeletingResource(resource);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deletingResource) {
      setResources(prev => ({
        ...prev,
        [selectedClass]: {
          ...prev[selectedClass],
          resources: prev[selectedClass].resources.filter(r => r.id !== deletingResource.id)
        }
      }));
      setShowDeleteModal(false);
      setDeletingResource(null);
    }
  };

  // Submit upload
  const handleSubmit = async () => {
    if (!newFile && !editingResource) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        if (editingResource) {
          // Update existing resource
          setResources(prev => ({
            ...prev,
            [selectedClass]: {
              ...prev[selectedClass],
              resources: prev[selectedClass].resources.map(r => 
                r.id === editingResource.id 
                  ? { ...r, title: newFileName, description: newFileDescription }
                  : r
              )
            }
          }));
          setShowEditModal(false);
          setEditingResource(null);
        } else {
          // Add new resource
          const newResource = {
            id: Date.now(),
            title: newFileName,
            description: newFileDescription,
            type: newFile.name.split('.').pop().toLowerCase(),
            uploadedBy: "Current User",
            date: new Date().toISOString().split('T')[0],
            fileUrl: URL.createObjectURL(newFile)
          };

          setResources(prev => ({
            ...prev,
            [selectedClass]: {
              ...prev[selectedClass],
              resources: [...prev[selectedClass].resources, newResource]
            }
          }));
          setShowUploadModal(false);
        }

        // Reset form
        setNewFile(null);
        setNewFileName('');
        setNewFileDescription('');
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }, 2000);
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return <i className="bi bi-file-earmark-pdf text-danger fs-4"></i>;
      case 'doc': return <i className="bi bi-file-earmark-word text-primary fs-4"></i>;
      case 'xlsx': return <i className="bi bi-file-earmark-excel text-success fs-4"></i>;
      case 'ppt': return <i className="bi bi-file-earmark-ppt text-warning fs-4"></i>;
      default: return <i className="bi bi-file-earmark fs-4"></i>;
    }
  };

  return (
     <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="resources-page bg-light min-vh-100">
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Class Resources</h1>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <i className="bi bi-upload me-2"></i>Upload Resource
          </Button>
        </div>
        
        <div className="mb-4">
          <h5 className="mb-3">Select a Class:</h5>
          <div className="d-flex flex-wrap gap-2">
            {Object.keys(resources).map((classKey) => (
              <Button
                key={classKey}
                variant={selectedClass === classKey ? "primary" : "outline-primary"}
                onClick={() => setSelectedClass(classKey)}
                className="rounded-pill"
              >
                {resources[classKey].name}
              </Button>
            ))}
          </div>
        </div>
        
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Card.Title className="mb-0">
                {resources[selectedClass].name} Resources
              </Card.Title>
              <div className="text-muted">
                {resources[selectedClass].resources.length} resources available
              </div>
            </div>
            
            {resources[selectedClass].resources.length > 0 ? (
              <ListGroup variant="flush">
                {resources[selectedClass].resources.map(resource => (
                  <ListGroup.Item key={resource.id} className="py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        {getFileIcon(resource.type)}
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">
                          <Link to={`/resource/${resource.id}`} className="text-decoration-none">
                            {resource.title}
                          </Link>
                        </h5>
                        <p className="mb-1 text-muted">{resource.description}</p>
                        <small className="text-muted">
                          Uploaded by {resource.uploadedBy} on {resource.date}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleDownload(resource)}
                          title="Download"
                        >
                          <FontAwesomeIcon icon={faDownload} className="me-1" />
                          Download
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => handleEdit(resource)}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(resource)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                          Delete
                        </Button>
                        <Link 
                          to={`/resource/${resource.id}`} 
                          className="btn btn-outline-info btn-sm"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          View
                        </Link>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Card className="text-center py-5 bg-light">
                <Card.Body>
                  <i className="bi bi-folder-x text-muted fs-1 mb-3"></i>
                  <h5 className="text-muted">No Resources Available</h5>
                  <p>Upload your first resource for this class</p>
                  <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                    Upload Resource
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Card.Body>
        </Card>
        
        <Row>
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">Recent Resources</Card.Title>
                <ListGroup variant="flush">
                  {Object.keys(resources).flatMap(classKey => 
                    resources[classKey].resources.slice(0, 2).map(resource => (
                      <ListGroup.Item key={`recent-${resource.id}`} className="py-2">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {getFileIcon(resource.type)}
                          </div>
                          <div>
                            <div className="fw-bold">{resource.title}</div>
                            <small className="text-muted">{resources[classKey].name}</small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="mb-3">My Uploads</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="py-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <i className="bi bi-file-earmark-pdf text-danger fs-4"></i>
                      </div>
                      <div>
                        <div className="fw-bold">My Algebra Notes</div>
                        <small className="text-muted">Mathematics</small>
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="py-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <i className="bi bi-file-earmark-word text-primary fs-4"></i>
                      </div>
                      <div>
                        <div className="fw-bold">Science Project Draft</div>
                        <small className="text-muted">Science</small>
                      </div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload New Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Class</Form.Label>
              <Form.Select>
                <option>Mathematics</option>
                <option>Science</option>
                <option>History</option>
                <option>English</option>
                <option>Computer Science</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Resource Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter title" 
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter description"
                value={newFileDescription}
                onChange={(e) => setNewFileDescription(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Upload File</Form.Label>
              <div className="border rounded p-3 text-center bg-light">
                {newFile ? (
                  <div>
                    <i className="bi bi-file-earmark-check fs-1 text-success"></i>
                    <p className="mb-1 mt-2">{newFile.name}</p>
                    <p className="text-muted small mb-2">{(newFile.size / 1024).toFixed(1)} KB</p>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        setNewFile(null);
                        setNewFileName('');
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <i className="bi bi-cloud-arrow-up fs-1 text-muted"></i>
                    <p className="mb-1 mt-2">Drag & drop files here</p>
                    <p className="text-muted small mb-3">or</p>
                    <Form.Control 
                      type="file" 
                      className="d-none" 
                      id="file-upload"
                      onChange={handleFileUpload}
                    />
                    <Button 
                      variant="outline-primary"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!newFile}>
            Upload Resource
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Resource Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isUploading && (
            <Alert variant="info">
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                <div className="flex-grow-1">
                  <div>Updating resource... {uploadProgress}%</div>
                  <ProgressBar now={uploadProgress} className="mt-2" />
                </div>
              </div>
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Resource Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter title" 
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter description"
                value={newFileDescription}
                onChange={(e) => setNewFileDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? 'Updating...' : 'Update Resource'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FontAwesomeIcon icon={faTrash} className="text-danger fs-1 mb-3" />
            <h5>Are you sure you want to delete this resource?</h5>
            {deletingResource && (
              <>
                <p className="text-muted mb-2">
                  <strong>{deletingResource.title}</strong>
                </p>
                <p className="text-muted small">
                  This action cannot be undone.
                </p>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Resource
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default Resources;