const Profile = require('../models/Profile');

// Create profile
const createProfile = async (req, res) => {
  try {
    const { name, department, academicYear, skills, projectInterests } = req.body;

    // Validate required fields
    if (!name || !department || !academicYear || !skills || !projectInterests) {
      return res.status(400).json({
        success: false,
        message: 'Name, department, academic year, skills, and project interests are required'
      });
    }

    // Validate arrays are not empty
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one skill is required'
      });
    }

    if (!Array.isArray(projectInterests) || projectInterests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one project interest is required'
      });
    }

    const profile = new Profile({
      name,
      department,
      academicYear,
      skills,
      projectInterests,
      ...req.body // Include any additional optional fields
    });

    await profile.save();
    
    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('projectsJoined', 'title category')
      .populate('projectsCreated', 'title category')
      .select('name department academicYear skills projectInterests email bio createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get profile by ID
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate('projectsJoined', 'title category status')
      .populate('projectsCreated', 'title category status');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { skills, projectInterests } = req.body;

    // Validate arrays if provided
    if (skills && (!Array.isArray(skills) || skills.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be a non-empty array'
      });
    }

    if (projectInterests && (!Array.isArray(projectInterests) || projectInterests.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Project interests must be a non-empty array'
      });
    }

    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get profiles by department
const getProfilesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const profiles = await Profile.find({ 
      department: { $regex: department, $options: 'i' } 
    })
    .select('name department academicYear skills projectInterests')
    .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get profiles by skills
const getProfilesBySkills = async (req, res) => {
  try {
    const { skills } = req.query; // Expected as comma-separated string
    
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: 'Skills parameter is required'
      });
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());
    
    const profiles = await Profile.find({
      skills: { $in: skillsArray }
    })
    .select('name department academicYear skills projectInterests')
    .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfilesByDepartment,
  getProfilesBySkills
};