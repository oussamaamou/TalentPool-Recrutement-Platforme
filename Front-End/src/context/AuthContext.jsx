import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {

    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.authorisation.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.authorisation.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };
  
  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(data);
      setUser({...user, ...response.data});
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};