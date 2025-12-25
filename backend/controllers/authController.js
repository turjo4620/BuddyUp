const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (profileId) => {
  return jwt.sign({ profileId }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token expires in 7 days
  });
};

// Register/Create Profile with Authentication
const register = async (req, res) => {
  try {
    const { username, password, name, department, academicYear, skills, projectInterests, email, bio } = req.body;

    // Validate required fields
    if (!username || !password || !name || !department || !academicYear || !skills || !projectInterests) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, name, department, academic year, skills, and project interests are required'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate username format
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 30 characters'
      });
    }

    // Check if username already exists
    const existingProfile = await Profile.findOne({ username: username.toLowerCase() });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose a different username.'
      });
    }

    // Validate arrays
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

    // Create new profile
    const profile = new Profile({
      username: username.toLowerCase(),
      password,
      name,
      department,
      academicYear,
      skills,
      projectInterests,
      email,
      bio
    });

    await profile.save();

    // Generate token
    const token = generateToken(profile._id);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      token,
      profile: profile.toJSON() // This excludes password due to toJSON override
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists. Please choose a different ${field}.`
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create profile'
    });
  }
};

// Login/Authenticate
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find profile by username
    const profile = await Profile.findOne({ username: username.toLowerCase() })
      .populate('projectsJoined', 'title category status')
      .populate('projectsCreated', 'title category status');

    if (!profile) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check password
    const isPasswordValid = await profile.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate token
    const token = generateToken(profile._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      profile: profile.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Get current user profile (protected route)
const getCurrentProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.profileId)
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
      profile: profile.toJSON()
    });
  } catch (error) {
    console.error('Get current profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.profileId = decoded.profileId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check username availability
const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    const existingProfile = await Profile.findOne({ username: username.toLowerCase() });
    
    res.status(200).json({
      success: true,
      available: !existingProfile,
      message: existingProfile ? 'Username is already taken' : 'Username is available'
    });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check username availability'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentProfile,
  authenticateToken,
  checkUsername
};