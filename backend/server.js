const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const joinRequestRoutes = require('./routes/joinRequestRoutes');
const authRoutes = require('./routes/authRoutes');

// Import utilities
const { findSuggestedTeammates, findMatchingProjects } = require('./utils/matchingAlgorithm');
const { handleAIGuidance } = require('./ai/aiChatHandler');
const { authenticateToken } = require('./controllers/authController');
const Profile = require('./models/Profile');
const Project = require('./models/Project');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173', // Vite default port
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${process.env.MONGODB_URI}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/joinRequests', joinRequestRoutes);

// Matching Algorithm Endpoints

// Get suggested teammates for a project (excludes project owner)
app.get('/api/matching/teammates/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'name department')
      .populate('members.profile', 'name department');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const allProfiles = await Profile.find({});
    const suggestedTeammates = await findSuggestedTeammates(project, allProfiles);

    res.status(200).json({
      success: true,
      projectTitle: project.title,
      requiredSkills: project.requiredSkills,
      count: suggestedTeammates.length,
      data: suggestedTeammates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get matching projects for a student
app.get('/api/matching/projects/:studentId', async (req, res) => {
  try {
    const student = await Profile.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const allProjects = await Project.find({ status: 'Looking for members' })
      .populate('owner', 'name department');

    const matchingProjects = await findMatchingProjects(student, allProjects);

    res.status(200).json({
      success: true,
      studentName: student.name,
      studentSkills: student.skills,
      count: matchingProjects.length,
      data: matchingProjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// AI Guidance Support Endpoint
app.post('/api/ai/guidance', async (req, res) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Validate that query is related to allowed topics
    const allowedTopics = [
      'project planning', 'research', 'skill learning', 'team collaboration',
      'timeline', 'team formation', 'tools', 'technology'
    ];

    const queryLower = query.toLowerCase();
    const isValidTopic = allowedTopics.some(topic => 
      queryLower.includes(topic.replace(' ', ''))
    );

    if (!isValidTopic) {
      return res.status(400).json({
        success: false,
        message: 'AI guidance is only available for project planning, research direction, skill learning, and team collaboration topics.'
      });
    }

    const response = await handleAIGuidance(query, context);

    res.status(200).json({
      success: true,
      query: query,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Health check endpoint with detailed information
app.get('/api/health', (req, res) => {
  const healthInfo = {
    success: true,
    message: 'BuddyUp API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      profiles: '/api/profiles',
      projects: '/api/projects',
      joinRequests: '/api/joinRequests',
      matching: '/api/matching',
      aiGuidance: '/api/ai/guidance'
    },
    cors: {
      enabled: true,
      allowedOrigins: corsOptions.origin
    }
  };
  
  console.log('🏥 Health check requested');
  res.status(200).json(healthInfo);
});

// Response logging middleware
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 ${req.method} ${req.path} - Status: ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 BuddyUp Backend Server Started`);
  console.log(`🚀 ================================`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS Enabled for: ${corsOptions.origin.join(', ')}`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
  console.log('🚀 ================================');
  
  // Test database connection
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  Warning: Database not connected. Some features may not work.');
  }
});