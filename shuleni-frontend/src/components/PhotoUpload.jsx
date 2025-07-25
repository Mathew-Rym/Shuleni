import React, { useState, useRef } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload, faTrash, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';

const PhotoUpload = ({ 
  currentPhoto, 
  onPhotoUpdate, 
  userRole = 'admin',
  size = 150,
  showEditButton = true,
  disabled = false,
  className = '',
  name = 'User'
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      // Simulate upload process (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload to your server/cloud storage
      // For now, we'll use the preview URL
      const uploadedPhotoUrl = previewUrl;
      
      if (onPhotoUpdate) {
        onPhotoUpdate(uploadedPhotoUrl);
      }
      
      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Show success message
      alert('Photo updated successfully!');
      
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (window.confirm('Are you sure you want to remove your photo?')) {
      setUploading(true);
      try {
        // Simulate API call to remove photo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (onPhotoUpdate) {
          onPhotoUpdate(null);
        }
        
        alert('Photo removed successfully!');
      } catch (err) {
        setError('Failed to remove photo. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlaceholderUrl = () => {
    const initials = getInitials(name);
    const colors = {
      admin: '4A90E2',
      teacher: '10B981',
      student: 'F59E0B'
    };
    const color = colors[userRole] || '6B7280';
    return `https://via.placeholder.com/${size}/${color}/FFFFFF?text=${initials}`;
  };

  const displayPhoto = currentPhoto || getPlaceholderUrl();

  return (
    <>
      <div className={`position-relative d-inline-block ${className}`}>
        <img
          src={displayPhoto}
          alt={`${name} Profile`}
          className="rounded-circle"
          width={size}
          height={size}
          style={{
            border: '4px solid white',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }}
        />
        
        {showEditButton && !disabled && (
          <Button
            variant="primary"
            size="sm"
            className="position-absolute"
            style={{
              bottom: '5px',
              right: '5px',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowModal(true)}
            disabled={uploading}
          >
            {uploading ? (
              <FontAwesomeIcon icon={faSpinner} spin size="sm" />
            ) : (
              <FontAwesomeIcon icon={faCamera} size="sm" />
            )}
          </Button>
        )}
      </div>

      {/* Photo Upload Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faCamera} className="me-2" />
            Update Profile Photo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="text-center mb-4">
            <div className="mb-3">
              <img
                src={previewUrl || displayPhoto}
                alt="Preview"
                className="rounded-circle"
                width="120"
                height="120"
                style={{
                  border: '3px solid var(--bs-border-color)',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="outline-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Choose Photo
              </Button>
              
              {currentPhoto && (
                <Button
                  variant="outline-danger"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="small text-muted">
            <ul className="mb-0">
              <li>Supported formats: JPEG, PNG, GIF</li>
              <li>Maximum file size: 5MB</li>
              <li>Recommended: Square images for best results</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedFile(null);
              setPreviewUrl(null);
              setError('');
            }}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                Uploading...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="me-2" />
                Update Photo
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PhotoUpload;
