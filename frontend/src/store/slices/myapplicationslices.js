import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Utility to set the auth token for axios globally
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Fetch applications of logged-in user
export const fetchMyApplications = createAsyncThunk(
  'myApplications/fetch',
  async (_, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error('Not logged in');

    setAuthToken(token);
    const res = await api.get('/applications/mine');
    return res.data;
  }
);

// (Optional) Create new application
export const createApplication = createAsyncThunk(
  'myApplications/create',
  async (payload, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error('Not logged in');

    setAuthToken(token);
    const res = await api.post('/applications', payload);
    return res.data;
  }
);

// (Optional) Delete an application
export const deleteApplication = createAsyncThunk(
  'myApplications/delete',
  async (id, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error('Not logged in');

    setAuthToken(token);
    await api.delete(`/applications/${id}`);
    return id;
  }
);

const slice = createSlice({
  name: 'myApplications',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMyApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Create
      .addCase(createApplication.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.error = null;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
