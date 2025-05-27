// tests/api.test.js
// This file contains a comprehensive test suite for the Task Management API.
// It uses Jest for the testing framework and Axios for making HTTP requests.
//
// To run these tests:
// 1. Ensure your Node.js server is running (e.g., in a separate terminal: npm start).
// 2. In your project root, run: npm test
//
// This file serves as both a functional test and a detailed documentation
// for how to interact with each API endpoint.

const axios = require('axios'); // Import Axios for making HTTP requests.

// Define the base URL for your API.
// Make sure this matches the PORT in your .env file (default is 5000).
const API_BASE_URL = 'http://localhost:5000/api';

// --- Global Variables for Test Chaining ---
// These variables will store data needed across multiple tests (e.g., user token, task ID).
let userToken = ''; // Stores the JWT token received after login/signup.
let userId = '';    // Stores the ID of the user created/logged in.
let taskId = '';    // Stores the ID of a task created.

// --- Test Data ---
// Define consistent test data to be used across tests.
const testUser = {
  email: `testuser_${Date.now()}@example.com`, // Use a unique email for each run.
  password: 'TestPassword123!',
};

const testTask = {
  title: 'Buy groceries',
  description: 'Milk, Eggs, Bread, and Coffee',
  status: 'pending',
  dueDate: '2025-06-30T17:00:00Z',
};

const updatedTestTask = {
  title: 'Buy groceries (completed)',
  description: 'All items purchased.',
  status: 'completed',
  dueDate: '2025-05-26T10:00:00Z',
};

// --- Jest Test Suite Structure ---

// `describe` blocks group related tests together.
// This makes the test output organized and readable.

describe('Authentication API Endpoints', () => {
  // Test case for user signup.
  test('should allow a new user to sign up', async () => {
    console.log('\n--- Testing User Signup (POST /api/auth/signup) ---');
    try {
      // Request Details:
      // Method: POST
      // Endpoint: /api/auth/signup
      // Body: JSON object with email and password.
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, testUser);

      // Expected Response:
      // Status: 201 Created
      // Body: { message: 'User registered successfully!', user: { id, email }, token }
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('User registered successfully!');
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user.email).toBe(testUser.email);
      expect(response.data).toHaveProperty('token');

      // Store the token and user ID for subsequent protected tests.
      userToken = response.data.token;
      userId = response.data.user.id;
      console.log('Signup successful. User ID:', userId, 'Token:', userToken.substring(0, 15) + '...');
    } catch (error) {
      console.error('Signup Test Failed:', error.response ? error.response.data : error.message);
      // Fail the test if an error occurs.
      fail('Signup test failed.');
    }
  });

  // Test case for user login.
  test('should allow an existing user to log in', async () => {
    console.log('\n--- Testing User Login (POST /api/auth/login) ---');
    try {
      // Request Details:
      // Method: POST
      // Endpoint: /api/auth/login
      // Body: JSON object with email and password.
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Logged in successfully!', user: { id, email }, token }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Logged in successfully!');
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user.email).toBe(testUser.email);
      expect(response.data).toHaveProperty('token');

      // Update the token in case it's a new one (though typically it's the same or refreshed).
      userToken = response.data.token;
      console.log('Login successful. Token:', userToken.substring(0, 15) + '...');
    } catch (error) {
      console.error('Login Test Failed:', error.response ? error.response.data : error.message);
      fail('Login test failed.');
    }
  });

  // Test case for getting current user details (protected route).
  test('should get current user details for an authenticated user', async () => {
    console.log('\n--- Testing Get Current User (GET /api/auth/me) ---');
    // Ensure we have a token from previous tests.
    expect(userToken).toBeTruthy();

    try {
      // Request Details:
      // Method: GET
      // Endpoint: /api/auth/me
      // Headers: Authorization header with Bearer token.
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Current user details fetched successfully.', user: { id, email, googleId? } }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Current user details fetched successfully.');
      expect(response.data.user).toHaveProperty('id', userId);
      expect(response.data.user.email).toBe(testUser.email);
      console.log('Get /me successful. User Email:', response.data.user.email);
    } catch (error) {
      console.error('Get /me Test Failed:', error.response ? error.response.data : error.message);
      fail('Get /me test failed.');
    }
  });

  // Test case for getting current user details without authentication (should fail).
  test('should NOT get current user details for an unauthenticated user', async () => {
    console.log('\n--- Testing Get Current User (GET /api/auth/me) - Unauthorized ---');
    try {
      // Request Details:
      // Method: GET
      // Endpoint: /api/auth/me
      // Headers: No Authorization header.
      await axios.get(`${API_BASE_URL}/auth/me`);
      // If the above line doesn't throw, the test should fail because it implies success.
      fail('Unauthorized access to /me should have failed.');
    } catch (error) {
      // Expected Response:
      // Status: 401 Unauthorized
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('🚫 Unauthorized: Please log in to access this resource.');
      console.log('Get /me Unauthorized test passed (expected 401).');
    }
  });
});

