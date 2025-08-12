
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const applyJob = createAsyncThunk('applications/apply', async (data) => {
  const res = await api.post('/applications', data);
  return res.data;
});
export const getApplicationsForJob = createAsyncThunk('applications/forJob', async (jobId) => {
  const res = await api.get(`/applications/job/${jobId}`);
  return res.data;
});
export const updateApplicationStatus = createAsyncThunk('applications/update', async ({ id, status }) => {
  const res = await api.put(`/applications/${id}`, { status });
  return res.data;
});

const slice = createSlice({
  name: 'applications',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(applyJob.fulfilled, (s, a) => { s.last = a.payload; });
    b.addCase(getApplicationsForJob.fulfilled, (s, a) => { s.list = a.payload; });
    b.addCase(updateApplicationStatus.fulfilled, (s, a) => { s.list = s.list.map(x => x.id === a.payload.id ? a.payload : x); });
  }
});
export default slice.reducer;
