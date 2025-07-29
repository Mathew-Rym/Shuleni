import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './Store/store.js';
import { checkAuth } from './Store/slices/authSlice.js';
import './App.css';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateSchoolPage from './pages/CreateSchoolPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from "./pages/Student/StudentDashboard";
import EducatorsManagement from './pages/EducatorsManagement';
import StudentsManagement from './pages/StudentsManagement';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./pages/NotFound.jsx";
import Resources from './pages/Resources';
import ClassList from './pages/ClassList';
import Classes from './pages/Student/Classes.jsx';
import ResourceDetail from './pages/Student/ResourceDetail.jsx';
import ExamOverview from './pages/Student/ExamOverview.jsx';


// Import support and info pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ContactSupport from './pages/ContactSupport';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ExamTaking from './pages/Student/ExamTaking.jsx';

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
                <Resources />
              </ProtectedRoute>
            } />
            <Route path="/resource/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ResourceDetail />
              </ProtectedRoute>
            } />
            <Route path="/class/:classId" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <Classes />
              </ProtectedRoute>
            } /> 
              {/* New Route for ClassList */}
            <Route path="/class-list" element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <ClassList />
              </ProtectedRoute>
            } />

            <Route path="/exam-overview/:classId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamOverview />
              </ProtectedRoute>
            } />
            <Route path="/exam-taking/:examId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamTaking />
              </ProtectedRoute>
            } />

            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
