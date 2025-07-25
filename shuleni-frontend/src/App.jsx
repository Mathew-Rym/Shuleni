import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './Store/store.js';
import { checkAuth } from './Store/slices/authSlice.js';
import { LanguageProvider } from './contexts/LanguageContext.jsx';


import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateSchoolPage from './pages/CreateSchoolPage';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ContactSupport from './pages/ContactSupport';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentsPage from './pages/StudentsPage';
import ProfilePage from './pages/ProfilePage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./pages/NotFound.jsx";

function App() {
  useEffect(() => {

    store.dispatch(checkAuth());
  }, []);

  return (
    <Provider store={store}>
      <LanguageProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/contact" element={<ContactSupport />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-school" element={<CreateSchoolPage />} />
              
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

              {/* Students Management */}
              <Route path="/students" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentsPage />
                </ProtectedRoute>
              } />
              
              {/* User Profile & Settings */}
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                  <AccountSettingsPage />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </Provider>
  );
}

export default App;
