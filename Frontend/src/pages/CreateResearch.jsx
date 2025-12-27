import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CreateResearch.css';

const CreateResearch = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    researchDomain: '',
    researchType: '',
    objective: '',
    methodology: '',
    expectedContribution: '',
    requiredSkills: [],
    preferredAcademicYear: '',
    supervisorInvolvement: false
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const researchDomains = [
    { value: 'AI', icon: '🤖', color: '#8b5cf6' },
    { value: 'Biology', icon: '🧬', color: '#10b981' },
    { value: 'Physics', icon: '⚛️', color: '#ef4444' },
    { value: 'Social Science', icon: '👥', color: '#84cc16' },
    { value: 'Chemistry', icon: '🧪', color: '#f59e0b' },
    { value: 'Mathematics', icon: '📐', color: '#6366f1' },
    { value: 'Psychology', icon: '🧠', color: '#ec4899' },
    { value: 'Engineering', icon: '⚙️', color: '#f97316' },
    { value: 'Medicine', icon: '🏥', color: '#14b8a6' },
    { value: 'Environmental Science', icon: '🌱', color: '#22c55e' }
  ];

  const researchTypes = [
    { value: 'Survey', icon: '📋', description: 'Data collection through surveys and interviews' },
    { value: 'Experimental', icon: '🔬', description: 'Hands-on experiments and data collection' },
    { value: 'Theoretical', icon: '📚', description: 'Literature review and theoretical analysis' }
  ];

  const academicSkills = [
    'Research', 'Data Analysis', 'Writing', 'Statistical Analysis', 'Literature Review',
    'Academic Writing', 'Survey Design', 'Interview Techniques', 'R Programming',
    'Python', 'Qualitative Analysis', 'Quantitative Analysis', 'Citation Management',
    'Presentation Skills', 'Critical Thinking', 'Project Management'
  ];

  const academicYears = [
    { value: 'Undergraduate', icon: '🎓' },
    { value: 'Masters', icon: '📚' },
    { value: 'PhD', icon: '🔬' },
    { value: 'Any', icon: '🌟' }
  ];

  const steps = [
    { number: 1, title: 'Research Basics', icon: '🔬' },
    { number: 2, title: 'Research Details', icon: '📚' },
    { number: 3, title: 'Collaboration Requirements', icon: '🤝' },
    { number: 4, title: 'Review & Publish', icon: '✅' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Research title is required';
      if (!formData.researchDomain) newErrors.researchDomain = 'Please select a research domain';
      if (!formData.researchType) newErrors.researchType = 'Please select a research type';
    }

    if (step === 2) {
      if (!formData.objective.trim()) newErrors.objective = 'Research objective is required';
      if (!formData.expectedContribution.trim()) newErrors.expectedContribution = 'Expected contribution is required';
    }

    if (step === 3) {
      if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
      if (!formData.preferredAcademicYear) newErrors.preferredAcademicYear = 'Please select preferred academic year';
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
      // Mock API call - replace with actual createResearch API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('🎉 Research opportunity published successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/research');
      }, 2000);
      
    } catch (error) {
      setMessage('⚠️ Failed to publish research. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="create-research-container">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            🔬 Create Research Opportunity
          </h1>
          <p className="page-subtitle">
            This feels like a serious academic collaboration platform
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
            
            {/* Step 1: Research Basics */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>🔬 Research Basics</h2>
                  <p>Define the foundation of your research</p>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="title">Research Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a clear, descriptive title for your research"
                      className={`form-control ${errors.title ? 'error' : ''}`}
                      maxLength={150}
                    />
                    {errors.title && <span className="error-text">{errors.title}</span>}
                    <small className="form-hint">{formData.title.length}/150 characters</small>
                  </div>

                  <div className="form-group">
                    <label>Research Domain (AI, Biology, Physics, Social Science, etc.)</label>
                    <div className="domain-grid">
                      {researchDomains.map(domain => (
                        <button
                          key={domain.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, researchDomain: domain.value }))}
                          className={`domain-card ${formData.researchDomain === domain.value ? 'selected' : ''}`}
                          style={{ '--domain-color': domain.color }}
                        >
                          <span className="domain-icon">{domain.icon}</span>
                          <span className="domain-value">{domain.value}</span>
                        </button>
                      ))}
                    </div>
                    {errors.researchDomain && <span className="error-text">{errors.researchDomain}</span>}
                  </div>

                  <div className="form-group">
                    <label>Research Type (Survey / Experimental / Theoretical)</label>
                    <div className="type-grid">
                      {researchTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, researchType: type.value }))}
                          className={`type-card ${formData.researchType === type.value ? 'selected' : ''}`}
                        >
                          <div className="type-header">
                            <span className="type-icon">{type.icon}</span>
                            <span className="type-value">{type.value}</span>
                          </div>
                          <p className="type-description">{type.description}</p>
                        </button>
                      ))}
                    </div>
                    {errors.researchType && <span className="error-text">{errors.researchType}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Research Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>📚 Research Details</h2>
                  <p>Explain the research objective clearly</p>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label htmlFor="objective">Research Objective</label>
                    <textarea
                      id="objective"
                      name="objective"
                      value={formData.objective}
                      onChange={handleInputChange}
                      placeholder="Describe the main goal and purpose of your research..."
                      className={`form-control ${errors.objective ? 'error' : ''}`}
                      rows={4}
                      maxLength={500}
                    />
                    {errors.objective && <span className="error-text">{errors.objective}</span>}
                    <small className="form-hint">{formData.objective.length}/500 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="methodology">Brief Methodology (optional)</label>
                    <textarea
                      id="methodology"
                      name="methodology"
                      value={formData.methodology}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your research approach and methods..."
                      className="form-control"
                      rows={3}
                      maxLength={300}
                    />
                    <small className="form-hint">{formData.methodology.length}/300 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="expectedContribution">Expected Contribution</label>
                    <textarea
                      id="expectedContribution"
                      name="expectedContribution"
                      value={formData.expectedContribution}
                      onChange={handleInputChange}
                      placeholder="What impact or contribution do you expect this research to make?"
                      className={`form-control ${errors.expectedContribution ? 'error' : ''}`}
                      rows={3}
                      maxLength={300}
                    />
                    {errors.expectedContribution && <span className="error-text">{errors.expectedContribution}</span>}
                    <small className="form-hint">{formData.expectedContribution.length}/300 characters</small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Collaboration Requirements */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>🤝 Collaboration Needs</h2>
                  <p>Specify the kind of collaborators you're looking for</p>
                </div>

                <div className="form-section">
                  <div className="form-group">
                    <label>Required Skills (Research, Data Analysis, Writing, etc.)</label>
                    <div className="skills-input-section">
                      <div className="skills-input-row">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Type a skill and press Enter"
                          className="form-control"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill(skillInput.trim());
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => addSkill(skillInput.trim())}
                          className="btn btn-secondary btn-sm"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="suggested-skills">
                        <small className="form-hint">Suggested skills:</small>
                        <div className="skill-suggestions">
                          {academicSkills.filter(skill => !formData.requiredSkills.includes(skill)).slice(0, 8).map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => addSkill(skill)}
                              className="skill-suggestion"
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
                    </div>
                    {errors.requiredSkills && <span className="error-text">{errors.requiredSkills}</span>}
                  </div>

                  <div className="form-group">
                    <label>Preferred Academic Year</label>
                    <div className="academic-year-grid">
                      {academicYears.map(year => (
                        <button
                          key={year.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, preferredAcademicYear: year.value }))}
                          className={`academic-year-card ${formData.preferredAcademicYear === year.value ? 'selected' : ''}`}
                        >
                          <span className="year-icon">{year.icon}</span>
                          <span className="year-value">{year.value}</span>
                        </button>
                      ))}
                    </div>
                    {errors.preferredAcademicYear && <span className="error-text">{errors.preferredAcademicYear}</span>}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="supervisorInvolvement"
                        checked={formData.supervisorInvolvement}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Supervisor Involvement (optional toggle)</span>
                    </label>
                    <small className="form-hint">Check if supervisor involvement is required for this research</small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Publish */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="step-header">
                  <h2>✅ Review Research</h2>
                  <p>Confirm before publishing</p>
                </div>

                <div className="research-summary">
                  <div className="summary-section">
                    <h3>🔬 Research Basics</h3>
                    <div className="summary-item">
                      <strong>Title:</strong> {formData.title}
                    </div>
                    <div className="summary-item">
                      <strong>Domain:</strong> {formData.researchDomain}
                    </div>
                    <div className="summary-item">
                      <strong>Type:</strong> {formData.researchType}
                    </div>
                  </div>

                  <div className="summary-section">
                    <h3>📚 Research Details</h3>
                    <div className="summary-item">
                      <strong>Objective:</strong> {formData.objective}
                    </div>
                    {formData.methodology && (
                      <div className="summary-item">
                        <strong>Methodology:</strong> {formData.methodology}
                      </div>
                    )}
                    <div className="summary-item">
                      <strong>Expected Contribution:</strong> {formData.expectedContribution}
                    </div>
                  </div>

                  <div className="summary-section">
                    <h3>🤝 Collaboration Requirements</h3>
                    <div className="summary-item">
                      <strong>Required Skills:</strong>
                      <div className="skills-summary">
                        {formData.requiredSkills.map(skill => (
                          <span key={skill} className="skill-tag-summary">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="summary-item">
                      <strong>Preferred Academic Year:</strong> {formData.preferredAcademicYear}
                    </div>
                    <div className="summary-item">
                      <strong>Supervisor Involvement:</strong> {formData.supervisorInvolvement ? 'Required' : 'Not Required'}
                    </div>
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
                      Publishing Research...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🔬</span>
                      Publish Research
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

export default CreateResearch;