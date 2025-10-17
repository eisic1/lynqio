const express = require('express');
const router = express.Router();
const { 
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  trackClick
} = require('../controllers/linkController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/:id/click', trackClick);

// Protected routes (require authentication)
router.get('/', authenticateToken, getMyLinks);
router.post('/', authenticateToken, createLink);
router.put('/reorder', authenticateToken, reorderLinks);
router.put('/:id', authenticateToken, updateLink);
router.delete('/:id', authenticateToken, deleteLink);

module.exports = router;