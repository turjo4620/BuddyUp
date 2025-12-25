const express = require('express');
const {
  register,
  login,
  getCurrentProfile,
  authenticateToken,
  checkUsername
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/check-username/:username', checkUsername);

// Protected routes
router.get('/me', authenticateToken, getCurrentProfile);

module.exports = router;