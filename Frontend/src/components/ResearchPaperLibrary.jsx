import React, { useState, useEffect } from 'react';

const ResearchPaperLibrary = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock data for research papers (in a real app, this would come from an API)
  const mockPapers = [
    {
      id: 1,
      title: "Machine Learning Applications in Healthcare: A Comprehensive Review",
      authors: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Rodriguez"],
      abstract: "This comprehensive review examines the current state and future prospects of machine learning applications in healthcare. We analyze over 200 recent studies covering diagnostic imaging, drug discovery, personalized medicine, and clinical decision support systems. Our findings suggest that while ML shows tremendous promise, challenges remain in data quality, interpretability, and regulatory approval.",
      category: "Machine Learning",
      journal: "Nature Medicine",
      year: 2024,
      citations: 156,
      doi: "10.1038/s41591-024-0001-x",
      keywords: ["machine learning", "healthcare", "artificial intelligence", "medical diagnosis"],
      downloadUrl: "#",
      pdfUrl: "#",
      isOpenAccess: true,
      readingTime: 25,
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions: Solar Panel Efficiency Optimization",
      authors: ["Dr. James Wilson", "Prof. Lisa Zhang"],
      abstract: "We present novel approaches to optimize solar panel efficiency through advanced materials and innovative design patterns. Our research demonstrates a 23% improvement in energy conversion rates using perovskite-silicon tandem cells combined with AI-driven tracking systems.",
      category: "Renewable Energy",
      journal: "Energy & Environmental Science",
      year: 2024,
      citations: 89,
      doi: "10.1039/D4EE00123K",
      keywords: ["solar energy", "renewable energy", "sustainability", "materials science"],
      downloadUrl: "#",
      pdfUrl: "#",
      isOpenAccess: false,
      readingTime: 18,
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Quantum Computing Algorithms for Cryptographic Security",
      authors: ["Prof. David Kumar", "Dr. Anna Petrov", "Dr. Robert Kim"],
      abstract: "This paper explores the implications of quantum computing on current cryptographic methods and proposes new quantum-resistant algorithms. We demonstrate the vulnerability of RSA encryption to Shor's algorithm and present alternative approaches for post-quantum cryptography.",
      category: "Quantum Computing",
      journal: "Quantum Information Processing",
      year: 2024,
      citations: 234,
      doi: "10.1007/s11128-024-0001-2",
      keywords: ["quantum computing", "cryptography", "security", "algorithms"],
      downloadUrl: "#",
      pdfUrl: "#",
      isOpenAccess: true,
      readingTime: 32,
      difficulty: "Advanced"
    },
    {
      id: 4,
      title: "Climate Change Impact on Marine Biodiversity: A Global Analysis",
      authors: ["Dr. Maria Santos", "Prof. John Thompson", "Dr. Yuki Tanaka"],
      abstract: "Our global analysis of marine biodiversity changes over the past 50 years reveals alarming trends in species distribution and population dynamics. Using satellite data and field observations from 500+ locations, we document significant shifts in marine ecosystems due to rising ocean temperatures and acidification.",
      category: "Environmental Science",
      journal: "Science",
      year: 2024,
      citations: 312,
      doi: "10.1126/science.abcd1234",
      keywords: ["climate change", "marine biology", "biodiversity", "ocean acidification"],
      downloadUrl: "#",
      pdfUrl: "#",
      isOpenAccess: false,
      readingTime: 28,
      difficulty: "Intermediate"
    },
    {
      id: 5,
      title: "CRISPR-Cas9 Gene Editing: Therapeutic Applications and Ethical Considerations",
      authors: ["Dr. Rachel Green", "Prof. Ahmed Hassan"],
      abstract: "We review recent advances in CRISPR-Cas9 gene editing technology, focusing on therapeutic applications for genetic disorders. This comprehensive analysis covers successful clinical trials, ongoing research, and the ethical framework needed for responsible implementation of gene editing technologies.",
      category: "Biotechnology",
      journal: "Cell",
      year: 2024,
      citations: 445,
      doi: "10.1016/j.cell.2024.01.001",
      keywords: ["CRISPR", "gene editing", "biotechnology", "genetic therapy"],
      downloadUrl: "#",
      pdfUrl: "#",
      isOpenAccess: true,
      readingTime: 22,
      difficulty: "Advanced"
    },
    {
      id: 6,
      title: "Artificial Neural Networks for Financial Market Prediction",
      authors: ["Dr. Alex Morgan", "Prof. Sophie Laurent"],
      abstract: "This study investigates the application of deep neural networks for predicting financial market trends. We compare various architectures including LSTM, GRU, and Transformer models, achieving up to 78% accuracy in short-term price movement predictions across multiple asset classes.",
      category: "Financial Technology",
      journal: "Journal of Financial Data Science",
      year: 2024,
      citations: 67,
      doi: "10.3905/jfds.2024.1.001",
      keywords: ["neural networks", "financial markets", "prediction", "deep learning"],
      downloadUrl: "#",
      pdfUrl: "#",
      isOpenAccess: false,
      readingTime: 20,
      difficulty: "Intermediate"
    }
  ];

  const categories = [
    'All Categories',
    'Machine Learning',
    'Renewable Energy',
    'Quantum Computing',
    'Environmental Science',
    'Biotechnology',
    'Financial Technology',
    'Computer Science',
    'Medicine',
    'Physics',
    'Chemistry'
  ];

  useEffect(() => {
    // Simulate loading papers
    setLoading(true);
    setTimeout(() => {
      setPapers(mockPapers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         paper.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
                           paper.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatAuthors = (authors) => {
    if (authors.length <= 2) return authors.join(', ');
    return `${authors[0]} et al.`;
  };

  return (
    <div className="research-library">
      {/* Header */}
      <div className="library-header">
        <div className="header-content">
          <h2>📚 Research Paper Library</h2>
          <p>Discover cutting-edge research papers and stay updated with the latest scientific breakthroughs</p>
        </div>
        <div className="library-stats">
          <div className="stat-item">
            <span className="stat-number">{papers.length}</span>
            <span className="stat-label">Papers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Open Access</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="library-controls">
        <div className="search-section">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search papers by title, author, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="view-controls">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span className="results-count">
          {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''} found
        </span>
        {searchQuery && (
          <span className="search-info">
            for "{searchQuery}"
          </span>
        )}
      </div>

      {/* Papers Grid/List */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading research papers...</p>
        </div>
      ) : (
        <div className={`papers-container ${viewMode}`}>
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
              <div key={paper.id} className="paper-card">
                {/* Paper Header */}
                <div className="paper-header">
                  <div className="paper-category">
                    <span className="category-tag">{paper.category}</span>
                    <span className="year-tag">{paper.year}</span>
                  </div>
                  <div className="paper-access">
                    {paper.isOpenAccess && (
                      <span className="open-access-badge">🔓 Open Access</span>
                    )}
                  </div>
                </div>

                {/* Paper Content */}
                <div className="paper-content">
                  <h3 className="paper-title">{paper.title}</h3>
                  <p className="paper-authors">
                    <span className="authors-icon">👥</span>
                    {formatAuthors(paper.authors)}
                  </p>
                  <p className="paper-journal">
                    <span className="journal-icon">📖</span>
                    {paper.journal}
                  </p>
                  
                  <div className="paper-abstract">
                    <p>{paper.abstract}</p>
                  </div>

                  {/* Paper Metadata */}
                  <div className="paper-metadata">
                    <div className="metadata-row">
                      <div className="metadata-item">
                        <span className="metadata-icon">📊</span>
                        <span className="metadata-text">{paper.citations} citations</span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-icon">⏱️</span>
                        <span className="metadata-text">{paper.readingTime} min read</span>
                      </div>
                      <div className="metadata-item">
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(paper.difficulty) }}
                        >
                          {paper.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="paper-keywords">
                      {paper.keywords.map(keyword => (
                        <span key={keyword} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Paper Actions */}
                <div className="paper-actions">
                  <button 
                    onClick={() => setSelectedPaper(paper)}
                    className="btn btn-primary btn-sm"
                  >
                    <span className="btn-icon">👁️</span>
                    Read Abstract
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    <span className="btn-icon">📥</span>
                    Download PDF
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <span className="btn-icon">🔗</span>
                    DOI: {paper.doi}
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <span className="btn-icon">💾</span>
                    Save
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No Papers Found</h3>
              <p>Try adjusting your search terms or filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <div className="modal-overlay" onClick={() => setSelectedPaper(null)}>
          <div className="modal-content paper-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPaper.title}</h3>
              <button 
                onClick={() => setSelectedPaper(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="paper-details">
                <div className="detail-section">
                  <h4>Authors</h4>
                  <p>{selectedPaper.authors.join(', ')}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Journal & Publication</h4>
                  <p>{selectedPaper.journal} ({selectedPaper.year})</p>
                  <p>DOI: {selectedPaper.doi}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Abstract</h4>
                  <p>{selectedPaper.abstract}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Keywords</h4>
                  <div className="keywords-list">
                    {selectedPaper.keywords.map(keyword => (
                      <span key={keyword} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary">
                <span className="btn-icon">💾</span>
                Save to Library
              </button>
              <button className="btn btn-primary">
                <span className="btn-icon">📥</span>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPaperLibrary;