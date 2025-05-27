Task Management API
This project is a robust and well-structured backend API for a simple Task Management system. It allows users to manage their tasks securely with authentication mechanisms, including traditional email/password and Google OAuth, and provides comprehensive CRUD (Create, Read, Update, Delete) operations for tasks.

Designed with clarity and modularity in mind, this API is an excellent learning resource for understanding Node.js backend development, database integration with Sequelize, and advanced authentication patterns.

Features
User Authentication:

Signup with Email and Password.

Login with Email and Password.

Google OAuth 2.0 integration for seamless login.

User session management for persistent logins.

Protected routes for authenticated users.

Task Management:

Create new tasks with title, description, status, and due date.

Retrieve all tasks for the logged-in user.

Retrieve a specific task by ID.

Update existing tasks.

Delete tasks.

User Profile Management:

Update logged-in user's email and password.

Secure Password Handling: Passwords are hashed using bcryptjs before storage.

Environment Configuration: Uses .env for secure handling of sensitive credentials.

Structured Project: Clear separation of concerns with dedicated folders for models, controllers, routes, and middleware.

Technology Stack
Backend Framework: Node.js, Express.js

Database: PostgreSQL

ORM (Object-Relational Mapper): Sequelize

Authentication: Passport.js (with passport-local and passport-google-oauth20 strategies)

Password Hashing: bcryptjs

Token-based Authentication: jsonwebtoken (JWTs)

Session Management: express-session, cookie-parser

CORS Handling: cors

Environment Variables: dotenv

Testing: Jest, Axios

Project File Structure
task-manager-api/
├── .env                  // Environment variables (database creds, secrets)
├── app.js                // Main application entry point, Express setup, middleware, and route loading
├── config/               // Configuration files
│   ├── config.js         // Database connection, JWT secret, Google OAuth keys
│   └── passport.js       // Passport.js strategies setup (local, Google)
├── models/               // Sequelize model definitions (database schemas)
│   ├── index.js          // Sequelize initialization, model loading, and associations
│   ├── User.js           // User model (for 'users' table)
│   └── Task.js           // Task model (for 'tasks' table)
├── controllers/          // Business logic for handling API requests
│   ├── authController.js // Logic for authentication routes
│   ├── taskController.js // Logic for task CRUD operations
│   └── userController.js // Logic for user profile updates
├── routes/               // API endpoint definitions
│   ├── authRoutes.js     // Authentication API endpoints
│   ├── taskRoutes.js     // Task API endpoints
│   └── userRoutes.js     // User profile API endpoints
└── middleware/           // Custom middleware functions
    └── authMiddleware.js // Middleware for protecting routes (e.g., isAuthenticated)

Getting Started
Follow these steps to get the Task Management API running on your local machine.

Prerequisites
Node.js & npm: Download and install from nodejs.org.

PostgreSQL: Download and install PostgreSQL. You can use pgAdmin (usually bundled) to manage your database.

1. Clone the Repository (or create project manually)
git clone <repository_url> # If you have a Git repo
cd task-manager-api

If you're building manually, create the task-manager-api directory and cd into it.

2. Initialize Project & Install Dependencies
npm init -y
npm install express sequelize pg dotenv bcryptjs jsonwebtoken passport passport-local passport-google-oauth20 cookie-parser cors express-session
npm install --save-dev jest axios # For testing

3. Database Setup (PostgreSQL)
Open pgAdmin or your preferred PostgreSQL client.

Connect to your PostgreSQL server.

Create a new database (e.g., taskmg).

Ensure you have a user (e.g., postgres) with a password and privileges to access this database.

4. Environment Variables
Create a file named .env in the root of your project (task-manager-api/.env) and add the following content. Replace placeholder values with your actual credentials.

# Database Configuration
DB_NAME=taskmg
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password # <<< IMPORTANT: No quotes around the password!
DB_HOST=localhost
DB_DIALECT=postgres
DB_PORT=5432

# JWT Secret (generate a strong random string)
JWT_SECRET=supersecretjwtkeythatisverylongandrandom1234567890

# Session Secret (generate a strong random string for express-session)
SESSION_SECRET=anothersupersecretkeyforpassportsessions12345

# Google OAuth Credentials (Optional, but recommended for full functionality)
# Obtain these from Google Cloud Console (APIs & Services -> Credentials)
# Ensure 'http://localhost:5000/api/auth/google/callback' is an Authorized redirect URI.
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client URL (for CORS and Google OAuth redirect)
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development # or production
PORT=5000

5. Run the Server
Start your Node.js application:

node app.js
# Or, if you added a "start" script to package.json:
# npm start

You should see console output indicating that the database is synced and the server is running on http://localhost:5000.

API Endpoints Reference
The API provides the following endpoints:

Authentication (/api/auth)
Method

Endpoint

Description

Protection

POST

/signup

Register a new user with email and password.

None

POST

/login

Log in an existing user with email and password.

None

GET

/google

Initiate Google OAuth flow.

None

GET

/google/callback

Google OAuth callback URI.

None

GET

/me

Get details of the currently logged-in user.

Protected

POST

/logout

Log out the current user.

Protected

Tasks (/api/tasks)
Method

Endpoint

Description

Protection

GET

/

Get all tasks for the logged-in user.

Protected

GET

/:id

Get a specific task by ID.

Protected

POST

/

Create a new task.

Protected

PUT

/:id

Update an existing task by ID.

Protected

DELETE

/:id

Delete a task by ID.

Protected

User Profile (/api/users)
Method

Endpoint

Description

Protection

PUT

/profile

Update the logged-in user's profile.

Protected

Testing the API
You can test the API using two main methods:

1. Automated Tests (Jest & Axios)
The project includes an automated test suite using Jest and Axios.

Ensure your server is running (as described in "Run the Server" above).

In a separate terminal, navigate to the project root and run:

npm test

This will execute tests/api.test.js, which simulates API requests and verifies responses.

2. Manual Testing with Postman
For interactive manual testing and to understand request/response structures, Postman is ideal.

Refer to the comprehensive Postman Testing Guide for detailed instructions on how to use Postman for each endpoint, including request headers, body formats, and expected responses. This guide will walk you through setting up requests for signup, login, protected routes, and task operations.

Understanding Authentication (For Students)
The authentication system in this project uses a hybrid approach combining Passport.js, Express Sessions, Cookies, and JSON Web Tokens (JWTs). This can be a complex topic, but here's a simplified overview:

Passport.js: Acts as a flexible authentication middleware. It's like a plug-and-play system for different login methods (email/password, Google, etc.).

Express Sessions: When a user logs in, the server creates a "session" to remember that user. This session stores minimal user data (like their ID) on the server.

Cookies (connect.sid): The server sends a unique "session ID" to the user's browser in a special cookie (named connect.sid). The browser automatically sends this cookie back with every subsequent request. This is how the server knows who the user is without them re-entering credentials.

serializeUser & deserializeUser: These are Passport.js functions that bridge the gap. serializeUser decides what user info goes into the session (e.g., just the user's ID). deserializeUser takes that ID from the session and fetches the full user object from the database, attaching it to req.user for your route handlers to use. This is the core of "persistent login."

JWTs (JSON Web Tokens): In addition to sessions, the API also issues a JWT upon login/signup. This token is a self-contained, digitally signed piece of data that can be used by the client (e.g., a frontend application) to prove its identity. While sessions handle the server's internal authentication state, JWTs are often used by clients for API calls, especially in stateless architectures or when integrating with mobile apps.

For a much deeper and step-by-step explanation of how Passport.js, sessions, cookies, and JWTs work together in this project, please refer to the Project Explanation Document.