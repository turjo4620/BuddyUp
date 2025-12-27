const Research = require('../models/Research');
const ResearchJoinRequest = require('../models/ResearchJoinRequest');
const Profile = require('../models/Profile');

// Get all research projects
const getResearches = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, skill, search } = req.query;
    
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (skill) filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const researches = await Research.find(filter)
      .populate('researcher', 'name department academicYear')
      .populate('collaborators.profile', 'name department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Research.countDocuments(filter);

    res.json({
      success: true,
      count: researches.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: researches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch research projects',
      error: error.message
    });
  }
};

// Get single research project
const getResearch = async (req, res) => {
  try {
    const research = await Research.findById(req.params.id)
      .populate('researcher', 'name department academicYear email skills')
      .populate('collaborators.profile', 'name department academicYear skills');

    if (!research) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found'
      });
    }

    research.viewCount += 1;
    await research.save();

    res.json({
      success: true,
      data: research
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch research project',
      error: error.message
    });
  }
};

// Create new research project
const createResearch = async (req, res) => {
  try {
    const { title, description, requiredSkills, fields, expectedTeamSize, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // SECURITY FIX: Only use authenticated user ID, never trust client-provided researcher ID
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to create research projects.'
      });
    }

    const research = new Research({
      title,
      description,
      researcher: req.user.id, // Only use authenticated user ID
      requiredSkills: requiredSkills || [],
      fields: fields || [],
      expectedTeamSize: expectedTeamSize || 3,
      category: category || 'Other'
    });

    await research.save();
    await research.populate('researcher', 'name department academicYear');

    res.status(201).json({
      success: true,
      message: 'Research project created successfully',
      data: research
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create research project',
      error: error.message
    });
  }
};

module.exports = {
  getResearches,
  getResearch,
  createResearch
};