// API Testing Utility for BuddyUp
import * as api from '../api/api.js';

export const runAPITests = async () => {
  console.log('🚀 Starting API tests...');
  
  try {
    // Test health check
    console.log('Testing health check...');
    const health = await api.checkHealth();
    console.log('✅ Health check:', health.success ? 'PASSED' : 'FAILED');

    // Test create profile
    console.log('Testing create profile...');
    const profileData = {
      name: 'Test User',
      department: 'Computer Science',
      academicYear: '3rd Year',
      skills: ['JavaScript', 'Python'],
      projectInterests: ['Web Development', 'AI/ML']
    };
    
    const profile = await api.createProfile(profileData);
    console.log('✅ Create profile:', profile.success ? 'PASSED' : 'FAILED');

    // Test get profiles
    console.log('Testing get profiles...');
    const profiles = await api.getProfiles();
    console.log('✅ Get profiles:', profiles.success ? 'PASSED' : 'FAILED');

    // Test create project
    if (profile.success) {
      console.log('Testing create project...');
      const projectData = {
        title: 'Test Project',
        description: 'A test project',
        requiredSkills: ['JavaScript'],
        teamSize: 3,
        owner: profile.data._id
      };
      
      const project = await api.createProject(projectData);
      console.log('✅ Create project:', project.success ? 'PASSED' : 'FAILED');

      // Test get projects
      console.log('Testing get projects...');
      const projects = await api.getProjects();
      console.log('✅ Get projects:', projects.success ? 'PASSED' : 'FAILED');
    }

    console.log('🎉 API tests completed!');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

export default runAPITests;