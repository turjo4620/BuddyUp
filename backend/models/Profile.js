const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  academicYear: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'PhD'],
    required: true
  },
  skills: [{
    type: String,
    trim: true,
    required: true
  }],
  projectInterests: [{
    type: String,
    trim: true,
    required: true
  }],
  // Optional fields for extended functionality
  email: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  projectsJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  projectsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

// Ensure skills and projectInterests arrays are not empty when provided
profileSchema.pre('save', function(next) {
  if (this.skills && this.skills.length === 0) {
    return next(new Error('At least one skill is required'));
  }
  if (this.projectInterests && this.projectInterests.length === 0) {
    return next(new Error('At least one project interest is required'));
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);