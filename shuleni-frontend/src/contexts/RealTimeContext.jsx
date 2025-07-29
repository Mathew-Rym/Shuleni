import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Real-time data context for managing live updates across dashboards
const RealTimeContext = createContext();

// Action types for real-time updates
const ACTIONS = {
  UPDATE_ATTENDANCE: 'UPDATE_ATTENDANCE',
  UPDATE_RESOURCES: 'UPDATE_RESOURCES',
  UPDATE_EXAMS: 'UPDATE_EXAMS',
  UPDATE_ACTIVE_CLASSES: 'UPDATE_ACTIVE_CLASSES',
  UPDATE_DETAILED_REPORT: 'UPDATE_DETAILED_REPORT',
  SET_USER_ROLE: 'SET_USER_ROLE',
  RESOURCE_UPLOADED: 'RESOURCE_UPLOADED',
  RESOURCE_DELETED: 'RESOURCE_DELETED',
  RESOURCE_UPDATED: 'RESOURCE_UPDATED',
  EXAM_CONDUCTED: 'EXAM_CONDUCTED',
  CLASS_ACTIVATED: 'CLASS_ACTIVATED'
};

// Initial state
const initialState = {
  userRole: 'student', // admin, teacher, student
  attendance: {
    daily: [],
    weekly: [],
    monthly: []
  },
  resources: [],
  exams: [],
  activeClasses: {
    today: [],
    thisWeek: [],
    thisMonth: []
  },
  detailedReport: {
    examsThisMonth: [],
    resourcesUploaded: [],
    activeClassesToday: [],
    activeClassesWeek: [],
    activeClassesMonth: [],
    monthlyAttendance: []
  },
  lastUpdated: new Date()
};

// Reducer for managing real-time state
const realTimeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload
      };

    case ACTIONS.UPDATE_ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
        lastUpdated: new Date()
      };

    case ACTIONS.UPDATE_RESOURCES:
      return {
        ...state,
        resources: action.payload,
        lastUpdated: new Date()
      };

    case ACTIONS.RESOURCE_UPLOADED:
      const newResource = {
        id: Date.now(),
        ...action.payload,
        uploadedAt: new Date(),
        uploadedBy: state.userRole
      };
      return {
        ...state,
        resources: [...state.resources, newResource],
        detailedReport: {
          ...state.detailedReport,
          resourcesUploaded: [...state.detailedReport.resourcesUploaded, newResource]
        },
        lastUpdated: new Date()
      };

    case ACTIONS.RESOURCE_DELETED:
      return {
        ...state,
        resources: state.resources.filter(r => r.id !== action.payload),
        lastUpdated: new Date()
      };

    case ACTIONS.RESOURCE_UPDATED:
      return {
        ...state,
        resources: state.resources.map(r => 
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        ),
        lastUpdated: new Date()
      };

    case ACTIONS.UPDATE_EXAMS:
      return {
        ...state,
        exams: action.payload,
        lastUpdated: new Date()
      };

    case ACTIONS.EXAM_CONDUCTED:
      const newExam = {
        id: Date.now(),
        ...action.payload,
        conductedAt: new Date()
      };
      return {
        ...state,
        exams: [...state.exams, newExam],
        detailedReport: {
          ...state.detailedReport,
          examsThisMonth: [...state.detailedReport.examsThisMonth, newExam]
        },
        lastUpdated: new Date()
      };

    case ACTIONS.UPDATE_ACTIVE_CLASSES:
      return {
        ...state,
        activeClasses: action.payload,
        detailedReport: {
          ...state.detailedReport,
          activeClassesToday: action.payload.today || [],
          activeClassesWeek: action.payload.thisWeek || [],
          activeClassesMonth: action.payload.thisMonth || []
        },
        lastUpdated: new Date()
      };

    case ACTIONS.CLASS_ACTIVATED:
      const newActiveClass = {
        id: Date.now(),
        ...action.payload,
        activatedAt: new Date()
      };
      return {
        ...state,
        activeClasses: {
          ...state.activeClasses,
          today: [...state.activeClasses.today, newActiveClass]
        },
        detailedReport: {
          ...state.detailedReport,
          activeClassesToday: [...state.detailedReport.activeClassesToday, newActiveClass]
        },
        lastUpdated: new Date()
      };

    case ACTIONS.UPDATE_DETAILED_REPORT:
      return {
        ...state,
        detailedReport: {
          ...state.detailedReport,
          ...action.payload
        },
        lastUpdated: new Date()
      };

    default:
      return state;
  }
};

