// AI Guidance Support using Hugging Face Inference API (Free)
const axios = require('axios');

// Hugging Face API configuration - Using free models
const HF_MODELS = {
  // Free conversational AI model
  chat: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  // Alternative free model for text generation
  text: 'https://api-inference.huggingface.co/models/gpt2'
};

const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN || null; // Optional, works without token but with rate limits

// Main AI guidance handler
const handleAIGuidance = async (query, context = {}) => {
  console.log(`🤖 AI Query received: "${query}"`);
  
  // Validate and sanitize query
  if (!query || query.trim().length < 3) {
    return getErrorResponse('Please provide a more detailed question.');
  }

  // Check if query is appropriate for our domain
  if (!isValidQuery(query)) {
    return getErrorResponse('I can only help with project planning, research direction, skill learning, and team collaboration topics.');
  }

  // First try to get AI response from Hugging Face
  try {
    const aiResponse = await getHuggingFaceResponse(query, context);
    if (aiResponse && aiResponse.response && aiResponse.response.length > 0) {
      console.log('✅ AI response generated using Hugging Face');
      return aiResponse;
    }
  } catch (error) {
    console.log('AI API failed, falling back to rule-based responses:', error.message);
  }

  // Fallback to rule-based responses
  console.log('📋 Using rule-based response');
  return getRuleBasedResponse(query, context);
};

// Get response from Hugging Face Inference API
const getHuggingFaceResponse = async (query, context = {}) => {
  try {
    // Prepare the prompt with context for student project guidance
    const systemContext = `You are a helpful AI assistant for university students working on projects and research. 
    Provide practical, concise advice about project planning, research methods, skill development, and teamwork. 
    Keep responses under 150 words and focus on actionable guidance.`;
    
    const fullPrompt = `${systemContext}\n\nStudent: ${query}\nAssistant:`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token is available (improves rate limits)
    if (HF_API_TOKEN) {
      headers['Authorization'] = `Bearer ${HF_API_TOKEN}`;
    }

    // Try the text generation model first
    const response = await axios.post(
      HF_MODELS.text,
      {
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1
        }
      },
      {
        headers,
        timeout: 15000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      let aiResponse = response.data[0].generated_text.trim();
      
      // Clean the response by removing the original prompt
      aiResponse = aiResponse.replace(fullPrompt, '').trim();
      
      // Remove common artifacts
      aiResponse = aiResponse
        .replace(/^(Answer:|Question:|A:|Q:)/i, '')
        .replace(/Student:|Assistant:/g, '')
        .trim();
      
      if (aiResponse && aiResponse.length > 20) {
        return {
          type: 'ai_response',
          response: [aiResponse],
          suggestions: generateSuggestions(query),
          source: 'huggingface_ai'
        };
      }
    }

    return null;
    
  } catch (error) {
    console.error('Hugging Face API error:', error.message);
    
    if (error.response?.status === 429) {
      console.log('Rate limited, please try again later');
      throw new Error('Rate limited, please try again in a moment');
    }
    
    throw error;
  }
};

// Validate if query is appropriate for our AI
const isValidQuery = (query) => {
  const allowedTopics = [
    'project', 'research', 'skill', 'team', 'collaboration', 'planning',
    'timeline', 'technology', 'tools', 'learning', 'development', 'study',
    'work', 'group', 'partner', 'coding', 'programming', 'software',
    'algorithm', 'data', 'analysis', 'methodology', 'framework'
  ];
  
  const queryLower = query.toLowerCase();
  return allowedTopics.some(topic => queryLower.includes(topic));
};

// Generate contextual suggestions based on query
const generateSuggestions = (query) => {
  const queryLower = query.toLowerCase();
  
  // Project-related suggestions
  if (queryLower.includes('project')) {
    return [
      "How do I break down a large project into manageable tasks?",
      "What project management tools work best for student teams?",
      "How to set realistic deadlines for project milestones?",
      "What should I include in a project proposal?"
    ];
  }
  
  // Research-related suggestions
  if (queryLower.includes('research')) {
    return [
      "How do I conduct a systematic literature review?",
      "What research methodology should I choose?",
      "How to write a strong research proposal?",
      "What are the best practices for data collection?"
    ];
  }
  
  // Team/collaboration suggestions
  if (queryLower.includes('team') || queryLower.includes('collaboration')) {
    return [
      "How to resolve conflicts in team projects?",
      "What tools help with remote team collaboration?",
      "How to assign roles effectively in a team?",
      "How to keep team members motivated?"
    ];
  }
  
  // Skill/learning suggestions
  if (queryLower.includes('skill') || queryLower.includes('learn')) {
    return [
      "What programming languages should I learn first?",
      "How to build a portfolio of projects?",
      "What are the most in-demand technical skills?",
      "How to learn new technologies efficiently?"
    ];
  }
  
  // Default suggestions
  return [
    "Help me plan my project timeline",
    "What research methodology should I use?",
    "How can I improve my technical skills?",
    "Give me team collaboration advice"
  ];
};

