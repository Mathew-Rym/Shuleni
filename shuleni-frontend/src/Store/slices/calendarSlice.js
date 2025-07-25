import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  loading: false,
  error: null,
};

const mockEvents = [
  {
    id: 1,
    title: 'Math Exam',
    date: '2025-08-05',
    time: '10:00 AM',
    type: 'exam',
    description: 'Advanced Mathematics exam for Grade 10',
    priority: 'high',
    createdBy: 'admin',
    color: '#dc3545'
  },
  {
    id: 2,
    title: 'Science Fair',
    date: '2025-08-12',
    time: '9:00 AM',
    type: 'event',
    description: 'Annual school science fair - all grades',
    priority: 'medium',
    createdBy: 'admin',
    color: '#28a745'
  },
  {
    id: 3,
    title: 'Parent-Teacher Conference',
    date: '2025-08-18',
    time: '2:00 PM',
    type: 'meeting',
    description: 'Quarterly parent-teacher meetings',
    priority: 'medium',
    createdBy: 'admin',
    color: '#17a2b8'
  },
  {
    id: 4,
    title: 'Holiday - School Closed',
    date: '2025-08-25',
    time: 'All Day',
    type: 'holiday',
    description: 'Public holiday - no classes',
    priority: 'low',
    createdBy: 'admin',
    color: '#ffc107'
  },
  {
    id: 5,
    title: 'Chemistry Lab Test',
    date: '2025-08-28',
    time: '11:00 AM',
    type: 'exam',
    description: 'Practical chemistry examination',
    priority: 'high',
    createdBy: 'admin',
    color: '#dc3545'
  }
];

const calendarSlice = createSlice({
  name: 'calendar',
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
    setEvents: (state, action) => {
      state.events = action.payload;
      state.loading = false;
    },
    addEvent: (state, action) => {
      const newEvent = {
        ...action.payload,
        id: Date.now(),
        createdBy: 'admin',
        color: action.payload.type === 'exam' ? '#dc3545' :
               action.payload.type === 'event' ? '#28a745' :
               action.payload.type === 'meeting' ? '#17a2b8' : '#ffc107'
      };
      state.events.push(newEvent);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload };
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
  },
});

// BACKEND TODO: Implement GET /api/calendar/events endpoint
export const fetchEvents = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/calendar/events');
    // const events = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setEvents(mockEvents));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement POST /api/calendar/events endpoint
export const createEvent = (eventData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/calendar/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // });
    // const event = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addEvent(eventData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement PUT /api/calendar/events/{id} endpoint
export const updateEventData = (eventData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch(`/api/calendar/events/${eventData.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(updateEvent(eventData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement DELETE /api/calendar/events/{id} endpoint
export const deleteEventData = (eventId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // await fetch(`/api/calendar/events/${eventId}`, {
    //   method: 'DELETE',
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(deleteEvent(eventId));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setLoading,
  setError,
  clearError,
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
