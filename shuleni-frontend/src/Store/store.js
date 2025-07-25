import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import usersSlice from './slices/usersSlice';
import classesSlice from './slices/classesSlice';
import classSubjectSlice from './slices/classSubjectSlice';
import dashboardSlice from './slices/dashboardSlice';
import schoolsSlice from './slices/schoolsSlice';
import studentMetricsSlice from './slices/studentMetricsSlice';
import calendarSlice from './slices/calendarSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    classes: classesSlice,
    classSubject: classSubjectSlice,
    dashboard: dashboardSlice,
    schools: schoolsSlice,
    studentMetrics: studentMetricsSlice,
    calendar: calendarSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;