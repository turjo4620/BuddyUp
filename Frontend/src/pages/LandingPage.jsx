import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingPageHeader from '../components/LandingPageHeader';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleCreateProfile = () => {
    if (isAuthenticated) {
      navigate('/project/create');
    } else {
      navigate('/register');
    }
  };

  // Content for authenticated users
  if (isAuthenticated) {
    return (
      <div className="landing-page">
        <LandingPageHeader />
        
        {/* Hero Section for Authenticated Users */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="animated-blob blob-1"></div>
            <div className="animated-blob blob-2"></div>
            <div className="animated-blob blob-3"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Welcome back, {user?.name || 'Student'}! 👋</h1>
              <p className="hero-subtitle">
                Ready to continue your project journey? Explore new opportunities, 
                check your dashboard for updates, or start a new collaboration.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </button>
                <button className="btn-secondary" onClick={() => navigate('/project/create')}>
                  Create Project
                </button>
              </div>
            </div>
            
            <div className="hero-illustration">
              <div className="student-icons">
                <div className="student-icon student-1">👩‍💻</div>
                <div className="student-icon student-2">👨‍🔬</div>
                <div className="student-icon student-3">👩‍🎓</div>
                <div className="connection-lines">
                  <div className="line line-1"></div>
                  <div className="line line-2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section for Authenticated Users */}
        <section className="features-section">
          <div className="container">
            <div className="features-grid">
              <div className="feature-card" onClick={() => navigate('/projects/browse')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">🔍</div>
                <h3>Browse Projects</h3>
                <p>Discover new projects that match your skills and interests</p>
              </div>
              
              <div className="feature-card" onClick={() => navigate('/research/browse')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">🔬</div>
                <h3>Explore Research</h3>
                <p>Find research opportunities and academic collaborations</p>
              </div>
              
              <div className="feature-card" onClick={() => navigate('/ai-help')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">🤖</div>
                <h3>AI Guidance</h3>
                <p>Get personalized advice for your projects and collaborations</p>
              </div>
              
              <div className="feature-card" onClick={() => navigate('/project/create')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">🚀</div>
                <h3>Start New Project</h3>
                <p>Create a project and find the perfect teammates</p>
              </div>

              <div className="feature-card" onClick={() => navigate('/research/create')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📊</div>
                <h3>Create Research</h3>
                <p>Start a research project and collaborate with peers</p>
              </div>

              <div className="feature-card" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                <div className="feature-icon">📋</div>
                <h3>My Dashboard</h3>
                <p>Manage your projects, requests, and collaborations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Motivation Section */}
        <section className="trust-section">
          <div className="container">
            <div className="trust-content">
              <div className="trust-divider"></div>
              <p className="trust-message">
                Your next great collaboration is just a click away. 
                Keep building, keep connecting, keep growing.
              </p>
              <div className="trust-divider"></div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <span className="logo-text">BuddyUp</span>
                <span className="logo-emoji">🤝</span>
              </div>
              <p className="footer-text">
                Connecting students for better collaboration and academic success.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  // Content for non-authenticated users (original landing page)
  return (
    <div className="landing-page">
      <LandingPageHeader />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="animated-blob blob-1"></div>
          <div className="animated-blob blob-2"></div>
          <div className="animated-blob blob-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Are you working alone?</h1>
            <p className="hero-subtitle">
              Do you want to work on projects or research but can't find the right teammate? 
              BuddyUp connects you with students who share your skills, interests, and goals.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
              <button className="btn-secondary" onClick={handleSignIn}>Sign In</button>
            </div>
          </div>
          
          <div className="hero-illustration">
            <div className="student-icons">
              <div className="student-icon student-1">👩‍💻</div>
              <div className="student-icon student-2">👨‍🔬</div>
              <div className="student-icon student-3">👩‍🎓</div>
              <div className="connection-lines">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Find Teammates Instantly</h3>
              <p>Skill-based matching for projects and research collaboration</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Research Collaboration</h3>
              <p>Connect with students who want to work on academic research</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Guidance</h3>
              <p>Get team-building suggestions and collaborative project advice</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Built for Students</h3>
              <p>Designed for meaningful student collaboration</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Project Matching</h3>
              <p>Find projects where your skills complement other students'</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Join Request Management</h3>
              <p>Send, receive, and track collaboration requests easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-divider"></div>
            <p className="trust-message">
              Many students have ideas, passion, and skills — but no team. 
              BuddyUp exists to solve that.
            </p>
            <div className="trust-divider"></div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Start your journey with the right people.</h2>
            <button className="btn-cta" onClick={handleCreateProfile}>Create Your Profile</button>
            <p className="cta-subtitle">It's free and made for students.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">BuddyUp</span>
              <span className="logo-emoji">🤝</span>
            </div>
            <p className="footer-text">
              Connecting students for better collaboration and academic success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;