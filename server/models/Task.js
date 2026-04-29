const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  category: { 
    type: String, 
    required: [true, 'Task category is required'],
    default: 'General'
  },
  estimatedEffort: { 
    type: Number, 
    required: [true, 'Estimated effort (in hours) is required'],
    min: [0.1, 'Estimated effort must be greater than 0']
  },
  deadline: { 
    type: Date, 
    required: [true, 'Deadline is required'] 
  },
  progress: { 
    type: Number, 
    default: 0,
    min: [0, 'Progress cannot be less than 0%'],
    max: [100, 'Progress cannot exceed 100%']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Review', 'Completed'],
    default: 'Pending'
  },
  // This links the task to the specific user who owns it
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'A task must be assigned to a user'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);