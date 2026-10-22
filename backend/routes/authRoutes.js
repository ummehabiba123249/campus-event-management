const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);
router.get('/users', authenticateToken, requireAdmin, authController.getAllUsers);

module.exports = router;
