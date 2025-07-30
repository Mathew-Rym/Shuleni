import React, { useState, useRef } from 'react';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import './PhotoUpload.css';

const PhotoUpload = ({ 
  currentPhoto, 
  onPhotoUpdate, 
  userRole = 'user', 
  size = 120, 
  name = 'User',
  showEditButton = true,
  className = '',
  userId = null 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPlaceholderColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'teacher': return '#198754';
      case 'student': return '#0d6efd';
      default: return '#6c757d';
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, upload to your backend/cloud storage
      // const formData = new FormData();
      // formData.append('photo', file);
      // formData.append('userId', userId);
      // formData.append('userRole', userRole);
      // 
      // const response = await fetch('/api/upload-photo', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      
      // For now, use the preview URL as the uploaded photo
      const uploadedUrl = previewUrl;
      
      // Call the callback to update the photo in parent component
      onPhotoUpdate(uploadedUrl);
      
      // Close modal and reset state
      setShowModal(false);
      setPreviewUrl(null);
      
      // Show success message
      setTimeout(() => {
        alert(`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} photo updated successfully! The change will be visible across all dashboards immediately.`);
      }, 300);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Are you sure you want to remove this photo?')) {
      onPhotoUpdate(null);
      setShowModal(false);
      setPreviewUrl(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Photo Display */}
      <div className={`position-relative d-inline-block ${className}`}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center position-relative overflow-hidden"
          style={{
            width: size,
            height: size,
            backgroundColor: currentPhoto ? 'transparent' : getPlaceholderColor(userRole),
            border: '3px solid #fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: showEditButton ? 'pointer' : 'default'
          }}
          onClick={showEditButton ? () => setShowModal(true) : undefined}
        >
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt={`${name}'s photo`}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <span 
              className="fw-bold text-white" 
              style={{ fontSize: size * 0.25 }}
            >
              {getInitials(name)}
            </span>
          )}
          
          {/* Edit overlay */}
          {showEditButton && (
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = 1}
              onMouseLeave={(e) => e.target.style.opacity = 0}
            >
              <FontAwesomeIcon icon={faCamera} className="text-white" style={{ fontSize: size * 0.15 }} />
            </div>
          )}
        </div>
        
        {/* Edit button */}
        {showEditButton && (
          <Button
            size="sm"
            variant="primary"
            className="position-absolute bottom-0 end-0 rounded-circle p-1"
            style={{ width: '28px', height: '28px' }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faEdit} style={{ fontSize: '12px' }} />
          </Button>
        )}
      </div>

      {/* Upload Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faCamera} className="me-2" />
            Update {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Photo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="mb-3">
              <strong>{name}</strong>
              <div className="text-muted small">{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Profile</div>
            </div>
            
            {/* Current/Preview Photo */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 overflow-hidden"
              style={{
                width: 120,
                height: 120,
                backgroundColor: (previewUrl || currentPhoto) ? 'transparent' : getPlaceholderColor(userRole),
                border: '3px solid #dee2e6'
              }}
            >
              {(previewUrl || currentPhoto) ? (
                <img
                  src={previewUrl || currentPhoto}
                  alt="Preview"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span className="fw-bold text-white" style={{ fontSize: '30px' }}>
                  {getInitials(name)}
                </span>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded p-4 text-center mb-3 ${
              dragOver ? 'border-primary bg-light' : 'border-secondary'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{ cursor: 'pointer' }}
            onClick={triggerFileInput}
          >
            <FontAwesomeIcon icon={faUpload} className="text-muted mb-2" style={{ fontSize: '2rem' }} />
            <div className="fw-bold">Drop photo here or click to upload</div>
            <small className="text-muted">Supports JPG, PNG, GIF up to 5MB</small>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          {previewUrl && (
            <Alert variant="info" className="small">
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              New photo selected. Click "Update Photo" to save changes.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              {currentPhoto && (
                <Button variant="outline-danger" onClick={handleRemovePhoto}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Remove Photo
                </Button>
              )}
            </div>
            <div>
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpload}
                disabled={!previewUrl || uploading}
              >
                {uploading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCamera} className="me-2" />
                    Update Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PhotoUpload;