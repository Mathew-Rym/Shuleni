import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotificationSystem = ({ notifications, onClose }) => {
  return (
    <ToastContainer 
      position="top-end" 
      className="position-fixed" 
      style={{ 
        zIndex: 9999, 
        top: '80px', 
        right: '10px',
        left: '10px',
        maxWidth: '400px',
        marginLeft: 'auto'
      }}
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          show={notification.show}
          onClose={() => onClose(notification.id)}
          delay={3000}
          autohide
          bg={notification.type}
          className="mb-2"
          style={{ 
            maxWidth: '100%',
            fontSize: window.innerWidth < 576 ? '0.875rem' : '1rem'
          }}
        >
          <Toast.Header className="d-flex justify-content-between align-items-center">
            <strong className="me-auto d-flex align-items-center">
              {notification.type === 'success' && <i className="fas fa-check-circle me-2 text-success"></i>}
              {notification.type === 'info' && <i className="fas fa-info-circle me-2 text-info"></i>}
              {notification.type === 'warning' && <i className="fas fa-exclamation-triangle me-2 text-warning"></i>}
              {notification.type === 'danger' && <i className="fas fa-times-circle me-2 text-danger"></i>}
              <span className="text-truncate">{notification.title}</span>
            </strong>
          </Toast.Header>
          <Toast.Body className={notification.type === 'dark' ? 'text-white' : ''}>
            <div className="text-break">
              {notification.message}
            </div>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

// Hook to manage notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, title, message) => {
    const id = Date.now();
    const newNotification = {
      id,
      type,
      title,
      message,
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
};

export default NotificationSystem;
