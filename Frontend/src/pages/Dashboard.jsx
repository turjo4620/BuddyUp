import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProfileCard from '../components/ProfileCard';
import { 
  getProfile, 
  getProjectsByOwner, 
  getJoinRequestsForProject,
  getJoinRequestsByStudent,
  getSuggestedTeammates,
  getMatchingProjects,
  updateJoinRequestStatus
} from '../api/api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [myJoinRequests, setMyJoinRequests] = useState([]);
  const [suggestedTeammates, setSuggestedTeammates] = useState([]);
  const [matchingProjects, setMatchingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = localStorage.getItem('currentUserId');

  useEffect(() => {
    if (currentUserId) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await getProfile(currentUserId);
      setProfile(profileResponse.data);

      // Fetch user's created projects
      const projectsResponse = await getProjectsByOwner(currentUserId);
      setCreatedProjects(projectsResponse.data);

      // Fetch join requests for user's projects
      const allJoinRequests = [];
      for (const project of projectsResponse.data) {
        try {
          const requestsResponse = await getJoinRequestsForProject(project._id);
          allJoinRequests.push(...requestsResponse.data.map(req => ({
            ...req,
            projectTitle: project.title
          })));
        } catch (err) {
          console.error(`Failed to fetch requests for project ${project._id}:`, err);
        }
      }
      setJoinRequests(allJoinRequests);

      // Fetch user's own join requests
      const myRequestsResponse = await getJoinRequestsByStudent(currentUserId);
      setMyJoinRequests(myRequestsResponse.data);

      // Fetch suggested teammates for first project
      if (projectsResponse.data.length > 0) {
        try {
          const teammatesResponse = await getSuggestedTeammates(projectsResponse.data[0]._id);
          setSuggestedTeammates(teammatesResponse.data);
        } catch (err) {
          console.error('Failed to fetch suggested teammates:', err);
        }
      }

      // Fetch matching projects
      try {
        const matchingResponse = await getMatchingProjects(currentUserId);
        setMatchingProjects(matchingResponse.data);
      } catch (err) {
        console.error('Failed to fetch matching projects:', err);
      }

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequestAction = async (requestId, status) => {
    try {
      await updateJoinRequestStatus(requestId, status, currentUserId);
      // Refresh join requests
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update join request');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="container">
        <div className="dashboard-section">
          <h2>Welcome to BuddyUp Dashboard</h2>
          <p>Please create a profile first to access your dashboard.</p>
          <a href="/profile/create" className="btn btn-primary">
            Create Profile
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {/* User Profile Section */}
      {profile && (
        <div className="dashboard-section">
          <h2>Your Profile</h2>
          <div style={{ maxWidth: '400px' }}>
            <ProfileCard profile={profile} />
          </div>
        </div>
      )}

      {/* Created Projects Section */}
      <div className="dashboard-section">
        <h2>Your Projects ({createdProjects.length})</h2>
        {createdProjects.length === 0 ? (
          <p>You haven't created any projects yet. <a href="/project/create">Create your first project</a></p>
        ) : (
          <div className="card-grid">
            {createdProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                showJoinButton={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Join Requests Received */}
      {joinRequests.length > 0 && (
        <div className="dashboard-section">
          <h2>Join Requests Received ({joinRequests.length})</h2>
          <div className="card-grid">
            {joinRequests.map((request) => (
              <div key={request._id} className="card">
                <h4>{request.studentId.name}</h4>
                <p><strong>Project:</strong> {request.projectTitle}</p>
                <p><strong>Department:</strong> {request.studentId.department}</p>
                <p><strong>Academic Year:</strong> {request.studentId.academicYear}</p>
                
                {request.studentId.skills && (
                  <div>
                    <p><strong>Skills:</strong></p>
                    <div className="skills-list">
                      {request.studentId.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {request.message && (
                  <p><strong>Message:</strong> {request.message}</p>
                )}

                <p><strong>Status:</strong> {request.status}</p>

                {request.status === 'Pending' && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleJoinRequestAction(request._id, 'Accepted')}
                      className="btn btn-success"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleJoinRequestAction(request._id, 'Rejected')}
                      className="btn btn-secondary"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Join Requests */}
      {myJoinRequests.length > 0 && (
        <div className="dashboard-section">
          <h2>Your Join Requests ({myJoinRequests.length})</h2>
          <div className="card-grid">
            {myJoinRequests.map((request) => (
              <div key={request._id} className="card">
                <h4>{request.projectId.title}</h4>
                <p>{request.projectId.description}</p>
                <p><strong>Status:</strong> 
                  <span style={{ 
                    color: request.status === 'Accepted' ? '#27ae60' : 
                           request.status === 'Rejected' ? '#e74c3c' : '#f39c12',
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {request.status}
                  </span>
                </p>
                {request.message && (
                  <p><strong>Your Message:</strong> {request.message}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Teammates */}
      {suggestedTeammates.length > 0 && (
        <div className="dashboard-section">
          <h2>Suggested Teammates</h2>
          <p>Based on your project: {createdProjects[0]?.title}</p>
          <div className="card-grid">
            {suggestedTeammates.slice(0, 6).map((match) => (
              <div key={match.student._id} className="card">
                <ProfileCard profile={match.student} />
                <div style={{ marginTop: '1rem' }}>
                  <p><strong>Match Score:</strong> {match.matchScore}%</p>
                  <p><strong>Matching Skills:</strong> {match.matchingSkills.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matching Projects */}
      {matchingProjects.length > 0 && (
        <div className="dashboard-section">
          <h2>Recommended Projects for You</h2>
          <div className="card-grid">
            {matchingProjects.slice(0, 6).map((match) => (
              <div key={match.project._id} className="card">
                <ProjectCard 
                  project={match.project} 
                  currentUserId={currentUserId}
                  onJoinRequest={() => fetchDashboardData()}
                />
                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                  <p><strong>Match Score:</strong> {match.matchScore}%</p>
                  <p><strong>Matching Skills:</strong> {match.matchingSkills.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;