import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from './Store/store.js';
import { checkAuth } from './Store/slices/authSlice.js';
import './App.css';
import Navbar from './components/Navbar';


import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateSchoolPage from './pages/CreateSchoolPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from "./pages/Student/StudentDashboard";
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./pages/NotFound.jsx";

function App() {
  console.log('App component is loading...');
  
  useEffect(() => {
    console.log('App useEffect running...');
    store.dispatch(checkAuth());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div style={{padding: '20px', backgroundColor: 'white', minHeight: '100vh'}}>
                <h1>Shuleni App is Working!</h1>
                <p>If you can see this, React is working properly.</p>
                <LandingPage />
              </div>
            } />
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
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
