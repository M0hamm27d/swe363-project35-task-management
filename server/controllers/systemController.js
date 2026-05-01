const Announcement = require('../models/Announcement');
const GlobalSettings = require('../models/GlobalSettings');

/**
 * @desc    Get all active announcements
 * @route   GET /api/system/announcements
 * @access  Public
 */
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get global settings (Contact info, social links, etc.)
 * @route   GET /api/system/settings
 * @access  Public
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await GlobalSettings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
