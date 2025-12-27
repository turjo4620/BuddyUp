import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ConnectionStatus from './components/ConnectionStatus';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateProfile from './pages/CreateProfile';
import CreateProject from './pages/CreateProject';
import ProjectList from './pages/ProjectList';
import BrowseProjects from './pages/BrowseProjects';
import BrowseResearch from './pages/BrowseResearch';
import AIMatchingDemo from './pages/AIMatchingDemo';
import Dashboard from './pages/Dashboard';
import AIHelp from './pages/AIHelp';
import Research from './pages/Research';
import CreateResearch from './pages/CreateResearch';

// Component that shows LandingPage for both authenticated and non-authenticated users
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  // Always show LandingPage regardless of authentication status
  return <LandingPage />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <ConnectionStatus />
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/create" element={<CreateProfile />} />
                <Route path="/project/create" element={<CreateProject />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/browse" element={<BrowseProjects />} />
                <Route path="/research/browse" element={<BrowseResearch />} />
                <Route path="/ai-matching-demo" element={<AIMatchingDemo />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-help" element={<AIHelp />} />
                <Route path="/research" element={<Research />} />
                <Route path="/research/create" element={<CreateResearch />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;