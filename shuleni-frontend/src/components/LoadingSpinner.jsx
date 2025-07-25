// Loading spinner component
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" size={size} />
      <p className="text-muted mt-3 mb-0">{text}</p>
    </div>
  );
};

export default LoadingSpinner;