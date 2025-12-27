import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResearchFeedCard.css';

const ResearchFeedCard = ({ research, onJoinRequest, currentUser, isAuthenticated }) => {
  const navigate = useNavigate();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get field icon
  const getFieldIcon = (field) => {
    const fieldIcons = {
      'Computer Science': '💻',
      'Engineering': '⚙️',
      'Biology': '🧬',
      'Chemistry': '🧪',
      'Physics': '⚛️',
      'Mathematics': '📊',
      'Psychology': '🧠',
      'Business': '💼',
      'Medicine': '🏥',
      'AI': '🤖',
      'Data Science': '📈',
      'Biotechnology': '🔬'
    };
    return fieldIcons[field] || '📚';
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Open for Collaboration':
        return { icon: '🟢', color: '#10b981', text: 'Open for Collaboration' };
      case 'Ongoing':
        return { icon: '🔵', color: '#3b82f6', text: 'Ongoing' };
      case 'Completed':
        return { icon: '✅', color: '#6b7280', text: 'Completed' };
      case 'On Hold':
        return { icon: '🟡', color: '#f59e0b', text: 'On Hold' };
      default:
        return { icon: '🟢', color: '#10b981', text: 'Open' };
    }
  };

  // Get level badge
  const getLevelBadge = (level) => {
    const badges = {
      'Undergraduate': { text: 'Undergrad', color: '#10b981' },
      'Masters': { text: 'Masters', color: '#3b82f6' },
      'PhD': { text: 'PhD', color: '#8b5cf6' },
      'Postdoc': { text: 'Postdoc', color: '#f59e0b' }
    };
    return badges[level] || { text: 'All Levels', color: '#6b7280' };
  };

  // Calculate skill match (mock implementation)
  const calculateSkillMatch = () => {
    if (!currentUser || !research.requiredSkills) return null;
    // This would be calculated based on user's skills vs required skills
    return Math.floor(Math.random() * 30) + 70; // Mock 70-100% match
  };

  // Check user status
  const isOwner = currentUser && research.researcher && 
    (research.researcher._id === currentUser._id || research.researcher === currentUser._id);
  
  const isCollaborator = currentUser && research.collaborators && 
    research.collaborators.some(collab => 
      collab.profile?._id === currentUser._id || collab.profile === currentUser._id
    );

  const hasRequested = currentUser && research.joinRequests && 
    research.joinRequests.some(request => 
      request.user === currentUser._id || request.user?._id === currentUser._id
    );

  // Handle actions
  const handleJoinClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async () => {
    setIsJoining(true);
    try {
      await onJoinRequest(research._id, joinMessage);
      setShowJoinModal(false);
      setJoinMessage('');
    } catch (error) {
      console.error('Error joining research:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/research/${research._id}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // API call to save/unsave research
  };

  const statusInfo = getStatusInfo(research.status);
  const skillMatch = calculateSkillMatch();
  const levelBadge = getLevelBadge(research.level);

  return (
    <>
      <div className="research-feed-card">
        {/* Card Header - LinkedIn Style */}
        <div className="feed-card-header">
          <div className="researcher-info">
            <div className="researcher-avatar">
              {research.researcher?.name ? research.researcher.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="researcher-details">
              <div className="researcher-name">
                {research.researcher?.name || 'Unknown Researcher'}
              </div>
              <div className="researcher-meta">
                <span className="department">{research.researcher?.department}</span>
                <span className="separator">•</span>
                <span className="university">{research.researcher?.university}</span>
                <span className="separator">•</span>
                <span className="timestamp">{formatDate(research.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="research-badges">
            <div className="field-badge">
              <span className="field-icon">{getFieldIcon(research.category)}</span>
              <span className="field-text">{research.category}</span>
            </div>
            <div className="status-badge" style={{ color: statusInfo.color }}>
              <span className="status-icon">{statusInfo.icon}</span>
              <span className="status-text">{statusInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="feed-card-body">
          <h3 className="research-title" onClick={handleViewDetails}>
            {research.title}
          </h3>
          
          <p className="research-description">
            {research.description?.length > 200 
              ? `${research.description.substring(0, 200)}...` 
              : research.description}
          </p>

          {/* Research Fields */}
          {research.fields && research.fields.length > 0 && (
            <div className="fields-container">
              <div className="fields-pills">
                {research.fields.slice(0, 3).map((field, index) => (
                  <span key={index} className="field-pill">
                    {field}
                  </span>
                ))}
                {research.fields.length > 3 && (
                  <span className="field-pill more-fields">
                    +{research.fields.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {research.requiredSkills && research.requiredSkills.length > 0 && (
            <div className="skills-container">
              <div className="skills-pills">
                {research.requiredSkills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="skill-pill">
                    {skill}
                  </span>
                ))}
                {research.requiredSkills.length > 4 && (
                  <span className="skill-pill more-skills">
                    +{research.requiredSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI Recommendations & Level */}
          <div className="research-meta">
            {skillMatch && (
              <div className="skill-match">
                <span className="match-icon">🎯</span>
                <span className="match-text">{skillMatch}% skill match</span>
              </div>
            )}
            <div className="level-badge" style={{ backgroundColor: levelBadge.color }}>
              {levelBadge.text}
            </div>
            {research.timeline && (
              <div className="timeline-badge">
                <span className="timeline-icon">⏱️</span>
                <span className="timeline-text">{research.timeline}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="feed-card-footer">
          <div className="team-status">
            <div className="team-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min(100, ((research.collaborators?.length || 0) / (research.expectedTeamSize || 5)) * 100)}%` 
                  }}
                ></div>
              </div>
              <span className="team-count">
                {research.collaborators?.length || 0}/{research.expectedTeamSize || 5} members
              </span>
            </div>
            
            {research.collaborators?.length >= research.expectedTeamSize && (
              <div className="team-full-badge">
                Team Full
              </div>
            )}
          </div>

          <div className="card-actions">
            <div className="secondary-actions">
              <button 
                className={`action-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSave}
              >
                <span className="action-icon">{isSaved ? '⭐' : '☆'}</span>
                <span className="action-text">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              
              <button className="action-btn">
                <span className="action-icon">💬</span>
                <span className="action-text">Ask Question</span>
              </button>
            </div>

            <div className="primary-actions">
              <button 
                className="secondary-btn"
                onClick={handleViewDetails}
              >
                View Details
              </button>
              
              {!isOwner && !isCollaborator && research.status === 'Open for Collaboration' && (
                <button 
                  className={`primary-btn ${hasRequested ? 'requested' : ''}`}
                  onClick={handleJoinClick}
                  disabled={hasRequested || research.collaborators?.length >= research.expectedTeamSize}
                >
                  {hasRequested ? 'Request Sent' : 'Request Collaboration'}
                </button>
              )}
              
              {isCollaborator && (
                <button className="primary-btn collaborating" disabled>
                  ✓ Collaborating
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Badge */}
        {skillMatch && skillMatch > 80 && (
          <div className="recommended-badge">
            <span className="rec-icon">🎯</span>
            <span className="rec-text">Recommended for you</span>
          </div>
        )}
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="join-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request to Join Research</h3>
              <button 
                onClick={() => setShowJoinModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="research-summary">
                <h4>{research.title}</h4>
                <p>by {research.researcher?.name} • {research.category}</p>
              </div>
              
              <div className="message-section">
                <label htmlFor="joinMessage">
                  Why do you want to join this research? (Optional)
                </label>
                <textarea
                  id="joinMessage"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Share your interest, relevant experience, or how you can contribute to this research..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowJoinModal(false)}
                className="secondary-btn"
                disabled={isJoining}
              >
                Cancel
              </button>
              <button 
                onClick={handleJoinSubmit}
                className="primary-btn"
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending Request...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResearchFeedCard;