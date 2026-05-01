const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowUserRegistration: {
    type: Boolean,
    default: true
  },
  contactPhone: String,
  contactEmail: {
    type: String,
    default: 'support@urgensee.com'
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    instagram: String
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
