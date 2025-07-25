// Redux store configuration for Shuleni School Management System
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import usersSlice from './slices/usersSlice';
import classesSlice from './slices/classesSlice';
import dashboardSlice from './slices/dashboardSlice';
import schoolsSlice from './slices/schoolsSlice';
import studentMetricsSlice from './slices/studentMetricsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    classes: classesSlice,
    dashboard: dashboardSlice,
    schools: schoolsSlice,
    studentMetrics: studentMetricsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;