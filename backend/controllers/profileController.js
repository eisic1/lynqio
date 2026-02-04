const Profile = require('../models/Profile');
const Link = require('../models/Link');

// @desc    Get user's profile
// @route   GET /api/profile
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    // Get links
    const links = await Link.findByProfileId(profile.id);
    
    // Get stats
    const stats = await Profile.getStats(profile.id);

    res.status(200).json({
      success: true,
      data: {
        profile: {
          ...profile,
          links,
          stats
        }
      }
    });

  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Get public profile by slug
// @route   GET /api/profile/:slug
// @access  Public
const getPublicProfile = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const profile = await Profile.getProfileWithLinks(slug);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    // Increment views
    await Profile.incrementViews(profile.id);

    // Separate links from profile object
    const { links, ...profileData } = profile;

    res.status(200).json({
      success: true,
      data: {
        profile: profileData,
        links: links || []
      }
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Create profile (automatically after registration)
// @route   POST /api/profile
// @access  Private
const createProfile = async (req, res) => {
  try {
    const { slug } = req.body;

    // Check if user already has profile
    const existingProfile = await Profile.findByUserId(req.user.id);
    if (existingProfile) {
      return res.status(400).json({ 
        success: false,
        message: 'Profile already exists.' 
      });
    }

    // Check if slug is taken
    const slugExists = await Profile.slugExists(slug);
    if (slugExists) {
      return res.status(400).json({ 
        success: false,
        message: 'This username is already taken.' 
      });
    }

    const profile = await Profile.create(req.user.id, slug);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully!',
      data: {
        profile
      }
    });

  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByUserId(req.user.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found.' 
      });
    }

    const updatedProfile = await Profile.update(profile.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        profile: updatedProfile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

module.exports = {
  getMyProfile,
  getPublicProfile,
  createProfile,
  updateProfile
};