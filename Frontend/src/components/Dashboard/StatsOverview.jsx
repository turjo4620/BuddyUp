import React from 'react';
import './StatsOverview.css';

const StatsOverview = ({ stats }) => {
  const statItems = [
    {
      key: 'totalProjects',
      label: 'Projects Posted',
      value: stats?.totalProjects || 0,
      icon: '📋',
      color: 'blue',
      description: 'Projects you\'ve created'
    },
    {
      key: 'totalResearch',
      label: 'Research Posted',
      value: stats?.totalResearch || 0,
      icon: '🔬',
      color: 'purple',
      description: 'Research projects you\'ve initiated'
    },
    {
      key: 'activeJoinRequests',
      label: 'Active Requests',
      value: stats?.activeJoinRequests || 0,
      icon: '📨',
      color: 'green',
      description: 'Pending join requests to review'
    },
    {
      key: 'aiMatchSuggestions',
      label: 'AI Suggestions',
      value: stats?.aiMatchSuggestions || 0,
      icon: '🤖',
      color: 'orange',
      description: 'AI-powered collaboration matches'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'stat-blue',
        icon: 'icon-blue'
      },
      purple: {
        bg: 'stat-purple',
        icon: 'icon-purple'
      },
      green: {
        bg: 'stat-green',
        icon: 'icon-green'
      },
      orange: {
        bg: 'stat-orange',
        icon: 'icon-orange'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="stats-overview">
      <div className="stats-grid">
        {statItems.map((stat) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div key={stat.key} className={`stat-card ${colorClasses.bg}`}>
              <div className="stat-header">
                <div className={`stat-icon ${colorClasses.icon}`}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
              <div className="stat-description">
                {stat.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsOverview;