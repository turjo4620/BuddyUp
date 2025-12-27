const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  collaborators: [{
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    },
    role: {
      type: String,
      default: 'Collaborator'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requiredSkills: [{
    type: String,
    trim: true
  }],
  fields: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Open for Collaboration', 'Ongoing', 'Completed', 'On Hold'],
    default: 'Open for Collaboration'
  },
  expectedTeamSize: {
    type: Number,
    min: 1,
    max: 20,
    default: 3
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  timeline: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['Computer Science', 'Engineering', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Psychology', 'Business', 'Other'],
    default: 'Other'
  },
  fundingStatus: {
    type: String,
    enum: ['Funded', 'Seeking Funding', 'Self-funded', 'Not Applicable'],
    default: 'Not Applicable'
  },
  publications: [{
    title: String,
    url: String,
    publishedAt: Date
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
researchSchema.index({ title: 'text', description: 'text' });
researchSchema.index({ status: 1 });
researchSchema.index({ requiredSkills: 1 });
researchSchema.index({ fields: 1 });
researchSchema.index({ researcher: 1 });
researchSchema.index({ createdAt: -1 });

// Virtual for current team size
researchSchema.virtual('currentTeamSize').get(function() {
  return this.collaborators.length + 1; // +1 for the researcher
});

// Method to check if research is full
researchSchema.methods.isFull = function() {
  return this.currentTeamSize >= this.expectedTeamSize;
};

// Method to add collaborator
researchSchema.methods.addCollaborator = function(profileId, role = 'Collaborator') {
  if (!this.collaborators.find(c => c.profile.toString() === profileId.toString())) {
    this.collaborators.push({
      profile: profileId,
      role: role,
      joinedAt: new Date()
    });
  }
  return this.save();
};

// Method to remove collaborator
researchSchema.methods.removeCollaborator = function(profileId) {
  this.collaborators = this.collaborators.filter(
    c => c.profile.toString() !== profileId.toString()
  );
  return this.save();
};

// Pre-save middleware to update lastUpdated
researchSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Research', researchSchema);