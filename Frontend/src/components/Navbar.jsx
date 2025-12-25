import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            BuddyUp
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile/create">Create Profile</Link></li>
            <li><Link to="/project/create">Create Project</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/ai-help">AI Help</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;