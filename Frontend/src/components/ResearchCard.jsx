import React, { useState } from 'react';

const ResearchCard = ({ research, onJoin, currentUser, isOwner = false, loading = false }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinClick = () => {
    if (!currentUser) {
      alert('Please log in to join research projects');
      return;
    }
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async () => {
    setIsJoining(true);
    try {
      await onJoin(research._id, joinMessage);
      setShowJoinModal(false);
      setJoinMessage('');
    } catch (error) {
      console.error('Error joining research:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open for Collaboration':
        return '#10b981'; // green
      case 'Ongoing':
        return '#3b82f6'; // blue
      case 'Completed':
        return '#6b7280'; // gray
      default:
        return '#f59e0b'; // yellow
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open for Collaboration':
        return '🟢';
      case 'Ongoing':
        return '🔵';
      case 'Completed':
        return '✅';
      default:
        return '🟡';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUserAlreadyCollaborator = () => {
    if (!currentUser || !research.collaborators) return false;
    return research.collaborators.some(collab => 
      collab.profile?._id === currentUser._id || collab.profile === currentUser._id
    );
  };

  const isResearchOwner = () => {
    if (!currentUser || !research.researcher) return false;
    return research.researcher._id === currentUser._id || research.researcher === currentUser._id;
  };

  return (
    <>
      <div className="research-card">
        {/* Header */}
        <div className="research-card-header">
          <div className="research-category">
            <span className="category-icon">🔬</span>
            <span className="category-text">{research.category || 'Research'}</span>
          </div>
          <div className="research-status">
            <span className="status-icon">{getStatusIcon(research.status)}</span>
            <span 
              className="status-text"
              style={{ color: getStatusColor(research.status) }}
            >
              {research.status || 'Open'}
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="research-card-content">
          <h3 className="research-title">{research.title}</h3>
          <p className="research-description">
            {research.description?.length > 150 
              ? `${research.description.substring(0, 150)}...` 
              : research.description}
          </p>
        </div>

        {/* Research Details */}
        <div className="research-details">
          {/* Researcher Info */}
          <div className="researcher-info">
            <div className="researcher-avatar">
              <span className="avatar-icon">👨‍🔬</span>
            </div>
            <div className="researcher-details">
              <p className="researcher-name">{research.researcher?.name || 'Unknown'}</p>
              <p className="researcher-dept">{research.researcher?.department || 'Department'}</p>
            </div>
          </div>

          {/* Research Metadata */}
          <div className="research-metadata">
            {research.fields && research.fields.length > 0 && (
              <div className="metadata-item">
                <span className="metadata-label">Fields:</span>
                <div className="fields-list">
                  {research.fields.slice(0, 2).map((field, index) => (
                    <span key={index} className="field-tag">
                      {field}
                    </span>
                  ))}
                  {research.fields.length > 2 && (
                    <span className="field-tag more">
                      +{research.fields.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {research.requiredSkills && research.requiredSkills.length > 0 && (
              <div className="metadata-item">
                <span className="metadata-label">Skills Needed:</span>
                <div className="skills-list">
                  {research.requiredSkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {research.requiredSkills.length > 3 && (
                    <span className="skill-tag more">
                      +{research.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Team Info */}
            <div className="team-info">
              <div className="team-size">
                <span className="team-icon">👥</span>
                <span className="team-text">
                  {research.collaborators?.length || 0} / {research.expectedTeamSize || 5} members
                </span>
              </div>
              <div className="research-date">
                <span className="date-icon">📅</span>
                <span className="date-text">
                  {research.createdAt ? formatDate(research.createdAt) : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="research-card-actions">
          <button className="btn btn-secondary btn-sm">
            <span className="btn-icon">👁️</span>
            View Details
          </button>

          {!isResearchOwner() && !isUserAlreadyCollaborator() && research.status === 'Open for Collaboration' && (
            <button 
              onClick={handleJoinClick}
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              <span className="btn-icon">🤝</span>
              Join Research
            </button>
          )}

          {isUserAlreadyCollaborator() && (
            <button className="btn btn-success btn-sm" disabled>
              <span className="btn-icon">✅</span>
              Collaborating
            </button>
          )}

          {isOwner && (
            <div className="owner-actions">
              <button className="btn btn-outline btn-sm">
                <span className="btn-icon">✏️</span>
                Edit
              </button>
              <button className="btn btn-outline btn-sm">
                <span className="btn-icon">📊</span>
                Manage
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar for Team Completion */}
        {research.expectedTeamSize && (
          <div className="team-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.min(100, ((research.collaborators?.length || 0) / research.expectedTeamSize) * 100)}%` 
                }}
              ></div>
            </div>
            <span className="progress-text">
              Team {Math.round(((research.collaborators?.length || 0) / research.expectedTeamSize) * 100)}% complete
            </span>
          </div>
        )}
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Join Research Project</h3>
              <button 
                onClick={() => setShowJoinModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="research-info">
                <h4>{research.title}</h4>
                <p>by {research.researcher?.name}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="joinMessage">
                  Why do you want to join this research? (Optional)
                </label>
                <textarea
                  id="joinMessage"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Share your interest, relevant experience, or how you can contribute..."
                  rows={4}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowJoinModal(false)}
                className="btn btn-secondary"
                disabled={isJoining}
              >
                Cancel
              </button>
              <button 
                onClick={handleJoinSubmit}
                className="btn btn-primary"
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <span className="spinner"></span>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🤝</span>
                    Send Join Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResearchCard;