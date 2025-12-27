import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPageHeader.css';

const LandingPageHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">BuddyUp</span>
          <span className="logo-emoji">🤝</span>
        </div>
        
        <nav className="header-nav">
          <button 
            className="nav-link"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
          <button 
            className="nav-btn-primary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
};

export default LandingPageHeader;