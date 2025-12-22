const Link = require('../models/Link');
const Profile = require('../models/Profile');

// @desc    Get all links for user's profile
// @route   GET /api/links
// @access  Private
const getMyLinks = async (req, res) => {
  try {
    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    const links = await Link.findByProfileId(profile.id);

    res.status(200).json({
      success: true,
      data: {
        links
      }
    });

  } catch (error) {
    console.error('Get my links error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Create new link
// @route   POST /api/links
// @access  Private
const createLink = async (req, res) => {
  try {
    const { title, url, description, icon, type, menu_items } = req.body;

    // Validation based on type
    if (!title) {
      return res.status(400).json({ 
        success: false,
        message: 'Title is required.' 
      });
    }

    if (type === 'menu') {
      // Validate menu items
      if (!menu_items || !Array.isArray(menu_items) || menu_items.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'At least one menu item is required for menu type.' 
        });
      }
    } else {
      // Validate URL for link type
      if (!url) {
        return res.status(400).json({ 
          success: false,
          message: 'URL is required for link type.' 
        });
      }
    }

    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found. Please create a profile first.' 
      });
    }

    const link = await Link.create(profile.id, {
      title,
      url,
      description,
      icon,
      type: type || 'link',
      menu_items: menu_items || null
    });

    res.status(201).json({
      success: true,
      message: 'Link created successfully!',
      data: {
        link
      }
    });

  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Update link
// @route   PUT /api/links/:id
// @access  Private
const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    
    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    // Check if link belongs to user's profile
    const belongsToUser = await Link.belongsToProfile(id, profile.id);
    
    if (!belongsToUser) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied.' 
      });
    }

    const updatedLink = await Link.update(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Link updated successfully!',
      data: {
        link: updatedLink
      }
    });

  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Delete link
// @route   DELETE /api/links/:id
// @access  Private
const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    
    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    // Check if link belongs to user's profile
    const belongsToUser = await Link.belongsToProfile(id, profile.id);
    
    if (!belongsToUser) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied.' 
      });
    }

    await Link.delete(id);

    res.status(200).json({
      success: true,
      message: 'Link deleted successfully!'
    });

  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Reorder links
// @route   PUT /api/links/reorder
// @access  Private
const reorderLinks = async (req, res) => {
  try {
    const { links } = req.body; // Array of {id, position}

    if (!Array.isArray(links)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid data format.' 
      });
    }

    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    await Link.reorder(profile.id, links);

    res.status(200).json({
      success: true,
      message: 'Links reordered successfully!'
    });

  } catch (error) {
    console.error('Reorder links error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Track link click (public)
// @route   POST /api/links/:id/click
// @access  Public
const trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    
    const link = await Link.incrementClicks(id);
    
    if (!link) {
      return res.status(404).json({ 
        success: false,
        message: 'Link not found.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Click tracked!',
      data: {
        url: link.url
      }
    });

  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

module.exports = {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  trackClick
};