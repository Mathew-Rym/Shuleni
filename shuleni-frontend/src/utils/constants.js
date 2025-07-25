// Application constants for Shuleni School Management System

// API Base URLs - Update these when backend is ready
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API Endpoints - Replace with actual backend endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Users
  USERS: '/users',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  ADMINS: '/admins',
  
  // Classes
  CLASSES: '/classes',
  CLASS_STUDENTS: '/classes/:id/students',
  CLASS_TEACHERS: '/classes/:id/teachers',
  
  // Resources
  RESOURCES: '/resources',
  UPLOAD_RESOURCE: '/resources/upload',
  
  // Attendance
  ATTENDANCE: '/attendance',
  MARK_ATTENDANCE: '/attendance/mark',
  
  // Dashboard
  DASHBOARD_METRICS: '/dashboard/metrics',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  
  // Exams & Assignments
  EXAMS: '/exams',
  ASSIGNMENTS: '/assignments',
  GRADES: '/grades',
  
  // Announcements
  ANNOUNCEMENTS: '/announcements',
  
  // School Management
  SCHOOLS: '/schools',
  SCHOOL_SETTINGS: '/schools/:id/settings',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  SUPER_ADMIN: 'super_admin'
};

// Application Settings
export const APP_SETTINGS = {
  APP_NAME: 'Shuleni',
  APP_VERSION: '1.0.0',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'png'],
  ITEMS_PER_PAGE: 10,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// Grade Levels
export const GRADE_LEVELS = [
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
  '11th Grade', '12th Grade'
];

// Subjects
export const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'History', 'Geography',
  'Physics', 'Chemistry', 'Biology', 'Literature', 'Art',
  'Music', 'Physical Education', 'Computer Science', 'Foreign Language'
];

// Status Options
export const STATUS_OPTIONS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  GRADUATED: 'graduated'
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
};

// Assignment/Exam Status
export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  COMPLETED: 'completed',
  GRADED: 'graded',
  OVERDUE: 'overdue'
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  USER_ROLES,
  APP_SETTINGS,
  GRADE_LEVELS,
  SUBJECTS,
  STATUS_OPTIONS,
  ATTENDANCE_STATUS,
  ASSIGNMENT_STATUS
};