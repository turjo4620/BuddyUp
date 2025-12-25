const Project = require('../models/Project');
const Profile = require('../models/Profile');

// Create project
const createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, teamSize, owner } = req.body;

    // Validate required fields
    if (!title || !description || !requiredSkills || !teamSize || !owner) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, required skills, team size, and owner are required'
      });
    }

    // Validate required skills array
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one required skill must be specified'
      });
    }

    // Validate team size
    if (teamSize < 2 || teamSize > 20) {
      return res.status(400).json({
        success: false,
        message: 'Team size must be between 2 and 20 members'
      });
    }

    // Verify owner exists
    const ownerProfile = await Profile.findById(owner);
    if (!ownerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Owner profile not found'
      });
    }

    const project = new Project({
      title,
      description,
      requiredSkills,
      teamSize,
      owner,
      ...req.body // Include any additional optional fields
    });
    
    await project.save();
    
    // Add project to owner's projectsCreated
    await Profile.findByIdAndUpdate(
      owner,
      { $push: { projectsCreated: project._id } }
    );

    await project.populate([
      { path: 'owner', select: 'name department academicYear' },
      { path: 'members.profile', select: 'name department academicYear' }
    ]);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const { status, skills, category } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.requiredSkills = { $in: skillsArray };
    }

    const projects = await Project.find(filter)
      .populate('owner', 'name department academicYear')
      .populate('members.profile', 'name department academicYear')
      .select('title description requiredSkills teamSize status owner members createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get project by ID
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name department academicYear skills projectInterests')
      .populate('members.profile', 'name department academicYear skills')
      .populate('joinRequests');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { requiredSkills, teamSize } = req.body;

    // Validate required skills if provided
    if (requiredSkills && (!Array.isArray(requiredSkills) || requiredSkills.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Required skills must be a non-empty array'
      });
    }

    // Validate team size if provided
    if (teamSize && (teamSize < 2 || teamSize > 20)) {
      return res.status(400).json({
        success: false,
        message: 'Team size must be between 2 and 20 members'
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'name department academicYear')
    .populate('members.profile', 'name department academicYear');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Remove project from owner's and members' profiles
    const memberIds = project.members.map(member => member.profile);
    await Profile.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { projectsJoined: project._id } }
    );
    
    await Profile.findByIdAndUpdate(
      project.owner,
      { $pull: { projectsCreated: project._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get project members
const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members.profile', 'name department academicYear skills projectInterests')
      .select('title members teamSize');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        projectTitle: project.title,
        teamSize: project.teamSize,
        currentMembers: project.members.length,
        members: project.members
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Looking for members', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('owner', 'name department')
    .select('title status owner');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get projects by owner
const getProjectsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const projects = await Project.find({ owner: ownerId })
      .populate('members.profile', 'name department academicYear')
      .select('title description requiredSkills teamSize status members createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  updateProjectStatus,
  getProjectsByOwner
};