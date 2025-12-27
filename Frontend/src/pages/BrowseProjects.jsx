import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EnhancedProjectCard from '../components/EnhancedProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import { getProjects } from '../api/api';
import './BrowseProjects.css';

const BrowseProjects = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    skills: '',
    sort: 'newest',
    page: 1
  });
  const [viewMode, setViewMode] = useState('grid');
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects(filters);
      setProjects(response.data || []);
      setTotalProjects(response.total || response.data?.length || 0);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      setProjects([]);
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

  const handleJoinRequest = (projectId) => {
    fetchProjects();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      skills: '',
      sort: 'newest',
      page: 1
    });
  };

  const hasActiveFilters = () => {
    return filters.search || filters.status || filters.category || filters.skills;
  };

  const getFilteredProjectsCount = () => {
    return projects.length;
  };

  if (loading && projects.length === 0) {
    return (
      <div className="browse-projects-page">
        <div className="browse-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Discovering amazing projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-projects-page">
      <div className="browse-hero">
        <div className="browse-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Explore Projects & Research Opportunities
              </h1>
              <p className="hero-subtitle">
                Find projects and teammates that match your skills and interests. 
                Join collaborative teams and build something amazing together.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{totalProjects}</span>
                  <span className="stat-label">Active Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{projects.filter(p => p.status === 'Looking for members').length}</span>
                  <span className="stat-label">Open Positions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{new Set(projects.flatMap(p => p.requiredSkills || [])).size}</span>
                  <span className="stat-label">Skills Needed</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-icon">🚀</div>
            </div>
          </div>
        </div>
      </div>

      <div className="browse-container">
        {!isAuthenticated && (
          <div className="auth-notice">
            <div className="notice-content">
              <span className="notice-icon">💡</span>
              <div className="notice-text">
                <strong>Ready to join a project?</strong>
                <p>
                  <a href="/login" className="notice-link">Sign in</a> or 
                  <a href="/register" className="notice-link">create your profile</a> to send join requests and connect with teams.
                </p>
              </div>
            </div>
          </div>
        )}

        <ProjectFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          loading={loading}
          hasActiveFilters={hasActiveFilters()}
          totalResults={getFilteredProjectsCount()}
        />

        <div className="view-controls">
          <div className="results-info">
            <span className="results-count">
              {loading ? 'Loading...' : `${getFilteredProjectsCount()} project${getFilteredProjectsCount() !== 1 ? 's' : ''} found`}
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
          
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid view"
            >
              <span className="view-icon">⊞</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List view"
            >
              <span className="view-icon">☰</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="error-state">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <div className="error-text">
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchProjects} className="retry-btn">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {!error && (
          <>
            {projects.length === 0 && !loading ? (
              <div className="empty-state">
                <div className="empty-content">
                  <div className="empty-icon">🔍</div>
                  <h3>No projects match your current filters</h3>
                  <p>
                    Try adjusting your search criteria or explore different categories. 
                    New projects are added regularly!
                  </p>
                  {hasActiveFilters() && (
                    <button onClick={handleClearFilters} className="clear-filters-btn primary">
                      Clear Filters & Show All
                    </button>
                  )}
                  {isAuthenticated && (
                    <a href="/project/create" className="create-project-btn">
                      <span className="btn-icon">+</span>
                      Create Your First Project
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className={`projects-container ${viewMode}`}>
                {projects.map((project) => (
                  <EnhancedProjectCard
                    key={project._id}
                    project={project}
                    onJoinRequest={handleJoinRequest}
                    currentUserId={user?._id}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {projects.length > 0 && !loading && (
          <div className="pagination-section">
            <button className="load-more-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Load More Projects'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProjects;