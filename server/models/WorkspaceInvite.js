const mongoose = require('mongoose');

const workspaceInviteSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Expired'], default: 'Pending' },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('WorkspaceInvite', workspaceInviteSchema);