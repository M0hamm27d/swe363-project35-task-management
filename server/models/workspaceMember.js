const mongoose = require('mongoose');

const workspaceMemberSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent a user from joining the same workspace twice
workspaceMemberSchema.index({ workspace: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('WorkspaceMember', workspaceMemberSchema);