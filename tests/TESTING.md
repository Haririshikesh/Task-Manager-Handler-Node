Postman Testing Guide for Task Management API
This guide will walk you through testing all the API endpoints of your Node.js Task Management application using Postman.

Base API URL: http://localhost:5000/api

1. Authentication Endpoints (/api/auth)
These endpoints handle user registration, login, and session management.

1.1. User Signup
Endpoint: /api/auth/signup

Method: POST

Purpose: Registers a new user with an email and password.

Request Details:

Headers:

Content-Type: application/json

Body:

Select raw and JSON from the dropdown.

Enter the following JSON. Use a unique email each time you sign up.

{
    "email": "yournewuser@example.com",
    "password": "StrongPassword123!"
}

Expected Response (201 Created):

{
    "message": "User registered successfully!",
    "user": {
        "id": "a_uuid_for_the_user",
        "email": "yournewuser@example.com"
    },
    "token": "a_long_jwt_token_string"
}

Action in Postman:

Create a new request.

Set the method to POST.

Enter the URL: http://localhost:5000/api/auth/signup

Go to the Headers tab and add Content-Type: application/json.

Go to the Body tab, select raw and JSON, then paste the JSON above.

Click Send.

Important: Copy the token from the response. You'll need it for protected routes. Also, note the id of the user.

1.2. User Login
Endpoint: /api/auth/login

Method: POST

Purpose: Authenticates an existing user and establishes a session.

Request Details:

Headers:

Content-Type: application/json

Body:

Select raw and JSON.

Enter the email and password of a user you've already signed up.

{
    "email": "yournewuser@example.com",
    "password": "StrongPassword123!"
}

Expected Response (200 OK):

{
    "message": "Logged in successfully!",
    "user": {
        "id": "a_uuid_for_the_user",
        "email": "yournewuser@example.com"
    },
    "token": "a_long_jwt_token_string"
}

Action in Postman:

Create a new request or modify the previous one.

Set the method to POST.

Enter the URL: http://localhost:5000/api/auth/login

Go to the Headers tab and add Content-Type: application/json.

Go to the Body tab, select raw and JSON, then paste the login credentials.

Click Send.

Important: Postman's cookie manager will automatically handle the connect.sid session cookie. You'll see it in the Cookies tab (usually below the response section). Copy the token from the response, as this is what we'll use for Authorization headers.

1.3. Get Current User Details (Protected)
Endpoint: /api/auth/me

Method: GET

Purpose: Retrieves details of the currently authenticated user.

Request Details:

Headers:

Authorization: Bearer <your_jwt_token> (Replace <your_jwt_token> with the token copied from signup/login).

Expected Response (200 OK):

{
    "message": "Current user details fetched successfully.",
    "user": {
        "id": "a_uuid_for_the_user",
        "email": "yournewuser@example.com",
        "googleId": null
    }
}

Action in Postman:

Create a new request.

Set the method to GET.

Enter the URL: http://localhost:5000/api/auth/me

Go to the Headers tab. Add a new header:

Key: Authorization

Value: Bearer <paste_your_jwt_token_here>

Click Send.

Test Case (Unauthorized):

Try sending the GET /api/auth/me request without the Authorization header.

Expected Response (401 Unauthorized):

{
    "error": {
        "message": "🚫 Unauthorized: Please log in to access this resource."
    }
}

1.4. Google OAuth (Initiate Flow)
Endpoint: /api/auth/google

Method: GET

Purpose: Initiates the Google OAuth 2.0 authentication flow.

Request Details: No specific headers or body needed from Postman.

Expected Behavior: The server will redirect your browser to Google's authentication page.

Action in Postman:

Create a new request.

Set the method to GET.

Enter the URL: http://localhost:5000/api/auth/google

Click Send.

Note: Postman might not handle the full OAuth redirect flow seamlessly in its built-in browser. For a true test of the Google OAuth flow, you'd typically open http://localhost:5000/api/auth/google directly in a web browser. After successful Google login, Google will redirect back to your GOOGLE_CALLBACK_URL (http://localhost:5000/api/auth/google/callback), and your server will handle the user creation/login and redirect the browser to your CLIENT_URL (e.g., http://localhost:3000/dashboard?token=...).

1.5. User Logout
Endpoint: /api/auth/logout

Method: POST

Purpose: Logs out the current user by destroying their session.

Request Details:

Headers:

Authorization: Bearer <your_jwt_token> (Use the token from your active session).

Expected Response (200 OK):

{
    "message": "Logged out successfully."
}

Action in Postman:

Create a new request.

Set the method to POST.

Enter the URL: http://localhost:5000/api/auth/logout

Go to the Headers tab and add Authorization: Bearer <your_jwt_token>.

Click Send.

Verification: After logging out, try the GET /api/auth/me request again with the same token. It should now return a 401 Unauthorized error because the session has been destroyed.

2. Task Management Endpoints (/api/tasks)
All task endpoints are protected, meaning you must include the Authorization: Bearer <your_jwt_token> header in every request.

2.1. Create a New Task
Endpoint: /api/tasks

Method: POST

Purpose: Creates a new task for the logged-in user.

Request Details:

Headers:

Content-Type: application/json

Authorization: Bearer <your_jwt_token>

Body:

Select raw and JSON.

{
    "title": "Finish API Testing Guide",
    "description": "Write comprehensive Postman instructions for all endpoints.",
    "status": "pending",
    "dueDate": "2025-06-01T23:59:59Z"
}

Expected Response (201 Created):

