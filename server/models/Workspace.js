const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [35, 'Workspace name cannot exceed 35 characters']
  },
  colorCode: {
    type: String,
    default: '#3498db'
  },
  description: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.split(/\s+/).filter(word => word.length > 0).length <= 500;
      },
      message: 'Description cannot exceed 500 words'
    }
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workspace', workspaceSchema);
