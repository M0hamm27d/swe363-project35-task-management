const Announcement = require('../models/Announcement');
const User = require('../models/User');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');
const GlobalSettings = require('../models/GlobalSettings');
const DailyStat = require('../models/DailyStat');
const Admin = require('../models/Admin');
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
    const activeTasks = await Task.countDocuments({ completed: false });
    const totalWorkspaces = await Workspace.countDocuments();

    // Fetch actual DailyStat metrics for the last 7 days
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const usageMetrics = [];

    // Generate dates for the last 7 days
    const last7Dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Dates.push({
        dateStr: d.toISOString().split('T')[0],
        dayLabel: days[d.getDay()]
      });
    }

    // Query DB for these specific dates
    const dateStrings = last7Dates.map(d => d.dateStr);
    const stats = await DailyStat.find({ date: { $in: dateStrings } });

    // Map the results back into the ordered 7-day array
    for (const d of last7Dates) {
      const statForDay = stats.find(s => s.date === d.dateStr);
      let activeCount = statForDay ? statForDay.activeUsers.length : 0;
      
      // SAFETY: If we deleted users, the historical active count might be higher than current total.
      // We cap it at totalUsers to keep the UI logic consistent.
      if (activeCount > totalUsers) activeCount = totalUsers;

      usageMetrics.push({
        day: d.dayLabel,
        total: totalUsers || 1, 
        active: activeCount
      });
    }

    // Check maintenance status from GlobalSettings
    const settings = await GlobalSettings.findOne();
    const systemStatus = settings && settings.maintenanceMode ? 'Maintenance' : 'Online';

    res.json({
      totalUsers,
      activeTasks,
      totalWorkspaces,
      usageMetrics,
      systemStatus
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
    const { title, body } = req.body;
    const announcement = await Announcement.create({
      title,
      body,
      adminId: req.user._id
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update an announcement
 * @route   PUT /api/admin/announcements/:id
 * @access  Private (Admin Only)
 */
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, body } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );
    res.json(announcement);
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
 * @desc    Get all users with pagination and search
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    const enhancedUsers = await Promise.all(users.map(async (u) => {
      const userObj = u.toObject();
      const isAdmin = await Admin.exists({ email: u.email });
      
      let workAs = 'Regular User';
      if (isAdmin) {
        workAs = 'Admin';
      } else {
        const workspaceCount = await Workspace.countDocuments({ leaderId: u._id });
        if (workspaceCount > 0) workAs = 'Team Leader';
      }
      
      const usage = u.dailyUsageMinutes || 0;
      const engagement = Math.min(Math.round((usage / 60) * 100), 100);

      return {
        ...userObj,
        name: `${u.firstName} ${u.lastName}`,
        workAs,
        status: `${engagement}%`,
        date: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'
      };
    }));

    res.json({
      users: enhancedUsers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Search for a specific user by email
 * @route   GET /api/admin/users/search
 * @access  Private (Admin Only)
 */
exports.searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isAdmin = await Admin.exists({ email: user.email });
    let workAs = 'Regular User';
    if (isAdmin) {
      workAs = 'Admin';
    } else {
      const workspaceCount = await Workspace.countDocuments({ leaderId: user._id });
      if (workspaceCount > 0) workAs = 'Team Leader';
    }

    const usage = user.dailyUsageMinutes || 0;
    const engagement = Math.min(Math.round((usage / 60) * 100), 100);

    res.json({
      ...user.toObject(),
      name: `${user.firstName} ${user.lastName}`,
      workAs,
      status: `${engagement}%`,
      date: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'
    });
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

    // SAFETY LOCK: Prevent banning an Admin
    const isAdmin = await Admin.exists({ email: user.email });
    if (isAdmin) {
      return res.status(403).json({ message: 'Safety Lock: You cannot ban an administrator account.' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Permanently delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin Only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // SAFETY LOCK: Prevent deleting an Admin
    const isAdmin = await Admin.exists({ email: user.email });
    if (isAdmin) {
      return res.status(403).json({ message: 'Safety Lock: You cannot delete an administrator account.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted permanently' });
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
    let settings = await GlobalSettings.findOne();

    if (!settings) {
      settings = await GlobalSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
