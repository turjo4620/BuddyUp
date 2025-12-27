// Enhanced AI Guidance Support with Multiple Providers and Better Integration
const axios = require('axios');

// AI Provider Configuration
const AI_PROVIDERS = {
  huggingface: {
    baseUrl: 'https://api-inference.huggingface.co/models',
    models: {
      textGeneration: 'gpt2',
      conversational: 'microsoft/DialoGPT-medium',
      questionAnswering: 'deepset/roberta-base-squad2'
    },
    token: process.env.HUGGING_FACE_API_TOKEN
  }
};

// Main AI guidance handler with enhanced capabilities
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

  // Try AI providers in order of preference
  const providers = ['huggingface', 'enhanced_rules'];
  
  for (const provider of providers) {
    try {
      console.log(`🔄 Trying AI provider: ${provider}`);
      
      let response;
      switch (provider) {
        case 'huggingface':
          response = await getHuggingFaceResponse(query, context);
          break;
        case 'enhanced_rules':
          response = getEnhancedRuleBasedResponse(query, context);
          break;
      }

      if (response && response.response && response.response.length > 0) {
        console.log(`✅ AI response generated using: ${provider}`);
        return {
          ...response,
          provider: provider,
          timestamp: new Date().toISOString(),
          query: query
        };
      }
    } catch (error) {
      console.log(`❌ Provider ${provider} failed:`, error.message);
      continue;
    }
  }

  // Final fallback
  console.log('🔄 Using final fallback response');
  return getFallbackResponse(query);
};

// Validate if query is appropriate for our AI
const isValidQuery = (query) => {
  const allowedTopics = [
    'project', 'research', 'skill', 'team', 'collaboration', 'planning',
    'timeline', 'technology', 'tools', 'learning', 'development', 'study',
    'work', 'group', 'partner', 'coding', 'programming', 'software',
    'algorithm', 'data', 'analysis', 'methodology', 'framework', 'career'
  ];
  
  const queryLower = query.toLowerCase();
  return allowedTopics.some(topic => queryLower.includes(topic));
};

