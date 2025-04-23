import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
    'Accept': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default apiClient;