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
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./pages/NotFound.jsx";

// Import support and info pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ContactSupport from './pages/ContactSupport';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';

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
            
            {/* Support and Information Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-us" element={<ContactUs />} />
          
           {/* Protected Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
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
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
