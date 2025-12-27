import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createProject } from '../api/api';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    requiredSkills: [],
    teamSize: 3,
    category: '',
    duration: '',
    timeCommitment: '',
    projectType: 'development',
    difficulty: 'intermediate',
    technologies: [],
    timeline: '',
    resources: '',
    expectations: ''
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const categories = [
    { value: 'Web Development', icon: '💻', color: '#3b82f6' },
    { value: 'Mobile App', icon: '📱', color: '#10b981' },
    { value: 'Data Science', icon: '📊', color: '#8b5cf6' },
    { value: 'AI/ML', icon: '🤖', color: '#f59e0b' },
    { value: 'Game Development', icon: '🎮', color: '#ef4444' },
    { value: 'IoT', icon: '🔗', color: '#06b6d4' },
    { value: 'Cybersecurity', icon: '🔒', color: '#6366f1' },
    { value: 'Research', icon: '🔬', color: '#ec4899' },
    { value: 'Startup', icon: '🚀', color: '#f97316' }
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++',
    'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Project Management',
    'Database Design', 'DevOps', 'Mobile Development', 'Cloud Computing',
    'Testing', 'Git', 'Agile', 'Leadership'
  ];

  const commonTechnologies = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    'TensorFlow', 'PyTorch', 'Figma', 'Adobe XD'
  ];

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📝' },
    { number: 2, title: 'Details', icon: '🎯' },
    { number: 3, title: 'Team & Skills', icon: '👥' },
    { number: 4, title: 'Review', icon: '✅' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addSkill = (skill) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addTechnology = (tech) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
    setTechInput('');
  };

  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Project title is required';
      if (!formData.description.trim()) newErrors.description = 'Project description is required';
      if (!formData.category) newErrors.category = 'Please select a category';
    }

    if (step === 2) {
      if (!formData.objectives.trim()) newErrors.objectives = 'Project objectives are required';
      if (!formData.duration) newErrors.duration = 'Please select project duration';
      if (!formData.timeCommitment) newErrors.timeCommitment = 'Please select time commitment';
    }

    if (step === 3) {
      if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
      if (formData.teamSize < 2 || formData.teamSize > 20) newErrors.teamSize = 'Team size must be between 2 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const projectData = {
        ...formData,
        owner: user._id,
        status: 'Looking for members'
      };

      await createProject(projectData);
      
      setMessage('🎉 Project created successfully! Redirecting...');
      
      // Redirect to projects page after 2 seconds
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
      
    } catch (error) {
      setMessage('⚠️ Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.value === formData.category);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="create-project-container">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            ✨ Create New Project
          </h1>
          <p className="page-subtitle">
            Turn your ideas into reality by finding the perfect team
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="steps-container">
        <div className="container">
          <div className="steps-progress">
            {steps.map((step, index) => (
              <div key={step.number} className="step-item">
                <div className={`step-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className="step-info">
                  <div className="step-number">Step {step.number}</div>
                  <div className="step-title">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="form-card">
          <div className="container">
            <div className={`message ${message.includes('🎉') ? 'success' : 'error'}`}>
              <span className="message-icon">{message.includes('🎉') ? '✅' : '⚠️'}</span>
              <span className="message-text">{message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="form-container">
        <div className="container">
          <div className="form-card">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>📝 Basic Information</h2>
                  <p>Let's start with the essentials of your project</p>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="title">Project Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a catchy, descriptive title for your project"
                      className={`form-control ${errors.title ? 'error' : ''}`}
                      maxLength={100}
                    />
                    {errors.title && <span className="error-text">{errors.title}</span>}
                    <small className="form-hint">{formData.title.length}/100 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Project Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project vision, goals, and what you want to build. Be specific and inspiring!"
                      className={`form-control ${errors.description ? 'error' : ''}`}
                      rows={4}
                      maxLength={500}
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                    <small className="form-hint">{formData.description.length}/500 characters</small>
                  </div>

                  <div className="form-group">
                    <label>Project Category *</label>
                    <div className="category-grid">
                      {categories.map(category => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                          className={`category-card ${formData.category === category.value ? 'selected' : ''}`}
                          style={{ '--category-color': category.color }}
                        >
                          <span className="category-icon">{category.icon}</span>
                          <span className="category-value">{category.value}</span>
                        </button>
                      ))}
                    </div>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label>Project Type</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="projectType"
                          value="development"
                          checked={formData.projectType === 'development'}
                          onChange={handleInputChange}
                        />
                        <div className="radio-content">
                          <div className="radio-icon">💻</div>
                          <div>
                            <div className="radio-title">Development Project</div>
                            <div className="radio-desc">Build websites, apps, or software</div>
                          </div>
                        </div>
                      </label>

                      <label className="radio-option">
                        <input
                          type="radio"
                          name="projectType"
                          value="research"
                          checked={formData.projectType === 'research'}
                          onChange={handleInputChange}
                        />
                        <div className="radio-content">
                          <div className="radio-icon">�</div>
                          <div>
                            <div className="radio-title">Research Project</div>
                            <div className="radio-desc">Conduct studies or investigations</div>
                          </div>
                        </div>
                      </label>

                      <label className="radio-option">
                        <input
                          type="radio"
                          name="projectType"
                          value="startup"
                          checked={formData.projectType === 'startup'}
                          onChange={handleInputChange}
                        />
                        <div className="radio-content">
                          <div className="radio-icon">🚀</div>
                          <div>
                            <div className="radio-title">Startup Idea</div>
                            <div className="radio-desc">Launch a business or product</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>🎯 Project Details</h2>
                  <p>Tell us more about your project goals and timeline</p>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="objectives">Project Objectives *</label>
                    <textarea
                      id="objectives"
                      name="objectives"
                      value={formData.objectives}
                      onChange={handleInputChange}
                      placeholder="What specific goals do you want to achieve? What problems will this project solve?"
                      className={`form-control ${errors.objectives ? 'error' : ''}`}
                      rows={3}
                    />
                    {errors.objectives && <span className="error-text">{errors.objectives}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="duration">Project Duration *</label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className={`form-control ${errors.duration ? 'error' : ''}`}
                      >
                        <option value="">Select Duration</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2-3 months">2-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                        <option value="Ongoing">Ongoing</option>
                      </select>
                      {errors.duration && <span className="error-text">{errors.duration}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="timeCommitment">Time Commitment *</label>
                      <select
                        id="timeCommitment"
                        name="timeCommitment"
                        value={formData.timeCommitment}
                        onChange={handleInputChange}
                        className={`form-control ${errors.timeCommitment ? 'error' : ''}`}
                      >
                        <option value="">Select Commitment</option>
                        <option value="5-10 hours/week">5-10 hours/week</option>
                        <option value="10-20 hours/week">10-20 hours/week</option>
                        <option value="20+ hours/week">20+ hours/week</option>
                        <option value="Full-time">Full-time</option>
                      </select>
                      {errors.timeCommitment && <span className="error-text">{errors.timeCommitment}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="difficulty">Project Difficulty</label>
                    <div className="difficulty-selector">
                      {[
                        { value: 'beginner', label: 'Beginner', icon: '🌱', color: '#10b981' },
                        { value: 'intermediate', label: 'Intermediate', icon: '🌿', color: '#f59e0b' },
                        { value: 'advanced', label: 'Advanced', icon: '🌳', color: '#ef4444' }
                      ].map(level => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                          className={`difficulty-option ${formData.difficulty === level.value ? 'selected' : ''}`}
                          style={{ '--difficulty-color': level.color }}
                        >
                          <span className="difficulty-icon">{level.icon}</span>
                          <span className="difficulty-label">{level.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeline">Project Timeline</label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="e.g., Phase 1: Research (2 weeks), Phase 2: Development (6 weeks)"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="resources">Available Resources</label>
                    <textarea
                      id="resources"
                      name="resources"
                      value={formData.resources}
                      onChange={handleInputChange}
                      placeholder="What resources do you have? (funding, tools, data, connections, etc.)"
                      className="form-control"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Team & Skills */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>👥 Team & Skills</h2>
                  <p>Define your team needs and required skills</p>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="teamSize">Team Size *</label>
                    <div className="team-size-selector">
                      <div className="team-size-display">
                        <span className="team-size-number">{formData.teamSize}</span>
                        <span className="team-size-label">team members (including you)</span>
                      </div>
                      <input
                        type="range"
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        min="2"
                        max="20"
                        className="team-size-slider"
                      />
                    </div>
                    {errors.teamSize && <span className="error-text">{errors.teamSize}</span>}
                  </div>

                  <div className="form-group">
                    <label>Required Skills *</label>
                    <div className="skill-input-container">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(skillInput.trim());
                          }
                        }}
                        placeholder="Type a skill and press Enter"
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => addSkill(skillInput.trim())}
                        className="btn btn-secondary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="common-skills">
                      <p className="skills-label">Popular skills:</p>
                      <div className="skills-suggestions">
                        {commonSkills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="skill-suggestion"
                            disabled={formData.requiredSkills.includes(skill)}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.requiredSkills.length > 0 && (
                      <div className="selected-skills">
                        {formData.requiredSkills.map(skill => (
                          <span key={skill} className="skill-tag">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="skill-remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {errors.requiredSkills && <span className="error-text">{errors.requiredSkills}</span>}
                  </div>

                  <div className="form-group">
                    <label>Technologies (Optional)</label>
                    <div className="tech-input-container">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTechnology(techInput.trim());
                          }
                        }}
                        placeholder="Type a technology and press Enter"
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => addTechnology(techInput.trim())}
                        className="btn btn-secondary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="common-technologies">
                      <p className="tech-label">Popular technologies:</p>
                      <div className="tech-suggestions">
                        {commonTechnologies.map(tech => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => addTechnology(tech)}
                            className="tech-suggestion"
                            disabled={formData.technologies.includes(tech)}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.technologies.length > 0 && (
                      <div className="selected-technologies">
                        {formData.technologies.map(tech => (
                          <span key={tech} className="tech-tag">
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(tech)}
                              className="tech-remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="expectations">Team Expectations</label>
                    <textarea
                      id="expectations"
                      name="expectations"
                      value={formData.expectations}
                      onChange={handleInputChange}
                      placeholder="What do you expect from team members? Any specific requirements or preferences?"
                      className="form-control"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>✅ Review Your Project</h2>
                  <p>Double-check everything looks good before publishing</p>
                </div>

                <div className="review-section">
                  <div className="review-card">
                    <div className="review-header">
                      <div className="project-type-badge" style={{ backgroundColor: getSelectedCategory()?.color }}>
                        {formData.projectType === 'development' && '💻'}
                        {formData.projectType === 'research' && '🔬'}
                        {formData.projectType === 'startup' && '🚀'}
                      </div>
                      <div className="category-badge" style={{ backgroundColor: getSelectedCategory()?.color }}>
                        <span className="category-icon">{getSelectedCategory()?.icon}</span>
                        <span>{formData.category}</span>
                      </div>
                    </div>
                    
                    <h3 className="review-title">{formData.title}</h3>
                    <p className="review-description">{formData.description}</p>
                  </div>

                  <div className="review-details">
                    <div className="detail-item">
                      <span className="detail-label">📋 Objectives:</span>
                      <span className="detail-value">{formData.objectives}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">⏱️ Duration:</span>
                      <span className="detail-value">{formData.duration}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">🕒 Time Commitment:</span>
                      <span className="detail-value">{formData.timeCommitment}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">👥 Team Size:</span>
                      <span className="detail-value">{formData.teamSize} members</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">📈 Difficulty:</span>
                      <span className="detail-value">{formData.difficulty}</span>
                    </div>

                    {formData.timeline && (
                      <div className="detail-item">
                        <span className="detail-label">📅 Timeline:</span>
                        <span className="detail-value">{formData.timeline}</span>
                      </div>
                    )}

                    {formData.resources && (
                      <div className="detail-item">
                        <span className="detail-label">🎁 Resources:</span>
                        <span className="detail-value">{formData.resources}</span>
                      </div>
                    )}

                    {formData.expectations && (
                      <div className="detail-item">
                        <span className="detail-label">💭 Expectations:</span>
                        <span className="detail-value">{formData.expectations}</span>
                      </div>
                    )}
                  </div>

                  <div className="review-skills">
                    <div className="review-item">
                      <span className="skills-label">Required Skills:</span>
                      <div className="skills-list">
                        {formData.requiredSkills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>

                    {formData.technologies.length > 0 && (
                      <div className="review-item">
                        <span className="tech-label">Technologies:</span>
                        <div className="tech-list">
                          {formData.technologies.map(tech => (
                            <span key={tech} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              <div className="nav-spacer">
                {currentStep > 1 && !isSubmitting && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    <span className="btn-icon">←</span>
                    Previous
                  </button>
                )}
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                  <span className="btn-icon">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🚀</span>
                      Create Project
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;