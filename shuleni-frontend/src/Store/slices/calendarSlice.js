import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  events: [],
  loading: false,
  error: null,
};

// Async actions (thunks)
export const fetchEvents = createAsyncThunk('calendar/fetchEvents', async (_, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/events');
    // return await response.json();

    // Mock API call
    return await new Promise((resolve) => 
      setTimeout(() => resolve([{ id: 1, title: 'Sample Event', date: '2024-02-20' }]), 500)
    );
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createEvent = createAsyncThunk('calendar/createEvent', async (eventData, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // });
    // return await response.json();

    // Mock API call
    return await new Promise((resolve) => 
      setTimeout(() => resolve({ ...eventData, id: Date.now() }), 500)
    );
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateEventData = createAsyncThunk('calendar/updateEventData', async (eventData, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/events/${eventData.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // });
    // return await response.json();

    // Mock API call
    return await new Promise((resolve) => 
      setTimeout(() => resolve(eventData), 500)
    );
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteEventData = createAsyncThunk('calendar/deleteEventData', async (eventId, { rejectWithValue }) => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`/api/events/${eventId}`, { method: 'DELETE' });

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return eventId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Create slice
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEventData.fulfilled, (state, action) => {
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(deleteEventData.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id !== action.payload);
      });
  },
});

export default calendarSlice.reducer;