import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// Create a separate constant for file URLs
export const FILES_BASE_URL = process.env.REACT_APP_API_BASE
  ? process.env.REACT_APP_API_BASE.replace('/api', '')
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export default api;
