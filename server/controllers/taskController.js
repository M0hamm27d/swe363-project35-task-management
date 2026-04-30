const Task = require("../models/Task");

// get all tasks
exports.getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// create task
exports.createTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
};