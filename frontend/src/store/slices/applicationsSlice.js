import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Apply for a job (coverLetter file + CV link)
export const applyJob = createAsyncThunk(
  'applications/apply',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/applications', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Fetch cover letter as Blob and convert to URL
export const fetchCoverLetter = createAsyncThunk(
  'applications/fetchCoverLetter',
  async (filename, { rejectWithValue }) => {
    try {
      const res = await api.get(`/files/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      return url;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Get all applications for a specific job (admin)
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

// Fetch job details
export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/jobs/${jobId}`);
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
    last: null,
    status: 'idle',
    error: null
  },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
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
        state.list = state.list.map(x => x.id === action.payload.id ? action.payload : x);
        state.error = null;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update status';
      });
  }
});

export const { clearError } = slice.actions;
export default slice.reducer;
