import axios from 'axios';

// Configuration for switching between mock and real backend
const CONFIG = {
  USE_MOCK_DATA: false, // Set to true for mock data, false for real backend
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000 // 10 seconds timeout
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle common errors
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend server is not running. Please start the backend at http://localhost:5000');
    }
    
    return Promise.reject(error);
  }
);

// Mock data for development
const MOCK_DATA = {
  profiles: [
    {
      _id: 'mock-profile-1',
      name: 'John Doe',
      department: 'Computer Science',
      academicYear: '3rd Year',
      skills: ['JavaScript', 'Python', 'React'],
      projectInterests: ['Web Development', 'AI/ML']
    }
  ],
  projects: [
    {
      _id: 'mock-project-1',
      title: 'AI Study Assistant',
      description: 'Building an AI-powered study assistant for students',
      requiredSkills: ['JavaScript', 'Python', 'Machine Learning'],
      teamSize: 4,
      status: 'Looking for members',
      owner: { _id: 'mock-profile-1', name: 'John Doe', department: 'Computer Science' },
      members: [{ profile: 'mock-profile-1', role: 'Owner' }]
    }
  ]
};

// Helper function to simulate API delay
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function for error handling
const handleApiError = (error, operation) => {
  const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
  console.error(`❌ ${operation} failed:`, errorMessage);
  throw { message: errorMessage, ...error.response?.data };
};

// =============================================================================
// HEALTH CHECK API
// =============================================================================

export const checkHealth = async () => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, message: 'Mock API is running', timestamp: new Date().toISOString() };
  }

  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    handleApiError(error, 'check health');
  }
};

// =============================================================================
// PROFILE API FUNCTIONS
// =============================================================================

/**
 * Create a new profile
 * @param {Object} profileData - Profile information
 * @param {string} profileData.name - Full name (required)
 * @param {string} profileData.department - Department (required)
 * @param {string} profileData.academicYear - Academic year (required)
 * @param {string[]} profileData.skills - Array of skills (required)
 * @param {string[]} profileData.projectInterests - Array of interests (required)
 * @param {string} [profileData.email] - Email address (optional)
 * @param {string} [profileData.bio] - Bio description (optional)
 * 
 * Example request body:
 * {
 *   "name": "John Doe",
 *   "department": "Computer Science",
 *   "academicYear": "3rd Year",
 *   "skills": ["JavaScript", "Python", "React"],
 *   "projectInterests": ["Web Development", "AI/ML"],
 *   "email": "john@university.edu",
 *   "bio": "Passionate about building innovative solutions"
 * }
 */
export const createProfile = async (profileData) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const newProfile = { ...profileData, _id: `mock-profile-${Date.now()}` };
    MOCK_DATA.profiles.push(newProfile);
    return { success: true, data: newProfile };
  }

  try {
    const response = await api.post('/profiles', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create profile');
  }
};

export const getProfiles = async () => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, count: MOCK_DATA.profiles.length, data: MOCK_DATA.profiles };
  }

  try {
    const response = await api.get('/profiles');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch profiles');
  }
};

export const getProfile = async (profileId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const profile = MOCK_DATA.profiles.find(p => p._id === profileId);
    if (!profile) throw { message: 'Profile not found' };
    return { success: true, data: profile };
  }

  try {
    const response = await api.get(`/profiles/${profileId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch profile');
  }
};

export const updateProfile = async (profileId, profileData) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const index = MOCK_DATA.profiles.findIndex(p => p._id === profileId);
    if (index === -1) throw { message: 'Profile not found' };
    MOCK_DATA.profiles[index] = { ...MOCK_DATA.profiles[index], ...profileData };
    return { success: true, data: MOCK_DATA.profiles[index] };
  }

  try {
    const response = await api.put(`/profiles/${profileId}`, profileData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update profile');
  }
};

export const deleteProfile = async (profileId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const index = MOCK_DATA.profiles.findIndex(p => p._id === profileId);
    if (index === -1) throw { message: 'Profile not found' };
    MOCK_DATA.profiles.splice(index, 1);
    return { success: true, message: 'Profile deleted successfully' };
  }

  try {
    const response = await api.delete(`/profiles/${profileId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete profile');
  }
};

// =============================================================================
// PROJECT API FUNCTIONS
// =============================================================================

/**
 * Create a new project
 * @param {Object} projectData - Project information
 * @param {string} projectData.title - Project title (required)
 * @param {string} projectData.description - Project description (required)
 * @param {string[]} projectData.requiredSkills - Required skills array (required)
 * @param {number} projectData.teamSize - Team size (required, 2-20)
 * @param {string} projectData.owner - Owner profile ID (required)
 * @param {string} [projectData.category] - Project category (optional)
 * @param {string} [projectData.duration] - Expected duration (optional)
 * @param {string} [projectData.timeCommitment] - Time commitment (optional)
 * 
 * Example request body:
 * {
 *   "title": "AI Study Assistant",
 *   "description": "Building an AI-powered study assistant for students",
 *   "requiredSkills": ["JavaScript", "Python", "Machine Learning"],
 *   "teamSize": 4,
 *   "owner": "profile_id_here",
 *   "category": "AI/ML",
 *   "duration": "2-3 months",
 *   "timeCommitment": "10-20 hours/week"
 * }
 */
export const createProject = async (projectData) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const newProject = { 
      ...projectData, 
      _id: `mock-project-${Date.now()}`,
      status: 'Looking for members',
      members: [{ profile: projectData.owner, role: 'Owner' }]
    };
    MOCK_DATA.projects.push(newProject);
    return { success: true, data: newProject };
  }

  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create project');
  }
};

export const getProjects = async (filters = {}) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, count: MOCK_DATA.projects.length, data: MOCK_DATA.projects };
  }

  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/projects?${params.toString()}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch projects');
  }
};

