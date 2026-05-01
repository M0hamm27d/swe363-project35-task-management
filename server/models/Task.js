const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [35, 'Task title cannot exceed 35 characters']
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
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  estimatedFinish: {
    days: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 }
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  estimatedTime: {
    days: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    mins: { type: Number, default: 0 }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
