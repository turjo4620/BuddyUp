import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  // Simple state management without auth context initially
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('buddyup_token') || sessionStorage.getItem('buddyup_token');
    const userId = localStorage.getItem('currentUserId');
    
    if (token && userId) {
      setIsAuthenticated(true);
      setUser({ _id: userId, name: localStorage.getItem('userName') || 'User' });
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (loginMessage) setLoginMessage('');
  };

  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginMessage('');

    if (!loginData.username.trim() || !loginData.password) {
      setLoginMessage('Please enter both username and password');
      setIsLoggingIn(false);
      return;
    }

    try {
      // Try to import and use the login function
      const { login } = await import('../api/api');
      const result = await login(loginData.username.trim(), loginData.password);
      
      if (result && result.success) {
        setLoginMessage('Login successful! Redirecting...');
        localStorage.setItem('buddyup_token', result.token);
        localStorage.setItem('currentUserId', result.profile._id);
        localStorage.setItem('userName', result.profile.name);
        
        setUser(result.profile);
        setIsAuthenticated(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setLoginMessage(result?.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Login failed. Please check if the backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTestAPI = async () => {
    console.log('🧪 Running API tests...');
    try {
      const { runAPITests } = await import('../utils/apiTest');
      await runAPITests();
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  // If user is authenticated, show welcome message
  if (isAuthenticated && user) {
    return (
      <div className="container">
        <div className="hero">
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>
            Ready to continue your project journey? Check your dashboard for updates 
            or explore new projects to join.
          </p>
          
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/project/create" className="btn btn-secondary">
              Create New Project
            </Link>
            <Link to="/projects" className="btn btn-success">
              Explore Projects
            </Link>
            <Link to="/ai-help" className="btn btn-primary">
              AI Guidance
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          <div className="card">
            <h3>🎯 Find Your Team</h3>
            <p>
              Discover projects that match your skills and interests. 
              Our smart matching algorithm connects you with the right opportunities.
            </p>
          </div>

          <div className="card">
            <h3>🚀 Start Your Project</h3>
            <p>
              Have a great idea? Create a project proposal and find talented 
              teammates who can help bring your vision to life.
            </p>
          </div>

          <div className="card">
            <h3>🤖 AI-Powered Guidance</h3>
            <p>
              Get personalized advice on project planning, research direction, 
              skill development, and team collaboration strategies.
            </p>
          </div>

          <div className="card">
            <h3>📚 Academic Focus</h3>
            <p>
              Built specifically for students and researchers. Whether it's coursework, 
              research projects, or hackathons - find your perfect collaborators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form for non-authenticated users
  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to BuddyUp</h1>
        <p>
          Find the perfect teammates for your projects and research work. 
          Connect with students who share your interests and complement your skills.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginTop: '3rem' }}>
        
        {/* Login Section */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h2>
          
          {loginMessage && (
            <div className={`alert ${loginMessage.includes('successful') ? 'alert-success' : 'alert-error'}`}>
              {loginMessage}
            </div>
          )}

          <form onSubmit={handleQuickLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !loginData.username.trim() || !loginData.password}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Don't have an account?
            </p>
            <Link to="/register" className="btn btn-success" style={{ width: '100%' }}>
              Create Profile
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Get Started</h2>
          <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>
            New to BuddyUp? Explore what you can do or create your profile to get started.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary">
              Create Your Profile
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              Browse Projects
            </Link>
            <Link to="/ai-help" className="btn btn-success">
              Get AI Guidance
            </Link>
            <button onClick={handleTestAPI} className="btn btn-secondary">
              🧪 Test APIs
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div className="card">
          <h3>🎯 Find Your Team</h3>
          <p>
            Discover projects that match your skills and interests. 
            Our smart matching algorithm connects you with the right opportunities.
          </p>
        </div>

        <div className="card">
          <h3>🚀 Start Your Project</h3>
          <p>
            Have a great idea? Create a project proposal and find talented 
            teammates who can help bring your vision to life.
          </p>
        </div>

        <div className="card">
          <h3>🤖 AI-Powered Guidance</h3>
          <p>
            Get personalized advice on project planning, research direction, 
            skill development, and team collaboration strategies.
          </p>
        </div>

        <div className="card">
          <h3>📚 Academic Focus</h3>
          <p>
            Built specifically for students and researchers. Whether it's coursework, 
            research projects, or hackathons - find your perfect collaborators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;