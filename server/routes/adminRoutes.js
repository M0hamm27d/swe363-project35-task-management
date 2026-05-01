const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  createAnnouncement, 
  deleteAnnouncement, 
  getAllUsers, 
  fetchUserByEmail,
  toggleUserBan, 
  updateSettings 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes here require: 1. Login (protect) AND 2. Admin role (adminOnly)
router.use(protect);
router.use(adminOnly);

// Stats
router.get('/stats', getDashboardStats);

// Announcements
router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// User Management
router.get('/users', getAllUsers);
router.post('/users/fetch', fetchUserByEmail);
router.put('/users/:id/ban', toggleUserBan);

// System Settings
router.put('/settings', updateSettings);

module.exports = router;
