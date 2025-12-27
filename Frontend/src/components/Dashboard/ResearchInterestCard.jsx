import React from 'react';

const ResearchInterestCard = ({ suggestion }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'difficulty-beginner';
      case 'intermediate':
        return 'difficulty-intermediate';
      case 'advanced':
        return 'difficulty-advanced';
      default:
        return 'difficulty-intermediate';
    }
  };

  const getCollaborationColor = (potential) => {
    switch (potential.toLowerCase()) {
      case 'high':
        return 'collaboration-high';
      case 'medium':
        return 'collaboration-medium';
      case 'low':
        return 'collaboration-low';
      default:
        return 'collaboration-medium';
    }
  };

  return (
    <div className="research-interest-card">
      <div className="card-header">
        <div className="header-left">
          <h4 className="research-title">{suggestion.title}</h4>
          {suggestion.trending && (
            <span className="trending-badge">
              🔥 Trending
            </span>
          )}
        </div>
        <div className="field-badge">
          {suggestion.field}
        </div>
      </div>
      
      <div className="card-content">
        <p className="research-description">{suggestion.description}</p>
        
        <div className="research-metrics">
          <div className="metric-item">
            <span className="metric-label">Difficulty:</span>
            <span className={`metric-value ${getDifficultyColor(suggestion.difficulty)}`}>
              {suggestion.difficulty}
            </span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Collaboration:</span>
            <span className={`metric-value ${getCollaborationColor(suggestion.collaborationPotential)}`}>
              {suggestion.collaborationPotential}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button className="action-btn primary">
          Explore Research
        </button>
        <button className="action-btn secondary">
          Find Collaborators
        </button>
      </div>
    </div>
  );
};

export default ResearchInterestCard;