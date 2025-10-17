const express = require('express');
const router = express.Router();
const { 
  getMyProfile,
  getPublicProfile,
  createProfile,
  updateProfile
} = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/:slug', getPublicProfile);

// Protected routes (require authentication)
router.get('/', authenticateToken, getMyProfile);
router.post('/', authenticateToken, createProfile);
router.put('/', authenticateToken, updateProfile);

module.exports = router;