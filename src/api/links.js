import axios from './axios';

export const linksAPI = {
  // Get all my links
  getMyLinks: async () => {
    const response = await axios.get('/links');
    return response.data;
  },

  // Create link
  createLink: async (linkData) => {
    const response = await axios.post('/links', linkData);
    return response.data;
  },

  // Update link
  updateLink: async (linkId, linkData) => {
    const response = await axios.put(`/links/${linkId}`, linkData);
    return response.data;
  },

  // Delete link
  deleteLink: async (linkId) => {
    const response = await axios.delete(`/links/${linkId}`);
    return response.data;
  },

  // Reorder links
  reorderLinks: async (linksArray) => {
    const response = await axios.put('/links/reorder', { links: linksArray });
    return response.data;
  },

  // Track click
  trackClick: async (linkId) => {
    const response = await axios.post(`/links/${linkId}/click`);
    return response.data;
  },
};