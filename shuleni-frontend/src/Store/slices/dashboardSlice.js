// Dashboard data slice for analytics and metrics
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
    activeClasses: 0,
    resourcesUploaded: 0,
    examsCompleted: 0,
  },
  attendanceData: [],
  recentActivity: [],
  announcements: [],
  loading: false,
  error: null,
};

// Mock metrics data
const mockMetrics = {
  totalStudents: 250,
  totalTeachers: 25,
  totalClasses: 10,
  attendanceRate: 95,
  activeClasses: 10,
  resourcesUploaded: 150,
  examsCompleted: 30,
};

// Mock attendance data for charts
const mockAttendanceData = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 88 },
  { month: 'Mar', attendance: 95 },
  { month: 'Apr', attendance: 89 },
  { month: 'May', attendance: 94 },
  { month: 'Jun', attendance: 91 },
  { month: 'Jul', attendance: 96 },
  { month: 'Aug', attendance: 93 },
];

// Mock recent activity
const mockRecentActivity = [
  {
    id: 1,
    type: 'student_added',
    message: 'New student John Doe enrolled in Mathematics',
    timestamp: '2024-01-22T10:30:00Z',
    user: 'Admin',
  },
  {
    id: 2,
    type: 'resource_uploaded',
    message: 'Ms. Jane uploaded new Math notes',
    timestamp: '2024-01-22T09:15:00Z',
    user: 'Ms. Jane',
  },
  {
    id: 3,
    type: 'attendance_marked',
    message: 'Attendance marked for Science class',
    timestamp: '2024-01-22T08:45:00Z',
    user: 'Mr. Jones',
  },
];

// Mock announcements
const mockAnnouncements = [
  {
    id: 1,
    title: 'School Assembly Tomorrow',
    message: 'All students and teachers are required to attend the morning assembly.',
    date: '2024-01-23',
    priority: 'high',
    author: 'Principal',
  },
  {
    id: 2,
    title: 'New Learning Resources Available',
    message: 'Check out the latest study materials uploaded to the resources section.',
    date: '2024-01-22',
    priority: 'medium',
    author: 'Library Staff',
  },
];

const dashboardSlice = createSlice({
  name: 'dashboard',
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
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    setAttendanceData: (state, action) => {
      state.attendanceData = action.payload;
    },
    setRecentActivity: (state, action) => {
      state.recentActivity = action.payload;
    },
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    addActivity: (state, action) => {
      state.recentActivity.unshift({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      });
      // Keep only last 10 activities
      if (state.recentActivity.length > 10) {
        state.recentActivity = state.recentActivity.slice(0, 10);
      }
    },
    addAnnouncement: (state, action) => {
      state.announcements.unshift({
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      });
    },
    deleteAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(a => a.id !== action.payload);
    },
  },
});

// Async actions
export const fetchDashboardData = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API calls
    // const [metricsRes, attendanceRes, activityRes, announcementsRes] = await Promise.all([
    //   fetch('/api/dashboard/metrics'),
    //   fetch('/api/dashboard/attendance'),
    //   fetch('/api/dashboard/activity'),
    //   fetch('/api/dashboard/announcements'),
    // ]);
    
    // Mock API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(setMetrics(mockMetrics));
    dispatch(setAttendanceData(mockAttendanceData));
    dispatch(setRecentActivity(mockRecentActivity));
    dispatch(setAnnouncements(mockAnnouncements));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setLoading,
  setError,
  clearError,
  setMetrics,
  setAttendanceData,
  setRecentActivity,
  setAnnouncements,
  addActivity,
  addAnnouncement,
  deleteAnnouncement,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
