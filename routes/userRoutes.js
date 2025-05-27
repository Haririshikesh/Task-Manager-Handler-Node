const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { isAuthenticated } = require('../middleware/authMiddleware');

// --- User Profile Routes (Protected) ---

// Protected By isAUthenticated
router.put('/profile', isAuthenticated, userController.updateProfile);

module.exports = router; // Export the router to be used in `app.js`.

