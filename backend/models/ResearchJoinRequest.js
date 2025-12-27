const mongoose = require('mongoose');

const researchJoinRequestSchema = new mongoose.Schema({
  researchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Research',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  message: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  reviewedAt: {
    type: Date
  },
  reviewMessage: {
    type: String,
    maxlength: 500,
    trim: true
  },
  proposedRole: {
    type: String,
    default: 'Collaborator',
    maxlength: 100
  },
  relevantExperience: {
    type: String,
    maxlength: 1000
  },
  availableHours: {
    type: Number,
    min: 1,
    max: 40
  }
}, {
  timestamps: true
});

// Indexes
researchJoinRequestSchema.index({ researchId: 1, studentId: 1 }, { unique: true });
researchJoinRequestSchema.index({ status: 1 });
researchJoinRequestSchema.index({ createdAt: -1 });

// Method to accept request
researchJoinRequestSchema.methods.accept = function(reviewerId, reviewMessage = '') {
  this.status = 'Accepted';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.reviewMessage = reviewMessage;
  return this.save();
};

// Method to reject request
researchJoinRequestSchema.methods.reject = function(reviewerId, reviewMessage = '') {
  this.status = 'Rejected';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.reviewMessage = reviewMessage;
  return this.save();
};

module.exports = mongoose.model('ResearchJoinRequest', researchJoinRequestSchema);