// controllers/authController.js
// This file contains the core logic for user authentication,
// including signup, login (local and Google OAuth), and fetching user details.

const { User } = require('../models'); // Import the User model.
const bcrypt = require('bcryptjs');     // For password hashing (though handled by model hook).
const jwt = require('jsonwebtoken');    // For creating JWTs.
const config = require('../config/config'); // Import configuration settings.
const passport = require('passport');   // Passport.js for authentication strategies.

// --- Helper Function: Generate JWT Token ---
// This function creates a JSON Web Token for a given user.
const generateToken = (user) => {
  // Sign the token with the user's ID, a secret key, and an expiration time.
  return jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: '1h', // Token expires in 1 hour.
  });
};

// --- Controller Functions ---

// 1. `signup`: Handles new user registration (email/password).
const signup = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body.
  console.log('--- authController.signup function entered ---'); 
  console.log('Request body for signup:', req.body); 

  // Basic validation: Check if email and password are provided.
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if a user with the given email already exists.
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Create a new user in the database.
    // The `beforeCreate` hook in the User model will hash the password automatically.
    const newUser = await User.create({ email, password });

    // Generate a JWT for the newly registered user.
    const token = generateToken(newUser);

    // Send success response with user details (excluding password) and token.
    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      token, // Send the JWT to the client.
    });
  } catch (error) {
    console.error('Error during signup:', error);
    // Handle validation errors (e.g., invalid email format) or other database errors.
    res.status(500).json({ message: 'Server error during signup.', error: error.message });
  }
};

// 2. `login`: Handles user login (email/password).
const login = (req, res, next) => {
  // Use Passport's 'local' strategy for email/password authentication.
  passport.authenticate('local', (err, user, info) => {
    // If an error occurred during authentication (e.g., database error).
    if (err) {
      console.error('Passport local auth error:', err);
      return res.status(500).json({ message: 'Server error during login.', error: err.message });
    }
    // If authentication failed (e.g., incorrect credentials).
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials.' });
    }

    // If authentication is successful, log the user in using `req.logIn()`.
    // This establishes a session for the user.
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during req.logIn:', err);
        return res.status(500).json({ message: 'Server error during session creation.', error: err.message });
      }

      // Generate a JWT for the logged-in user.
      const token = generateToken(user);

      // Send success response with user details (excluding password) and token.
      res.status(200).json({
        message: 'Logged in successfully!',
        user: {
          id: user.id,
          email: user.email,
        },
        token, // Send the JWT to the client.
      });
    });
  })(req, res, next); // Call the passport.authenticate middleware.
};

// 3. `googleAuth`: Initiates Google OAuth flow.
// This function redirects the user to Google's authentication server.
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'], // Request access to user's profile and email.
});

// 4. `googleAuthCallback`: Handles Google OAuth callback.
// This function is the redirect target after Google authentication.
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth callback error:', err);
      return res.status(500).json({ message: 'Google OAuth failed.', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Google OAuth authentication failed.' });
    }

    // Log the user in after successful Google authentication.
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during req.logIn after Google OAuth:', err);
        return res.status(500).json({ message: 'Server error during session creation after Google OAuth.', error: err.message });
      }

      // Generate a JWT for the Google-authenticated user.
      const token = generateToken(user);

      // Redirect the user back to the client application,
      // potentially passing the token or a success indicator in the URL.
      // In a real application, you might redirect to a specific dashboard page
      // and handle the token on the client side.
      res.redirect(`${config.clientURL}/dashboard?token=${token}`);
    });
  })(req, res, next);
};

// 5. `getMe`: Gets current logged-in user details.
// This route is protected by `isAuthenticated` middleware.
const getMe = (req, res) => {
  // `req.user` is populated by Passport's `deserializeUser` function
  // if the user is authenticated.
  if (req.user) {
    res.status(200).json({
      message: 'Current user details fetched successfully.',
      user: {
        id: req.user.id,
        email: req.user.email,
        googleId: req.user.googleId,
        // Add other user details you want to expose
      },
    });
  } else {
    // This case should ideally not be hit if `isAuthenticated` middleware works correctly.
    res.status(401).json({ message: 'No authenticated user found.' });
  }
};

// 6. `logout`: Handles user logout.
const logout = (req, res, next) => {
  // Passport.js provides `req.logout()` to terminate a login session.
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return next(err); // Pass error to the error handling middleware.
    }
    // Destroy the session.
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err);
      }
      // Clear the session cookie from the client.
      res.clearCookie('connect.sid'); // Default session cookie name for express-session.
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
};


module.exports = {
  signup,
  login,
  googleAuth,
  googleAuthCallback,
  getMe,
  logout,
};
