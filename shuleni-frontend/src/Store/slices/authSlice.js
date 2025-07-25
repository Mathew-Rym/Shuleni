import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
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
    updateUserAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
});

// BACKEND TODO: Replace with actual API endpoint POST /api/auth/login
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  
  try {
    // BACKEND INTEGRATION: Replace mock with actual API call
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    // });
    // const data = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 1,
      email: credentials.email,
      name: 'John Doe',
      role: credentials.email.includes('admin') ? 'admin' : 
            credentials.email.includes('teacher') ? 'teacher' : 'student',
      avatar: 'https://via.placeholder.com/150',
      school_id: 1,
      // Additional student fields (will be available when role is 'student')
      admissionNo: 'STU-2025-001',
      idNumber: '12345678',
      gender: 'Male',
      dateOfBirth: '1/15/2005',
      county: 'Nairobi',
      country: 'KENYAN',
      phone: '+254712345678',
      parentName: 'Jane Doe',
      postalAddress: 'P.O. Box 123, Nairobi',
      canGraduate: false
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    
    localStorage.setItem('shuleni_token', mockToken);
    localStorage.setItem('shuleni_user', JSON.stringify(mockUser));
    
  } catch (error) {
    dispatch(loginFailure(error.message || 'Login failed'));
  }
};

// BACKEND TODO: Implement POST /api/auth/logout endpoint
export const logoutUser = () => (dispatch) => {
  // BACKEND INTEGRATION: Call logout API endpoint
  // await fetch('/api/auth/logout', { method: 'POST' });
  
  localStorage.removeItem('shuleni_token');
  localStorage.removeItem('shuleni_user');
  dispatch(logout());
};

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

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateProfile, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;