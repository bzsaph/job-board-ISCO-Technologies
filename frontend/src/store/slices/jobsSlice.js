import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
export function setAuthToken(token) {

  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 
  else delete api.defaults.headers.common['Authorization'];
  
}


// Fetch all jobs (public)
export const fetchJobs = createAsyncThunk('jobs/fetch', async (params = '') => {
  const res = await api.get(`/jobs${params}`);
  return res.data;
});

// Fetch single job (public)
export const fetchJob = createAsyncThunk('jobs/fetchOne', async (id) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
});

// Create job (requires auth)
export const createJob = createAsyncThunk(
  'jobs/create',
  async (payload, { getState }) => {
    const token = getState().auth.token;
    console.log(getState().auth.token);
    if (!token) throw new Error('Not logged in');

    setAuthToken(token); // ensure axios has it globally
    const res = await api.post('/jobs', payload); // no need to pass headers here
    // ...............................
    console.log("...............................",res.data);
    return res.data;
  }
);


// Update job (requires auth)
export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, data }, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error('Not logged in');

    const res = await api.put(`/jobs/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  }
);

// Delete job (requires auth)
export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error('Not logged in');

    await api.delete(`/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  }
);

const slice = createSlice({
  name: 'jobs',
  initialState: { list: [], current: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = null;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.list = state.list.map(j => j.id === action.payload.id ? action.payload : j);
        state.current = action.payload;
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.list = state.list.filter(j => j.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});


export default slice.reducer;
