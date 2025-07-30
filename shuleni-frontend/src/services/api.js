import API_CONFIG, { apiRequest } from '../config/api.js';

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  register: async (userData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST'
    });
  },
  
  getProfile: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  }
};

// Users API calls
export const usersAPI = {
  getStudents: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.USERS.STUDENTS);
  },
  
  getTeachers: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.USERS.TEACHERS);
  },
  
  createStudent: async (studentData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.USERS.STUDENTS, {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },
  
  createTeacher: async (teacherData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.USERS.TEACHERS, {
      method: 'POST',
      body: JSON.stringify(teacherData)
    });
  },
  
  updateStudent: async (id, studentData) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.STUDENTS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },
  
  updateTeacher: async (id, teacherData) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.TEACHERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData)
    });
  },
  
  deleteStudent: async (id) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.STUDENTS}/${id}`, {
      method: 'DELETE'
    });
  },
  
  deleteTeacher: async (id) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USERS.TEACHERS}/${id}`, {
      method: 'DELETE'
    });
  }
};

// Classes API calls
export const classesAPI = {
  getClasses: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.CLASSES.BASE);
  },
  
  createClass: async (classData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.CLASSES.BASE, {
      method: 'POST',
      body: JSON.stringify(classData)
    });
  },
  
  updateClass: async (id, classData) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.CLASSES.BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData)
    });
  },
  
  deleteClass: async (id) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.CLASSES.BASE}/${id}`, {
      method: 'DELETE'
    });
  }
};

// Resources API calls
export const resourcesAPI = {
  getResources: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.RESOURCES.BASE);
  },
  
  uploadResource: async (formData) => {
    const token = localStorage.getItem('authToken');
    return await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESOURCES.UPLOAD}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // Don't set Content-Type for FormData
    }).then(response => response.json());
  },
  
  downloadResource: async (id) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.RESOURCES.DOWNLOAD}/${id}`);
  },
  
  deleteResource: async (id) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.RESOURCES.BASE}/${id}`, {
      method: 'DELETE'
    });
  }
};

// Attendance API calls
export const attendanceAPI = {
  getAttendance: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.ATTENDANCE.BASE);
  },
  
  takeAttendance: async (attendanceData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.ATTENDANCE.TAKE, {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    });
  },
  
  getAttendanceReports: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.ATTENDANCE.REPORTS);
  }
};

// Events API calls
export const eventsAPI = {
  getEvents: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.EVENTS.BASE);
  },
  
  createEvent: async (eventData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.EVENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  },
  
  updateEvent: async (id, eventData) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.EVENTS.BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  },
  
  deleteEvent: async (id) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.EVENTS.BASE}/${id}`, {
      method: 'DELETE'
    });
  }
};

// Exams API calls
export const examsAPI = {
  getExams: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.EXAMS.BASE);
  },
  
  createExam: async (examData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.EXAMS.BASE, {
      method: 'POST',
      body: JSON.stringify(examData)
    });
  },
  
  submitExam: async (examId, submissionData) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.EXAMS.SUBMISSIONS}/${examId}`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });
  },
  
  gradeExam: async (submissionId, gradeData) => {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.EXAMS.GRADES}/${submissionId}`, {
      method: 'POST',
      body: JSON.stringify(gradeData)
    });
  }
};

export default {
  auth: authAPI,
  users: usersAPI,
  classes: classesAPI,
  resources: resourcesAPI,
  attendance: attendanceAPI,
  events: eventsAPI,
  exams: examsAPI
};
