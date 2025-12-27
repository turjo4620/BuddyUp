import React, { useState } from 'react';
import './ResearchFilters.css';

const ResearchFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  loading, 
  hasActiveFilters 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const researchFields = [
    'Computer Science',
    'Engineering',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Psychology',
    'Business',
    'Medicine',
    'Data Science',
    'AI & Machine Learning',
    'Biotechnology',
    'Environmental Science',
    'Social Sciences'
  ];

  const statusOptions = [
    'Open for Collaboration',
    'Ongoing',
    'Completed',
    'On Hold'
  ];

  const levelOptions = [
    'Undergraduate',
    'Masters',
    'PhD',
    'Postdoc'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'team-size', label: 'Team Size' },
    { value: 'skill-match', label: 'Best Skill Match' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.field) count++;
    if (filters.status) count++;
    if (filters.skills) count++;
    if (filters.university) count++;
    if (filters.level) count++;
    return count;
  };

  return (
    <div className="research-filters">
      <div className="filters-header">
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="filter-icon">🎯</span>
          <span className="filter-text">Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="filter-count">{getActiveFilterCount()}</span>
          )}
          <span className={`chevron ${showFilters ? 'up' : 'down'}`}>
            {showFilters ? '▲' : '▼'}
          </span>
        </button>

        <div className="sort-section">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="sort-select"
            disabled={loading}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Research Field Filter */}
            <div className="filter-group">
              <label htmlFor="field-select" className="filter-label">
                <span className="label-icon">📚</span>
                Research Field
              </label>
              <select
                id="field-select"
                value={filters.field}
                onChange={(e) => handleFilterChange('field', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Fields</option>
                {researchFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label htmlFor="status-select" className="filter-label">
                <span className="label-icon">🔄</span>
                Status
              </label>
              <select
                id="status-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="filter-group">
              <label htmlFor="level-select" className="filter-label">
                <span className="label-icon">🎓</span>
                Academic Level
              </label>
              <select
                id="level-select"
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Levels</option>
                {levelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* University Filter */}
            <div className="filter-group">
              <label htmlFor="university-input" className="filter-label">
                <span className="label-icon">🏛️</span>
                University
              </label>
              <input
                id="university-input"
                type="text"
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
                placeholder="Enter university name..."
                className="filter-input"
                disabled={loading}
              />
            </div>

            {/* Skills Filter */}
            <div className="filter-group">
              <label htmlFor="skills-input" className="filter-label">
                <span className="label-icon">⚡</span>
                Required Skills
              </label>
              <input
                id="skills-input"
                type="text"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                placeholder="e.g., Python, Machine Learning..."
                className="filter-input"
                disabled={loading}
              />
            </div>

            {/* Year/Duration Filter */}
            <div className="filter-group">
              <label htmlFor="duration-select" className="filter-label">
                <span className="label-icon">⏱️</span>
                Duration
              </label>
              <select
                id="duration-select"
                value={filters.duration || ''}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">Any Duration</option>
                <option value="short-term">Short-term (1-3 months)</option>
                <option value="medium-term">Medium-term (3-6 months)</option>
                <option value="long-term">Long-term (6+ months)</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="filters-actions">
            <button 
              onClick={onClearFilters}
              className="clear-btn"
              disabled={!hasActiveFilters || loading}
            >
              <span className="btn-icon">🗑️</span>
              Clear All Filters
            </button>
            
            <button 
              onClick={() => setShowFilters(false)}
              className="apply-btn"
            >
              <span className="btn-icon">✓</span>
              Apply Filters
            </button>
          </div>

          {/* Quick Filters */}
          <div className="quick-filters">
            <span className="quick-label">Quick filters:</span>
            <div className="quick-buttons">
              <button 
                className={`quick-btn ${filters.status === 'Open for Collaboration' ? 'active' : ''}`}
                onClick={() => handleFilterChange('status', 
                  filters.status === 'Open for Collaboration' ? '' : 'Open for Collaboration'
                )}
              >
                🟢 Open Now
              </button>
              <button 
                className={`quick-btn ${filters.field === 'Computer Science' ? 'active' : ''}`}
                onClick={() => handleFilterChange('field', 
                  filters.field === 'Computer Science' ? '' : 'Computer Science'
                )}
              >
                💻 Computer Science
              </button>
              <button 
                className={`quick-btn ${filters.field === 'AI & Machine Learning' ? 'active' : ''}`}
                onClick={() => handleFilterChange('field', 
                  filters.field === 'AI & Machine Learning' ? '' : 'AI & Machine Learning'
                )}
              >
                🤖 AI & ML
              </button>
              <button 
                className={`quick-btn ${filters.level === 'Undergraduate' ? 'active' : ''}`}
                onClick={() => handleFilterChange('level', 
                  filters.level === 'Undergraduate' ? '' : 'Undergraduate'
                )}
              >
                🎓 Undergrad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchFilters;