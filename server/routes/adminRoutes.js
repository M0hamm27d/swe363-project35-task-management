const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllUsers,
  searchUserByEmail,
  toggleUserBan,
  updateSettings,
  deleteUser
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes here require: 1. Login (protect) AND 2. Admin role (adminOnly)
router.use(protect);
router.use(adminOnly);

// Stats
router.get('/stats', getDashboardStats);

// Announcements
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// User Management
router.get('/users', getAllUsers);
router.get('/users/search', searchUserByEmail);
router.put('/users/:id/ban', toggleUserBan);
router.delete('/users/:id', deleteUser);

// System Settings
router.put('/settings', updateSettings);

module.exports = router;
