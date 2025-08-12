
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetch', async (params='') => {
  const res = await api.get(`/jobs${params}`);
  return res.data;
});
export const fetchJob = createAsyncThunk('jobs/fetchOne', async (id) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
});
export const createJob = createAsyncThunk('jobs/create', async (payload) => {
  const res = await api.post('/jobs', payload);
  return res.data;
});
export const updateJob = createAsyncThunk('jobs/update', async ({ id, data }) => {
  const res = await api.put(`/jobs/${id}`, data);
  return res.data;
});
export const deleteJob = createAsyncThunk('jobs/delete', async (id) => {
  await api.delete(`/jobs/${id}`);
  return id;
});

const slice = createSlice({
  name: 'jobs',
  initialState: { list: [], current: null, status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchJobs.fulfilled, (s, a) => { s.list = a.payload; });
    b.addCase(fetchJob.fulfilled, (s, a) => { s.current = a.payload; });
    b.addCase(createJob.fulfilled, (s, a) => { s.list.unshift(a.payload); });
    b.addCase(deleteJob.fulfilled, (s, a) => { s.list = s.list.filter(j => j.id !== a.payload); });
    b.addCase(updateJob.fulfilled, (s, a) => { s.list = s.list.map(j => j.id === a.payload.id ? a.payload : j); s.current = a.payload; });
  }
});
export default slice.reducer;
