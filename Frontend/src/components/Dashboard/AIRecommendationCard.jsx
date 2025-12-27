import React from 'react';

const AIRecommendationCard = ({ recommendation }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'project':
        return '📋';
      case 'collaborator':
        return '👥';
      case 'research':
        return '🔬';
      default:
        return '💡';
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'match-excellent';
    if (score >= 80) return 'match-good';
    if (score >= 70) return 'match-fair';
    return 'match-low';
  };

  return (
    <div className="ai-recommendation-card">
      <div className="recommendation-header">
        <div className="recommendation-type">
          <span className="type-icon">{getTypeIcon(recommendation.type)}</span>
          <span className="type-label">{recommendation.type}</span>
        </div>
        <div className={`match-score ${getMatchScoreColor(recommendation.matchScore)}`}>
          {recommendation.matchScore}% match
        </div>
      </div>
      
      <div className="recommendation-content">
        <h4 className="recommendation-title">{recommendation.title}</h4>
        <p className="recommendation-description">{recommendation.description}</p>
        <p className="recommendation-reason">
          <span className="reason-label">Why recommended:</span>
          {recommendation.reason}
        </p>
        
        <div className="recommendation-tags">
          {recommendation.tags?.map((tag, index) => (
            <span key={index} className="recommendation-tag">
              {tag}
            </span>
          ))}
        </div>
        
        {recommendation.collaborators && (
          <div className="recommendation-meta">
            <span className="meta-item">
              👥 {recommendation.collaborators} collaborators
            </span>
            <span className="meta-item">
              📊 {recommendation.difficulty}
            </span>
          </div>
        )}
        
        {recommendation.department && (
          <div className="recommendation-meta">
            <span className="meta-item">
              🏛️ {recommendation.department}
            </span>
            <span className="meta-item">
              🎓 {recommendation.academicYear}
            </span>
          </div>
        )}
        
        {recommendation.timeline && (
          <div className="recommendation-meta">
            <span className="meta-item">
              ⏱️ {recommendation.timeline}
            </span>
            <span className="meta-item">
              📈 {recommendation.level}
            </span>
          </div>
        )}
      </div>
      
      <div className="recommendation-actions">
        <button className="action-btn primary">
          View Details
        </button>
        <button className="action-btn secondary">
          Save for Later
        </button>
      </div>
    </div>
  );
};

export default AIRecommendationCard;