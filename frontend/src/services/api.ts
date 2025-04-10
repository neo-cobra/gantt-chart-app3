import axios from 'axios';
import { getAuthHeader } from './authService';

// API URL from environment variable or default
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create a reusable axios instance with default configs
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    config.headers = {
      ...config.headers,
      ...authHeader,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration or auth errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;