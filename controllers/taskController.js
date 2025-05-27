const db = require('../models');
const Task = db.Task;

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: {userId: req.user.id},
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
        message: 'Tasks fetched successfully.',
        tasks,
        });
    } catch(error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error fetching tasks.", error: error.message, });
    }
}

const getTaskById = async (req, res) => {
  const { id } = req.params; 

  try {
    const task = await Task.findOne({
      where: {
        id: id,
        userId: req.user.id, 
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to view it.' });
    }

    res.status(200).json({
      message: 'Task fetched successfully.',
      task,
    });
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ message: 'Server error fetching task.', error: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body; 
  if (!title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      status,
      dueDate,
      userId: req.user.id, 
    });

    res.status(201).json({
      message: 'Task created successfully!',
      task: newTask,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task.', error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findOne({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to update it.' });
    }

    task.title = title || task.title; 
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate; 

    await task.save(); 

    res.status(200).json({
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Server error updating task.', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params; 

  try {
    const deletedRowCount = await Task.destroy({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error deleting task.', error: error.message });
  }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
}