const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const profileSchema = new mongoose.Schema({
  // Authentication fields
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile fields
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

// Hash password before saving
profileSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
profileSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
profileSchema.methods.toJSON = function() {
  const profile = this.toObject();
  delete profile.password;
  return profile;
};

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