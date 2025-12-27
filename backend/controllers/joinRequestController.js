const JoinRequest = require('../models/JoinRequest');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const mongoose = require('mongoose');

// Send join request
const sendJoinRequest = async (req, res) => {
  try {
    const { projectId, studentId, message } = req.body;

    // Validate required fields
    if (!projectId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and student ID are required'
      });
    }

    // Check if project exists and is looking for members
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'Looking for members') {
      return res.status(400).json({
        success: false,
        message: 'Project is not accepting new members'
      });
    }

    // Check if team is full
    if (project.members.length >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Project team is full'
      });
    }

    // Check if student is the project owner
    if (project.owner.toString() === studentId) {
      return res.status(400).json({
        success: false,
        message: 'Project owner cannot send join request to their own project'
      });
    }

    // Check if student is already a member
    const isAlreadyMember = project.members.some(
      member => member.profile.toString() === studentId
    );
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'Student is already a member of this project'
      });
    }

    // Verify student exists
    const student = await Profile.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const joinRequest = new JoinRequest({
      projectId,
      studentId,
      message: message || ''
    });

    await joinRequest.save();

    // Add request to project
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { joinRequests: joinRequest._id } }
    );

    await joinRequest.populate([
      { path: 'studentId', select: 'name department academicYear skills' },
      { path: 'projectId', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      data: joinRequest
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Join request already exists for this project'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get join requests for a project (for project owner)
const getJoinRequestsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const requests = await JoinRequest.find({ projectId })
      .populate('studentId', 'name department academicYear skills projectInterests')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get join requests by student
const getJoinRequestsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const requests = await JoinRequest.find({ studentId })
      .populate('projectId', 'title description owner')
      .populate({
        path: 'projectId',
        populate: {
          path: 'owner',
          select: 'name department'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Accept/Reject join request
const updateJoinRequestStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { requestId } = req.params;
    const { status, reviewerId } = req.body;
    
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Accepted or Rejected'
      });
    }

    const joinRequest = await JoinRequest.findById(requestId)
      .populate('projectId')
      .populate('studentId')
      .session(session);

    if (!joinRequest) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Join request not found'
      });
    }

    if (joinRequest.status !== 'Pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Join request has already been processed'
      });
    }

    // Verify reviewer is the project owner
    if (joinRequest.projectId.owner.toString() !== reviewerId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only project owner can review join requests'
      });
    }

    // If accepting, check team size atomically
    if (status === 'Accepted') {
      const project = await Project.findById(joinRequest.projectId._id).session(session);
      
      // Check if team is still not full
      if (project.members.length >= project.teamSize) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Project team is now full'
        });
      }

      // Add student to project members atomically
      await Project.findByIdAndUpdate(
        project._id,
        { 
          $push: { 
            members: {
              profile: joinRequest.studentId._id,
              role: 'Member',
              joinedAt: new Date()
            }
          }
        },
        { session }
      );

      await Profile.findByIdAndUpdate(
        joinRequest.studentId._id,
        { $push: { projectsJoined: project._id } },
        { session }
      );
    }

    // Update join request status
    joinRequest.status = status;
    joinRequest.reviewedBy = reviewerId;
    joinRequest.reviewedAt = new Date();
    await joinRequest.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: joinRequest
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  sendJoinRequest,
  getJoinRequestsForProject,
  getJoinRequestsByStudent,
  updateJoinRequestStatus
};