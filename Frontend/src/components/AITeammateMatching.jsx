import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AITeammateMatching.css';

const AITeammateMatching = ({ project, onInviteStudent, showGuidance = true }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGuidancePanel, setShowGuidancePanel] = useState(false);

  // Mock student data for demonstration
  const mockStudents = [
    {
      id: 1,
      name: "Sarah Chen",
      department: "Computer Science",
      academic_year: 3,
      skills: ["React", "Node.js", "Python", "Machine Learning", "MongoDB"],
      bio: "Passionate about AI and web development. Looking for collaborative projects.",
      avatar: "SC",
      experience_level: "Intermediate",
      projects_completed: 5
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      department: "Data Science",
      academic_year: 2,
      skills: ["Python", "TensorFlow", "Data Analysis", "SQL", "React"],
      bio: "Data science enthusiast with strong programming background.",
      avatar: "AR",
      experience_level: "Advanced",
      projects_completed: 8
    },
    {
      id: 3,
      name: "Emily Zhang",
      department: "Software Engineering",
      academic_year: 4,
      skills: ["JavaScript", "React", "Node.js", "AWS", "Docker"],
      bio: "Full-stack developer interested in scalable applications.",
      avatar: "EZ",
      experience_level: "Advanced",
      projects_completed: 12
    },
    {
      id: 4,
      name: "Michael Johnson",
      department: "Computer Science",
      academic_year: 2,
      skills: ["Java", "Spring Boot", "MongoDB", "React", "Git"],
      bio: "Backend-focused developer with growing frontend skills.",
      avatar: "MJ",
      experience_level: "Intermediate",
      projects_completed: 3
    },
    {
      id: 5,
      name: "Lisa Park",
      department: "Information Systems",
      academic_year: 3,
      skills: ["UI/UX Design", "Figma", "React", "CSS", "User Research"],
      bio: "Designer who codes. Passionate about user-centered design.",
      avatar: "LP",
      experience_level: "Intermediate",
      projects_completed: 6
    }
  ];

  // Calculate match score and generate AI explanation
  const calculateMatch = (student, projectSkills) => {
    const studentSkills = student.skills.map(s => s.toLowerCase());
    const requiredSkills = projectSkills.map(s => s.toLowerCase());
    
    const matchedSkills = requiredSkills.filter(skill => 
      studentSkills.some(studentSkill => 
        studentSkill.includes(skill) || skill.includes(studentSkill)
      )
    );
    
    const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    
    return {
      score: matchScore,
      matchedSkills: matchedSkills,
      explanation: generateAIExplanation(student, projectSkills, matchedSkills, matchScore)
    };
  };

  // Generate AI explanation for teammate matching
  const generateAIExplanation = (student, projectSkills, matchedSkills, matchScore) => {
    const studentName = student.name.split(' ')[0];
    const matchedSkillsFormatted = matchedSkills.map(skill => 
      projectSkills.find(ps => ps.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps.toLowerCase()))
    ).filter(Boolean);
    
    const missingSkills = projectSkills.filter(skill => 
      !matchedSkills.some(matched => 
        skill.toLowerCase().includes(matched.toLowerCase()) || matched.toLowerCase().includes(skill.toLowerCase())
      )
    );

    let explanation = "";
    
    if (matchScore >= 80) {
      explanation = `🌟 ${studentName} is an excellent match! Strong alignment with ${matchedSkillsFormatted.join(', ')}. `;
    } else if (matchScore >= 60) {
      explanation = `✨ ${studentName} shows good potential with ${matchedSkillsFormatted.join(', ')} skills. `;
    } else if (matchScore >= 40) {
      explanation = `💡 ${studentName} has foundational skills in ${matchedSkillsFormatted.join(', ')}. `;
    } else {
      explanation = `🔍 ${studentName} brings ${student.skills.slice(0, 2).join(', ')} expertise. `;
    }

    // Add experience context
    if (student.experience_level === 'Advanced') {
      explanation += `Their advanced experience (${student.projects_completed} projects) adds valuable leadership. `;
    } else if (student.experience_level === 'Intermediate') {
      explanation += `Solid experience with ${student.projects_completed} completed projects. `;
    }

    // Add missing skills suggestion
    if (missingSkills.length > 0 && matchScore < 100) {
      explanation += `Consider pairing with someone skilled in ${missingSkills.slice(0, 2).join(', ')} to strengthen the team.`;
    } else if (matchScore === 100) {
      explanation += `Perfect skill alignment - this collaboration could be highly productive!`;
    }

    return explanation;
  };

  // Generate project guidance
  const generateProjectGuidance = (projectTitle, projectSkills) => {
    const guidance = {
      teamStructure: "",
      workflow: "",
      techStack: "",
      collaboration: ""
    };

    // Team structure advice
    if (projectSkills.includes('React') && projectSkills.includes('Node.js')) {
      guidance.teamStructure = "Consider a full-stack approach: assign frontend (React) and backend (Node.js) specialists, with one person handling integration.";
    } else if (projectSkills.includes('AI') || projectSkills.includes('Machine Learning')) {
      guidance.teamStructure = "Form a balanced team: one AI/ML specialist, one software engineer for implementation, and optionally a data analyst.";
    } else {
      guidance.teamStructure = "Divide responsibilities based on core skills, ensuring each team member has a primary focus area with some overlap for collaboration.";
    }

    // Workflow advice
    guidance.workflow = "Implement agile methodology with weekly sprints. Use GitHub for version control and establish clear branching strategies from day one.";

    // Tech stack recommendations
    if (projectSkills.includes('React')) {
      guidance.techStack = "React ecosystem is solid. Consider adding TypeScript for better code quality and testing frameworks like Jest.";
    } else if (projectSkills.includes('Python')) {
      guidance.techStack = "Python offers great flexibility. Consider FastAPI for backends or Streamlit for quick prototypes.";
    } else {
      guidance.techStack = "Choose technologies that all team members can contribute to, with room for learning new skills.";
    }

    // Collaboration tips
    guidance.collaboration = "Schedule regular check-ins, use collaborative tools like Figma for design and Notion for documentation. Establish clear communication channels.";

    return guidance;
  };

  useEffect(() => {
    if (project && project.skillsRequired) {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const matchedStudents = mockStudents.map(student => {
          const match = calculateMatch(student, project.skillsRequired);
          return {
            ...student,
            matchScore: match.score,
            matchedSkills: match.matchedSkills,
            aiExplanation: match.explanation
          };
        }).sort((a, b) => b.matchScore - a.matchScore);

        setSuggestions(matchedStudents);
        setLoading(false);
      }, 1500);
    }
  }, [project]);

  const handleInviteStudent = (student) => {
    if (onInviteStudent) {
      onInviteStudent(student);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'low';
  };

  const getMatchScoreIcon = (score) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '✨';
    if (score >= 40) return '💡';
    return '🔍';
  };

  if (!project) {
    return (
      <div className="ai-matching-container">
        <div className="no-project">
          <span className="no-project-icon">🤖</span>
          <p>Select a project to see AI-powered teammate suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-matching-container">
      {/* Header */}
      <div className="ai-matching-header">
        <div className="header-content">
          <h2 className="matching-title">
            <span className="ai-icon">🤖</span>
            AI Teammate Suggestions
          </h2>
          <p className="matching-subtitle">
            Smart matches for "{project.title}"
          </p>
        </div>
        
        {showGuidance && (
          <button 
            className="guidance-toggle"
            onClick={() => setShowGuidancePanel(!showGuidancePanel)}
          >
            <span className="guidance-icon">💡</span>
            Project Guidance
          </button>
        )}
      </div>

      {/* Project Skills Overview */}
      <div className="project-skills-overview">
        <h3>Required Skills</h3>
        <div className="skills-list">
          {project.skillsRequired?.map((skill, index) => (
            <span key={index} className="skill-tag required">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-suggestions">
          <div className="ai-thinking">
            <div className="thinking-animation">🤖</div>
            <p>AI is analyzing potential teammates...</p>
          </div>
          <div className="loading-cards">
            {[1, 2, 3].map(i => (
              <div key={i} className="suggestion-card skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.slice(0, 5).map((student, index) => (
            <div 
              key={student.id} 
              className={`suggestion-card ${index < 3 ? 'top-suggestion' : ''}`}
              onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
            >
              {/* Top 3 Badge */}
              {index < 3 && (
                <div className="top-badge">
                  <span className="badge-icon">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  <span className="badge-text">Top {index + 1}</span>
                </div>
              )}

              <div className="card-header">
                <div className="student-info">
                  <div className="student-avatar">
                    {student.avatar}
                  </div>
                  <div className="student-details">
                    <h3 className="student-name">{student.name}</h3>
                    <p className="student-meta">
                      {student.department} • Year {student.academic_year}
                    </p>
                  </div>
                </div>
                
                <div className="match-score">
                  <div className={`score-circle ${getMatchScoreColor(student.matchScore)}`}>
                    <span className="score-icon">{getMatchScoreIcon(student.matchScore)}</span>
                    <span className="score-number">{student.matchScore}%</span>
                  </div>
                </div>
              </div>

              <div className="student-skills">
                {student.skills.map((skill, skillIndex) => {
                  const isMatched = project.skillsRequired?.some(reqSkill => 
                    reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
                    skill.toLowerCase().includes(reqSkill.toLowerCase())
                  );
                  
                  return (
                    <span 
                      key={skillIndex} 
                      className={`skill-tag ${isMatched ? 'matched' : 'additional'}`}
                    >
                      {skill}
                      {isMatched && <span className="match-indicator">✓</span>}
                    </span>
                  );
                })}
              </div>

              <div className="ai-explanation">
                <div className="explanation-header">
                  <span className="ai-badge">AI Analysis</span>
                </div>
                <p className="explanation-text">{student.aiExplanation}</p>
              </div>

              <div className="card-actions">
                <button 
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // View profile logic
                  }}
                >
                  View Profile
                </button>
                <button 
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInviteStudent(student);
                  }}
                >
                  <span className="btn-icon">📧</span>
                  Invite to Project
                </button>
              </div>

              {/* Expanded Details */}
              {selectedStudent?.id === student.id && (
                <div className="expanded-details">
                  <div className="detail-section">
                    <h4>About</h4>
                    <p>{student.bio}</p>
                  </div>
                  <div className="detail-section">
                    <h4>Experience</h4>
                    <div className="experience-stats">
                      <div className="stat">
                        <span className="stat-number">{student.projects_completed}</span>
                        <span className="stat-label">Projects</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{student.experience_level}</span>
                        <span className="stat-label">Level</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Project Guidance Panel */}
      {showGuidancePanel && (
        <div className="guidance-panel">
          <div className="guidance-header">
            <h3>
              <span className="guidance-icon">💡</span>
              Project Guidance
            </h3>
            <button 
              className="close-guidance"
              onClick={() => setShowGuidancePanel(false)}
            >
              ×
            </button>
          </div>
          
          <div className="guidance-content">
            {(() => {
              const guidance = generateProjectGuidance(project.title, project.skillsRequired || []);
              return (
                <>
                  <div className="guidance-section">
                    <h4>🎯 Team Structure</h4>
                    <p>{guidance.teamStructure}</p>
                  </div>
                  
                  <div className="guidance-section">
                    <h4>⚡ Workflow</h4>
                    <p>{guidance.workflow}</p>
                  </div>
                  
                  <div className="guidance-section">
                    <h4>🛠️ Tech Stack</h4>
                    <p>{guidance.techStack}</p>
                  </div>
                  
                  <div className="guidance-section">
                    <h4>🤝 Collaboration</h4>
                    <p>{guidance.collaboration}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <div className="empty-suggestions">
          <div className="empty-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try adjusting your project requirements or check back later for new students.</p>
        </div>
      )}
    </div>
  );
};

export default AITeammateMatching;