const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Check if email already exists
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered.' 
      });
    }

    // Check if username already exists
    const usernameExists = await User.usernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Username already taken.' 
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      full_name
    });

    // Auto-kreiraj profil
    const Profile = require('../models/Profile');
    await Profile.create(user.id, username, full_name);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          is_verified: user.is_verified,
          created_at: user.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration.',
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password.' 
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password.' 
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          is_verified: user.is_verified,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login.',
      error: error.message 
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { full_name, avatar_url } = req.body;
    
    const updatedUser = await User.update(req.user.id, {
      full_name,
      avatar_url
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during profile update.',
      error: error.message 
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete account
    await User.deleteAccount(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting account.',
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount
};