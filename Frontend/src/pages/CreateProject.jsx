import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/api';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    teamSize: '',
    category: '',
    duration: '',
    timeCommitment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
      setMessage('Please create a profile first before creating a project');
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert comma-separated skills to array
      const projectData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
        teamSize: parseInt(formData.teamSize),
        owner: currentUserId
      };

      // Remove empty optional fields
      if (!projectData.category) delete projectData.category;
      if (!projectData.duration) delete projectData.duration;
      if (!projectData.timeCommitment) delete projectData.timeCommitment;

      await createProject(projectData);
      
      setMessage('Project created successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setMessage(error.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Project/Research Proposal</h2>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a clear, descriptive title for your project"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project goals, what you want to build, and what you hope to achieve..."
              required
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="requiredSkills">Required Skills * (comma-separated)</label>
            <input
              type="text"
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, Python, UI/UX Design, Data Analysis"
              required
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              List the skills needed for this project, separated by commas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="teamSize">Team Size *</label>
            <input
              type="number"
              id="teamSize"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              min="2"
              max="20"
              placeholder="How many people do you need (including yourself)?"
              required
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Total team size including yourself (2-20 members)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category (optional)</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Research">Research</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Expected Duration (optional)</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              <option value="">Select Duration</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2-3 months">2-3 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeCommitment">Time Commitment (optional)</label>
            <select
              id="timeCommitment"
              name="timeCommitment"
              value={formData.timeCommitment}
              onChange={handleChange}
            >
              <option value="">Select Time Commitment</option>
              <option value="5-10 hours/week">5-10 hours/week</option>
              <option value="10-20 hours/week">10-20 hours/week</option>
              <option value="20+ hours/week">20+ hours/week</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;