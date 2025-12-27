import React, { useState } from 'react';
import AITeammateMatching from '../components/AITeammateMatching';
import './AIMatchingDemo.css';

const AIMatchingDemo = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample projects for demonstration
  const sampleProjects = [
    {
      id: 1,
      title: "AI-Powered Student Collaboration Platform",
      description: "Building a platform that uses machine learning to match students for academic projects and research collaboration.",
      skillsRequired: ["React", "Node.js", "MongoDB", "Machine Learning", "Python"],
      category: "Web Development",
      status: "Looking for members",
      owner: {
        name: "John Smith",
        department: "Computer Science"
      }
    },
    {
      id: 2,
      title: "Sustainable Energy Management System",
      description: "IoT-based system for monitoring and optimizing energy consumption in university buildings.",
      skillsRequired: ["IoT", "Python", "Data Analysis", "React", "Arduino"],
      category: "Engineering",
      status: "Looking for members",
      owner: {
        name: "Sarah Johnson",
        department: "Electrical Engineering"
      }
    },
    {
      id: 3,
      title: "Mental Health Support Chatbot",
      description: "AI chatbot to provide initial mental health support and resources for university students.",
      skillsRequired: ["Natural Language Processing", "Python", "TensorFlow", "React", "Psychology"],
      category: "AI/ML",
      status: "Looking for members",
      owner: {
        name: "Emily Chen",
        department: "Psychology"
      }
    },
    {
      id: 4,
      title: "Blockchain-Based Academic Credential System",
      description: "Secure, decentralized system for storing and verifying academic credentials and certificates.",
      skillsRequired: ["Blockchain", "Solidity", "Web3", "React", "Node.js"],
      category: "Blockchain",
      status: "Looking for members",
      owner: {
        name: "Michael Rodriguez",
        department: "Computer Science"
      }
    }
  ];

  const handleInviteStudent = (student) => {
    alert(`Invitation sent to ${student.name}! 📧\n\nThis would normally send a collaboration request through the platform.`);
  };

  return (
    <div className="ai-matching-demo">
      {/* Header */}
      <div className="demo-header">
        <div className="demo-container">
          <h1 className="demo-title">
            <span className="demo-icon">🤖</span>
            AI Teammate Matching Demo
          </h1>
          <p className="demo-subtitle">
            Experience how AI helps students find the perfect collaborators for their projects
          </p>
        </div>
      </div>

      <div className="demo-container">
        {/* Project Selection */}
        <div className="project-selection">
          <h2>Select a Project to See AI Suggestions</h2>
          <div className="projects-grid">
            {sampleProjects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span className="project-category">{project.category}</span>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-skills">
                  <h4>Required Skills:</h4>
                  <div className="skills-list">
                    {project.skillsRequired.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="project-owner">
                  <span className="owner-text">
                    by {project.owner.name} • {project.owner.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matching Component */}
        <div className="matching-section">
          {selectedProject ? (
            <>
              <div className="selected-project-info">
                <h2>AI Analysis for: "{selectedProject.title}"</h2>
                <p>Watch as AI analyzes student profiles and generates intelligent teammate suggestions with explanations.</p>
              </div>
              
              <AITeammateMatching
                project={selectedProject}
                onInviteStudent={handleInviteStudent}
                showGuidance={true}
              />
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-content">
                <span className="no-selection-icon">👆</span>
                <h3>Choose a project above</h3>
                <p>Select any project to see how AI matches students based on skills, experience, and collaboration potential.</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Showcase */}
        <div className="features-showcase">
          <h2>AI Matching Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>Smart Skill Matching</h3>
              <p>AI analyzes required vs. available skills and calculates compatibility scores</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">💡</div>
              <h3>Intelligent Explanations</h3>
              <p>Get detailed reasons why each student is a good match for your project</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🏆</div>
              <h3>Top Suggestions</h3>
              <p>Best matches are highlighted with badges and detailed compatibility analysis</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Project Guidance</h3>
              <p>AI provides workflow, team structure, and collaboration recommendations</p>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="demo-notice">
          <div className="notice-content">
            <span className="notice-icon">ℹ️</span>
            <div className="notice-text">
              <strong>Demo Mode</strong>
              <p>This is a demonstration using sample data. In the real application, AI would analyze actual student profiles and provide personalized recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchingDemo;