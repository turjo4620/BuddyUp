import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../api/api';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    academicYear: '',
    skills: '',
    projectInterests: '',
    email: '',
    bio: ''
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

    try {
      // Convert comma-separated strings to arrays
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        projectInterests: formData.projectInterests.split(',').map(interest => interest.trim()).filter(interest => interest)
      };

      // Remove empty optional fields
      if (!profileData.email) delete profileData.email;
      if (!profileData.bio) delete profileData.bio;

      const response = await createProfile(profileData);
      
      setMessage('Profile created successfully!');
      
      // Store profile ID in localStorage for demo purposes
      localStorage.setItem('currentUserId', response.data._id);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setMessage(error.message || 'Failed to create profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Your Profile</h2>
        
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science, Biology, Engineering"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="academicYear">Academic Year *</label>
            <select
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
            >
              <option value="">Select Academic Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills * (comma-separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, Python, Data Analysis, Research"
              required
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Enter your skills separated by commas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="projectInterests">Project/Research Interests * (comma-separated)</label>
            <input
              type="text"
              id="projectInterests"
              name="projectInterests"
              value={formData.projectInterests}
              onChange={handleChange}
              placeholder="e.g., Web Development, AI/ML, Mobile Apps, Research"
              required
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              Enter your interests separated by commas
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@university.edu"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio (optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others about yourself, your experience, and what you're looking for in a project..."
              maxLength="500"
            />
            <small style={{ color: '#666', fontSize: '0.875rem' }}>
              {formData.bio.length}/500 characters
            </small>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;