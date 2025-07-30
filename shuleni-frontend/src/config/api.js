// API Configuration for Shuleni App
const API_CONFIG = {
  // Base URL - will use environment variable or fallback
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://shuleni-sfox.onrender.com',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
      PROFILE: '/api/auth/profile'
    },
    
    // Users Management
    USERS: {
      STUDENTS: '/api/users/students',
      TEACHERS: '/api/users/teachers',
      ADMINS: '/api/users/admins'
    },
    
    // Classes Management
    CLASSES: {
      BASE: '/api/classes',
      ASSIGNMENTS: '/api/classes/assignments',
      ENROLLMENT: '/api/classes/enrollment'
    },
    
    // Resources Management
    RESOURCES: {
      BASE: '/api/resources',
      UPLOAD: '/api/resources/upload',
      DOWNLOAD: '/api/resources/download'
    },
    
    // Attendance
    ATTENDANCE: {
      BASE: '/api/attendance',
      TAKE: '/api/attendance/take',
      REPORTS: '/api/attendance/reports'
    },
    
    // Exams
    EXAMS: {
      BASE: '/api/exams',
      SUBMISSIONS: '/api/exams/submissions',
      GRADES: '/api/exams/grades'
    },
    
    // Calendar Events
    EVENTS: {
      BASE: '/api/events',
      CREATE: '/api/events/create',
      UPDATE: '/api/events/update'
    },
    
    // Schools
    SCHOOLS: {
      BASE: '/api/schools',
      CREATE: '/api/schools/create'
    }
  },
  
  // Request timeout
  TIMEOUT: 30000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? {
    ...API_CONFIG.HEADERS,
    'Authorization': `Bearer ${token}`
  } : API_CONFIG.HEADERS;
};

// API request helper
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  
  const config = {
    method: 'GET',
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_CONFIG;
