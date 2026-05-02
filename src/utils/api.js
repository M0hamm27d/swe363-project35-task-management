import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Request interceptor to add the auth token to every request automatically
api.interceptors.request.use(
  (config) => {
    // Check if the request is targeting an admin endpoint OR if we are currently on an admin page
    const isAdminRoute = config.url && config.url.startsWith('/admin');
    const isBrowsingAdmin = window.location.pathname.startsWith('/admin');
    
    // Pick the appropriate token
    const tokenKey = (isAdminRoute || isBrowsingAdmin) ? 'admin_token' : 'token';
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
