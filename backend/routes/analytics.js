const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTopLinks,
  getLinksPerformance,
  getTimeline,
  getCompleteAnalytics
} = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// @route   GET /api/analytics/overview
// @desc    Get analytics overview (total views, clicks, CTR, links)
// @access  Private
router.get('/overview', getOverview);

// @route   GET /api/analytics/top-links
// @desc    Get top performing links
// @access  Private
// @query   ?limit=5 (optional, default: 5, max: 20)
router.get('/top-links', getTopLinks);

// @route   GET /api/analytics/links
// @desc    Get all links performance with percentages
// @access  Private
router.get('/links', getLinksPerformance);

// @route   GET /api/analytics/timeline
// @desc    Get views and clicks timeline
// @access  Private
// @query   ?days=7 (optional, default: 7, max: 90)
router.get('/timeline', getTimeline);

// @route   GET /api/analytics/complete
// @desc    Get complete analytics (all data in one request)
// @access  Private
router.get('/complete', getCompleteAnalytics);

module.exports = router;