import { useState } from 'react';
import './AIMatchingSuggestions.css';

const AIMatchingSuggestions = ({ suggestedTeammates = [], matchingProjects = [] }) => {
  const [activeTab, setActiveTab] = useState('teammates');

  const hasTeammates = suggestedTeammates.length > 0;
  const hasProjects = matchingProjects.length > 0;

  if (!hasTeammates && !hasProjects) {
    return (
      <div className="ai-suggestions-panel">
        <div className="panel-header">
          <h3>🤖 AI Suggestions</h3>
        </div>
        <div className="panel-content">
          <div className="no-suggestions">
            <p>No AI suggestions available at the moment.</p>
            <p className="suggestion-tip">Create more projects or update your profile to get better matches!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-suggestions-panel">
      <div className="panel-header">
        <h3>🤖 AI Suggestions</h3>
        <div className="suggestion-tabs">
          {hasTeammates && (
            <button 
              className={`tab-button ${activeTab === 'teammates' ? 'active' : ''}`}
              onClick={() => setActiveTab('teammates')}
            >
              Teammates ({suggestedTeammates.length})
            </button>
          )}
          {hasProjects && (
            <button 
              className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects ({matchingProjects.length})
            </button>
          )}
        </div>
      </div>

      <div className="panel-content">
        {activeTab === 'teammates' && hasTeammates && (
          <div className="suggestions-list">
            <h4>Suggested Teammates</h4>
            {suggestedTeammates.map((teammate, index) => (
              <div key={teammate._id || index} className="suggestion-item">
                <div className="suggestion-info">
                  <h5>{teammate.name}</h5>
                  <p className="department">{teammate.department}</p>
                  <div className="skills">
                    {teammate.skills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="match-score">
                  {teammate.matchScore && (
                    <span className="score">{Math.round(teammate.matchScore)}% match</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && hasProjects && (
          <div className="suggestions-list">
            <h4>Matching Projects</h4>
            {matchingProjects.map((project, index) => (
              <div key={project._id || index} className="suggestion-item">
                <div className="suggestion-info">
                  <h5>{project.title}</h5>
                  <p className="owner">{project.owner?.name}</p>
                  <div className="skills">
                    {project.requiredSkills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="match-score">
                  {project.matchScore && (
                    <span className="score">{Math.round(project.matchScore)}% match</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatchingSuggestions;