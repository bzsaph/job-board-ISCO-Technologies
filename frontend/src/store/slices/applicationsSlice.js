import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Apply for a job (with files)
export const applyJob = createAsyncThunk(
  'applications/apply',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error('User not logged in');

      const res = await api.post('/applications', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // required for files
        },
      });

      return res.data;
    } catch (err) {
      // Return backend error message for UI
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Get all applications for a job
export const getApplicationsForJob = createAsyncThunk(
  'applications/forJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  'applications/update',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/applications/${id}`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const slice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    status: 'idle',
    last: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyJob.fulfilled, (state, action) => {
        state.last = action.payload;
        state.error = null;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to apply';
      })
      .addCase(getApplicationsForJob.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(getApplicationsForJob.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch applications';
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.list = state.list.map((x) =>
          x.id === action.payload.id ? action.payload : x
        );
        state.error = null;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update status';
      });
  },
});

export default slice.reducer;
