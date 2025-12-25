import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConnectionStatus from './components/ConnectionStatus';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import CreateProject from './pages/CreateProject';
import ProjectList from './pages/ProjectList';
import Dashboard from './pages/Dashboard';
import AIHelp from './pages/AIHelp';

function App() {
  return (
    <Router>
      <div className="App">
        <ConnectionStatus />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/create" element={<CreateProfile />} />
            <Route path="/project/create" element={<CreateProject />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-help" element={<AIHelp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;