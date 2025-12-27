import React, { useState } from 'react';
import { sendJoinRequest } from '../api/api';

const ProjectCard = ({ project, onJoinRequest, showJoinButton = true, currentUserId }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  const handleJoinRequest = async () => {
    if (!currentUserId) {
      alert('Please create a profile first to join projects');
      return;
    }

    if (project.owner._id === currentUserId) {
      alert('You cannot join your own project');
      return;
    }

    setIsJoining(true);
    try {
      await sendJoinRequest({
        projectId: project._id,
        studentId: currentUserId,
        message: joinMessage
      });
      
      alert('Join request sent successfully!');
      if (onJoinRequest) {
        onJoinRequest(project._id);
      }
    } catch (error) {
      alert(error.message || 'Failed to send join request');
    } finally {
      setIsJoining(false);
      setJoinMessage('');
    }
  };

  const currentMembers = project.members ? project.members.length : 0;
  const isTeamFull = currentMembers >= project.teamSize;

  return (
    <div className="card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      
      {project.requiredSkills && project.requiredSkills.length > 0 && (
        <div>
          <p><strong>Required Skills:</strong></p>
          <div className="skills-list">
            {project.requiredSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <p><strong>Team Size:</strong> {currentMembers}/{project.teamSize}</p>
      <p><strong>Status:</strong> {project.status}</p>
      
      {project.owner && (
        <p><strong>Owner:</strong> {project.owner.name} ({project.owner.department})</p>
      )}

      {project.category && (
        <p><strong>Category:</strong> {project.category}</p>
      )}

      {showJoinButton && project.status === 'Looking for members' && !isTeamFull && (
        <div style={{ marginTop: '1rem' }}>
          <textarea
            placeholder="Optional message to project owner..."
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
            style={{ 
              width: '100%', 
              marginBottom: '0.5rem',
              minHeight: '60px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleJoinRequest}
            disabled={isJoining}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isJoining ? 'Sending...' : 'Send Join Request'}
          </button>
        </div>
      )}

      {isTeamFull && (
        <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '1rem' }}>
          Team is full
        </p>
      )}
    </div>
  );
};

export default ProjectCard;