{
    "message": "Task created successfully!",
    "task": {
        "id": "a_uuid_for_the_task",
        "title": "Finish API Testing Guide",
        "description": "Write comprehensive Postman instructions for all endpoints.",
        "status": "pending",
        "dueDate": "2025-06-01T23:59:59.000Z",
        "userId": "the_user_uuid",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}

Action in Postman:

Create a new request.

Set the method to POST.

Enter the URL: http://localhost:5000/api/tasks

Add Content-Type: application/json and Authorization: Bearer <your_jwt_token> headers.

Go to Body, select raw and JSON, then paste the task JSON.

Click Send.

Important: Copy the id of the created task from the response. You'll need it for GET /:id, PUT /:id, and DELETE /:id.

2.2. Get All Tasks
Endpoint: /api/tasks

Method: GET

Purpose: Retrieves all tasks belonging to the logged-in user.

Request Details:

Headers:

Authorization: Bearer <your_jwt_token>

Expected Response (200 OK):

{
    "message": "Tasks fetched successfully.",
    "tasks": [
        {
            "id": "uuid_of_task_1",
            "title": "Task 1 Title",
            "description": "Task 1 Description",
            "status": "pending",
            "dueDate": "2025-06-01T23:59:59.000Z",
            "userId": "the_user_uuid",
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
        },
        {
            "id": "uuid_of_task_2",
            "title": "Task 2 Title",
            // ...
        }
    ]
}

Action in Postman:

Create a new request.

Set the method to GET.

Enter the URL: http://localhost:5000/api/tasks

Add the Authorization: Bearer <your_jwt_token> header.

Click Send.

2.3. Get a Specific Task
Endpoint: /api/tasks/:id (Replace :id with an actual task ID)

Method: GET

Purpose: Retrieves a single task by its ID, ensuring it belongs to the logged-in user.

Request Details:

Headers:

Authorization: Bearer <your_jwt_token>

Expected Response (200 OK):

{
    "message": "Task fetched successfully.",
    "task": {
        "id": "the_specific_task_uuid",
        "title": "Finish API Testing Guide",
        "description": "Write comprehensive Postman instructions for all endpoints.",
        "status": "pending",
        "dueDate": "2025-06-01T23:59:59.000Z",
        "userId": "the_user_uuid",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}

Action in Postman:

Create a new request.

Set the method to GET.

Enter the URL: http://localhost:5000/api/tasks/<paste_your_task_id_here>

Add the Authorization: Bearer <your_jwt_token> header.

Click Send.

Test Case (Task Not Found/Unauthorized):

Try with a non-existent task ID or a task ID that belongs to another user (if you have one).

Expected Response (404 Not Found):

{
    "message": "Task not found or you do not have permission to view it."
}

2.4. Update a Task
Endpoint: /api/tasks/:id (Replace :id with the task ID you want to update)

Method: PUT

Purpose: Updates the details of an existing task.

Request Details:

Headers:

Content-Type: application/json

Authorization: Bearer <your_jwt_token>

Body:

Select raw and JSON.

Provide the fields you want to update. You don't need to send all fields.

{
    "title": "Finish API Testing Guide (Completed)",
    "status": "completed"
}

Expected Response (200 OK):

{
    "message": "Task updated successfully!",
    "task": {
        "id": "the_specific_task_uuid",
        "title": "Finish API Testing Guide (Completed)",
        "description": "Write comprehensive Postman instructions for all endpoints.",
        "status": "completed",
        "dueDate": "2025-06-01T23:59:59.000Z",
        "userId": "the_user_uuid",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
    }
}

Action in Postman:

Create a new request.

Set the method to PUT.

Enter the URL: http://localhost:5000/api/tasks/<paste_your_task_id_here>

Add Content-Type: application/json and Authorization: Bearer <your_jwt_token> headers.

Go to Body, select raw and JSON, then paste the update JSON.

Click Send.

2.5. Delete a Task
Endpoint: /api/tasks/:id (Replace :id with the task ID you want to delete)

Method: DELETE

Purpose: Deletes a specific task.

Request Details:

Headers:

Authorization: Bearer <your_jwt_token>

Expected Response (200 OK):

{
    "message": "Task deleted successfully!"
}

Action in Postman:

Create a new request.

Set the method to DELETE.

Enter the URL: http://localhost:5000/api/tasks/<paste_your_task_id_here>

Add the Authorization: Bearer <your_jwt_token> header.

Click Send.

Verification: After deleting, try to GET the same task ID. It should now return a 404 Not Found error.

3. User Profile Endpoints (/api/users)
This endpoint allows updating the logged-in user's profile.

3.1. Update User Profile
Endpoint: /api/users/profile

Method: PUT

Purpose: Updates the email or password of the logged-in user.

Request Details:

Headers:

Content-Type: application/json

Authorization: Bearer <your_jwt_token>

Body:

Select raw and JSON.

You can update email, password, or both.

{
    "email": "updated_email@example.com",
    "password": "NewStrongPassword456!"
}

Expected Response (200 OK):

{
    "message": "Profile updated successfully!",
    "user": {
        "id": "the_user_uuid",
        "email": "updated_email@example.com",
        "googleId": null
    }
}

Action in Postman:

Create a new request.

Set the method to PUT.

Enter the URL: http://localhost:5000/api/users/profile

Add Content-Type: application/json and Authorization: Bearer <your_jwt_token> headers.

Go to Body, select raw and JSON, then paste the update JSON.

Click Send.

Important: If you updated the email, remember to use the new email for subsequent logins. If you updated the password, use the new password for future logins.

This comprehensive guide should help you and your sister confidently test every aspect of your Task Management API using Postman! Remember to follow the steps in order, especially for authentication, as subsequent protected requests rely on a valid token.