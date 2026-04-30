const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [30, 'Tag name cannot exceed 30 characters']
  },
  colorCode: {
    type: String,
    default: '#e74c3c'
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema);
