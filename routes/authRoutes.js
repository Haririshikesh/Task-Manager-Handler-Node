// routes/authRoutes.js
// This file defines the API endpoints related to user authentication.

const express = require('express'); // Import Express to create a router.
const router = express.Router();    // Create a new router instance.
const authController = require('../controllers/authController'); // Import authentication controller functions.
const { isAuthenticated } = require('../middleware/authMiddleware'); // Import authentication middleware.

// --- Authentication Routes ---

// 1. POST /api/auth/signup
// Registers a new user with email and password.
console.log("ENTERED ROUTES");
router.post('/signup', authController.signup);

// 2. POST /api/auth/login
// Logs in an existing user with email and password.
router.post('/login', authController.login);

// 3. GET /api/auth/google
// Initiates the Google OAuth flow.
router.get('/google', authController.googleAuth);

// 4. GET /api/auth/google/callback
// Google OAuth callback URI. Google redirects back to this endpoint after authentication.
router.get(
  '/google/callback',
  authController.googleAuthCallback // Handles the Google OAuth callback logic.
);

// 5. GET /api/auth/me
// Gets details of the currently logged-in user.
// This route is protected by `isAuthenticated` middleware, meaning only authenticated
// users can access it.
router.get('/me', isAuthenticated, authController.getMe);

// 6. POST /api/auth/logout
// Logs out the current user and destroys the session.
router.post('/logout', isAuthenticated, authController.logout);


module.exports = router; // Export the router to be used in `app.js`.
