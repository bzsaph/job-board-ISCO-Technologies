
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAuthToken } from '../../services/api';

export const login = createAsyncThunk('auth/login', async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
});
export const register = createAsyncThunk('auth/register', async (payload) => {
  const res = await api.post('/auth/register', payload);
  return res.data;
});

const initialToken = localStorage.getItem('token');
if (initialToken) setAuthToken(initialToken);

const slice = createSlice({
  name: 'auth',
  initialState: { token: initialToken, user: JSON.parse(localStorage.getItem('user')||'null'), status: 'idle' },
  reducers: {
    logout(state) {
      state.token = null; state.user = null;
      localStorage.removeItem('token'); localStorage.removeItem('user');
      setAuthToken(null);
    }
  },
  extraReducers: (b) => {
    b.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token; state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      setAuthToken(action.payload.token);
    });
    b.addCase(register.fulfilled, (state, action) => {
      state.token = action.payload.token; state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      setAuthToken(action.payload.token);
    });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
