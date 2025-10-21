const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile ,
  deleteAccount
} = require('../controllers/authController');
const { 
  validateRegistration, 
  validateLogin 
} = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes (require authentication)
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/account', authenticateToken, deleteAccount);

module.exports = router;