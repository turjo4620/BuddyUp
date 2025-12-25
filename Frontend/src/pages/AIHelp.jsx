import React from 'react';
import AIChatBox from '../components/AIChatBox';

const AIHelp = () => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>AI Guidance & Support</h1>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Get personalized advice and guidance for your projects and research. 
          Ask questions about project planning, research direction, skill development, 
          and team collaboration strategies.
        </p>
      </div>

      <AIChatBox />

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <h3>🎯 Project Planning</h3>
          <p>Get help with:</p>
          <ul style={{ marginLeft: '1rem', color: '#666' }}>
            <li>Setting realistic timelines</li>
            <li>Breaking down complex tasks</li>
            <li>Defining project scope</li>
            <li>Risk management</li>
          </ul>
        </div>

        <div className="card">
          <h3>🔬 Research Direction</h3>
          <p>Get guidance on:</p>
          <ul style={{ marginLeft: '1rem', color: '#666' }}>
            <li>Research methodology</li>
            <li>Literature review strategies</li>
            <li>Data collection methods</li>
            <li>Hypothesis formation</li>
          </ul>
        </div>

        <div className="card">
          <h3>📚 Skill Learning</h3>
          <p>Learn about:</p>
          <ul style={{ marginLeft: '1rem', color: '#666' }}>
            <li>Technology recommendations</li>
            <li>Learning resources</li>
            <li>Skill development paths</li>
            <li>Best practices</li>
          </ul>
        </div>

        <div className="card">
          <h3>🤝 Team Collaboration</h3>
          <p>Improve your:</p>
          <ul style={{ marginLeft: '1rem', color: '#666' }}>
            <li>Communication strategies</li>
            <li>Conflict resolution</li>
            <li>Role distribution</li>
            <li>Team motivation</li>
          </ul>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: '2rem' }}>
        <h3>Sample Questions to Get Started</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <h4>Project Planning</h4>
            <ul style={{ color: '#666' }}>
              <li>"Help me plan my project timeline"</li>
              <li>"How do I set realistic project goals?"</li>
              <li>"What project management tools should I use?"</li>
            </ul>
          </div>
          
          <div>
            <h4>Research & Skills</h4>
            <ul style={{ color: '#666' }}>
              <li>"What research methodology should I use?"</li>
              <li>"How can I improve my programming skills?"</li>
              <li>"What's the best way to learn data science?"</li>
            </ul>
          </div>
          
          <div>
            <h4>Team Collaboration</h4>
            <ul style={{ color: '#666' }}>
              <li>"Give me team collaboration advice"</li>
              <li>"How do I handle team conflicts?"</li>
              <li>"What makes a good team leader?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;