// Real-time data provider component
export const RealTimeProvider = ({ children, userRole = 'student' }) => {
  const [state, dispatch] = useReducer(realTimeReducer, {
    ...initialState,
    userRole
  });

  // Simulate real-time updates (in production, this would be WebSocket connections)
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate real-time attendance data
      const generateAttendanceData = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Generate monthly attendance data
        const monthlyData = [];
        for (let day = 1; day <= new Date(currentYear, currentMonth + 1, 0).getDate(); day++) {
          const date = new Date(currentYear, currentMonth, day);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          if (!isWeekend && date <= today) {
            monthlyData.push({
              date: date.toISOString().split('T')[0],
              present: Math.floor(Math.random() * 50) + 180, // 180-230 students
              absent: Math.floor(Math.random() * 20) + 5,    // 5-25 absent
              totalStudents: 215
            });
          }
        }

        return {
          daily: monthlyData.slice(-1), // Today's data
          weekly: monthlyData.slice(-7), // Last 7 days
          monthly: monthlyData // Full month
        };
      };

      // Generate active classes data
      const generateActiveClasses = () => {
        const classes = [
          { id: 1, name: 'Grade 10 Mathematics', teacher: 'Mr. Johnson', time: '09:00-10:00', subject: 'Mathematics' },
          { id: 2, name: 'Form 2 Chemistry', teacher: 'Dr. Smith', time: '10:30-11:30', subject: 'Chemistry' },
          { id: 3, name: 'Grade 8 English', teacher: 'Ms. Davis', time: '14:00-15:00', subject: 'English' },
          { id: 4, name: 'Form 4 Physics', teacher: 'Prof. Wilson', time: '15:30-16:30', subject: 'Physics' }
        ];

        return {
          today: classes.slice(0, 2),
          thisWeek: classes,
          thisMonth: [...classes, ...classes.map(c => ({ ...c, id: c.id + 10 }))]
        };
      };

      // Generate resources data
      const generateResources = () => {
        return [
          {
            id: 1,
            name: 'Mathematics Workbook Chapter 5',
            type: 'pdf',
            subject: 'Mathematics',
            class: 'Grade 10',
            uploadedBy: 'Mr. Johnson',
            uploadedAt: new Date(Date.now() - 86400000), // Yesterday
            size: '2.5 MB',
            downloads: 45
          },
          {
            id: 2,
            name: 'Chemistry Lab Manual',
            type: 'pdf',
            subject: 'Chemistry',
            class: 'Form 2',
            uploadedBy: 'Dr. Smith',
            uploadedAt: new Date(Date.now() - 172800000), // 2 days ago
            size: '5.1 MB',
            downloads: 32
          },
          {
            id: 3,
            name: 'English Literature Essays',
            type: 'docx',
            subject: 'English',
            class: 'Grade 8',
            uploadedBy: 'Ms. Davis',
            uploadedAt: new Date(),
            size: '1.8 MB',
            downloads: 18
          }
        ];
      };

      // Generate exam data
      const generateExams = () => {
        return [
          {
            id: 1,
            title: 'Mathematics Mid-term Exam',
            class: 'Grade 10',
            subject: 'Mathematics',
            conductedAt: new Date(Date.now() - 259200000), // 3 days ago
            totalStudents: 35,
            completed: 33,
            averageScore: 78.5
          },
          {
            id: 2,
            title: 'Chemistry Quiz',
            class: 'Form 2',
            subject: 'Chemistry',
            conductedAt: new Date(),
            totalStudents: 28,
            completed: 25,
            averageScore: 82.3
          }
        ];
      };

      // Update all real-time data
      dispatch({ type: ACTIONS.UPDATE_ATTENDANCE, payload: generateAttendanceData() });
      dispatch({ type: ACTIONS.UPDATE_ACTIVE_CLASSES, payload: generateActiveClasses() });
      dispatch({ type: ACTIONS.UPDATE_RESOURCES, payload: generateResources() });
      dispatch({ type: ACTIONS.UPDATE_EXAMS, payload: generateExams() });

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Action creators
  const actions = {
    setUserRole: (role) => dispatch({ type: ACTIONS.SET_USER_ROLE, payload: role }),
    
    uploadResource: (resource) => dispatch({ type: ACTIONS.RESOURCE_UPLOADED, payload: resource }),
    
    deleteResource: (resourceId) => dispatch({ type: ACTIONS.RESOURCE_DELETED, payload: resourceId }),
    
    updateResource: (resourceId, updates) => dispatch({ 
      type: ACTIONS.RESOURCE_UPDATED, 
      payload: { id: resourceId, updates } 
    }),
    
    conductExam: (exam) => dispatch({ type: ACTIONS.EXAM_CONDUCTED, payload: exam }),
    
    activateClass: (classData) => dispatch({ type: ACTIONS.CLASS_ACTIVATED, payload: classData }),
    
    updateDetailedReport: (reportData) => dispatch({ 
      type: ACTIONS.UPDATE_DETAILED_REPORT, 
      payload: reportData 
    })
  };

  const value = {
    state,
    actions,
    userRole: state.userRole,
    attendance: state.attendance,
    resources: state.resources,
    exams: state.exams,
    activeClasses: state.activeClasses,
    detailedReport: state.detailedReport,
    lastUpdated: state.lastUpdated
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};