export const getProject = async (projectId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const project = MOCK_DATA.projects.find(p => p._id === projectId);
    if (!project) throw { message: 'Project not found' };
    return { success: true, data: project };
  }

  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch project');
  }
};

export const updateProject = async (projectId, projectData) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const index = MOCK_DATA.projects.findIndex(p => p._id === projectId);
    if (index === -1) throw { message: 'Project not found' };
    MOCK_DATA.projects[index] = { ...MOCK_DATA.projects[index], ...projectData };
    return { success: true, data: MOCK_DATA.projects[index] };
  }

  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update project');
  }
};

export const deleteProject = async (projectId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const index = MOCK_DATA.projects.findIndex(p => p._id === projectId);
    if (index === -1) throw { message: 'Project not found' };
    MOCK_DATA.projects.splice(index, 1);
    return { success: true, message: 'Project deleted successfully' };
  }

  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete project');
  }
};

export const getProjectsByOwner = async (ownerId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const projects = MOCK_DATA.projects.filter(p => p.owner === ownerId || p.owner._id === ownerId);
    return { success: true, count: projects.length, data: projects };
  }

  try {
    const response = await api.get(`/projects/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch projects by owner');
  }
};

// =============================================================================
// JOIN REQUEST API FUNCTIONS
// =============================================================================

/**
 * Send a join request to a project
 * @param {Object} joinRequestData - Join request information
 * @param {string} joinRequestData.projectId - Project ID (required)
 * @param {string} joinRequestData.studentId - Student profile ID (required)
 * @param {string} [joinRequestData.message] - Optional message to project owner
 * 
 * Example request body:
 * {
 *   "projectId": "project_id_here",
 *   "studentId": "student_profile_id_here",
 *   "message": "I'm interested in joining your project because..."
 * }
 */
export const sendJoinRequest = async (joinRequestData) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    const newRequest = { 
      ...joinRequestData, 
      _id: `mock-request-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    return { success: true, data: newRequest };
  }

  try {
    const response = await api.post('/joinRequests', joinRequestData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'send join request');
  }
};

export const getJoinRequestsForProject = async (projectId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, count: 0, data: [] };
  }

  try {
    const response = await api.get(`/joinRequests/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch join requests for project');
  }
};

export const getJoinRequestsByStudent = async (studentId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, count: 0, data: [] };
  }

  try {
    const response = await api.get(`/joinRequests/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch join requests by student');
  }
};

/**
 * Update join request status (accept/reject)
 * @param {string} requestId - Join request ID
 * @param {string} status - New status ('Accepted' or 'Rejected')
 * @param {string} reviewerId - Reviewer profile ID
 * 
 * Example request body:
 * {
 *   "status": "Accepted",
 *   "reviewerId": "reviewer_profile_id_here"
 * }
 */
export const updateJoinRequestStatus = async (requestId, status, reviewerId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, data: { _id: requestId, status, reviewerId } };
  }

  try {
    const response = await api.put(`/joinRequests/${requestId}/status`, {
      status,
      reviewerId
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'update join request status');
  }
};

// =============================================================================
// MATCHING ALGORITHM API FUNCTIONS
// =============================================================================

export const getSuggestedTeammates = async (projectId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { 
      success: true, 
      count: 0, 
      data: [],
      projectTitle: 'Mock Project',
      requiredSkills: ['JavaScript', 'Python']
    };
  }

  try {
    const response = await api.get(`/matching/teammates/${projectId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch suggested teammates');
  }
};

export const getMatchingProjects = async (studentId) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return { 
      success: true, 
      count: 0, 
      data: [],
      studentName: 'Mock Student',
      studentSkills: ['JavaScript', 'Python']
    };
  }

  try {
    const response = await api.get(`/matching/projects/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch matching projects');
  }
};

// =============================================================================
// AI GUIDANCE API FUNCTIONS
// =============================================================================

/**
 * Get AI guidance response
 * @param {string} query - User question/query (required)
 * @param {Object} [context] - Additional context for AI (optional)
 * 
 * Example request body:
 * {
 *   "query": "How do I plan my project timeline?",
 *   "context": {
 *     "projectType": "web development",
 *     "teamSize": 4
 *   }
 * }
 */
export const getAIResponse = async (query, context = {}) => {
  if (CONFIG.USE_MOCK_DATA) {
    await mockDelay();
    return {
      success: true,
      query: query,
      data: {
        type: 'mock_response',
        response: [
          'This is a mock AI response for development.',
          'Your query was: ' + query,
          'In production, this would connect to the real AI guidance system.'
        ],
        suggestions: [
          'Try asking about project planning',
          'Ask about team collaboration',
          'Get help with skill development'
        ]
      }
    };
  }

  try {
    const response = await api.post('/ai/guidance', {
      query,
      context
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'get AI response');
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Function to switch between mock and real data
export const setMockMode = (useMock) => {
  CONFIG.USE_MOCK_DATA = useMock;
  console.log(`🔄 API Mode switched to: ${useMock ? 'MOCK DATA' : 'REAL BACKEND'}`);
};

// Function to check current mode
export const getCurrentMode = () => {
  return CONFIG.USE_MOCK_DATA ? 'MOCK' : 'REAL';
};

// Function to test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    const originalMode = CONFIG.USE_MOCK_DATA;
    CONFIG.USE_MOCK_DATA = false; // Force real backend test
    
    const response = await checkHealth();
    console.log('✅ Backend connection successful:', response);
    
    CONFIG.USE_MOCK_DATA = originalMode; // Restore original mode
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('💡 Make sure the backend is running at http://localhost:5000');
    return false;
  }
};

export default api;