const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const answerRoutes = require('./routes/answerRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/notes', noteRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Campus Connect Backend is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});