// Custom hook to use real-time context
export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

// Role-based data filtering
export const useRoleBasedData = () => {
  const { state, userRole } = useRealTime();
  
  const getFilteredData = useCallback(() => {
    switch (userRole) {
      case 'admin':
        // Admin can see everything
        return {
          canSeeAllData: true,
          searchableEntities: ['students', 'teachers', 'classes', 'resources', 'exams'],
          attendance: state.attendance,
          resources: state.resources,
          exams: state.exams,
          activeClasses: state.activeClasses
        };
      
      case 'teacher':
        // Teachers can see their classes, students, and resources
        return {
          canSeeAllData: false,
          searchableEntities: ['students', 'classes', 'resources'],
          attendance: {
            daily: state.attendance.daily,
            weekly: state.attendance.weekly,
            monthly: state.attendance.monthly.filter(a => a.teacherId === 'current_teacher_id')
          },
          resources: state.resources,
          exams: state.exams.filter(e => e.teacherId === 'current_teacher_id'),
          activeClasses: {
            today: state.activeClasses.today.filter(c => c.teacherId === 'current_teacher_id'),
            thisWeek: state.activeClasses.thisWeek.filter(c => c.teacherId === 'current_teacher_id'),
            thisMonth: state.activeClasses.thisMonth.filter(c => c.teacherId === 'current_teacher_id')
          }
        };
      
      case 'student':
        // Students can only see their own data and downloadable resources
        return {
          canSeeAllData: false,
          searchableEntities: ['classes', 'resources'],
          attendance: {
            daily: state.attendance.daily.filter(a => a.studentId === 'current_student_id'),
            weekly: state.attendance.weekly.filter(a => a.studentId === 'current_student_id'),
            monthly: state.attendance.monthly.filter(a => a.studentId === 'current_student_id')
          },
          resources: state.resources.filter(r => r.class === 'student_class'),
          exams: state.exams.filter(e => e.studentId === 'current_student_id'),
          activeClasses: {
            today: state.activeClasses.today.filter(c => c.studentClass === 'student_class'),
            thisWeek: state.activeClasses.thisWeek.filter(c => c.studentClass === 'student_class'),
            thisMonth: state.activeClasses.thisMonth.filter(c => c.studentClass === 'student_class')
          }
        };
      
      default:
        return {
          canSeeAllData: false,
          searchableEntities: [],
          attendance: { daily: [], weekly: [], monthly: [] },
          resources: [],
          exams: [],
          activeClasses: { today: [], thisWeek: [], thisMonth: [] }
        };
    }
  }, [state, userRole]);

  return getFilteredData();
};

export default RealTimeContext;
