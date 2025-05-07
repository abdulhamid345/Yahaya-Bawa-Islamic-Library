const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  arabicTitle: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  scholar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholar',
    required: [true, 'Please specify which scholar authored this book']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify a category for this book']
  },
  language: {
    type: String,
    enum: ['Arabic', 'English', 'Hausa', 'Yoruba', 'French', 'Other'],
    default: 'Arabic'
  },
  publishedYear: {
    type: Number
  },
  publisher: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a book description'],
    trim: true
  },
  coverImage: {
    type: String
  },
  fileUrl: {
    type: String
  },
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  },
  location: {
    shelf: { type: String },
    section: { type: String }
  },
  downloads: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  borrowers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    returnDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed'
    }
  }],
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
BookSchema.index({
  title: 'text',
  arabicTitle: 'text',
  author: 'text',
  description: 'text'
});

// Update the updatedAt field before saving
BookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', BookSchema);