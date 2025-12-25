import React from 'react';
import { Link } from 'react-router-dom';
import { runAPITests } from '../utils/apiTest';

const Home = () => {
  const handleTestAPI = async () => {
    console.log('🧪 Running API tests...');
    await runAPITests();
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to BuddyUp</h1>
        <p>
          Find the perfect teammates for your projects and research work. 
          Connect with students who share your interests and complement your skills.
        </p>
        
        <div className="hero-buttons">
          <Link to="/profile/create" className="btn btn-primary">
            Create Profile
          </Link>
          <Link to="/project/create" className="btn btn-secondary">
            Create Project
          </Link>
          <Link to="/projects" className="btn btn-success">
            Explore Projects
          </Link>
          <Link to="/ai-help" className="btn btn-primary">
            AI Guidance
          </Link>
          <button onClick={handleTestAPI} className="btn btn-secondary">
            🧪 Test APIs
          </button>
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