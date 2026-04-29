const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  activeUntil: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);