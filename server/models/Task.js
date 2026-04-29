const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  estimatedEffort: { type: Number, required: true },
  deadline: { type: Date, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  isVisibleToTeam: { type: Boolean, default: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);