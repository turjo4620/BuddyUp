import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSummary.css';

const ProfileSummary = ({ user }) => {
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDepartmentEmoji = (department) => {
    const deptMap = {
      'Computer Science': '💻',
      'Engineering': '⚙️',
      'Mathematics': '📊',
      'Physics': '🔬',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'Business': '💼',
      'Design': '🎨',
      'Medicine': '🏥',
      'Psychology': '🧠',
      'Economics': '📈',
      'Literature': '📚',
      'History': '📜',
      'Art': '🎭',
      'Music': '🎵',
      'Law': '⚖️',
      'Architecture': '🏗️',
      'Data Science': '📊',
      'Artificial Intelligence': '🤖',
      'Cybersecurity': '🔐'
    };
    
    // Find matching department (case insensitive)
    const dept = Object.keys(deptMap).find(key => 
      department?.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(department?.toLowerCase())
    );
    
    return dept ? deptMap[dept] : '🎓';
  };

  const getAcademicYearColor = (year) => {
    const yearColors = {
      '1st Year': '#10b981', // Green
      '2nd Year': '#3b82f6', // Blue
      '3rd Year': '#f59e0b', // Orange
      '4th Year': '#ef4444', // Red
      'Graduate': '#8b5cf6', // Purple
      'PhD': '#ec4899' // Pink
    };
    return yearColors[year] || '#64748b';
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleViewPublicProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <div className="profile-summary-wow">
      {/* Animated Background */}
      <div className="profile-bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Main Profile Content */}
      <div className="profile-main-content">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <div className="avatar-ring">
              <div className="avatar-circle-wow">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span className="avatar-initials-wow">{getUserInitials()}</span>
                )}
              </div>
            </div>
            <div className="status-indicator">
              <div className="pulse-ring"></div>
              <div className="status-dot"></div>
            </div>
          </div>
        </div>

        {/* Name Section - The WOW Factor */}
        <div className="profile-name-section">
          <h1 className="profile-name-wow">
            <span className="name-text">{user?.name || 'Student Name'}</span>
            <div className="name-underline"></div>
          </h1>
          
          {/* Department with Emoji - Major WOW */}
          <div className="department-showcase">
            <div className="dept-emoji">{getDepartmentEmoji(user?.department)}</div>
            <div className="dept-info">
              <span className="dept-name">{user?.department || 'Department'}</span>
              <div className="dept-shine"></div>
            </div>
          </div>

          {/* Academic Year Badge */}
          <div className="academic-year-badge" style={{ '--year-color': getAcademicYearColor(user?.academicYear) }}>
            <span className="year-text">{user?.academicYear || 'Academic Year'}</span>
            <div className="badge-glow"></div>
          </div>
        </div>

        {/* Bio Section (if exists) */}
        {user?.bio && (
          <div className="profile-bio-section">
            <p className="bio-text">{user.bio}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="profile-quick-stats">
          <div className="stat-item">
            <div className="stat-icon">🛠️</div>
            <div className="stat-info">
              <span className="stat-number">{user?.skills?.length || 0}</span>
              <span className="stat-label">Skills</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-number">{user?.projectInterests?.length || 0}</span>
              <span className="stat-label">Interests</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon">🚀</div>
            <div className="stat-info">
              <span className="stat-number">{user?.projectsJoined?.length || 0}</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-wow">
          <button className="action-btn-wow primary" onClick={handleEditProfile}>
            <span className="btn-icon">✨</span>
            <span className="btn-text">Edit Profile</span>
            <div className="btn-ripple"></div>
          </button>
          <button className="action-btn-wow secondary" onClick={handleViewPublicProfile}>
            <span className="btn-icon">👁️</span>
            <span className="btn-text">View Public</span>
            <div className="btn-ripple"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;