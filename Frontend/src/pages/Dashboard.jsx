import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import ProfileSummary from '../components/Dashboard/ProfileSummary';
import StatsOverview from '../components/Dashboard/StatsOverview';
import MyProjectsResearch from '../components/Dashboard/MyProjectsResearch';
import JoinRequestsPanel from '../components/Dashboard/JoinRequestsPanel';
import AIMatchingSuggestions from '../components/Dashboard/AIMatchingSuggestions';
import { 
  getProjectsByOwner, 
  getResearches,
  getJoinRequestsForProject,
  getJoinRequestsByStudent,
  getSuggestedTeammates,
  getMatchingProjects,
  updateJoinRequestStatus
} from '../api/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    research: [],
    joinRequests: [],
    myJoinRequests: [],
    suggestedTeammates: [],
    matchingProjects: [],
    stats: {
      totalProjects: 0,
      totalResearch: 0,
      activeJoinRequests: 0,
      aiMatchSuggestions: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Fetch user's projects and research
      const [projectsResponse, researchResponse] = await Promise.allSettled([
        getProjectsByOwner(user._id),
        getResearches({ researcher: user._id })
      ]);

      const projects = projectsResponse.status === 'fulfilled' ? projectsResponse.value.data : [];
      const research = researchResponse.status === 'fulfilled' ? researchResponse.value.data : [];

      // Fetch join requests for user's projects
      const allJoinRequests = [];
      for (const project of projects) {
        try {
          const requestsResponse = await getJoinRequestsForProject(project._id);
          allJoinRequests.push(...requestsResponse.data.map(req => ({
            ...req,
            projectTitle: project.title,
            projectType: 'project'
          })));
        } catch (err) {
          console.error(`Failed to fetch requests for project ${project._id}:`, err);
        }
      }

      // Fetch user's own join requests
      let myJoinRequests = [];
      try {
        const myRequestsResponse = await getJoinRequestsByStudent(user._id);
        myJoinRequests = myRequestsResponse.data;
      } catch (err) {
        console.error('Failed to fetch user join requests:', err);
      }

      // Fetch AI suggestions
      let suggestedTeammates = [];
      let matchingProjects = [];
      
      if (projects.length > 0) {
        try {
          const teammatesResponse = await getSuggestedTeammates(projects[0]._id);
          suggestedTeammates = teammatesResponse.data;
        } catch (err) {
          console.error('Failed to fetch suggested teammates:', err);
        }
      }

      try {
        const matchingResponse = await getMatchingProjects(user._id);
        matchingProjects = matchingResponse.data;
      } catch (err) {
        console.error('Failed to fetch matching projects:', err);
      }

      // Calculate stats
      const stats = {
        totalProjects: projects.length,
        totalResearch: research.length,
        activeJoinRequests: allJoinRequests.filter(req => req.status === 'Pending').length,
        aiMatchSuggestions: suggestedTeammates.length + matchingProjects.length
      };

      setDashboardData({
        projects,
        research,
        joinRequests: allJoinRequests,
        myJoinRequests,
        suggestedTeammates,
        matchingProjects,
        stats
      });

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle join request actions
  const handleJoinRequestAction = async (requestId, action) => {
    try {
      await updateJoinRequestStatus(requestId, action);
      // Refresh dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update join request:', err);
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader user={user} />
      
      <div className="dashboard-content">
        {/* Top Section - Profile & Stats */}
        <div className="dashboard-top-section">
          <ProfileSummary user={user} />
          <StatsOverview stats={dashboardData.stats} />
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-main-grid">
          {/* Left Column - Projects & Research */}
          <div className="dashboard-main-content">
            <MyProjectsResearch 
              projects={dashboardData.projects}
              research={dashboardData.research}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onRefresh={fetchDashboardData}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="dashboard-sidebar">
            <JoinRequestsPanel 
              joinRequests={dashboardData.joinRequests}
              onAction={handleJoinRequestAction}
            />
            
            <AIMatchingSuggestions 
              suggestedTeammates={dashboardData.suggestedTeammates}
              matchingProjects={dashboardData.matchingProjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;