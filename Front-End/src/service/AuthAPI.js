import axios from 'axios';

const API = axios.create({
    baseURL:'http://localhost/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    
    }
});


API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);