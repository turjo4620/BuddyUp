import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Dropdown states
  const [exploreOpen, setExploreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Refs for dropdown positioning
  const exploreRef = useRef(null);
  const createRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setExploreOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target)) {
        setCreateOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setExploreOpen(false);
    setCreateOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if current path matches
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🤝</span>
            <span className="brand-text">BuddyUp</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="navbar-nav">
          {isAuthenticated ? (
            // Authenticated Navigation
            <>
              {/* Home */}
              <Link 
                to="/" 
                className={`nav-item ${isActivePath('/') || isActivePath('/home') ? 'active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </Link>

              {/* Explore Dropdown */}
              <div className="nav-dropdown" ref={exploreRef}>
                <button
                  className={`nav-item dropdown-trigger ${exploreOpen ? 'active' : ''} ${(isActivePath('/projects/browse') || isActivePath('/research/browse')) ? 'active' : ''}`}
                  onClick={() => setExploreOpen(!exploreOpen)}
                >
                  <span className="nav-icon">🔍</span>
                  <span className="nav-text">Explore</span>
                  <span className={`dropdown-arrow ${exploreOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {exploreOpen && (
                  <div className="dropdown-menu">
                    <Link to="/projects/browse" className="dropdown-item">
                      <span className="dropdown-icon">🚀</span>
                      <div className="dropdown-content">
                        <span className="dropdown-title">Browse Projects</span>
                        <span className="dropdown-subtitle">Find collaborative projects</span>
                      </div>
                    </Link>
                    <Link to="/research/browse" className="dropdown-item">
                      <span className="dropdown-icon">🔬</span>
                      <div className="dropdown-content">
                        <span className="dropdown-title">Browse Research</span>
                        <span className="dropdown-subtitle">Discover research opportunities</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Create Dropdown */}
              <div className="nav-dropdown" ref={createRef}>
                <button
                  className={`nav-item dropdown-trigger ${createOpen ? 'active' : ''} ${isActivePath('/project/create') ? 'active' : ''}`}
                  onClick={() => setCreateOpen(!createOpen)}
                >
                  <span className="nav-icon">➕</span>
                  <span className="nav-text">Create</span>
                  <span className={`dropdown-arrow ${createOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {createOpen && (
                  <div className="dropdown-menu create-menu">
                    <div className="create-header">
                      <h3>What do you want to create?</h3>
                      <p>Choose the type of collaboration that fits your goals</p>
                    </div>
                    
                    <Link to="/project/create" className="create-option project-option">
                      <div className="option-icon">🚀</div>
                      <div className="option-content">
                        <h4 className="option-title">Create Project</h4>
                        <p className="option-description">Build apps, software, games, or startup ideas with the right teammates.</p>
                        <div className="option-tags">
                          <span className="tag">Practical</span>
                          <span className="tag">Build</span>
                          <span className="tag">Launch</span>
                        </div>
                      </div>
                      <div className="option-arrow">→</div>
                    </Link>
                    
                    <Link to="/research/create" className="create-option research-option">
                      <div className="option-icon">🔬</div>
                      <div className="option-content">
                        <h4 className="option-title">Create Research</h4>
                        <p className="option-description">Collaborate on academic research, studies, or thesis-related work.</p>
                        <div className="option-tags">
                          <span className="tag">Academic</span>
                          <span className="tag">Study</span>
                          <span className="tag">Publish</span>
                        </div>
                      </div>
                      <div className="option-arrow">→</div>
                    </Link>
                  </div>
                )}
              </div>

              {/* AI */}
              <Link 
                to="/ai-help" 
                className={`nav-item ${isActivePath('/ai-help') ? 'active' : ''}`}
              >
                <span className="nav-icon">🤖</span>
                <span className="nav-text">AI</span>
              </Link>

              {/* Profile Dropdown */}
              <div className="nav-dropdown profile-dropdown" ref={profileRef}>
                <button
                  className={`nav-item dropdown-trigger profile-trigger ${profileOpen ? 'active' : ''}`}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="profile-avatar">
                    {getUserInitials()}
                  </div>
                  <span className={`dropdown-arrow ${profileOpen ? 'open' : ''}`}>▼</span>
                </button>
                
                {profileOpen && (
                  <div className="dropdown-menu profile-menu">
                    <div className="profile-header">
                      <div className="profile-avatar large">
                        {getUserInitials()}
                      </div>
                      <div className="profile-info">
                        <span className="profile-name">Welcome, {user?.name || 'User'}</span>
                        <span className="profile-email">{user?.email}</span>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to="/dashboard" className="dropdown-item">
                      <span className="dropdown-icon">📊</span>
                      <div className="dropdown-content">
                        <span className="dropdown-title">Dashboard</span>
                        <span className="dropdown-subtitle">View your activity</span>
                      </div>
                    </Link>
                    
                    <Link to="/profile/settings" className="dropdown-item">
                      <span className="dropdown-icon">⚙️</span>
                      <div className="dropdown-content">
                        <span className="dropdown-title">Settings</span>
                        <span className="dropdown-subtitle">Manage your account</span>
                      </div>
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <span className="dropdown-icon">🚪</span>
                      <div className="dropdown-content">
                        <span className="dropdown-title">Sign Out</span>
                        <span className="dropdown-subtitle">Logout from BuddyUp</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Non-authenticated Navigation
            <>
              <Link 
                to="/projects/browse" 
                className={`nav-item ${isActivePath('/projects/browse') ? 'active' : ''}`}
              >
                <span className="nav-icon">🚀</span>
                <span className="nav-text">Browse Projects</span>
              </Link>
              
              <Link 
                to="/research/browse" 
                className={`nav-item ${isActivePath('/research/browse') ? 'active' : ''}`}
              >
                <span className="nav-icon">🔬</span>
                <span className="nav-text">Browse Research</span>
              </Link>
              
              <Link 
                to="/ai-help" 
                className={`nav-item ${isActivePath('/ai-help') ? 'active' : ''}`}
              >
                <span className="nav-icon">🤖</span>
                <span className="nav-text">AI Help</span>
              </Link>
              
              <Link to="/login" className="nav-item signin-btn">
                <span className="nav-text">Sign In</span>
              </Link>
              
              <Link to="/register" className="nav-item signup-btn">
                <span className="nav-text">Join BuddyUp</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;