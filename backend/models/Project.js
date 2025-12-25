const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  requiredSkills: [{
    type: String,
    trim: true,
    required: true
  }],
  teamSize: {
    type: Number,
    required: true,
    min: 2,
    max: 20
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  members: [{
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['Owner', 'Member'],
      default: 'Member'
    }
  }],
  status: {
    type: String,
    enum: ['Looking for members', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Looking for members'
  },
  // Optional fields for extended functionality
  category: {
    type: String,
    enum: ['Research', 'Web Development', 'Mobile App', 'Data Science', 'AI/ML', 'Other']
  },
  duration: {
    type: String,
    enum: ['1-2 weeks', '1 month', '2-3 months', '6+ months']
  },
  timeCommitment: {
    type: String,
    enum: ['5-10 hours/week', '10-20 hours/week', '20+ hours/week']
  },
  joinRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JoinRequest'
  }]
}, {
  timestamps: true
});

// Ensure requiredSkills array is not empty when provided
projectSchema.pre('save', function(next) {
  if (this.requiredSkills && this.requiredSkills.length === 0) {
    return next(new Error('At least one required skill must be specified'));
  }
  
  // Add owner to members array if not already present
  if (this.isNew) {
    this.members = [{
      profile: this.owner,
      role: 'Owner',
      joinedAt: new Date()
    }];
  }
  
  next();
});

// Virtual to get current team size
projectSchema.virtual('currentTeamSize').get(function() {
  return this.members ? this.members.length : 0;
});

// Virtual to check if team is full
projectSchema.virtual('isTeamFull').get(function() {
  return this.currentTeamSize >= this.teamSize;
});

module.exports = mongoose.model('Project', projectSchema);