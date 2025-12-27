import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './EnhancedProjectCard.css';

const EnhancedProjectCard = ({ project, onJoinRequest, onViewDetails, showActions = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'planning':
        return 'status-planning';
      case 'on-hold':
        return 'status-hold';
      default:
        return 'status-default';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'difficulty-beginner';
      case 'intermediate':
        return 'difficulty-intermediate';
      case 'advanced':
        return 'difficulty-advanced';
      default:
        return 'difficulty-default';
    }
  };

  // Handle join request
  const handleJoinRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      if (onJoinRequest) {
        await onJoinRequest(project._id);
      }
    } catch (error) {
      console.error('Error joining project:', error);
    } finally {
      setIsJoining(false);
    }
  };

  // Handle view details
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(project);
    } else {
      navigate(`/projects/${project._id}`);
    }
  };

  // Check if user is project owner
  const isOwner = user && project.owner && (
    project.owner._id === user._id || 
    project.owner === user._id
  );

  // Check if user already requested to join
  const hasRequested = user && project.joinRequests && 
    project.joinRequests.some(request => 
      request.user === user._id || request.user?._id === user._id
    );

  // Check if user is already a member
  const isMember = user && project.members && 
    project.members.some(member => 
      member._id === user._id || member === user._id
    );

  // Truncate text helper
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="enhanced-project-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="project-meta">
          <span className={`status-badge ${getStatusColor(project.status)}`}>
            {project.status || 'Active'}
          </span>
          {project.difficulty && (
            <span className={`difficulty-badge ${getDifficultyColor(project.difficulty)}`}>
              {project.difficulty}
            </span>
          )}
        </div>
        
        {project.featured && (
          <div className="featured-badge">
            <span>⭐ Featured</span>
          </div>
        )}
      </div>

      {/* Project Title and Description */}
      <div className="card-content">
        <h3 className="project-title" onClick={handleViewDetails}>
          {project.title}
        </h3>
        
        <p className="project-description">
          {isExpanded ? project.description : truncateText(project.description)}
          {project.description && project.description.length > 150 && (
            <button 
              className="expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>

        {/* Project Owner */}
        <div className="project-owner">
          <div className="owner-avatar">
            {project.owner?.name ? project.owner.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="owner-info">
            <span className="owner-name">
              {project.owner?.name || project.owner?.username || 'Unknown User'}
            </span>
            <span className="owner-department">
              {project.owner?.department}
            </span>
          </div>
        </div>

        {/* Skills Required */}
        {project.skillsRequired && project.skillsRequired.length > 0 && (
          <div className="skills-section">
            <h4>Skills Required:</h4>
            <div className="skills-list">
              {project.skillsRequired.slice(0, 5).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {project.skillsRequired.length > 5 && (
                <span className="skill-tag more-skills">
                  +{project.skillsRequired.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Project Stats */}
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-text">
              {project.members?.length || 0}/{project.maxMembers || 'Unlimited'} Members
            </span>
          </div>
          
          {project.duration && (
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-text">{project.duration}</span>
            </div>
          )}
          
          <div className="stat-item">
            <span className="stat-icon">📅</span>
            <span className="stat-text">
              Created {formatDate(project.createdAt)}
            </span>
          </div>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="technologies-section">
            <div className="tech-list">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <span key={index} className="tech-tag">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="tech-tag more-tech">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      {showActions && (
        <div className="card-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleViewDetails}
          >
            View Details
          </button>
          
          {!isOwner && !isMember && (
            <button 
              className={`btn btn-primary ${hasRequested ? 'btn-requested' : ''}`}
              onClick={handleJoinRequest}
              disabled={isJoining || hasRequested}
            >
              {isJoining ? (
                <>
                  <span className="loading-spinner"></span>
                  Joining...
                </>
              ) : hasRequested ? (
                'Request Sent'
              ) : (
                'Join Project'
              )}
            </button>
          )}
          
          {isOwner && (
            <button 
              className="btn btn-outline"
              onClick={() => navigate(`/projects/${project._id}/manage`)}
            >
              Manage
            </button>
          )}
          
          {isMember && !isOwner && (
            <span className="member-badge">
              ✓ Member
            </span>
          )}
        </div>
      )}

      {/* Progress Bar (if project has progress) */}
      {project.progress !== undefined && (
        <div className="progress-section">
          <div className="progress-header">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Join Requests Count (for owners) */}
      {isOwner && project.joinRequests && project.joinRequests.length > 0 && (
        <div className="join-requests-indicator">
          <span className="requests-count">
            {project.joinRequests.length} pending request{project.joinRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default EnhancedProjectCard;