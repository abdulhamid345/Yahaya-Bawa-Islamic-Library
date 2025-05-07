const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Please specify which book this chapter belongs to']
  },
  title: {
    type: String,
    required: [true, 'Please provide a chapter title'],
    trim: true
  },
  arabicTitle: {
    type: String,
    trim: true
  },
  orderNumber: {
    type: Number,
    required: [true, 'Please provide the chapter order number']
  },
  content: {
    type: String,
    required: [true, 'Please provide the chapter content'],
    trim: true
  },
  arabicText: {
    type: String,
    trim: true
  },
  pages: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ChapterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient retrieval by book and order
ChapterSchema.index({ book: 1, orderNumber: 1 });

module.exports = mongoose.model('Chapter', ChapterSchema);