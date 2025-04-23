import apiClient from './apiClient';

const authService = {
  login: async (credentials) => {
    return await apiClient.post('/login', credentials);
  },
  
  register: async (userData) => {
    return await apiClient.post('/register', userData);
  },
  
  logout: async () => {
    return await apiClient.post('/logout');
  },
  
  getCurrentUser: async () => {
    return await apiClient.get('/user');
  },
  
  updateProfile: async (data) => {
    return await apiClient.put('/profile', data);
  },
  
  forgotPassword: async (email) => {
    return await apiClient.post('/forgot-password', { email });
  },
  
  resetPassword: async (data) => {
    return await apiClient.post('/reset-password', data);
  }
};

export default authService;