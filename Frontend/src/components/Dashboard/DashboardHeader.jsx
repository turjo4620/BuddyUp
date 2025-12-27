import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => {
    return user?.name?.split(' ')[0] || 'Student';
  };

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="welcome-section">
          <h1 className="welcome-title">
            {getGreeting()}, {getFirstName()}! 👋
          </h1>
          <p className="welcome-subtitle">
            Ready to collaborate and build amazing projects together?
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;