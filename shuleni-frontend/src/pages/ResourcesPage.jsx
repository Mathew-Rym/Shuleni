import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Modal, Form, Table, 
  Badge, Alert, InputGroup, Dropdown, ProgressBar 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, faDownload, faEdit, faTrash, faSearch, faFilter,
  faFilePdf, faFileWord, faFileExcel, faFileImage, faFile,
  faEye, faUsers, faCalendarAlt, faBook, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { useRealTime, useRoleBasedData } from '../contexts/RealTimeContext';
import NotificationSystem, { useNotifications } from '../components/NotificationSystem';

const ResourcesPage = () => {
  const { state, actions, userRole } = useRealTime();
  const roleBasedData = useRoleBasedData();
  const { showSuccess, showError, showWarning, notifications, removeNotification } = useNotifications();

  // Component state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form state for new/edit resource
  const [resourceForm, setResourceForm] = useState({
    name: '',
    file: null,
    subject: '',
    class: '',
    type: '',
    description: '',
    examType: '' // For past exams
  });

  // Available options
  const subjects = ['Mathematics', 'Chemistry', 'Physics', 'English', 'Biology', 'History', 'Geography'];
  const classes = ['Grade 8', 'Grade 9', 'Grade 10', 'Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const resourceTypes = ['lesson', 'assignment', 'exam', 'past_exam', 'reference'];
  const examTypes = ['midterm', 'final', 'quiz', 'mock', 'national'];

  // Permission check
  const canUpload = userRole === 'admin' || userRole === 'teacher';
  const canEdit = userRole === 'admin' || userRole === 'teacher';
  const canDelete = userRole === 'admin' || userRole === 'teacher';

  // Get file icon based on file type
  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return faFilePdf;
      case 'doc':
      case 'docx': return faFileWord;
      case 'xls':
      case 'xlsx': return faFileExcel;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return faFileImage;
      default: return faFile;
    }
  };

  // Get file type color
  const getFileTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'danger';
      case 'doc':
      case 'docx': return 'primary';
      case 'xls':
      case 'xlsx': return 'success';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'warning';
      default: return 'secondary';
    }
  };

  // Filter and search resources
  const filteredResources = roleBasedData.resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.examType && resource.examType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterBy === 'all' || 
                         resource.subject === filterBy || 
                         resource.class === filterBy ||
                         resource.type === filterBy ||
                         resource.examType === filterBy;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'date': return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      case 'downloads': return b.downloads - a.downloads;
      case 'size': return parseFloat(b.size) - parseFloat(a.size);
      default: return 0;
    }
  });

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!resourceForm.file || !resourceForm.name || !resourceForm.subject || !resourceForm.class) {
      showError('Please fill in all required fields and select a file');
      return;
    }

    // Validate file type
    const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    const fileExtension = resourceForm.file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      showError('Please upload only PDF, Word, Excel, or PowerPoint files');
      return;
    }

    // Validate file size (max 10MB)
    if (resourceForm.file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          
          // Create new resource
          const newResource = {
            name: resourceForm.name,
            type: fileExtension,
            subject: resourceForm.subject,
            class: resourceForm.class,
            resourceType: resourceForm.type,
            examType: resourceForm.examType,
            description: resourceForm.description,
            size: (resourceForm.file.size / (1024 * 1024)).toFixed(2) + ' MB',
            downloads: 0,
            fileName: resourceForm.file.name
          };

          // Add to real-time context
          actions.uploadResource(newResource);
          
          showSuccess(`Resource "${resourceForm.name}" uploaded successfully!`);
          setShowUploadModal(false);
          setResourceForm({
            name: '', file: null, subject: '', class: '', type: '', description: '', examType: ''
          });
          setIsUploading(false);
          setUploadProgress(0);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle resource download
  const handleDownload = (resource) => {
    // Simulate download
    showSuccess(`Downloading "${resource.name}"...`);
    
    // In a real app, this would trigger an actual download
    // For now, we'll just increment the download counter
    actions.updateResource(resource.id, { downloads: resource.downloads + 1 });
  };

  // Handle resource deletion
  const handleDelete = (resource) => {
    if (window.confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      actions.deleteResource(resource.id);
      showSuccess(`Resource "${resource.name}" deleted successfully`);
    }
  };

  // Handle edit
  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setResourceForm({
      name: resource.name,
      file: null,
      subject: resource.subject,
      class: resource.class,
      type: resource.resourceType || '',
      description: resource.description || '',
      examType: resource.examType || ''
    });
    setShowEditModal(true);
  };

  // Handle edit save
  const handleEditSave = () => {
    if (!resourceForm.name || !resourceForm.subject || !resourceForm.class) {
      showError('Please fill in all required fields');
      return;
    }

    const updates = {
      name: resourceForm.name,
      subject: resourceForm.subject,
      class: resourceForm.class,
      resourceType: resourceForm.type,
      examType: resourceForm.examType,
      description: resourceForm.description
    };

    actions.updateResource(selectedResource.id, updates);
    showSuccess(`Resource "${resourceForm.name}" updated successfully!`);
    setShowEditModal(false);
    setSelectedResource(null);
    setResourceForm({
      name: '', file: null, subject: '', class: '', type: '', description: '', examType: ''
    });
  };

  return (
    <Container fluid className="py-4">
      <NotificationSystem 
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FontAwesomeIcon icon={faBook} className="me-3 text-primary" />
                Resources Library
              </h2>
              <p className="text-muted">
                {userRole === 'student' 
                  ? 'Download study materials and resources for your classes'
                  : 'Manage educational resources, documents, and past exams'
                }
              </p>
            </div>
            {canUpload && (
              <Button 
                variant="primary" 
                onClick={() => setShowUploadModal(true)}
                className="shuleni-btn-primary"
              >
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Upload Resource
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Search and Filter Controls */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search resources by name, subject, class, or exam type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="all">All Resources</option>
            <optgroup label="Subjects">
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </optgroup>
            <optgroup label="Classes">
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </optgroup>
            <optgroup label="Resource Types">
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
              ))}
            </optgroup>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="downloads">Sort by Downloads</option>
            <option value="size">Sort by Size</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Badge bg="info" className="p-2 w-100 text-center">
            {filteredResources.length} Resources
          </Badge>
        </Col>
      </Row>

      {/* Resources Grid */}
      <Row>
        {filteredResources.length === 0 ? (
          <Col>
            <Alert variant="info" className="text-center py-5">
              <FontAwesomeIcon icon={faBook} size="3x" className="text-muted mb-3" />
              <h5>No resources found</h5>
              <p>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : canUpload 
                    ? 'Upload your first resource to get started'
                    : 'No resources have been uploaded yet'
                }
              </p>
            </Alert>
          </Col>
        ) : (
          filteredResources.map(resource => (
            <Col key={resource.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shuleni-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <FontAwesomeIcon 
                      icon={getFileIcon(resource.type)} 
                      size="2x" 
                      className={`text-${getFileTypeColor(resource.type)}`}
                    />
                    <Badge bg={getFileTypeColor(resource.type)}>
                      {resource.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <Card.Title className="mb-2" style={{ fontSize: '1.1rem' }}>
                    {resource.name}
                  </Card.Title>
                  
                  <div className="mb-3">
                    <small className="text-muted d-block">
                      <FontAwesomeIcon icon={faBook} className="me-1" />
                      {resource.subject} - {resource.class}
                    </small>
                    {resource.resourceType && (
                      <small className="text-muted d-block">
                        <FontAwesomeIcon icon={faGraduationCap} className="me-1" />
                        {resource.resourceType.replace('_', ' ').toUpperCase()}
                        {resource.examType && ` (${resource.examType})`}
                      </small>
                    )}
                    <small className="text-muted d-block">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                      {new Date(resource.uploadedAt).toLocaleDateString()}
                    </small>
                    <small className="text-muted d-block">
                      <FontAwesomeIcon icon={faUsers} className="me-1" />
                      By {resource.uploadedBy} • {resource.size}
                    </small>
                  </div>

                  {resource.description && (
                    <p className="text-muted small mb-3">
                      {resource.description.length > 100 
                        ? `${resource.description.substring(0, 100)}...`
                        : resource.description
                      }
                    </p>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <FontAwesomeIcon icon={faDownload} className="me-1" />
                      {resource.downloads} downloads
                    </small>
                    
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        className="me-1"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </Button>
                      
                      {canEdit && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEdit(resource)}
                          className="me-1"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      )}
                      
                      {canDelete && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(resource)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FontAwesomeIcon icon={faUpload} className="me-2" />
            Upload New Resource
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFileUpload}>
          <Modal.Body>
            {isUploading && (
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Uploading...</small>
                  <small>{uploadProgress}%</small>
                </div>
                <ProgressBar now={uploadProgress} variant="success" />
              </div>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Resource Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={resourceForm.name}
                    onChange={(e) => setResourceForm({...resourceForm, name: e.target.value})}
                    placeholder="Enter resource name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File *</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setResourceForm({...resourceForm, file: e.target.files[0]})}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    required
                  />
                  <Form.Text className="text-muted">
                    PDF, Word, Excel, PowerPoint files only. Max 10MB.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Select
                    value={resourceForm.subject}
                    onChange={(e) => setResourceForm({...resourceForm, subject: e.target.value})}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class *</Form.Label>
                  <Form.Select
                    value={resourceForm.class}
                    onChange={(e) => setResourceForm({...resourceForm, class: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Resource Type</Form.Label>
                  <Form.Select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({...resourceForm, type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {resourceForm.type === 'past_exam' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Exam Type</Form.Label>
                    <Form.Select
                      value={resourceForm.examType}
                      onChange={(e) => setResourceForm({...resourceForm, examType: e.target.value})}
                    >
                      <option value="">Select Exam Type</option>
                      {examTypes.map(type => (
                        <option key={type} value={type}>
                          {type.toUpperCase()}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={resourceForm.description}
                onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                placeholder="Optional description of the resource"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Edit Resource
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Resource Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={resourceForm.name}
                  onChange={(e) => setResourceForm({...resourceForm, name: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subject *</Form.Label>
                <Form.Select
                  value={resourceForm.subject}
                  onChange={(e) => setResourceForm({...resourceForm, subject: e.target.value})}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Class *</Form.Label>
                <Form.Select
                  value={resourceForm.class}
                  onChange={(e) => setResourceForm({...resourceForm, class: e.target.value})}
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Resource Type</Form.Label>
                <Form.Select
                  value={resourceForm.type}
                  onChange={(e) => setResourceForm({...resourceForm, type: e.target.value})}
                >
                  <option value="">Select Type</option>
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {resourceForm.type === 'past_exam' && (
            <Form.Group className="mb-3">
              <Form.Label>Exam Type</Form.Label>
              <Form.Select
                value={resourceForm.examType}
                onChange={(e) => setResourceForm({...resourceForm, examType: e.target.value})}
              >
                <option value="">Select Exam Type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={resourceForm.description}
              onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResourcesPage;
