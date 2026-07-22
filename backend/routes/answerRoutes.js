const express = require('express');
const Answer = require('../models/answer');
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

// POST - Post an answer to a doubt (protected route)
router.post('/:doubtId', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const { doubtId } = req.params;

    // Check if doubt exists
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    const newAnswer = new Answer({
      content,
      doubt: doubtId,
      answeredBy: req.user.id
    });

    await newAnswer.save();

    // Increment answersCount on the doubt
    doubt.answersCount += 1;
    await doubt.save();

    res.status(201).json({ message: 'Answer posted successfully', answer: newAnswer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - Get all answers for a specific doubt
router.get('/:doubtId', async (req, res) => {
  try {
    const answers = await Answer.find({ doubt: req.params.doubtId })
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;