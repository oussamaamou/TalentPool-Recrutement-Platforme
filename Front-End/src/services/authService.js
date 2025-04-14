import apiClient from './apiClient';

const authService = {
  // Login
  login: async (credentials) => {
    return await apiClient.post('/login', credentials);
  },
  
  // Register
  register: async (userData) => {
    return await apiClient.post('/register', userData);
  },
  
  // Logout
  logout: async () => {
    return await apiClient.post('/logout');
  },
  
  // Get current user
  getCurrentUser: async () => {
    return await apiClient.get('/user');
  },
  
  // Update profile
  updateProfile: async (data) => {
    return await apiClient.put('/profile', data);
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    return await apiClient.post('/forgot-password', { email });
  },
  
  // Reset password
  resetPassword: async (data) => {
    return await apiClient.post('/reset-password', data);
  }
};

export default authService;