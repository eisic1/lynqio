import axios from './axios';

export const analyticsAPI = {
  // Get overview stats
  getOverview: async () => {
    const response = await axios.get('/analytics/overview');
    return response.data;
  },

  // Get top links
  getTopLinks: async (limit = 5) => {
    const response = await axios.get(`/analytics/top-links?limit=${limit}`);
    return response.data;
  },

  // Get all links performance
  getLinksPerformance: async () => {
    const response = await axios.get('/analytics/links');
    return response.data;
  },

  // Get timeline
  getTimeline: async (days = 7) => {
    const response = await axios.get(`/analytics/timeline?days=${days}`);
    return response.data;
  },

  // Get complete analytics
  getCompleteAnalytics: async () => {
    const response = await axios.get('/analytics/complete');
    return response.data;
  }
};