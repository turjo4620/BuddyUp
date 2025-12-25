const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  message: {
    type: String,
    maxlength: 500
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
  }
}, {
  timestamps: true
});

// Ensure one request per student per project
joinRequestSchema.index({ projectId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);