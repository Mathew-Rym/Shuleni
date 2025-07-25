import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulate real-time data fetching
export const fetchStudentMetrics = createAsyncThunk(
  'studentMetrics/fetchMetrics',
  async (studentId, thunkAPI) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/students/${studentId}/metrics`);
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // For demo purposes, return mock data
      return {
        grade: 'A-',
        gradeImprovement: true,
        attendance: 92,
        attendanceStatus: 'Excellent',
        assignments: {
          completed: 8,
          total: 11,
          pending: 3
        },
        lastUpdated: new Date().toISOString()
      };
    }
  }
);

// Simulate teacher updating student metrics
export const updateStudentMetrics = createAsyncThunk(
  'studentMetrics/updateMetrics',
  async ({ studentId, updates }, thunkAPI) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/students/${studentId}/metrics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update metrics');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // For demo purposes, return updated mock data
      return {
        ...updates,
        lastUpdated: new Date().toISOString()
      };
    }
  }
);

const studentMetricsSlice = createSlice({
  name: 'studentMetrics',
  initialState: {
    metrics: {
      grade: 'A-',
      gradeImprovement: true,
      attendance: 92,
      attendanceStatus: 'Excellent',
      assignments: {
        completed: 8,
        total: 11,
        pending: 3
      },
      lastUpdated: null
    },
    loading: false,
    error: null,
    realTimeConnected: false
  },
  reducers: {
    // Real-time update when teacher makes changes
    updateMetricsRealTime: (state, action) => {
      state.metrics = {
        ...state.metrics,
        ...action.payload,
        lastUpdated: new Date().toISOString()
      };
    },
    
    // Connect to real-time updates
    connectRealTime: (state) => {
      state.realTimeConnected = true;
    },
    
    // Disconnect from real-time updates
    disconnectRealTime: (state) => {
      state.realTimeConnected = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchStudentMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateStudentMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = {
          ...state.metrics,
          ...action.payload
        };
      })
      .addCase(updateStudentMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  updateMetricsRealTime, 
  connectRealTime, 
  disconnectRealTime, 
  clearError 
} = studentMetricsSlice.actions;

export default studentMetricsSlice.reducer;
