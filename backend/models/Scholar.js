const mongoose = require('mongoose');

const ScholarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the scholar name'],
    trim: true
  },
  arabicName: {
    type: String,
    trim: true
  },
  initial: {
    type: String,
    required: [true, 'Please provide an initial'],
    trim: true
  },
  era: {
    type: String,
    required: [true, 'Please provide the scholar\'s era'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description about the scholar'],
    trim: true
  },
  biography: {
    type: String,
    required: [true, 'Please provide a biography'],
    trim: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  birthYear: {
    type: Number
  },
  deathYear: {
    type: Number
  },
  birthPlace: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  timeline: [{
    year: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  }],
  students: {
    type: Number,
    default: 0
  },
  activeYears: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
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
ScholarSchema.index({
  name: 'text',
  arabicName: 'text',
  description: 'text',
  biography: 'text'
});

// Update the updatedAt field before saving
ScholarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Scholar', ScholarSchema);