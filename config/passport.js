const LocalStrategy = require('passport-local').Strategy; // For email/password login.
const GoogleStrategy = require('passport-google-oauth20').Strategy; // For Google OAuth login.
const bcrypt = require('bcryptjs'); // For comparing hashed passwords.
const { User } = require('../models'); // Import the User model from our database.
const config = require('./config'); // Import our general configuration settings.

module.exports = function(passport) {
  // --- Passport Session Serialization/Deserialization ---
  // These functions determine what user data is stored in the session
  // and how to retrieve the user from the session.

  // `serializeUser`: Determines which data of the user object should be stored in the session.
  // Here, we store only the user's ID. This ID is then used to retrieve the full user object
  // in `deserializeUser` on subsequent requests.
  passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in the session.
  });

  // `deserializeUser`: Retrieves the full user object based on the ID stored in the session.
  // This function is called on every subsequent request after a user logs in,
  // and it attaches the `user` object to `req.user`.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id); // Find the user by primary key (ID).
      done(null, user); // Attach the user object to `req.user`.
    } catch (err) {
      done(err, null); // Pass any error.
    }
  });

  // --- Local Strategy (Email/Password) ---
  // This strategy handles traditional email and password logins.
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // Specify that 'email' field will be used as the username.
      async (email, password, done) => {
        try {
          // 1. Find the user by email in the database.
          const user = await User.findOne({ where: { email } });

          // 2. If user not found, return an error.
          if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }

          // 3. Compare the provided password with the hashed password in the database.
          const isMatch = await bcrypt.compare(password, user.password);

          // 4. If passwords don't match, return an error.
          if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }

          // 5. If email and password are correct, return the user.
          return done(null, user);
        } catch (err) {
          // Handle any database or server errors.
          return done(err);
        }
      }
    )
  );

  // --- Google OAuth 2.0 Strategy ---
  // This strategy handles authentication via Google.
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,         // Your Google Client ID.
        clientSecret: config.google.clientSecret, // Your Google Client Secret.
        callbackURL: config.google.callbackURL,   // The redirect URI after Google authentication.
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Check if a user with this Google ID already exists in our database.
          let user = await User.findOne({ where: { googleId: profile.id } });

          // 2. If user exists, return that user.
          if (user) {
            return done(null, user);
          }

          // 3. If user does not exist, create a new user.
          // We try to use the email provided by Google, but ensure it's unique or handle conflicts.
          // For simplicity, we'll create a new user with the Google ID and display name.
          // In a real app, you might also check if an email-based user exists with the same email
          // and link the accounts.
          user = await User.create({
            googleId: profile.id,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
            // You might want to store more profile info like name, picture etc.
            // For now, we'll just use email and googleId.
            // Note: Password field will be null for Google-authenticated users.
          });

          // 4. Return the newly created user.
          return done(null, user);
        } catch (err) {
          // Handle any errors during the Google OAuth process.
          return done(err, null);
        }
      }
    )
  );
};
