const Analytics = require('../models/Analytics');
const Profile = require('../models/Profile');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get overview stats
    const overview = await Analytics.getOverview(profile.id);

    res.status(200).json({
      success: true,
      data: overview
    });

  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching overview',
      error: error.message
    });
  }
};

// @desc    Get top performing links
// @route   GET /api/analytics/top-links
// @access  Private
const getTopLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    // Validate limit
    if (limit < 1 || limit > 20) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 20'
      });
    }

    // Get user's profile
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get top links
    const topLinks = await Analytics.getTopLinks(profile.id, limit);

    res.status(200).json({
      success: true,
      data: {
        links: topLinks,
        count: topLinks.length
      }
    });

  } catch (error) {
    console.error('Get top links error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top links',
      error: error.message
    });
  }
};

// @desc    Get all links performance
// @route   GET /api/analytics/links
// @access  Private
const getLinksPerformance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get all links performance
    const links = await Analytics.getAllLinksPerformance(profile.id);

    // Calculate total clicks
    const totalClicks = links.reduce((sum, link) => sum + parseInt(link.click_count), 0);

    // Add percentage to each link
    const linksWithPercentage = links.map(link => ({
      ...link,
      click_percentage: totalClicks > 0 
        ? ((parseInt(link.click_count) / totalClicks) * 100).toFixed(2)
        : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        links: linksWithPercentage,
        count: links.length,
        total_clicks: totalClicks
      }
    });

  } catch (error) {
    console.error('Get links performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching links performance',
      error: error.message
    });
  }
};

// @desc    Get timeline data (views and clicks over time)
// @route   GET /api/analytics/timeline
// @access  Private
const getTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 7;

    // Validate days parameter
    if (days < 1 || days > 90) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 90'
      });
    }

    // Get user's profile
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get timeline data
    const timeline = await Analytics.getTimeline(profile.id, days);

    // Calculate totals
    const totalViews = timeline.reduce((sum, day) => sum + day.views, 0);
    const totalClicks = timeline.reduce((sum, day) => sum + day.clicks, 0);

    res.status(200).json({
      success: true,
      data: {
        timeline: timeline,
        period_days: days,
        summary: {
          total_views: totalViews,
          total_clicks: totalClicks,
          avg_views_per_day: (totalViews / days).toFixed(2),
          avg_clicks_per_day: (totalClicks / days).toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching timeline',
      error: error.message
    });
  }
};

// @desc    Get complete analytics (all in one)
// @route   GET /api/analytics/complete
// @access  Private
const getCompleteAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await Profile.findByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get all analytics data
    const [overview, topLinks, allLinks, timeline] = await Promise.all([
      Analytics.getOverview(profile.id),
      Analytics.getTopLinks(profile.id, 5),
      Analytics.getAllLinksPerformance(profile.id),
      Analytics.getTimeline(profile.id, 7)
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview,
        top_links: topLinks,
        all_links: allLinks,
        timeline
      }
    });

  } catch (error) {
    console.error('Get complete analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics',
      error: error.message
    });
  }
};

module.exports = {
  getOverview,
  getTopLinks,
  getLinksPerformance,
  getTimeline,
  getCompleteAnalytics
};