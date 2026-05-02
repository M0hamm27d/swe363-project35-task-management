const mongoose = require('mongoose');

const dailyStatSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Format: 'YYYY-MM-DD'
  
  activeUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
});

module.exports = mongoose.model('DailyStat', dailyStatSchema);
