import axios from './axios';

export const profileAPI = {
  // Get my profile
  getMyProfile: async () => {
    const response = await axios.get('/profile');
    return response.data;
  },

  // Get public profile by slug
  getPublicProfile: async (slug) => {
    const response = await axios.get(`/profile/${slug}`);
    return response.data;
  },

  // Create profile
  createProfile: async (profileData) => {
    const response = await axios.post('/profile', profileData);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await axios.put('/profile', profileData);
    return response.data;
  },
};