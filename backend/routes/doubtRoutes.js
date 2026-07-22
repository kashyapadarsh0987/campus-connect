const express = require('express');
const Doubt = require('../models/doubt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// POST - Create a new doubt (protected route)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    const newDoubt = new Doubt({
      title,
      description,
      subject,
      postedBy: req.user.id
    });

    await newDoubt.save();
    res.status(201).json({ message: 'Doubt posted successfully', doubt: newDoubt });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - Get all doubts
router.get('/', async (req, res) => {
  try {
    const doubts = await Doubt.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - Get a single doubt by ID
router.get('/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id).populate('postedBy', 'name email');
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;