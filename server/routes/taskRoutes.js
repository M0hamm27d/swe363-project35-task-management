const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, userOnly } = require('../middleware/authMiddleware');

/**
 * All routes below this line will require:
 * 1. A valid JWT Token (protect)
 * 2. A 'user' role (userOnly)
 */
router.use(protect);
router.use(userOnly);

// GET all tasks & POST a new task
router.route('/')
  .get(getTasks)
  .post(createTask);

// UPDATE & DELETE a specific task by ID
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
