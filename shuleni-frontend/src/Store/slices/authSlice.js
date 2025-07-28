// Authentication slice for managing user login/logout state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null, // 'admin', 'teacher', 'student'
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

// Mock login function - Replace with actual API call
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  
  try {
    // TODO: Replace with actual API endpoint
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    // const data = await response.json();
    
    // Mock authentication - Remove when backend is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 1,
      email: credentials.email,
      name: 'John Doe',
      role: credentials.email.includes('admin') ? 'admin' : 
            credentials.email.includes('teacher') ? 'teacher' : 'student',
      avatar: 'https://via.placeholder.com/150',
      school_id: 1,
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    
    // Store in localStorage for persistence
    localStorage.setItem('shuleni_token', mockToken);
    localStorage.setItem('shuleni_user', JSON.stringify(mockUser));
    
  } catch (error) {
    dispatch(loginFailure(error.message || 'Login failed'));
  }
};

// Logout function
export const logoutUser = () => (dispatch) => {
  // TODO: Call logout API endpoint if needed
  // await fetch('/api/auth/logout', { method: 'POST' });
  
  localStorage.removeItem('shuleni_token');
  localStorage.removeItem('shuleni_user');
  dispatch(logout());
};

// Check authentication on app load
export const checkAuth = () => (dispatch) => {
  const token = localStorage.getItem('shuleni_token');
  const user = localStorage.getItem('shuleni_user');
  
  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      dispatch(loginSuccess({ user: parsedUser, token }));
    } catch (error) {
      dispatch(logout());
    }
  }
};

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;