// Rule-based response system as fallback
const getRuleBasedResponse = (query, context = {}) => {
  const queryLower = query.toLowerCase();

  // Project Planning Guidance
  if (queryLower.includes('project') && (queryLower.includes('plan') || queryLower.includes('timeline'))) {
    return {
      type: 'project_planning',
      response: [
        "Here's a structured approach to project planning: 1) Define clear objectives and deliverables, 2) Break down tasks into manageable milestones, 3) Identify required skills and assign roles, 4) Set realistic timelines with buffer time, 5) Establish communication channels and meeting schedules, 6) Plan for regular progress reviews and adjustments."
      ],
      suggestions: [
        "How do I set realistic project timelines?",
        "What tools should we use for project management?",
        "How to define project scope effectively?"
      ],
      source: 'rule_based'
    };
  }

  // Research Direction Guidance
  if (queryLower.includes('research')) {
    return {
      type: 'research_direction',
      response: [
        "Research direction guidance: 1) Start with a clear research question or hypothesis, 2) Conduct thorough literature review to understand existing work, 3) Identify gaps in current knowledge or technology, 4) Choose appropriate research methodology, 5) Plan data collection and analysis methods, 6) Consider ethical implications and required approvals, 7) Set measurable outcomes and success criteria."
      ],
      suggestions: [
        "How to conduct effective literature review?",
        "What research methodologies should I consider?",
        "How to validate research findings?"
      ],
      source: 'rule_based'
    };
  }

  // Skill Learning Suggestions
  if (queryLower.includes('skill') && (queryLower.includes('learn') || queryLower.includes('improve'))) {
    return {
      type: 'skill_learning',
      response: [
        "Effective skill learning strategies: 1) Start with fundamentals and build progressively, 2) Practice through hands-on projects and exercises, 3) Join study groups or find learning partners, 4) Use multiple learning resources (videos, books, tutorials), 5) Set specific, measurable learning goals, 6) Apply new skills in real projects immediately, 7) Seek feedback from experienced practitioners."
      ],
      suggestions: [
        "What programming languages should I learn first?",
        "How to stay updated with technology trends?",
        "Best resources for learning data science?"
      ],
      source: 'rule_based'
    };
  }

  // Team Collaboration Advice
  if (queryLower.includes('team') && (queryLower.includes('collaboration') || queryLower.includes('work together'))) {
    return {
      type: 'team_collaboration',
      response: [
        "Team collaboration best practices: 1) Establish clear roles and responsibilities, 2) Set up regular communication schedules, 3) Use collaborative tools (Git, Slack, Trello, etc.), 4) Create shared documentation and knowledge base, 5) Practice active listening and constructive feedback, 6) Address conflicts early and professionally, 7) Celebrate team achievements and milestones."
      ],
      suggestions: [
        "How to handle team conflicts effectively?",
        "What tools are best for remote collaboration?",
        "How to keep team motivated throughout the project?"
      ],
      source: 'rule_based'
    };
  }

  // Technology and Tool Recommendations
  if (queryLower.includes('tools') || queryLower.includes('technology')) {
    return {
      type: 'technology_guidance',
      response: [
        "Choosing the right tools and technologies: 1) Align technology choices with project requirements, 2) Consider team's existing skill levels, 3) Evaluate learning curve vs. project timeline, 4) Choose mature, well-documented technologies, 5) Consider scalability and maintenance requirements, 6) Use version control (Git) for all code projects, 7) Set up automated testing and deployment when possible."
      ],
      suggestions: [
        "What's the best tech stack for web development?",
        "How to choose between different frameworks?",
        "What project management tools should we use?"
      ],
      source: 'rule_based'
    };
  }

  // Default response for general queries
  return {
    type: 'general_guidance',
    response: [
      "I'm here to help with project planning, research direction, skill learning, and team collaboration. I can provide guidance on project planning and timeline management, research methodology and direction, skill development and learning strategies, team formation and collaboration best practices, and technology choices and tool recommendations."
    ],
    suggestions: [
      "Help me plan my project timeline",
      "What research methodology should I use?",
      "How can I improve my programming skills?",
      "Give me team collaboration advice"
    ],
    source: 'rule_based'
  };
};

// Error response generator
const getErrorResponse = (message) => {
  return {
    type: 'error',
    response: [message],
    suggestions: [
      "Help me plan my project timeline",
      "What research methodology should I use?",
      "How can I improve my technical skills?",
      "Give me team collaboration advice"
    ],
    source: 'error_handler'
  };
};

module.exports = {
  handleAIGuidance
};