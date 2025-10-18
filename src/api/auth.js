import axios from './axios';

export const authAPI = {
  // Register
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    const response = await axios.put('/auth/profile', userData);
    return response.data;
  },
};