const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  doubt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt',
    required: true
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);