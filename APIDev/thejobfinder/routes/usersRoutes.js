const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');

// Authentication routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);

// User profile routes
router.use(authMiddleware);
// Apply authentication middleware to protect routes
router.get('/profile', usersController.getUserDetails);
router.patch('/profile', usersController.updateUser);
router.delete('/profile', usersController.deleteUser);

module.exports = router;
