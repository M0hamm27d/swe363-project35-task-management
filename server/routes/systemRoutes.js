const express = require('express');
const router = express.Router();
const { getAnnouncements, getSettings } = require('../controllers/systemController');

// These are public routes
router.get('/announcements', getAnnouncements);
router.get('/settings', getSettings);

module.exports = router;