// Enhanced Hugging Face integration with better prompting
const getHuggingFaceResponse = async (query, context = {}) => {
  try {
    // Create context-aware prompt
    const systemPrompt = createSystemPrompt(query, context);
    const fullPrompt = `${systemPrompt}\n\nQuestion: ${query}\nAnswer:`;
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (AI_PROVIDERS.huggingface.token) {
      headers['Authorization'] = `Bearer ${AI_PROVIDERS.huggingface.token}`;
    }

    // Try text generation model
    const response = await axios.post(
      `${AI_PROVIDERS.huggingface.baseUrl}/${AI_PROVIDERS.huggingface.models.textGeneration}`,
      {
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.2,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      },
      {
        headers,
        timeout: 20000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      let aiResponse = response.data[0].generated_text.trim();
      
      // Clean and validate response
      aiResponse = cleanAIResponse(aiResponse, fullPrompt);
      
      if (aiResponse && aiResponse.length > 20) {
        return {
          type: 'ai_response',
          response: [aiResponse],
          suggestions: generateContextualSuggestions(query, context),
          confidence: 'high',
          source: 'huggingface_ai'
        };
      }
    }

    // If text generation fails, try conversational model
    return await tryConversationalModel(query, context);
    
  } catch (error) {
    console.error('Hugging Face API error:', error.message);
    
    if (error.response?.status === 429) {
      console.log('Rate limited, implementing backoff...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error('Rate limited, please try again in a moment');
    }
    
    throw error;
  }
};

// Try conversational model as backup
const tryConversationalModel = async (query, context) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (AI_PROVIDERS.huggingface.token) {
      headers['Authorization'] = `Bearer ${AI_PROVIDERS.huggingface.token}`;
    }

    const response = await axios.post(
      `${AI_PROVIDERS.huggingface.baseUrl}/${AI_PROVIDERS.huggingface.models.conversational}`,
      {
        inputs: {
          past_user_inputs: [],
          generated_responses: [],
          text: query
        },
        parameters: {
          max_length: 200,
          temperature: 0.8
        }
      },
      {
        headers,
        timeout: 15000
      }
    );

    if (response.data && response.data.generated_text) {
      const aiResponse = cleanAIResponse(response.data.generated_text);
      
      if (aiResponse && aiResponse.length > 15) {
        return {
          type: 'ai_response',
          response: [aiResponse],
          suggestions: generateContextualSuggestions(query, context),
          confidence: 'medium',
          source: 'huggingface_conversational'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Conversational model failed:', error.message);
    return null;
  }
};

// Create context-aware system prompt
const createSystemPrompt = (query, context) => {
  const basePrompt = `You are an AI assistant helping university students with academic projects and research. Provide practical, actionable advice in 2-3 sentences.`;
  
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('project') && queryLower.includes('plan')) {
    return `${basePrompt} Focus on project planning, timeline management, and milestone setting.`;
  } else if (queryLower.includes('research')) {
    return `${basePrompt} Focus on research methodology, literature review, and academic best practices.`;
  } else if (queryLower.includes('team') || queryLower.includes('collaboration')) {
    return `${basePrompt} Focus on team dynamics, communication, and collaborative tools.`;
  } else if (queryLower.includes('skill') || queryLower.includes('learn')) {
    return `${basePrompt} Focus on skill development, learning resources, and career growth.`;
  }
  
  return basePrompt;
};

// Clean and validate AI response
const cleanAIResponse = (response, originalPrompt = '') => {
  if (!response) return null;
  
  // Remove the original prompt if it appears in the response
  if (originalPrompt) {
    response = response.replace(originalPrompt, '').trim();
  }
  
  // Remove common artifacts
  response = response
    .replace(/^(Answer:|Question:|A:|Q:)/i, '')
    .replace(/Student:|Assistant:/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Remove incomplete sentences at the end
  const sentences = response.split(/[.!?]+/);
  if (sentences.length > 1 && sentences[sentences.length - 1].trim().length < 10) {
    sentences.pop();
    response = sentences.join('. ').trim() + '.';
  }
  
  // Validate response quality
  if (response.length < 10 || 
      response.includes('undefined') || 
      response.includes('null') ||
      response.toLowerCase().includes('i cannot') ||
      response.toLowerCase().includes('i am not able')) {
    return null;
  }
  
  return response;
};

// Generate contextual suggestions based on query and context
const generateContextualSuggestions = (query, context = {}) => {
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

// Enhanced rule-based responses with better categorization
const getEnhancedRuleBasedResponse = (query, context = {}) => {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(' ');
  
  // Advanced pattern matching
  const patterns = {
    projectPlanning: ['project', 'plan', 'planning', 'timeline', 'schedule', 'milestone'],
    research: ['research', 'study', 'investigation', 'analysis', 'methodology', 'literature'],
    teamwork: ['team', 'collaboration', 'group', 'partner', 'member', 'communicate'],
    skills: ['skill', 'learn', 'learning', 'develop', 'improve', 'technology', 'programming'],
    tools: ['tool', 'software', 'platform', 'framework', 'library', 'technology'],
    career: ['career', 'job', 'internship', 'portfolio', 'resume', 'interview']
  };
  
  // Calculate pattern scores
  const scores = {};
  Object.keys(patterns).forEach(category => {
    scores[category] = patterns[category].reduce((score, keyword) => {
      return score + (words.includes(keyword) ? 1 : 0);
    }, 0);
  });
  
  // Find the best matching category
  const bestCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  // Generate response based on best category
  switch (bestCategory) {
    case 'projectPlanning':
      return getProjectPlanningResponse(query, context);
    case 'research':
      return getResearchResponse(query, context);
    case 'teamwork':
      return getTeamworkResponse(query, context);
    case 'skills':
      return getSkillsResponse(query, context);
    case 'tools':
      return getToolsResponse(query, context);
    case 'career':
      return getCareerResponse(query, context);
    default:
      return getGeneralResponse(query, context);
  }
};

// Specialized response generators
const getProjectPlanningResponse = (query, context) => {
  return {
    type: 'project_planning',
    response: [
      "Effective project planning involves: 1) Clear goal definition and success metrics, 2) Breaking work into manageable tasks, 3) Realistic timelines with buffer time, 4) Regular team communication and progress reviews, 5) Flexibility to adapt when challenges arise."
    ],
    suggestions: [
      "How do I create a realistic project timeline?",
      "What project management tools work best for students?",
      "How to manage project risks effectively?",
      "What should I include in a project charter?"
    ],
    source: 'enhanced_rules',
    confidence: 'high'
  };
};

const getResearchResponse = (query, context) => {
  return {
    type: 'research_guidance',
    response: [
      "Strong research approach: 1) Start with a clear, focused research question, 2) Conduct thorough literature review to understand existing work, 3) Choose appropriate methodology for your question type, 4) Plan systematic data collection and analysis, 5) Consider ethical implications and get necessary approvals."
    ],
    suggestions: [
      "How do I conduct a systematic literature review?",
      "What research methodology should I choose?",
      "How to ensure research ethics compliance?",
      "What are best practices for data collection?"
    ],
    source: 'enhanced_rules',
    confidence: 'high'
  };
};

const getTeamworkResponse = (query, context) => {
  return {
    type: 'team_collaboration',
    response: [
      "Effective team collaboration requires: 1) Clear role definition and responsibilities, 2) Regular communication through scheduled meetings and sync updates, 3) Shared tools for documentation and project tracking, 4) Conflict resolution process and open feedback culture, 5) Celebrating milestones and team achievements together."
    ],
    suggestions: [
      "How to resolve team conflicts constructively?",
      "What tools work best for remote collaboration?",
      "How to assign roles effectively in a team?",
      "How to keep team members motivated and engaged?"
    ],
    source: 'enhanced_rules',
    confidence: 'high'
  };
};

const getSkillsResponse = (query, context) => {
  return {
    type: 'skill_development',
    response: [
      "Strategic skill development: 1) Identify skills gaps through job market research and self-assessment, 2) Create a learning roadmap with short-term and long-term goals, 3) Use multiple learning methods (courses, projects, mentorship), 4) Build a portfolio showcasing your skills through real projects, 5) Join communities and seek feedback from experienced practitioners."
    ],
    suggestions: [
      "What programming languages are most in-demand?",
      "How to build an impressive project portfolio?",
      "What are the best online learning platforms?",
      "How to find mentors in my field?"
    ],
    source: 'enhanced_rules',
    confidence: 'high'
  };
};

const getToolsResponse = (query, context) => {
  return {
    type: 'technology_guidance',
    response: [
      "Choosing the right tools: 1) Align tool selection with project requirements and team skills, 2) Consider learning curve vs. project timeline constraints, 3) Prioritize tools with good documentation and community support, 4) Start with industry-standard tools in your field, 5) Evaluate cost, scalability, and integration capabilities."
    ],
    suggestions: [
      "What development tools should I learn first?",
      "How to choose between different frameworks?",
      "What project management tools work best for students?",
      "Which collaboration tools are most effective?"
    ],
    source: 'enhanced_rules',
    confidence: 'high'
  };
};

const getCareerResponse = (query, context) => {
  return {
    type: 'career_guidance',
    response: [
      "Career development strategy: 1) Build a strong portfolio showcasing diverse projects and skills, 2) Network actively through online communities, events, and informational interviews, 3) Gain practical experience through internships, freelance work, or open-source contributions, 4) Stay updated with industry trends and continuously upskill, 5) Develop both technical and soft skills for well-rounded professional growth."
    ],
    suggestions: [
      "How to build an impressive portfolio?",
      "What should I include on my resume?",
      "How to prepare for technical interviews?",
      "How to find internship opportunities?"
    ],
    source: 'enhanced_rules',
    confidence: 'high'
  };
};

const getGeneralResponse = (query, context) => {
  return {
    type: 'general_guidance',
    response: [
      "I'm here to help with academic and professional development! I can provide guidance on project planning, research methodology and direction, skill development and learning strategies, team formation and collaboration best practices, and technology choices and tool recommendations."
    ],
    suggestions: [
      "Help me plan my project timeline",
      "What research methodology should I use?",
      "How can I improve my technical skills?",
      "Give me team collaboration advice"
    ],
    source: 'enhanced_rules',
    confidence: 'medium'
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
    source: 'error_handler',
    confidence: 'low'
  };
};

// Fallback response when all else fails
const getFallbackResponse = (query) => {
  return {
    type: 'fallback',
    response: [
      "I understand you're looking for guidance, but I'm having trouble processing your request right now. I specialize in helping with project planning, skill development, research methodology, and team collaboration. Could you rephrase your question focusing on one of these areas?"
    ],
    suggestions: [
      "Help me plan my project timeline",
      "What research methodology should I use?",
      "How can I improve my programming skills?",
      "Give me team collaboration advice"
    ],
    source: 'fallback',
    confidence: 'low'
  };
};

module.exports = {
  handleAIGuidance
};