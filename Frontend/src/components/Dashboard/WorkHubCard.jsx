import React from 'react';
import './WorkHubCard.css';

const WorkHubCard = ({ 
  item, 
  type, 
  viewMode, 
  statusColor, 
  onView, 
  onViewRequests, 
  onViewSuggestions 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEngagementStats = () => {
    const joinRequestsCount = item.joinRequests?.length || 0;
    const aiMatchCount = item.suggestedTeammates?.length || 0;
    return { joinRequestsCount, aiMatchCount };
  };

  const { joinRequestsCount, aiMatchCount } = getEngagementStats();

  const getTypeIcon = () => {
    return type === 'project' ? '📋' : '🔬';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Looking for members': '🟢',
      'Open for Collaboration': '🟢',
      'In Progress': '🔵',
      'Ongoing': '🔵',
      'Completed': '✅',
      'On Hold': '🟡',
      'Cancelled': '🔴'
    };
    return statusIcons[status] || '⚪';
  };

  const truncateDescription = (description, maxLength = viewMode === 'list' ? 150 : 120) => {
    if (!description || description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const getTeamProgress = () => {
    if (type === 'project') {
      const currentMembers = item.members?.length || 1; // Include owner
      const targetSize = item.teamSize || 1;
      return {
        current: currentMembers,
        target: targetSize,
        percentage: Math.min((currentMembers / targetSize) * 100, 100)
      };
    } else {
      const currentCollaborators = item.collaborators?.length || 1; // Include researcher
      const expectedSize = item.expectedTeamSize || 1;
      return {
        current: currentCollaborators,
        target: expectedSize,
        percentage: Math.min((currentCollaborators / expectedSize) * 100, 100)
      };
    }
  };

  const teamProgress = getTeamProgress();

  const getVisibilityIcon = () => {
    return item.isPrivate ? '🔒' : '🌐';
  };

  return (
    <div className={`work-hub-card ${viewMode} ${statusColor}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="header-top">
          <div className="type-status-group">
            <div className="type-badge">
              <span className="type-icon">{getTypeIcon()}</span>
              <span className="type-text">{type === 'project' ? 'Project' : 'Research'}</span>
            </div>
            
            <div className="status-badge">
              <span className="status-icon">{getStatusIcon(item.status)}</span>
              <span className="status-text">{item.status}</span>
            </div>
          </div>
          
          <div className="header-meta">
            <div className="visibility-indicator" title={item.isPrivate ? 'Private' : 'Public'}>
              {getVisibilityIcon()}
            </div>
            <span className="posted-date">
              {formatDate(item.createdAt || item.startDate)}
            </span>
          </div>
        </div>

        <div className="ownership-indicator">
          <span className="owner-badge">Created by You</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title" onClick={() => onView(item._id)}>
          {item.title}
        </h3>
        
        <p className="card-description">
          {truncateDescription(item.description)}
        </p>

        {/* Skills/Technology Tags */}
        {item.requiredSkills && item.requiredSkills.length > 0 && (
          <div className="skills-section">
            <div className="skills-list">
              {item.requiredSkills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-chip">
                  {skill}
                </span>
              ))}
              {item.requiredSkills.length > 4 && (
                <span className="skill-chip more-skills">
                  +{item.requiredSkills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Team Progress */}
        <div className="team-progress">
          <div className="progress-header">
            <span className="progress-label">
              👥 Team: {teamProgress.current}/{teamProgress.target}
            </span>
            <span className="progress-percentage">
              {Math.round(teamProgress.percentage)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${teamProgress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="engagement-stats">
          <div className="stat-item">
            <span className="stat-icon">📨</span>
            <span className="stat-text">{joinRequestsCount} requests</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🤖</span>
            <span className="stat-text">{aiMatchCount} AI matches</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button 
          className="action-btn primary"
          onClick={() => onView(item._id)}
        >
          View Details
        </button>
        
        <div className="secondary-actions">
          <button 
            className="action-btn secondary"
            onClick={() => onViewRequests(item._id, type)}
            disabled={joinRequestsCount === 0}
          >
            Requests ({joinRequestsCount})
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={() => onViewSuggestions(item._id, type)}
            disabled={aiMatchCount === 0}
          >
            AI Matches ({aiMatchCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkHubCard;