import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ResearchFeedCard from '../components/ResearchFeedCard';
import ResearchFilters from '../components/ResearchFilters';
import { getResearches } from '../api/api';
import { getMockResearchData } from '../data/sampleResearchData';
import './BrowseResearch.css';

const BrowseResearch = () => {
  const { user, isAuthenticated } = useAuth();
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    field: '',
    status: '',
    skills: '',
    university: '',
    level: '',
    sort: 'newest',
    page: 1
  });
  const [totalResearch, setTotalResearch] = useState(0);

  useEffect(() => {
    fetchResearch();
  }, [filters]);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      // Use mock data for demo purposes
      const response = getMockResearchData(filters);
      setResearch(response.data || []);
      setTotalResearch(response.total || response.data?.length || 0);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch research opportunities');
      setResearch([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
  };

  const handleJoinRequest = async (researchId, message) => {
    try {
      // API call to join research
      await fetchResearch(); // Refresh the list
    } catch (error) {
      console.error('Error joining research:', error);
      throw error;
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      field: '',
      status: '',
      skills: '',
      university: '',
      level: '',
      sort: 'newest',
      page: 1
    });
  };

  const hasActiveFilters = () => {
    return filters.search || filters.field || filters.status || 
           filters.skills || filters.university || filters.level;
  };

  if (loading && research.length === 0) {
    return (
      <div className="browse-research-page">
        <div className="research-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Discovering research opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-research-page">
      {/* Header Section */}
      <div className="research-hero">
        <div className="research-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Explore Research Opportunities
              </h1>
              <p className="hero-subtitle">
                Discover ongoing research, thesis topics, and academic collaborations 
                from students and supervisors across universities.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{totalResearch}</span>
                  <span className="stat-label">Active Research</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {research.filter(r => r.status === 'Open for Collaboration').length}
                  </span>
                  <span className="stat-label">Open Positions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {new Set(research.flatMap(r => r.fields || [])).size}
                  </span>
                  <span className="stat-label">Research Fields</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-icon">🔬</div>
            </div>
          </div>
        </div>
      </div>

      <div className="research-container">
        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="auth-notice">
            <div className="notice-content">
              <span className="notice-icon">🎓</span>
              <div className="notice-text">
                <strong>Ready to join research?</strong>
                <p>
                  <a href="/login" className="notice-link">Sign in</a> or 
                  <a href="/register" className="notice-link">create your profile</a> to collaborate with researchers and join academic projects.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="research-header">
          <div className="search-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by topic, domain, or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="search-input"
              />
            </div>
            <ResearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              loading={loading}
              hasActiveFilters={hasActiveFilters()}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span className="results-count">
            {loading ? 'Loading...' : `${research.length} research opportunit${research.length !== 1 ? 'ies' : 'y'} found`}
          </span>
          {hasActiveFilters() && (
            <button 
              onClick={handleClearFilters}
              className="clear-filters-btn"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* AI Suggestion Banner */}
        {isAuthenticated && research.length > 0 && (
          <div className="ai-suggestion-banner">
            <span className="ai-icon">🤖</span>
            <span className="ai-text">
              AI suggests research based on your interests and skills
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchResearch} className="retry-btn">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Research Feed */}
        {!error && (
          <>
            {research.length === 0 && !loading ? (
              <div className="empty-state">
                <div className="empty-content">
                  <div className="empty-icon">🔍</div>
                  <h3>No research opportunities match your current filters</h3>
                  <p>
                    Try adjusting your search criteria or explore different fields. 
                    New research opportunities are added regularly!
                  </p>
                  {hasActiveFilters() && (
                    <button onClick={handleClearFilters} className="clear-filters-btn primary">
                      Clear Filters & Show All
                    </button>
                  )}
                  {isAuthenticated && (
                    <a href="/research/create" className="create-research-btn">
                      <span className="btn-icon">+</span>
                      Post Your Research
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="research-feed">
                {research.map((researchItem) => (
                  <ResearchFeedCard
                    key={researchItem._id}
                    research={researchItem}
                    onJoinRequest={handleJoinRequest}
                    currentUser={user}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Load More */}
        {research.length > 0 && !loading && (
          <div className="pagination-section">
            <button className="load-more-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Load More Research'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseResearch;