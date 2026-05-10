const express = require('express');
const router = express.Router();
const TaskService = require('./taskService');
const taskService = new TaskService();

// Add a new task
router.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = taskService.addTask(title, description);
  res.status(201).json(newTask);
});

// Delete a task
router.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = taskService.deleteTask(id);
  if (deleted) {
    return res.status(204).send();
  }
  res.status(404).json({ error: 'Task not found' });
});

module.exports = router;
