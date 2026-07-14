import axios from 'axios';

// The default backend URL will be localhost:5000 in dev or use environment variables
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to inject JWT token into requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('melodia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle errors centrally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is unauthorized (token expired / invalid)
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized request. Cleaning credentials.');
      // Optionally trigger logouts
      localStorage.removeItem('melodia_token');
    }
    return Promise.reject(error);
  }
);

export default API;
