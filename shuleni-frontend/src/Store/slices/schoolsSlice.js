// Schools management slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  schools: [],
  currentSchool: null,
  loading: false,
  error: null,
};

// Mock schools data for development
const mockSchools = [
  {
    id: 1,
    name: 'Shuleni High School',
    description: 'A modern high school focused on excellence',
    address: '123 Education Street, Nairobi',
    phone: '+254 700 123456',
    email: 'info@shuleni.ac.ke',
    logo: 'https://via.placeholder.com/150/2563eb/FFFFFF?text=SHS',
    established: '2020',
    adminId: 1,
    createdAt: '2024-01-01',
    status: 'active',
    students: 150,
    teachers: 12,
    classes: 8,
  },
];

const schoolsSlice = createSlice({
  name: 'schools',
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
    
    // Schools actions
    setSchools: (state, action) => {
      state.schools = action.payload;
      state.loading = false;
    },
    setCurrentSchool: (state, action) => {
      state.currentSchool = action.payload;
    },
    addSchool: (state, action) => {
      const newSchool = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        students: 0,
        teachers: 0,
        classes: 0,
        logo: `https://via.placeholder.com/150/2563eb/FFFFFF?text=${action.payload.name.split(' ').map(n => n[0]).join('')}`,
      };
      state.schools.push(newSchool);
      state.currentSchool = newSchool;
    },
    updateSchool: (state, action) => {
      const index = state.schools.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.schools[index] = { ...state.schools[index], ...action.payload };
        if (state.currentSchool && state.currentSchool.id === action.payload.id) {
          state.currentSchool = { ...state.currentSchool, ...action.payload };
        }
      }
    },
    deleteSchool: (state, action) => {
      state.schools = state.schools.filter(s => s.id !== action.payload);
      if (state.currentSchool && state.currentSchool.id === action.payload) {
        state.currentSchool = null;
      }
    },
  },
});

// Async actions
export const fetchSchools = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/schools');
    // const schools = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setSchools(mockSchools));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createSchool = (schoolData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/schools', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(schoolData),
    // });
    // const school = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addSchool(schoolData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setLoading,
  setError,
  clearError,
  setSchools,
  setCurrentSchool,
  addSchool,
  updateSchool,
  deleteSchool,
} = schoolsSlice.actions;

export default schoolsSlice.reducer;