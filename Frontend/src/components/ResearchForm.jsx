import React, { useState } from 'react';

const ResearchForm = ({ onSubmit, loading, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    methodology: '',
    expectedOutcomes: '',
    requiredSkills: [],
    fields: [],
    category: '',
    expectedTeamSize: 3,
    timeline: '',
    resources: '',
    ethicalConsiderations: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [fieldInput, setFieldInput] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    'Computer Science',
    'Engineering',
    'Medicine & Health',
    'Natural Sciences',
    'Social Sciences',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Psychology',
    'Economics',
    'Environmental Science',
    'Data Science',
    'Artificial Intelligence',
    'Other'
  ];

  const commonSkills = [
    'Python', 'R', 'JavaScript', 'Machine Learning', 'Data Analysis',
    'Statistics', 'Research Methodology', 'Literature Review', 'SPSS',
    'MATLAB', 'Java', 'C++', 'SQL', 'Excel', 'Tableau', 'PowerBI',
    'Qualitative Research', 'Quantitative Research', 'Survey Design',
    'Interview Techniques', 'Academic Writing', 'Grant Writing'
  ];

  const commonFields = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science',
    'Biotechnology', 'Nanotechnology', 'Renewable Energy',
    'Climate Change', 'Public Health', 'Neuroscience',
    'Genetics', 'Robotics', 'Cybersecurity', 'Blockchain',
    'Quantum Computing', 'Space Technology', 'Biomedical Engineering'
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

  const addField = (field) => {
    if (field && !formData.fields.includes(field)) {
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, field]
      }));
    }
    setFieldInput('');
  };

  const removeField = (fieldToRemove) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field !== fieldToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Research title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Research description is required';
    }

    if (!formData.objectives.trim()) {
      newErrors.objectives = 'Research objectives are required';
    }

    if (!formData.methodology.trim()) {
      newErrors.methodology = 'Research methodology is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a research category';
    }

    if (formData.expectedTeamSize < 1 || formData.expectedTeamSize > 20) {
      newErrors.expectedTeamSize = 'Team size must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      researcher: user._id
    };

    onSubmit(submissionData);
  };

  return (
    <div className="research-form-container">
      <div className="form-header">
        <h2>🔬 Post Your Research Project</h2>
        <p>Share your research problem and find brilliant collaborators to advance knowledge together</p>
      </div>

      <form onSubmit={handleSubmit} className="research-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📋</span>
            Basic Information
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Research Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a clear, descriptive title for your research"
                className={`form-control ${errors.title ? 'error' : ''}`}
                maxLength={200}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
              <small className="form-hint">{formData.title.length}/200 characters</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Research Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-control ${errors.category ? 'error' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="expectedTeamSize">Expected Team Size *</label>
              <input
                type="number"
                id="expectedTeamSize"
                name="expectedTeamSize"
                value={formData.expectedTeamSize}
                onChange={handleInputChange}
                min="1"
                max="20"
                className={`form-control ${errors.expectedTeamSize ? 'error' : ''}`}
              />
              {errors.expectedTeamSize && <span className="error-text">{errors.expectedTeamSize}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Research Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a comprehensive overview of your research problem, its significance, and current state of knowledge..."
              rows={4}
              className={`form-control ${errors.description ? 'error' : ''}`}
              maxLength={1000}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
            <small className="form-hint">{formData.description.length}/1000 characters</small>
          </div>
        </div>

        {/* Research Details */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🎯</span>
            Research Details
          </h3>

          <div className="form-group">
            <label htmlFor="objectives">Research Objectives *</label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleInputChange}
              placeholder="List your specific research objectives and goals. What do you aim to achieve?"
              rows={3}
              className={`form-control ${errors.objectives ? 'error' : ''}`}
            />
            {errors.objectives && <span className="error-text">{errors.objectives}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="methodology">Research Methodology *</label>
            <textarea
              id="methodology"
              name="methodology"
              value={formData.methodology}
              onChange={handleInputChange}
              placeholder="Describe your research approach, methods, and techniques you plan to use..."
              rows={3}
              className={`form-control ${errors.methodology ? 'error' : ''}`}
            />
            {errors.methodology && <span className="error-text">{errors.methodology}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="expectedOutcomes">Expected Outcomes</label>
            <textarea
              id="expectedOutcomes"
              name="expectedOutcomes"
              value={formData.expectedOutcomes}
              onChange={handleInputChange}
              placeholder="What outcomes, publications, or impact do you expect from this research?"
              rows={3}
              className="form-control"
            />
          </div>
        </div>

        {/* Skills and Fields */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🛠️</span>
            Skills & Research Fields
          </h3>

          <div className="form-group">
            <label>Required Skills</label>
            <div className="skill-input-container">
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
            
            <div className="common-skills">
              <p className="skills-label">Common skills:</p>
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
          </div>

          <div className="form-group">
            <label>Research Fields</label>
            <div className="field-input-container">
              <input
                type="text"
                value={fieldInput}
                onChange={(e) => setFieldInput(e.target.value)}
                placeholder="Type a research field and press Enter"
                className="form-control"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addField(fieldInput.trim());
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addField(fieldInput.trim())}
                className="btn btn-secondary btn-sm"
              >
                Add
              </button>
            </div>

            <div className="common-fields">
              <p className="fields-label">Common fields:</p>
              <div className="fields-suggestions">
                {commonFields.map(field => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => addField(field)}
                    className="field-suggestion"
                    disabled={formData.fields.includes(field)}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {formData.fields.length > 0 && (
              <div className="selected-fields">
                {formData.fields.map(field => (
                  <span key={field} className="field-tag">
                    {field}
                    <button
                      type="button"
                      onClick={() => removeField(field)}
                      className="field-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📅</span>
            Additional Information
          </h3>

          <div className="form-group">
            <label htmlFor="timeline">Project Timeline</label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              placeholder="e.g., 6 months, 1 year, ongoing"
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
              placeholder="Describe available funding, equipment, data, or other resources..."
              rows={2}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ethicalConsiderations">Ethical Considerations</label>
            <textarea
              id="ethicalConsiderations"
              name="ethicalConsiderations"
              value={formData.ethicalConsiderations}
              onChange={handleInputChange}
              placeholder="Any ethical considerations, IRB requirements, or compliance issues..."
              rows={2}
              className="form-control"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Research...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Post Research Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResearchForm;