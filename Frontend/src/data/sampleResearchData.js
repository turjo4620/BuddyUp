// Sample Research Data for Demo Purposes
export const sampleResearchData = [
  {
    _id: '1',
    title: 'Machine Learning Applications in Climate Change Prediction',
    description: 'We are developing advanced ML models to predict climate patterns and extreme weather events. This research combines satellite data, historical weather records, and cutting-edge deep learning techniques to create more accurate climate forecasting systems.',
    researcher: {
      _id: 'r1',
      name: 'Dr. Sarah Chen',
      department: 'Computer Science',
      university: 'Stanford University'
    },
    collaborators: [
      { profile: { _id: 'c1', name: 'Alex Johnson' }, role: 'Research Assistant' },
      { profile: { _id: 'c2', name: 'Maria Garcia' }, role: 'Data Analyst' }
    ],
    requiredSkills: ['Python', 'TensorFlow', 'Data Analysis', 'Statistics', 'Climate Science'],
    fields: ['Machine Learning', 'Climate Science', 'Data Science'],
    status: 'Open for Collaboration',
    expectedTeamSize: 6,
    category: 'Computer Science',
    level: 'PhD',
    timeline: 'Long-term (12+ months)',
    createdAt: '2024-01-15T10:30:00Z',
    joinRequests: []
  },
  {
    _id: '2',
    title: 'CRISPR Gene Editing for Rare Disease Treatment',
    description: 'Investigating novel CRISPR-Cas9 applications for treating rare genetic disorders. Our focus is on developing precise gene editing techniques that can correct mutations causing inherited diseases.',
    researcher: {
      _id: 'r2',
      name: 'Prof. Michael Rodriguez',
      department: 'Molecular Biology',
      university: 'MIT'
    },
    collaborators: [
      { profile: { _id: 'c3', name: 'Emily Zhang' }, role: 'Lab Technician' }
    ],
    requiredSkills: ['Molecular Biology', 'CRISPR', 'Cell Culture', 'Genetics', 'Laboratory Techniques'],
    fields: ['Biotechnology', 'Genetics', 'Medicine'],
    status: 'Open for Collaboration',
    expectedTeamSize: 4,
    category: 'Biology',
    level: 'Masters',
    timeline: 'Medium-term (6-12 months)',
    createdAt: '2024-01-20T14:15:00Z',
    joinRequests: []
  }
];

// Mock API function for development
export const getMockResearchData = (filters = {}) => {
  let filteredData = [...sampleResearchData];

  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredData = filteredData.filter(research => 
      research.title.toLowerCase().includes(searchTerm) ||
      research.description.toLowerCase().includes(searchTerm) ||
      research.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
      research.fields.some(field => field.toLowerCase().includes(searchTerm))
    );
  }

  if (filters.field) {
    filteredData = filteredData.filter(research => 
      research.category === filters.field || 
      research.fields.includes(filters.field)
    );
  }

  if (filters.status) {
    filteredData = filteredData.filter(research => research.status === filters.status);
  }

  if (filters.level) {
    filteredData = filteredData.filter(research => research.level === filters.level);
  }

  return {
    success: true,
    data: filteredData,
    total: filteredData.length,
    page: 1,
    pages: 1
  };
};