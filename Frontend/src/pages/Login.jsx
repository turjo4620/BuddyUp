import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Basic validation
    if (!formData.username.trim() || !formData.password) {
      setMessage('Please enter both username and password');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.username.trim(), formData.password, rememberMe);
      
      if (result.success) {
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Welcome Back to BuddyUp</h1>
          <p style={{ color: '#666' }}>Sign in to find your perfect project teammates</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '0.875rem'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.username.trim() || !formData.password}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#3498db', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Create Profile
            </Link>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#666', 
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;