
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


export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { getState }) => {
    const token = getState().auth.token;
    const res = await api.put('/auth/profile', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
