// Classes management slice
import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';


// Correct `initialState` initialization at the top of the file
const initialState = {
  classes: [], // Initialize classes as an empty array
  resources: [], // Initialize resources as an empty array
  loading: false,
  error: null,
}; 

// Mock classes data
const mockClasses = [
  {
    id: 1,
    name: 'Mathematics',
    teacher: 'Ms. Jane',
    teacherId: 1,
    students: 25,
    grade: '10th Grade',
    description: 'Advanced mathematics covering algebra and calculus',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    room: 'Room 101',
    image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=MATH',
    color: '#4A90E2',
  },
  {
    id: 2,
    name: 'Science',
    teacher: 'Mr. Jones',
    teacherId: 2,
    students: 22,
    grade: '10th Grade',
    description: 'Physics and Chemistry fundamentals',
    schedule: 'Tue, Thu - 10:00 AM',
    room: 'Lab 201',
    image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=SCIENCE',
    color: '#50C878',
  },
  {
    id: 3,
    name: 'History',
    teacher: 'Ms. Brown',
    teacherId: 3,
    students: 28,
    grade: '10th Grade',
    description: 'World history and civilizations',
    schedule: 'Mon, Wed - 2:00 PM',
    room: 'Room 301',
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=HISTORY',
    color: '#FF6B6B',
  },
  {
    id: 4,
    name: 'English',
    teacher: 'Mr. Wilson',
    teacherId: 4,
    students: 30,
    grade: '10th Grade',
    description: 'Literature and creative writing',
    schedule: 'Tue, Thu, Fri - 11:00 AM',
    room: 'Room 102',
    image: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=ENGLISH',
    color: '#9B59B6',
  },
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
  },
});

// Async actions
export const fetchClasses = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/classes');
    // const classes = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setClasses(mockClasses));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchResources = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/resources');
    // const resources = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setResources(mockResources));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createClass = (classData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/classes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(classData),
    // });
    // const newClass = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addClass(classData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
}; 

export const assignTeacherToClass = createAsyncThunk(
  'classes/assignTeacherToClass',
  async ({ classId, teacherId, teacherName }, { dispatch, getState }) => {
    dispatch(setLoading(true));
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/classes/${classId}/assign-teacher`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ teacherId }),
      // });
      // const updatedClass = await response.json();

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const state = getState();
      const classToUpdate = state.classes.classes.find(c => c.id === classId);
      if (classToUpdate) {
        const updatedClass = { ...classToUpdate, teacherId, teacher: teacherName };
        dispatch(updateClass(updatedClass));
      }
      
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
    }
  }
);

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
} = classesSlice.actions;

export default classesSlice.reducer;