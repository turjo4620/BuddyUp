import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../api/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    skills: ''
  });

  const currentUserId = localStorage.getItem('currentUserId');

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getProjects(filters);
      setProjects(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleJoinRequest = (projectId) => {
    // Refresh projects after join request
    fetchProjects();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Explore Projects</h1>
      
      {!currentUserId && (
        <div className="alert alert-error">
          <strong>Note:</strong> Create a profile first to send join requests to projects.
        </div>
      )}

      {/* Filters */}
      <div className="dashboard-section">
        <h3>Filter Projects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Looking for members">Looking for members</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Research">Research</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              placeholder="e.g., JavaScript, Python"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="dashboard-section">
          <p>No projects found. Try adjusting your filters or create the first project!</p>
        </div>
      ) : (
        <>
          <p style={{ margin: '1rem 0', color: '#666' }}>
            Found {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
          
          <div className="card-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onJoinRequest={handleJoinRequest}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;