import React from 'react';

const ProfileCard = ({ profile }) => {
  return (
    <div className="card">
      <h3>{profile.name}</h3>
      <p><strong>Department:</strong> {profile.department}</p>
      <p><strong>Academic Year:</strong> {profile.academicYear}</p>
      
      {profile.skills && profile.skills.length > 0 && (
        <div>
          <p><strong>Skills:</strong></p>
          <div className="skills-list">
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {profile.projectInterests && profile.projectInterests.length > 0 && (
        <div>
          <p><strong>Project Interests:</strong></p>
          <div className="skills-list">
            {profile.projectInterests.map((interest, index) => (
              <span key={index} className="skill-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {profile.bio && (
        <p><strong>Bio:</strong> {profile.bio}</p>
      )}
    </div>
  );
};

export default ProfileCard;