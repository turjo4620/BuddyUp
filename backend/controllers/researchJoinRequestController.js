const ResearchJoinRequest = require('../models/ResearchJoinRequest');
const Research = require('../models/Research');

// Send join request
const sendResearchJoinRequest = async (req, res) => {
  try {
    const { researchId, message } = req.body;
    const studentId = req.user?.id || req.body.studentId;

    if (!researchId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Research ID and student ID are required'
      });
    }

    const research = await Research.findById(researchId);
    if (!research) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found'
      });
    }

    const joinRequest = new ResearchJoinRequest({
      researchId,
      studentId,
      message: message || ''
    });

    await joinRequest.save();
    await joinRequest.populate([
      { path: 'studentId', select: 'name department academicYear' },
      { path: 'researchId', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully',
      data: joinRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send join request',
      error: error.message
    });
  }
};

// Get join requests for research
const getResearchJoinRequests = async (req, res) => {
  try {
    const { researchId } = req.params;

    const joinRequests = await ResearchJoinRequest.find({ researchId })
      .populate('studentId', 'name department academicYear skills')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: joinRequests.length,
      data: joinRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch join requests',
      error: error.message
    });
  }
};

module.exports = {
  sendResearchJoinRequest,
  getResearchJoinRequests
};