describe('Task Management API Endpoints (Protected)', () => {
  // Ensure a user is authenticated before running task tests.
  // This `beforeAll` hook runs once before all tests in this `describe` block.
  beforeAll(() => {
    // We assume userToken is set from the Auth tests, but if running task tests
    // in isolation, you might need to perform a login here.
    if (!userToken) {
      console.warn('User token not found. Please run Authentication tests first or log in manually.');
      // For a robust setup, you'd perform a login here if userToken is empty.
      // E.g., await axios.post(`${API_BASE_URL}/auth/login`, testUser);
    }
  });

  // Test case for creating a new task.
  test('should allow an authenticated user to create a task', async () => {
    console.log('\n--- Testing Create Task (POST /api/tasks) ---');
    expect(userToken).toBeTruthy(); // Ensure we have a token.

    try {
      // Request Details:
      // Method: POST
      // Endpoint: /api/tasks
      // Body: JSON object with task details (title, description, status, dueDate).
      // Headers: Authorization header with Bearer token.
      const response = await axios.post(`${API_BASE_URL}/tasks`, testTask, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 201 Created
      // Body: { message: 'Task created successfully!', task: { id, title, ... } }
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Task created successfully!');
      expect(response.data.task).toHaveProperty('id');
      expect(response.data.task.title).toBe(testTask.title);
      expect(response.data.task.userId).toBe(userId); // Ensure task is linked to our user.

      // Store the task ID for subsequent task-related tests.
      taskId = response.data.task.id;
      console.log('Create Task successful. Task ID:', taskId);
    } catch (error) {
      console.error('Create Task Test Failed:', error.response ? error.response.data : error.message);
      fail('Create Task test failed.');
    }
  });

  // Test case for getting all tasks for the authenticated user.
  test('should get all tasks for the authenticated user', async () => {
    console.log('\n--- Testing Get All Tasks (GET /api/tasks) ---');
    expect(userToken).toBeTruthy();

    try {
      // Request Details:
      // Method: GET
      // Endpoint: /api/tasks
      // Headers: Authorization header with Bearer token.
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Tasks fetched successfully.', tasks: [ { id, title, ... } ] }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Tasks fetched successfully.');
      expect(Array.isArray(response.data.tasks)).toBe(true);
      expect(response.data.tasks.length).toBeGreaterThanOrEqual(1); // Should at least contain the task we just created.
      // Verify that our created task is in the list.
      const foundTask = response.data.tasks.find(task => task.id === taskId);
      expect(foundTask).toBeTruthy();
      expect(foundTask.title).toBe(testTask.title);
      console.log('Get All Tasks successful. Found', response.data.tasks.length, 'tasks.');
    } catch (error) {
      console.error('Get All Tasks Test Failed:', error.response ? error.response.data : error.message);
      fail('Get All Tasks test failed.');
    }
  });

  // Test case for getting a specific task by ID.
  test('should get a specific task by ID for the authenticated user', async () => {
    console.log('\n--- Testing Get Task by ID (GET /api/tasks/:id) ---');
    expect(userToken).toBeTruthy();
    expect(taskId).toBeTruthy(); // Ensure we have a task ID.

    try {
      // Request Details:
      // Method: GET
      // Endpoint: /api/tasks/:id
      // Headers: Authorization header with Bearer token.
      const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Task fetched successfully.', task: { id, title, ... } }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Task fetched successfully.');
      expect(response.data.task).toHaveProperty('id', taskId);
      expect(response.data.task.title).toBe(testTask.title);
      console.log('Get Task by ID successful. Task Title:', response.data.task.title);
    } catch (error) {
      console.error('Get Task by ID Test Failed:', error.response ? error.response.data : error.message);
      fail('Get Task by ID test failed.');
    }
  });

  // Test case for updating an existing task.
  test('should allow an authenticated user to update a task', async () => {
    console.log('\n--- Testing Update Task (PUT /api/tasks/:id) ---');
    expect(userToken).toBeTruthy();
    expect(taskId).toBeTruthy();

    try {
      // Request Details:
      // Method: PUT
      // Endpoint: /api/tasks/:id
      // Body: JSON object with updated task details.
      // Headers: Authorization header with Bearer token.
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updatedTestTask, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Task updated successfully!', task: { id, title, description, status, ... } }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Task updated successfully!');
      expect(response.data.task).toHaveProperty('id', taskId);
      expect(response.data.task.title).toBe(updatedTestTask.title);
      expect(response.data.task.description).toBe(updatedTestTask.description);
      expect(response.data.task.status).toBe(updatedTestTask.status);
      console.log('Update Task successful. New Title:', response.data.task.title);
    } catch (error) {
      console.error('Update Task Test Failed:', error.response ? error.response.data : error.message);
      fail('Update Task test failed.');
    }
  });
});

describe('User Profile API Endpoints (Protected)', () => {
  // Ensure a user is authenticated before running profile tests.
  beforeAll(() => {
    if (!userToken) {
      console.warn('User token not found. Please run Authentication tests first or log in manually.');
    }
  });

  // Test case for updating user profile.
  test('should allow an authenticated user to update their profile', async () => {
    console.log('\n--- Testing Update User Profile (PUT /api/users/profile) ---');
    expect(userToken).toBeTruthy();

    const newEmail = `updated_user_${Date.now()}@example.com`;
    const newPassword = 'NewSecurePassword456!';

    try {
      // Request Details:
      // Method: PUT
      // Endpoint: /api/users/profile
      // Body: JSON object with new email and/or password.
      // Headers: Authorization header with Bearer token.
      const response = await axios.put(`${API_BASE_URL}/users/profile`, {
        email: newEmail,
        password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Profile updated successfully!', user: { id, email, ... } }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Profile updated successfully!');
      expect(response.data.user).toHaveProperty('id', userId);
      expect(response.data.user.email).toBe(newEmail);
      // Note: Password is not returned for security, so we can't directly check it here.
      console.log('Update User Profile successful. New Email:', response.data.user.email);

      // Update testUser email for subsequent tests if needed (e.g., re-login with new email).
      testUser.email = newEmail;
      testUser.password = newPassword; // Update password too, though not directly verified here.
    } catch (error) {
      console.error('Update User Profile Test Failed:', error.response ? error.response.data : error.message);
      fail('Update User Profile test failed.');
    }
  });
});

describe('Cleanup and Logout', () => {
  // Test case for deleting the created task.
  test('should allow an authenticated user to delete a task', async () => {
    console.log('\n--- Testing Delete Task (DELETE /api/tasks/:id) ---');
    expect(userToken).toBeTruthy();
    expect(taskId).toBeTruthy();

    try {
      // Request Details:
      // Method: DELETE
      // Endpoint: /api/tasks/:id
      // Headers: Authorization header with Bearer token.
      const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Task deleted successfully!' }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Task deleted successfully!');
      console.log('Delete Task successful. Task ID:', taskId);

      // Verify the task is actually gone.
      try {
        await axios.get(`${API_BASE_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        fail('Task should have been deleted but was still accessible.');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toContain('Task not found');
        console.log('Verification: Task is indeed gone (expected 404).');
      }
    } catch (error) {
      console.error('Delete Task Test Failed:', error.response ? error.response.data : error.message);
      fail('Delete Task test failed.');
    }
  });

  // Test case for user logout.
  test('should allow an authenticated user to log out', async () => {
    console.log('\n--- Testing User Logout (POST /api/auth/logout) ---');
    expect(userToken).toBeTruthy();

    try {
      // Request Details:
      // Method: POST
      // Endpoint: /api/auth/logout
      // Headers: Authorization header with Bearer token (though session-based logout might not strictly need it, good practice).
      const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Expected Response:
      // Status: 200 OK
      // Body: { message: 'Logged out successfully.' }
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Logged out successfully.');
      console.log('Logout successful.');

      // After logout, the token/session should be invalid.
      // Attempt to access a protected route to confirm unauthentication.
      try {
        await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${userToken}` }, // Still using the old token.
        });
        fail('Access to protected route after logout should have failed.');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.message).toContain('Unauthorized');
        console.log('Verification: Access after logout failed (expected 401).');
      }
    } catch (error) {
      console.error('Logout Test Failed:', error.response ? error.response.data : error.message);
      fail('Logout test failed.');
    }
  });
});
