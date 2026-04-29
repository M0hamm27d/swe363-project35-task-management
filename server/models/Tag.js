const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  colorCode: { type: String, default: '#CCCCCC' },
  isGlobal: { type: Boolean, default: false },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);