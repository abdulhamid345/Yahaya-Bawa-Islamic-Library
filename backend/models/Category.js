const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a category description'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Please provide an icon for the category'],
  },
  featured: {
    type: Boolean,
    default: false
  },
  bookCount: {
    type: Number,
    default: 0
  },
  featuredBook: {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    title: {
      type: String,
      trim: true
    }
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

// Add text index for search functionality
CategorySchema.index({
  name: 'text',
  description: 'text'
});

// Update the updatedAt field before saving
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', CategorySchema);