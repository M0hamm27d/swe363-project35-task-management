const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});


const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start Server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
    console.log('Please ensure you have set a valid MONGODB_URI in your .env file.');
  });