const express = require('express'); 
const router = express.Router();    
const taskController = require('../controllers/taskController'); 
const { isAuthenticated } = require('../middleware/authMiddleware'); 

// --- Task Routes (All Protected) ---
// The `isAuthenticated` middleware is applied to all routes in this router,
// ensuring that only logged-in users can access task-related functionalities.

// 1. GET /api/tasks
// Retrieves all tasks for the logged-in user.
router.get('/', isAuthenticated, taskController.getAllTasks);

// 2. GET /api/tasks/:id
// Retrieves a specific task by its ID for the logged-in user.
router.get('/:id', isAuthenticated, taskController.getTaskById);

// 3. POST /api/tasks
// Creates a new task for the logged-in user.
router.post('/', isAuthenticated, taskController.createTask);

// 4. PUT /api/tasks/:id
// Updates an existing task by its ID for the logged-in user.
router.put('/:id', isAuthenticated, taskController.updateTask);

// 5. DELETE /api/tasks/:id
// Deletes a task by its ID for the logged-in user.
router.delete('/:id', isAuthenticated, taskController.deleteTask);

module.exports = router;
