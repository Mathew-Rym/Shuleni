import { Link } from 'react-router-dom';
import React from 'react';
import './LandingPage.css'; // Assuming you have some styles for the landing page

export default function LandingPage() {
  return (
    <div className="container text-center my-5 p-5">
      <h1 className="fw-bold">Welcome to Shuleni</h1>
      <p className="lead text-muted">A modern platform for full online schooling</p>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary mx-2">Login</Link>
      </div>
    </div>
  );
}
