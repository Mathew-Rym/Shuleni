// Authentication slice for managing user login/logout state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null, // 'admin', 'teacher', 'student'
  loading: false,
  error: null,
  // Password reset states
  resetLoading: false,
  resetError: null,
  resetSuccess: false,
  verificationSent: false,
  codeVerified: false,
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
    // Password reset reducers
    resetPasswordStart: (state) => {
      state.resetLoading = true;
      state.resetError = null;
      state.resetSuccess = false;
    },
    resetPasswordSuccess: (state) => {
      state.resetLoading = false;
      state.resetSuccess = true;
      state.resetError = null;
    },
    resetPasswordFailure: (state, action) => {
      state.resetLoading = false;
      state.resetError = action.payload;
      state.resetSuccess = false;
    },
    verificationCodeSent: (state) => {
      state.verificationSent = true;
      state.resetLoading = false;
      state.resetError = null;
    },
    verificationCodeVerified: (state) => {
      state.codeVerified = true;
      state.resetLoading = false;
      state.resetError = null;
    },
    clearResetState: (state) => {
      state.resetError = null;
      state.resetSuccess = false;
      state.verificationSent = false;
      state.codeVerified = false;
      state.resetLoading = false;
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

// Password reset actions
export const sendVerificationCode = (email) => async (dispatch) => {
  dispatch(resetPasswordStart());
  
  try {
    // Mock API call - replace with actual backend endpoint
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate email validation
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    // In real implementation, call your backend API:
    // const response = await fetch('/api/auth/forgot-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to send verification code');
    // }
    
    dispatch(verificationCodeSent());
    return { success: true, message: `Verification code sent to ${email}` };
    
  } catch (error) {
    dispatch(resetPasswordFailure(error.message));
    throw error;
  }
};

export const verifyResetCode = (email, code) => async (dispatch) => {
  dispatch(resetPasswordStart());
  
  try {
    // Mock API call - replace with actual backend endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!code || code.length !== 6) {
      throw new Error('Please enter a valid 6-digit code');
    }
    
    // Mock verification - in real app, verify with backend
    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }
    
    // In real implementation:
    // const response = await fetch('/api/auth/verify-reset-code', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, code })
    // });
    
    dispatch(verificationCodeVerified());
    return { success: true, message: 'Code verified successfully' };
    
  } catch (error) {
    dispatch(resetPasswordFailure(error.message));
    throw error;
  }
};

export const resetPassword = (email, code, newPassword) => async (dispatch) => {
  dispatch(resetPasswordStart());
  
  try {
    // Mock API call - replace with actual backend endpoint
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // In real implementation:
    // const response = await fetch('/api/auth/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, code, newPassword })
    // });
    
    dispatch(resetPasswordSuccess());
    return { success: true, message: 'Password reset successfully' };
    
  } catch (error) {
    dispatch(resetPasswordFailure(error.message));
    throw error;
  }
};

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError, 
  updateProfile,
  updateUserAvatar,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  verificationCodeSent,
  verificationCodeVerified,
  clearResetState
} = authSlice.actions;
export default authSlice.reducer;