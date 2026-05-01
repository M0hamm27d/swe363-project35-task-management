const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');
const GlobalSettings = require('../models/GlobalSettings');
const bcrypt = require('bcryptjs');

// ==========================================
// SYSTEM DASHBOARD
// ==========================================

/**
 * @desc    Get system-wide statistics for the dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalWorkspaces = await Workspace.countDocuments();
    
    // You can add more complex stats here later (like daily active users)
    res.json({
      totalUsers,
      totalTasks,
      totalWorkspaces,
      systemStatus: 'Online'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ANNOUNCEMENT MANAGEMENT
// ==========================================

/**
 * @desc    Create a new system announcement
 * @route   POST /api/admin/announcements
 * @access  Private (Admin Only)
 */
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      type, // 'info', 'warning', or 'success'
      adminId: req.user._id
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete an announcement
 * @route   DELETE /api/admin/announcements/:id
 * @access  Private (Admin Only)
 */
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

/**
 * @desc    Get all users in the system
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Search/Fetch a user by email to add to the management view
 * @route   POST /api/admin/users/fetch
 * @access  Private (Admin Only)
 */
exports.fetchUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found in database.' });

    // Return the user data to be added to the Admin's local table
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Ban or Unban a user
 * @route   PUT /api/admin/users/:id/ban
 * @access  Private (Admin Only)
 */
exports.toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// GLOBAL SETTINGS
// ==========================================

/**
 * @desc    Update global system settings
 * @route   PUT /api/admin/settings
 * @access  Private (Admin Only)
 */
exports.updateSettings = async (req, res) => {
  try {
    const { allowUserRegistration, maintenanceMode } = req.body;

    // There is usually only one settings document
    let settings = await GlobalSettings.findOne();
    
    if (!settings) {
      settings = await GlobalSettings.create(req.body);
    } else {
      // Use Object.assign to update all fields sent in req.body
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
