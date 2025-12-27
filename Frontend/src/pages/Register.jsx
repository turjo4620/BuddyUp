import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkUsernameAvailability } from '../api/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ 
    checking: false, 
    available: null, 
    message: '' 
  });
  const [passwordStrength, setPasswordStrength] = useState({ 
    score: 0, 
    message: '' 
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length >= 3) {
        setUsernameStatus({ 
          checking: true, 
          available: null, 
          message: 'Checking...' 
        });
        
        try {
          const response = await checkUsernameAvailability(formData.username);
          setUsernameStatus({
            checking: false,
            available: response.available,
            message: response.message
          });
        } catch (error) {
          setUsernameStatus({
            checking: false,
            available: null,
            message: 'Unable to check username'
          });
        }
      } else if (formData.username.length > 0) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: 'Username must be at least 3 characters'
        });
      } else {
        setUsernameStatus({ checking: false, available: null, message: '' });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // Check password strength
  useEffect(() => {
    const checkPasswordStrength = () => {
      const password = formData.password;
      if (password.length === 0) {
        setPasswordStrength({ score: 0, message: '' });
        return;
      }

      let score = 0;
      let message = '';

      if (password.length >= 6) score += 1;
      if (password.length >= 8) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      if (score < 2) message = 'Weak password';
      else if (score < 4) message = 'Fair password';
      else if (score < 5) message = 'Good password';
      else message = 'Strong password';

      setPasswordStrength({ score, message });
    };

    checkPasswordStrength();
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (formData.username.length < 3) return 'Username must be at least 3 characters';
    if (!usernameStatus.available) return 'Username is not available';
    
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    
    if (!formData.name.trim()) return 'Full name is required';
    if (!formData.department.trim()) return 'Department is required';
    if (!formData.academicYear) return 'Academic year is required';
    if (!formData.skills.trim()) return 'At least one skill is required';
    if (!formData.projectInterests.trim()) return 'At least one project interest is required';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const registrationData = {
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        department: formData.department.trim(),
        academicYear: formData.academicYear,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        projectInterests: formData.projectInterests.split(',').map(interest => interest.trim()),
        email: formData.email.trim() || undefined,
        bio: formData.bio.trim() || undefined
      };

      const result = await register(registrationData);
    
      if (result.success) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-form-wrapper">
            <div className="loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const isFormValid = validateForm() === null && usernameStatus.available;

  return (
    <div className="register-page">
      {/* Background elements */}
      <div className="register-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div className="register-container">
        <div className="register-form-wrapper">
          {/* Hero Section */}
          <div className="register-header">
            <h1>Join BuddyUp</h1>
            <p>Connect with peers and collaborate on amazing projects</p>
          </div>

          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                autoComplete="username"
                required
                className="form-input"
              />
              {usernameStatus.message && (
                <small className={`helper-text ${
                  usernameStatus.available === true ? 'success' : 
                  usernameStatus.available === false ? 'error' : 
                  usernameStatus.checking ? 'info' : ''
                }`}>
                  {usernameStatus.checking ? '🔍 ' : 
                   usernameStatus.available === true ? '✅ ' : 
                   usernameStatus.available === false ? '❌ ' : ''}
                  {usernameStatus.message}
                </small>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password (min 6 characters)"
                  autoComplete="new-password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
              {passwordStrength.message && (
                <small className={`helper-text password-strength ${
                  passwordStrength.score < 2 ? 'error' : 
                  passwordStrength.score < 4 ? 'warning' : 'success'
                }`}>
                  {passwordStrength.message}
                </small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                className="form-input"
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science, Engineering"
                required
                className="form-input"
              />
            </div>

            {/* Academic Year */}
            <div className="form-group">
              <label htmlFor="academicYear">Academic Year *</label>
              <select
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select your academic year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label htmlFor="skills">Skills *</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="List your skills (comma-separated): JavaScript, Python, React, etc."
                required
                className="form-input"
                rows="3"
              />
            </div>

            {/* Project Interests */}
            <div className="form-group">
              <label htmlFor="projectInterests">Project Interests *</label>
              <textarea
                id="projectInterests"
                name="projectInterests"
                value={formData.projectInterests}
                onChange={handleChange}
                placeholder="What types of projects interest you? (comma-separated): Web Development, AI/ML, Mobile Apps, etc."
                required
                className="form-input"
                rows="3"
              />
            </div>

            {/* Bio */}
            <div className="form-group">
              <label htmlFor="bio">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself..."
                className="form-input"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="auth-link">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;