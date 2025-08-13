import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Apply for a job (coverLetter file + CV link via FormData)
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
export const fetchCoverLetter = createAsyncThunk(
  'applications/fetchCoverLetter',
  async (filename, { rejectWithValue }) => {
    try {
      // fetch as blob
      const res = await api.get(`/files/${filename}`, { responseType: 'blob' });
      // convert to URL for browser
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
      console.log('Applications for job:', res.data);
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
  initialState: { list: [], last: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(applyJob.fulfilled, (s, a) => { 
      s.last = a.payload; 
      s.error = null;
    });
    b.addCase(applyJob.rejected, (s, a) => { 
      s.error = a.payload?.message || 'Failed to apply'; 
    });

    b.addCase(getApplicationsForJob.fulfilled, (s, a) => { 
      s.list = a.payload; 
      s.error = null;
    });
    b.addCase(getApplicationsForJob.rejected, (s, a) => { 
      s.error = a.payload?.message || 'Failed to fetch applications'; 
    });

    b.addCase(updateApplicationStatus.fulfilled, (s, a) => { 
      s.list = s.list.map(x => x.id === a.payload.id ? a.payload : x); 
      s.error = null;
    });
    b.addCase(updateApplicationStatus.rejected, (s, a) => { 
      s.error = a.payload?.message || 'Failed to update status'; 
    });
  }
});

export default slice.reducer;
