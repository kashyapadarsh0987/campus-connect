const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const Note = require('../models/note');
const jwt = require('jsonwebtoken');

const router = express.Router();
const upload = multer({ storage });

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

// POST - Upload a note (protected route)
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newNote = new Note({
      title,
      subject,
      fileUrl: req.file.path,
      uploadedBy: req.user.id
    });

    await newNote.save();
    res.status(201).json({ message: 'Note uploaded successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;