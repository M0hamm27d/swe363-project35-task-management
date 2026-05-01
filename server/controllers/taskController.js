const Task = require('../models/Task');
const WorkspaceMember = require('../models/WorkspaceMember');

/**
 * @desc    Get all personal tasks for the logged-in user
 * @route   GET /api/tasks/personal
 * @access  Private
 */
exports.getPersonalTasks = async (req, res) => {
  try {
    // Find tasks where workspaceId is null (personal) AND userId matches
    const tasks = await Task.find({ userId: req.user._id, workspaceId: null });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all tasks for a specific workspace
 * @route   GET /api/tasks/workspace/:workspaceId
 * @access  Private
 */
exports.getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check if the user is at least a member of this workspace
    const isMember = await WorkspaceMember.findOne({ workspaceId, userId: req.user._id });
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this workspace.' });
    }

    const tasks = await Task.find({ workspaceId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new task (Personal or Workspace)
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, workspaceId, deadline, estimatedTime } = req.body;

    // If it's a WORKSPACE task, check if the user is a Leader
    if (workspaceId) {
      const membership = await WorkspaceMember.findOne({ workspaceId, userId: req.user._id });
      if (!membership || membership.role !== 'Admin') {
        return res.status(403).json({ message: 'Only team leaders can create tasks in a workspace.' });
      }
    }

    // If no workspaceId, it is a personal task (anyone can create their own)
    const task = await Task.create({
      title,
      description,
      workspaceId: workspaceId || null,
      deadline,
      estimatedTime,
      userId: req.user._id 
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a task
 */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 1. If it's a Personal Task -> Allow only the Owner
    if (!task.workspaceId) {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    } 
    // 2. If it's a Workspace Task -> Allow only the Workspace Leader
    else {
      const membership = await WorkspaceMember.findOne({ 
        workspaceId: task.workspaceId, 
        userId: req.user._id 
      });
      if (!membership || membership.role !== 'Admin') {
        return res.status(403).json({ message: 'Only leaders can update workspace tasks.' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 1. If it's a Personal Task -> Allow only the Owner
    if (!task.workspaceId) {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    } 
    // 2. If it's a Workspace Task -> Allow only the Workspace Leader
    else {
      const membership = await WorkspaceMember.findOne({ 
        workspaceId: task.workspaceId, 
        userId: req.user._id 
      });
      if (!membership || membership.role !== 'Admin') {
        return res.status(403).json({ message: 'Only leaders can delete workspace tasks.' });
      }
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
