import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import WorkHubCard from './WorkHubCard';
import AIRecommendationCard from './AIRecommendationCard';
import ResearchInterestCard from './ResearchInterestCard';
import './MyProjectsResearch.css';

const MyProjectsResearch = ({ 
  projects = [], 
  research = [], 
  onRefresh 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [researchSuggestions, setResearchSuggestions] = useState([]);

  // Generate AI recommendations based on user profile
  useEffect(() => {
    if (user) {
      generateAIRecommendations();
      generateResearchSuggestions();
    }
  }, [user, projects, research]);

  const generateAIRecommendations = () => {
    if (!user) return;

    const mockRecommendations = [
      {
        id: 1,
        type: 'project',
        title: 'Smart Campus IoT Network',
        description: 'Build an IoT sensor network for campus environmental monitoring',
        reason: `Recommended because you have experience with ${user.skills?.slice(0, 2).join(' and ')} and listed IoT as an interest`,
        matchScore: 92,
        tags: ['IoT', 'Sensors', 'Data Analytics'],
        collaborators: 3,
        difficulty: 'Intermediate'
      },
      {
        id: 2,
        type: 'collaborator',
        title: 'Sarah Chen - ML Researcher',
        description: 'PhD student specializing in machine learning applications',
        reason: 'Complementary skills in data science and shared interest in AI applications',
        matchScore: 88,
        tags: ['Machine Learning', 'Python', 'Research'],
        department: 'Computer Science',
        academicYear: 'PhD'
      },
      {
        id: 3,
        type: 'research',
        title: 'Sustainable Computing Research Lab',
        description: 'Join ongoing research in energy-efficient computing systems',
        reason: 'Matches your background in computer systems and sustainability interests',
        matchScore: 85,
        tags: ['Green Computing', 'Systems', 'Energy Efficiency'],
        timeline: '6-12 months',
        level: 'Graduate'
      }
    ];

    setAiRecommendations(mockRecommendations);
  };

  const generateResearchSuggestions = () => {
    if (!user) return;

    const mockSuggestions = [
      {
        id: 1,
        title: 'Edge Computing for Smart Cities',
        field: 'Computer Science',
        difficulty: 'Advanced',
        collaborationPotential: 'High',
        description: 'Investigate edge computing architectures for urban IoT deployments',
        trending: true
      },
      {
        id: 2,
        title: 'Blockchain in Academic Credentials',
        field: 'Information Systems',
        difficulty: 'Intermediate',
        collaborationPotential: 'Medium',
        description: 'Develop blockchain-based system for academic credential verification',
        trending: false
      },
      {
        id: 3,
        title: 'AI Ethics in Educational Technology',
        field: 'Computer Science',
        difficulty: 'Intermediate',
        collaborationPotential: 'High',
        description: 'Study ethical implications of AI in educational platforms',
        trending: true
      }
    ];

    setResearchSuggestions(mockSuggestions);
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleViewResearch = (researchId) => {
    navigate(`/research/${researchId}`);
  };

  const handleViewRequests = (itemId, type) => {
    navigate(`/${type}/${itemId}/requests`);
  };

  const handleViewSuggestions = (itemId, type) => {
    navigate(`/${type}/${itemId}/suggestions`);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Looking for members': 'status-open',
      'Open for Collaboration': 'status-open',
      'In Progress': 'status-progress',
      'Ongoing': 'status-progress',
      'Completed': 'status-completed',
      'On Hold': 'status-hold',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  };

  const getUserResearchInterests = () => {
    if (!user) return [];
    
    // Combine skills and project interests to create research areas
    const skills = user.skills || [];
    const interests = user.projectInterests || [];
    
    return [...new Set([...skills, ...interests])].slice(0, 6);
  };

  const getAcademicGoals = () => {
    // Mock academic goals based on user's academic year and interests
    const goals = [];
    
    if (user?.academicYear === 'PhD' || user?.academicYear === 'Graduate') {
      goals.push('Publication', 'Research Collaboration', 'Conference Presentation');
    } else {
      goals.push('Project Portfolio', 'Skill Development', 'Research Experience');
    }
    
    return goals;
  };

  return (
    <div className="work-research-hub">
      {/* Hero Header */}
      <div className="hub-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="hub-title">
              <span className="title-icon">🎯</span>
              My Work & Research Hub
            </h1>
            <p className="hub-subtitle">
              Your academic identity, intelligent recommendations, and portfolio showcase
            </p>
          </div>
          
          <div className="header-actions">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <span className="view-icon">⊞</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <span className="view-icon">☰</span>
              </button>
            </div>
            
            <button className="refresh-btn" onClick={onRefresh} title="Refresh">
              <span className="refresh-icon">🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* Academic Identity Section */}
      <div className="academic-identity-section">
        <div className="identity-grid">
          {/* Research Interests Card */}
          <div className="identity-card research-interests">
            <div className="card-header">
              <h3 className="card-title">
                <span className="title-icon">🔬</span>
                My Research & Academic Interests
              </h3>
            </div>
            <div className="card-content">
              <div className="interests-grid">
                {getUserResearchInterests().map((interest, index) => (
                  <div key={index} className="interest-chip">
                    {interest}
                  </div>
                ))}
              </div>
              <div className="academic-goals">
                <h4 className="goals-title">Academic Goals</h4>
                <div className="goals-list">
                  {getAcademicGoals().map((goal, index) => (
                    <span key={index} className="goal-badge">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Smart Suggestions Card */}
          <div className="identity-card ai-suggestions">
            <div className="card-header">
              <h3 className="card-title">
                <span className="title-icon">🤖</span>
                AI-Powered Smart Suggestions
              </h3>
              <span className="suggestions-count">{aiRecommendations.length} recommendations</span>
            </div>
            <div className="card-content">
              <div className="suggestions-list">
                {aiRecommendations.slice(0, 3).map((recommendation) => (
                  <AIRecommendationCard 
                    key={recommendation.id} 
                    recommendation={recommendation} 
                  />
                ))}
              </div>
              {aiRecommendations.length > 3 && (
                <button className="view-all-btn">
                  View All {aiRecommendations.length} Recommendations
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Research Recommendations Section */}
      <div className="research-recommendations-section">
        <div className="section-header">
          <h3 className="section-title">
            <span className="title-icon">💡</span>
            Research Recommendations for You
          </h3>
          <p className="section-subtitle">
            Curated research ideas based on your background and current trends
          </p>
        </div>
        <div className="recommendations-grid">
          {researchSuggestions.map((suggestion) => (
            <ResearchInterestCard 
              key={suggestion.id} 
              suggestion={suggestion} 
            />
          ))}
        </div>
      </div>

      {/* My Projects Panel */}
      <div className="my-projects-panel">
        <div className="panel-header">
          <div className="header-left">
            <h3 className="panel-title">
              <span className="title-icon">📋</span>
              My Projects
            </h3>
            <div className="ownership-badge">Created by You</div>
          </div>
          <div className="panel-actions">
            <span className="projects-count">{projects.length} projects</span>
            <button 
              className="create-btn primary"
              onClick={() => navigate('/create-project')}
            >
              <span className="btn-icon">➕</span>
              Create Project
            </button>
          </div>
        </div>

        <div className="panel-content">
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h4 className="empty-title">No projects yet</h4>
              <p className="empty-description">
                Start building your academic portfolio by creating your first project
              </p>
              <button 
                className="create-btn primary"
                onClick={() => navigate('/create-project')}
              >
                <span className="btn-icon">➕</span>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className={`projects-grid ${viewMode}`}>
              {projects.map((project) => (
                <WorkHubCard
                  key={project._id}
                  item={project}
                  type="project"
                  viewMode={viewMode}
                  statusColor={getStatusColor(project.status)}
                  onView={handleViewProject}
                  onViewRequests={handleViewRequests}
                  onViewSuggestions={handleViewSuggestions}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Research Panel */}
      <div className="my-research-panel">
        <div className="panel-header">
          <div className="header-left">
            <h3 className="panel-title">
              <span className="title-icon">🔬</span>
              My Research
            </h3>
            <div className="ownership-badge">Led by You</div>
          </div>
          <div className="panel-actions">
            <span className="research-count">{research.length} research projects</span>
            <button 
              className="create-btn secondary"
              onClick={() => navigate('/create-research')}
            >
              <span className="btn-icon">➕</span>
              Start Research
            </button>
          </div>
        </div>

        <div className="panel-content">
          {research.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔬</div>
              <h4 className="empty-title">No research projects yet</h4>
              <p className="empty-description">
                Begin your research journey and contribute to academic knowledge
              </p>
              <button 
                className="create-btn secondary"
                onClick={() => navigate('/create-research')}
              >
                <span className="btn-icon">➕</span>
                Start Your First Research
              </button>
            </div>
          ) : (
            <div className={`research-grid ${viewMode}`}>
              {research.map((researchItem) => (
                <WorkHubCard
                  key={researchItem._id}
                  item={researchItem}
                  type="research"
                  viewMode={viewMode}
                  statusColor={getStatusColor(researchItem.status)}
                  onView={handleViewResearch}
                  onViewRequests={handleViewRequests}
                  onViewSuggestions={handleViewSuggestions}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsResearch;