import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Class from './pages/Classes.jsx';
import ExamTaking from './pages/Student/ExamTaking.jsx';
import ExamOverview from './pages/Student/ExamOverview.jsx';
import Resources from './pages/Resources.jsx';
import ResourceDetail from './pages/Student/ResourceDetail.jsx';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

export default function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/classes" element={<Class />} />
          <Route path="/exam-taking" element={<ExamTaking />} />
          <Route path="/exam-overview" element={<ExamOverview />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}
