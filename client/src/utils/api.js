import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle specific HTTP errors
    switch (error.response.status) {
      case 401:
        // Unauthorized - token might be invalid
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Access forbidden');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Internal server error');
        break;
      default:
        console.error('Unexpected error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;