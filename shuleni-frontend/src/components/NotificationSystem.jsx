import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

const NotificationSystem = ({ notifications, onRemoveNotification }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case 'success':
        return { icon: faCheckCircle, color: 'text-success' };
      case 'error':
        return { icon: faExclamationTriangle, color: 'text-danger' };
      case 'warning':
        return { icon: faExclamationTriangle, color: 'text-warning' };
      case 'info':
      default:
        return { icon: faInfoCircle, color: 'text-info' };
    }
  };

  return (
    <ToastContainer 
      position="top-end" 
      className="p-3"
      style={{ zIndex: 1060, position: 'fixed', top: '80px', right: '20px' }}
    >
      {notifications.map((notification) => {
        const { icon, color } = getIconAndColor(notification.type);
        
        return (
          <Toast
            key={notification.id}
            show={true}
            onClose={() => onRemoveNotification(notification.id)}
            delay={5000}
            autohide={notification.autoHide !== false}
            className="mb-2"
          >
            <Toast.Header className="d-flex align-items-center">
              <FontAwesomeIcon 
                icon={icon} 
                className={`me-2 ${color}`} 
              />
              <strong className="me-auto">{notification.title || 'Notification'}</strong>
              <small className="text-muted">now</small>
            </Toast.Header>
            <Toast.Body>
              {notification.message}
            </Toast.Body>
          </Toast>
        );
      })}
    </ToastContainer>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Success notification helper
  const showSuccess = (message, title = 'Success') => {
    addNotification({
      type: 'success',
      title,
      message,
      autoHide: true
    });
  };

  // Error notification helper
  const showError = (message, title = 'Error') => {
    addNotification({
      type: 'error',
      title,
      message,
      autoHide: false // Keep error messages visible
    });
  };

  // Warning notification helper
  const showWarning = (message, title = 'Warning') => {
    addNotification({
      type: 'warning',
      title,
      message,
      autoHide: true
    });
  };

  // Info notification helper
  const showInfo = (message, title = 'Information') => {
    addNotification({
      type: 'info',
      title,
      message,
      autoHide: true
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default NotificationSystem;
