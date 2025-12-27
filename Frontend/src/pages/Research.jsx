import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getResearches, createResearch, sendResearchJoinRequest } from '../api/api';
import ResearchCard from '../components/ResearchCard';
import ResearchForm from '../components/ResearchForm';
import ResearchPaperLibrary from '../components/ResearchPaperLibrary';
import ResearchFilters from '../components/ResearchFilters';

const Research = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('browse'); // browse, create, library, myResearch
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    skill: '',
    category: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    if (activeTab === 'browse' || activeTab === 'myResearch') {
      fetchResearches();
    }
  }, [filters, activeTab]);

  const fetchResearches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = activeTab === 'myResearch' && user 
        ? { ...filters, researcher: user._id }
        : filters;
        
      const response = await getResearches(searchFilters);
      
      if (response && response.success) {
        setResearches(response.data || []);
      } else {
        setResearches([]);
      }
    } catch (err) {
      console.error('Error fetching researches:', err);
      setError(err.message || 'Failed to load research projects');
      setResearches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResearch = async (researchData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createResearch(researchData);
      
      if (response && response.success) {
        setSuccess('Research project created successfully!');
        setActiveTab('browse');
        fetchResearches();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response?.message || 'Failed to create research project');
      }
    } catch (err) {
      console.error('Error creating research:', err);
      setError(err.message || 'Failed to create research project');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinResearch = async (researchId, message = '') => {
    if (!isAuthenticated || !user) {
      setError('Please log in to join research projects');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await sendResearchJoinRequest({
        researchId,
        studentId: user._id,
        message
      });
      
      if (response && response.success) {
        setSuccess('Join request sent successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response?.message || 'Failed to send join request');
      }
    } catch (err) {
      console.error('Error joining research:', err);
      setError(err.message || 'Failed to send join request');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const tabs = [
    { id: 'browse', label: '🔍 Browse Research', icon: '🔬' },
    { id: 'library', label: '📚 Paper Library', icon: '📖' },
    ...(isAuthenticated ? [
      { id: 'create', label: '➕ Post Research', icon: '✨' },
      { id: 'myResearch', label: '👤 My Research', icon: '🎯' }
    ] : [])
  ];

  return (
    <div className="research-container">
      {/* Header */}
      <div className="research-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="research-title">
                🔬 Research Hub
              </h1>
              <p className="research-subtitle">
                Discover groundbreaking research, collaborate with brilliant minds, and advance knowledge together
              </p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{researches.length}</span>
                <span className="stat-label">Active Research</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Papers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1.2K</span>
                <span className="stat-label">Researchers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="research-nav">
        <div className="container">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  clearMessages();
                }}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className="container">
          <div className="messages">
            {error && (
              <div className="message error">
                <span className="message-icon">⚠️</span>
                <span className="message-text">{error}</span>
                <button onClick={clearMessages} className="message-close">×</button>
              </div>
            )}
            {success && (
              <div className="message success">
                <span className="message-icon">✅</span>
                <span className="message-text">{success}</span>
                <button onClick={clearMessages} className="message-close">×</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="research-content">
        <div className="container">
          {activeTab === 'browse' && (
            <div className="browse-section">
              <ResearchFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
              
              <div className="research-grid">
                {loading ? (
                  <div className="loading-grid">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="research-card-skeleton">
                        <div className="skeleton-header"></div>
                        <div className="skeleton-content">
                          <div className="skeleton-line"></div>
                          <div className="skeleton-line short"></div>
                        </div>
                        <div className="skeleton-footer"></div>
                      </div>
                    ))}
                  </div>
                ) : researches.length > 0 ? (
                  researches.map(research => (
                    <ResearchCard
                      key={research._id}
                      research={research}
                      onJoin={handleJoinResearch}
                      currentUser={user}
                      loading={loading}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🔬</div>
                    <h3>No Research Projects Found</h3>
                    <p>Be the first to share your research and inspire collaboration!</p>
                    {isAuthenticated && (
                      <button 
                        onClick={() => setActiveTab('create')}
                        className="btn btn-primary"
                      >
                        Create Research Project
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'create' && isAuthenticated && (
            <div className="create-section">
              <ResearchForm 
                onSubmit={handleCreateResearch}
                loading={loading}
                user={user}
              />
            </div>
          )}

          {activeTab === 'library' && (
            <div className="library-section">
              <ResearchPaperLibrary />
            </div>
          )}

          {activeTab === 'myResearch' && isAuthenticated && (
            <div className="my-research-section">
              <div className="section-header">
                <h2>My Research Projects</h2>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="btn btn-primary"
                >
                  Create New Research
                </button>
              </div>
              
              <div className="research-grid">
                {loading ? (
                  <div className="loading-grid">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="research-card-skeleton">
                        <div className="skeleton-header"></div>
                        <div className="skeleton-content">
                          <div className="skeleton-line"></div>
                          <div className="skeleton-line short"></div>
                        </div>
                        <div className="skeleton-footer"></div>
                      </div>
                    ))}
                  </div>
                ) : researches.length > 0 ? (
                  researches.map(research => (
                    <ResearchCard
                      key={research._id}
                      research={research}
                      onJoin={handleJoinResearch}
                      currentUser={user}
                      isOwner={true}
                      loading={loading}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Research Projects Yet</h3>
                    <p>Start your research journey by creating your first project!</p>
                    <button 
                      onClick={() => setActiveTab('create')}
                      className="btn btn-primary"
                    >
                      Create Your First Research
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {isAuthenticated && activeTab === 'browse' && (
        <button 
          className="fab"
          onClick={() => setActiveTab('create')}
          title="Create Research Project"
        >
          ➕
        </button>
      )}
    </div>
  );
};

export default Research;