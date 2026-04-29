const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  footerText: { type: String, default: '© Smart Task Application' },
  supportEmail: { type: String, default: 'support@smarttask.com' },
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
