import React, { useState } from 'react';
import './JoinRequestsPanel.css';

const JoinRequestsPanel = ({ joinRequests = [], onAction }) => {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const pendingRequests = joinRequests.filter(req => req.status === 'Pending');

  const handleAction = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      await onAction(requestId, action);
    } catch (error) {
      console.error('Failed to handle join request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpanded = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateMessage = (message, maxLength = 80) => {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (pendingRequests.length === 0) {
    return (
      <div className="join-requests-panel">
        <div className="panel-header">
          <h3 className="panel-title">📋 Join Requests</h3>
        </div>
        <div className="panel-content">
          <div className="no-requests">
            <p>No pending join requests</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-requests-panel">
      <div className="panel-header">
        <h3 className="panel-title">📋 Join Requests ({pendingRequests.length})</h3>
      </div>
      <div className="panel-content">
        <div className="requests-list">
          {pendingRequests.map((request) => (
            <div key={request._id} className="request-item">
              <div className="request-header" onClick={() => toggleExpanded(request._id)}>
                <div className="requester-info">
                  <div className="avatar">
                    {getUserInitials(request.student?.name || request.requesterName)}
                  </div>
                  <div className="requester-details">
                    <h4>{request.student?.name || request.requesterName || 'Unknown User'}</h4>
                    <p className="project-title">{request.projectTitle}</p>
                    <span className="request-date">{formatDate(request.createdAt)}</span>
                  </div>
                </div>
                <div className="expand-icon">
                  {expandedRequest === request._id ? '▼' : '▶'}
                </div>
              </div>

              {expandedRequest === request._id && (
                <div className="request-details">
                  <div className="message-section">
                    <h5>Message:</h5>
                    <p className="request-message">
                      {request.message || 'No message provided'}
                    </p>
                  </div>

                  {request.student && (
                    <div className="student-info">
                      <h5>Student Details:</h5>
                      <p><strong>Department:</strong> {request.student.department || 'Not specified'}</p>
                      <p><strong>Academic Year:</strong> {request.student.academicYear || 'Not specified'}</p>
                      {request.student.skills && request.student.skills.length > 0 && (
                        <div className="skills-section">
                          <strong>Skills:</strong>
                          <div className="skills-list">
                            {request.student.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="action-buttons">
                    <button
                      className="accept-btn"
                      onClick={() => handleAction(request._id, 'Accepted')}
                      disabled={actionLoading === request._id}
                    >
                      {actionLoading === request._id ? 'Processing...' : '✓ Accept'}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleAction(request._id, 'Rejected')}
                      disabled={actionLoading === request._id}
                    >
                      {actionLoading === request._id ? 'Processing...' : '✗ Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRequestsPanel;