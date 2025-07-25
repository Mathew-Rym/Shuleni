import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classes: [],
  resources: [],
  loading: false,
  error: null,
};

const mockClasses = [
  {
    id: 1,
    name: 'Basic Mathematics',
    teacher: 'Ms. Jane',
    teacherId: 1,
    students: 28,
    grade: '9th Grade',
    gradeLevel: 9,
    subject: 'Mathematics',
    description: 'Foundational mathematics covering basic algebra and geometry',
    schedule: 'Mon, Wed, Fri - 8:00 AM',
    room: 'Room 101',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=MATH+9',
    color: '#4A90E2',
    studentsEnrolled: [
      { id: 1, name: 'Alice Johnson', grade: 'A-', attendance: 95, assignments: { completed: 8, total: 10 } },
      { id: 2, name: 'Bob Smith', grade: 'B+', attendance: 88, assignments: { completed: 7, total: 10 } },
      { id: 3, name: 'Carol Davis', grade: 'A', attendance: 100, assignments: { completed: 10, total: 10 } }
    ],
    assignments: [
      {
        id: 1001,
        title: 'Algebra Fundamentals Quiz',
        description: 'Complete the algebra worksheet covering linear equations and graphing.',
        dueDate: '2025-08-01T23:59:00',
        maxPoints: 100,
        teacherId: 1,
        teacherName: 'Ms. Jane',
        createdAt: '2025-07-20T10:00:00',
        submissions: [
          {
            id: 2001,
            studentId: 1,
            studentName: 'Alice Johnson',
            fileName: 'alice_algebra_quiz.pdf',
            submittedAt: '2025-07-30T14:30:00',
            grade: 95,
            feedback: 'Excellent work! Great understanding of linear equations.',
            isGraded: true
          },
          {
            id: 2002,
            studentId: 2,
            studentName: 'Bob Smith',
            fileName: 'bob_algebra_quiz.pdf',
            submittedAt: '2025-07-31T09:15:00',
            grade: null,
            feedback: null,
            isGraded: false
          }
        ]
      }
    ],
    announcements: [
      {
        id: 3001,
        title: 'Upcoming Test Reminder',
        message: 'Don\'t forget about the algebra test next Friday. Please review chapters 3-5.',
        teacherId: 1,
        teacherName: 'Ms. Jane',
        priority: 'important',
        createdAt: '2025-07-24T08:00:00'
      }
    ]
  },
  {
    id: 2,
    name: 'Earth Science',
    teacher: 'Mr. Jones',
    teacherId: 2,
    students: 25,
    grade: '9th Grade',
    gradeLevel: 9,
    subject: 'Science',
    description: 'Introduction to earth sciences and environmental studies',
    schedule: 'Tue, Thu - 9:00 AM',
    room: 'Lab 201',
    image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=EARTH+SCI',
    color: '#50C878',
    studentsEnrolled: [
      { id: 4, name: 'David Wilson', grade: 'B', attendance: 92, assignments: { completed: 6, total: 8 } },
      { id: 5, name: 'Eva Martinez', grade: 'A-', attendance: 96, assignments: { completed: 8, total: 8 } }
    ]
  },
  {
    id: 3,
    name: 'Advanced Mathematics',
    teacher: 'Ms. Jane',
    teacherId: 1,
    students: 25,
    grade: '10th Grade',
    gradeLevel: 10,
    subject: 'Mathematics',
    description: 'Advanced mathematics covering algebra and pre-calculus',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    room: 'Room 101',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=MATH+10',
    color: '#4A90E2',
    studentsEnrolled: [
      { id: 6, name: 'Frank Garcia', grade: 'A', attendance: 98, assignments: { completed: 9, total: 10 } },
      { id: 7, name: 'Grace Lee', grade: 'B+', attendance: 90, assignments: { completed: 8, total: 10 } }
    ]
  },
  {
    id: 4,
    name: 'Chemistry & Physics',
    teacher: 'Mr. Jones',
    teacherId: 2,
    students: 22,
    grade: '10th Grade',
    gradeLevel: 10,
    subject: 'Science',
    description: 'Introduction to chemistry and physics fundamentals',
    schedule: 'Tue, Thu - 10:00 AM',
    room: 'Lab 201',
    image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=CHEM+PHYS',
    color: '#50C878',
    studentsEnrolled: [
      { id: 8, name: 'Henry Brown', grade: 'A-', attendance: 94, assignments: { completed: 7, total: 9 } },
      { id: 9, name: 'Ivy Chen', grade: 'A', attendance: 100, assignments: { completed: 9, total: 9 } }
    ]
  },
  {
    id: 5,
    name: 'World History',
    teacher: 'Ms. Brown',
    teacherId: 3,
    students: 28,
    grade: '10th Grade',
    gradeLevel: 10,
    subject: 'History',
    description: 'World history and ancient civilizations',
    schedule: 'Mon, Wed - 2:00 PM',
    room: 'Room 301',
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=HISTORY',
    color: '#FF6B6B',
    studentsEnrolled: [
      { id: 10, name: 'Jack Taylor', grade: 'B', attendance: 85, assignments: { completed: 5, total: 8 } },
      { id: 11, name: 'Kate Johnson', grade: 'A', attendance: 97, assignments: { completed: 8, total: 8 } }
    ]
  },
  // 11th Grade Classes
  {
    id: 6,
    name: 'Pre-Calculus',
    teacher: 'Dr. Anderson',
    teacherId: 5,
    students: 20,
    grade: '11th Grade',
    gradeLevel: 11,
    subject: 'Mathematics',
    description: 'Advanced pre-calculus and trigonometry',
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    room: 'Room 105',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=PRE-CALC',
    color: '#4A90E2',
    studentsEnrolled: [
      { id: 12, name: 'Liam Davis', grade: 'A-', attendance: 93, assignments: { completed: 11, total: 12 } },
      { id: 13, name: 'Mia Rodriguez', grade: 'B+', attendance: 89, assignments: { completed: 10, total: 12 } }
    ]
  },
  {
    id: 7,
    name: 'Advanced Biology',
    teacher: 'Dr. Smith',
    teacherId: 6,
    students: 18,
    grade: '11th Grade',
    gradeLevel: 11,
    subject: 'Science',
    description: 'Advanced biology and genetics',
    schedule: 'Tue, Thu - 11:00 AM',
    room: 'Lab 301',
    image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=BIO+ADV',
    color: '#50C878',
    studentsEnrolled: [
      { id: 14, name: 'Noah Wilson', grade: 'A', attendance: 100, assignments: { completed: 8, total: 8 } },
      { id: 15, name: 'Olivia Martinez', grade: 'A-', attendance: 95, assignments: { completed: 7, total: 8 } }
    ]
  },
  {
    id: 8,
    name: 'Literature & Composition',
    teacher: 'Mr. Wilson',
    teacherId: 4,
    students: 24,
    grade: '11th Grade',
    gradeLevel: 11,
    subject: 'English',
    description: 'Advanced literature analysis and creative writing',
    schedule: 'Mon, Tue, Thu - 1:00 PM',
    room: 'Room 102',
    image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=LIT+COMP',
    color: '#9B59B6',
    studentsEnrolled: [
      { id: 16, name: 'Paul Garcia', grade: 'B+', attendance: 87, assignments: { completed: 6, total: 9 } },
      { id: 17, name: 'Quinn Lee', grade: 'A', attendance: 99, assignments: { completed: 9, total: 9 } }
    ]
  },
  // 12th Grade Classes
  {
    id: 9,
    name: 'AP Calculus',
    teacher: 'Dr. Anderson',
    teacherId: 5,
    students: 15,
    grade: '12th Grade',
    gradeLevel: 12,
    subject: 'Mathematics',
    description: 'Advanced Placement Calculus AB',
    schedule: 'Mon, Wed, Fri - 11:00 AM',
    room: 'Room 105',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=AP+CALC',
    color: '#4A90E2',
    studentsEnrolled: [
      { id: 18, name: 'Ryan Brown', grade: 'A', attendance: 100, assignments: { completed: 12, total: 12 } },
      { id: 19, name: 'Sophia Chen', grade: 'A-', attendance: 97, assignments: { completed: 11, total: 12 } }
    ]
  },
  {
    id: 10,
    name: 'AP Physics',
    teacher: 'Dr. Smith',
    teacherId: 6,
    students: 16,
    grade: '12th Grade',
    gradeLevel: 12,
    subject: 'Science',
    description: 'Advanced Placement Physics C',
    schedule: 'Tue, Thu - 2:00 PM',
    room: 'Lab 301',
    image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=AP+PHYS',
    color: '#50C878',
    studentsEnrolled: [
      { id: 20, name: 'Tyler Taylor', grade: 'B+', attendance: 92, assignments: { completed: 8, total: 10 } },
      { id: 21, name: 'Uma Johnson', grade: 'A', attendance: 98, assignments: { completed: 10, total: 10 } }
    ]
  }
];

// Mock resources data
const mockResources = [
  {
    id: 1,
    title: 'Mathematics Notes',
    description: 'Comprehensive notes on Algebra and Calculus',
    type: 'Notes',
    subject: 'Math',
    author: 'Ms. Smith',
    uploadDate: '2024-01-15',
    fileSize: '2.5 MB',
    downloads: 45,
  },
  {
    id: 2,
    title: 'Science Resources',
    description: 'Interactive experiments and documents',
    type: 'Resources',
    subject: 'Science',
    author: 'Mr. Jones',
    uploadDate: '2024-01-20',
    fileSize: '5.2 MB',
    downloads: 38,
  },
  {
    id: 3,
    title: 'History Readings',
    description: 'Key events and dates in History',
    type: 'Readings',
    subject: 'History',
    author: 'Ms. Brown',
    uploadDate: '2024-01-18',
    fileSize: '3.8 MB',
    downloads: 52,
  },
];

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Classes actions
    setClasses: (state, action) => {
      state.classes = action.payload;
      state.loading = false;
    },
    addClass: (state, action) => {
      state.classes.push({
        ...action.payload,
        id: Date.now(),
        students: 0,
        image: `https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=${action.payload.name.toUpperCase()}`,
        color: '#4A90E2',
      });
    },
    updateClass: (state, action) => {
      const index = state.classes.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = { ...state.classes[index], ...action.payload };
      }
    },
    
    // Teacher assignment actions
    assignTeacherToClass: (state, action) => {
      const { classId, teacherId, teacherName } = action.payload;
      const classItem = state.classes.find(c => c.id === classId);
      if (classItem) {
        classItem.teacherId = teacherId;
        classItem.teacher = teacherName;
        classItem.lastUpdated = new Date().toISOString();
      }
    },
    
    removeTeacherFromClass: (state, action) => {
      const { classId } = action.payload;
      const classItem = state.classes.find(c => c.id === classId);
      if (classItem) {
        classItem.teacherId = null;
        classItem.teacher = null;
        classItem.lastUpdated = new Date().toISOString();
      }
    },
    deleteClass: (state, action) => {
      state.classes = state.classes.filter(c => c.id !== action.payload);
    },
    
    // Resources actions
    setResources: (state, action) => {
      state.resources = action.payload;
      state.loading = false;
    },
    addResource: (state, action) => {
      state.resources.push({
        ...action.payload,
        id: Date.now(),
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0,
      });
    },
    updateResource: (state, action) => {
      const index = state.resources.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.resources[index] = { ...state.resources[index], ...action.payload };
      }
    },
    deleteResource: (state, action) => {
      state.resources = state.resources.filter(r => r.id !== action.payload);
    },

    // Student interaction actions
    updateStudentGrade: (state, action) => {
      const { classId, studentId, newGrade } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        const studentIndex = state.classes[classIndex].studentsEnrolled.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          state.classes[classIndex].studentsEnrolled[studentIndex].grade = newGrade;
        }
      }
    },

    updateStudentAttendance: (state, action) => {
      const { classId, studentId, newAttendance } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        const studentIndex = state.classes[classIndex].studentsEnrolled.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          state.classes[classIndex].studentsEnrolled[studentIndex].attendance = newAttendance;
        }
      }
    },

    updateStudentAssignment: (state, action) => {
      const { classId, studentId, assignmentData } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        const studentIndex = state.classes[classIndex].studentsEnrolled.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          state.classes[classIndex].studentsEnrolled[studentIndex].assignments = assignmentData;
        }
      }
    },

    addAnnouncementToClass: (state, action) => {
      const { classId, announcement } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        if (!state.classes[classIndex].announcements) {
          state.classes[classIndex].announcements = [];
        }
        state.classes[classIndex].announcements.unshift({
          id: Date.now(),
          ...announcement,
          timestamp: new Date().toISOString()
        });
      }
    },

    // New enhanced teacher functionality actions
    addAssignment: (state, action) => {
      const { classId, ...assignmentData } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === parseInt(classId));
      if (classIndex !== -1) {
        if (!state.classes[classIndex].assignments) {
          state.classes[classIndex].assignments = [];
        }
        state.classes[classIndex].assignments.push({
          id: Date.now(),
          ...assignmentData,
          submissions: []
        });
      }
    },

    addAnnouncement: (state, action) => {
      const { classId, ...announcementData } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === parseInt(classId));
      if (classIndex !== -1) {
        if (!state.classes[classIndex].announcements) {
          state.classes[classIndex].announcements = [];
        }
        state.classes[classIndex].announcements.unshift({
          id: Date.now(),
          ...announcementData,
          timestamp: new Date().toISOString()
        });
      }
    },

    updateAttendance: (state, action) => {
      const { classId, studentId, status, date } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        const studentIndex = state.classes[classIndex].studentsEnrolled.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
          // Initialize attendance records if not exists
          if (!state.classes[classIndex].studentsEnrolled[studentIndex].attendanceRecords) {
            state.classes[classIndex].studentsEnrolled[studentIndex].attendanceRecords = [];
          }
          
          // Add or update attendance record
          const existingRecordIndex = state.classes[classIndex].studentsEnrolled[studentIndex].attendanceRecords
            .findIndex(record => record.date === date);
          
          if (existingRecordIndex !== -1) {
            state.classes[classIndex].studentsEnrolled[studentIndex].attendanceRecords[existingRecordIndex].status = status;
          } else {
            state.classes[classIndex].studentsEnrolled[studentIndex].attendanceRecords.push({
              date,
              status,
              markedBy: action.payload.markedBy || 'Teacher'
            });
          }
          
          // Recalculate attendance percentage
          const records = state.classes[classIndex].studentsEnrolled[studentIndex].attendanceRecords;
          const presentCount = records.filter(r => r.status === 'present').length;
          const totalCount = records.length;
          state.classes[classIndex].studentsEnrolled[studentIndex].attendance = 
            Math.round((presentCount / totalCount) * 100);
        }
      }
    },

    gradeAssignment: (state, action) => {
      const { submissionId, grade, feedback, gradedBy, gradedAt } = action.payload;
      
      // Find the submission across all classes and assignments
      state.classes.forEach(classItem => {
        if (classItem.assignments) {
          classItem.assignments.forEach(assignment => {
            if (assignment.submissions) {
              const submissionIndex = assignment.submissions.findIndex(s => s.id === submissionId);
              if (submissionIndex !== -1) {
                assignment.submissions[submissionIndex] = {
                  ...assignment.submissions[submissionIndex],
                  grade: parseFloat(grade),
                  feedback,
                  gradedBy,
                  gradedAt,
                  isGraded: true
                };
              }
            }
          });
        }
      });
    },
  },
});

// BACKEND TODO: Implement GET /api/classes endpoint
export const fetchClasses = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/classes');
    // const classes = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setClasses(mockClasses));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement GET /api/resources endpoint
export const fetchResources = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/resources');
    // const resources = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setResources(mockResources));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement POST /api/classes endpoint
export const createClass = (classData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/classes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(classData),
    // });
    // const newClass = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addClass(classData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setLoading,
  setError,
  clearError,
  setClasses,
  addClass,
  updateClass,
  deleteClass,
  setResources,
  addResource,
  updateResource,
  deleteResource,
  updateStudentGrade,
  updateStudentAttendance,
  updateStudentAssignment,
  addAnnouncementToClass,
  // New enhanced actions
  addAssignment,
  addAnnouncement,
  updateAttendance,
  gradeAssignment,
  // Teacher assignment actions
  assignTeacherToClass,
  removeTeacherFromClass,
} = classesSlice.actions;

export default classesSlice.reducer;