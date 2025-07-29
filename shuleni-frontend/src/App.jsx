import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './Store/store.js';
import { checkAuth } from './Store/slices/authSlice.js';
import './App.css';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Login from './pages/Login';
import CreateSchoolPage from './pages/CreateSchoolPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from "./pages/Student/StudentDashboard";
import EducatorsManagement from './pages/EducatorsManagement';
import StudentsManagement from './pages/StudentsManagement';
import ResourcesPage from './pages/ResourcesPage';
import Classes from './pages/Classes';
import ClassList from './pages/ClassList';
import ClassNotes from './pages/ClassNotes';
import ExamOverview from './pages/ExamOverview';
import ExamTaking from './pages/ExamTaking';
import ResourceDetail from './pages/ResourceDetail';
import SchoolCreation from './pages/SchoolCreation';
import StudentProfile from './pages/StudentProfile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./pages/NotFound.jsx";

// Import support and info pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ContactSupport from './pages/ContactSupport';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-school" element={<CreateSchoolPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Support and Information Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn-more" element={<About />} />
          
           {/* Protected Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/educators" element={
              <ProtectedRoute allowedRoles={['admin']}>
                  <EducatorsManagement />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={['admin']}>
                  <StudentsManagement />
              </ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ResourcesPage />
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <Classes />
              </ProtectedRoute>
            } />
            <Route path="/class-list" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ClassList />
              </ProtectedRoute>
            } />
            <Route path="/class-notes/:classId" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ClassNotes />
              </ProtectedRoute>
            } />
            <Route path="/exam-overview" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ExamOverview />
              </ProtectedRoute>
            } />
            <Route path="/exam-taking/:examId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamTaking />
              </ProtectedRoute>
            } />
            <Route path="/resource/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ResourceDetail />
              </ProtectedRoute>
            } />
            <Route path="/school-creation" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SchoolCreation />
              </ProtectedRoute>
            } />
            <Route path="/student-profile/:studentId" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            
            {/* Alternative login route */}
            <Route path="/login-alt" element={<Login />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
