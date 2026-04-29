const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  twitterUrl: String,
  instagramUrl: String,
  linkedInUrl: String,
  contactPhone: String,
  contactEmail: String,
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
