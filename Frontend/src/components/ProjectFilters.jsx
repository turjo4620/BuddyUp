import React, { useState } from 'react';
import './ProjectFilters.css';

const ProjectFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  loading, 
  hasActiveFilters, 
  totalResults 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const departmentOptions = [
    'Computer Science',
    'Engineering',
    'Business',
    'Design',
    'Data Science',
    'Mathematics',
    'Physics',
    'Biology',
    'Chemistry',
    'Psychology',
    'Other'
  ];

  const categoryOptions = [
    'Web Development',
    'Mobile App',
    'Data Science',
    'AI/ML',
    'Research',
    'Design',
    'Business',
    'Other'
  ];

  const academicYearOptions = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Graduate',
    'PhD'
  ];

  const statusOptions = [
    'Looking for members',
    'In Progress',
    'Completed'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const quickSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++',
    'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Mobile Development',
    'DevOps', 'Blockchain', 'Cybersecurity', 'Cloud Computing'
  ];

  const handleQuickSkillClick = (skill) => {
    const currentSkills = filters.skills || '';
    const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(s => s);
    
    if (skillsArray.includes(skill)) {
      // Remove skill
      const newSkills = skillsArray.filter(s => s !== skill).join(', ');
      handleInputChange('skills', newSkills);
    } else {
      // Add skill
      const newSkills = [...skillsArray, skill].join(', ');
      handleInputChange('skills', newSkills);
    }
  };

  const isSkillSelected = (skill) => {
    const currentSkills = filters.skills || '';
    return currentSkills.split(',').map(s => s.trim()).includes(skill);
  };

  return (
    <div className="project-filters">
      {/* Main Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search projects by title, description, or skills..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="search-input"
              disabled={loading}
            />
            {filters.search && (
              <button
                onClick={() => handleInputChange('search', '')}
                className="clear-search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span className="results-text">
          {loading ? 'Searching...' : `${totalResults} project${totalResults !== 1 ? 's' : ''} found`}
        </span>
        {hasActiveFilters && (
          <button
            className="clear-all-btn"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="filter-chips">
            {filters.search && (
              <div className="active-chip">
                <span>Search: "{filters.search}"</span>
                <button onClick={() => handleInputChange('search', '')}>×</button>
              </div>
            )}
            {filters.status && (
              <div className="active-chip">
                <span>Status: {filters.status}</span>
                <button onClick={() => handleInputChange('status', '')}>×</button>
              </div>
            )}
            {filters.category && (
              <div className="active-chip">
                <span>Category: {filters.category}</span>
                <button onClick={() => handleInputChange('category', '')}>×</button>
              </div>
            )}
            {filters.department && (
              <div className="active-chip">
                <span>Department: {filters.department}</span>
                <button onClick={() => handleInputChange('department', '')}>×</button>
              </div>
            )}
            {filters.academicYear && (
              <div className="active-chip">
                <span>Year: {filters.academicYear}</span>
                <button onClick={() => handleInputChange('academicYear', '')}>×</button>
              </div>
            )}
            {filters.skills && (
              <div className="active-chip">
                <span>Skills: {filters.skills}</span>
                <button onClick={() => handleInputChange('skills', '')}>×</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <div className="advanced-toggle">
        <button
          className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="toggle-icon">⚙️</span>
          <span className="toggle-text">More filters</span>
          <span className={`arrow ${showAdvanced ? 'up' : 'down'}`}>
            {showAdvanced ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filters-row">
            {/* Sort Filter */}
            <div className="filter-chip">
              <div className="chip-select">
                <select
                  value={filters.sort || 'newest'}
                  onChange={(e) => handleInputChange('sort', e.target.value)}
                  disabled={loading}
                  className="chip-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-chip">
              <div className="chip-select">
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={loading}
                  className="chip-select"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="filter-chip">
              <div className="chip-select">
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={loading}
                  className="chip-select"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Filter */}
            <div className="filter-group">
              <label>Department</label>
              <select
                value={filters.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Departments</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year Filter */}
            <div className="filter-group">
              <label>Academic Year</label>
              <select
                value={filters.academicYear || ''}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                className="filter-select"
                disabled={loading}
              >
                <option value="">All Years</option>
                {academicYearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Input */}
            <div className="filter-group skills-group">
              <label>Skills</label>
              <input
                type="text"
                placeholder="e.g., JavaScript, Python, React"
                value={filters.skills || ''}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="filter-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Quick Skills */}
          <div className="quick-skills-section">
            <label>Popular Skills</label>
            <div className="quick-skills">
              {quickSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleQuickSkillClick(skill)}
                  className={`quick-skill ${isSkillSelected(skill) ? 'selected' : ''}`}
                  disabled={loading}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;