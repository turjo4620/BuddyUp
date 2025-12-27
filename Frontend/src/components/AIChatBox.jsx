import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../api/api';

const AIChatBox = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for academic projects and research. I can help with project planning, research methodology, skill development, and team collaboration. What would you like guidance on?',
      timestamp: new Date().toISOString(),
      suggestions: [
        "Help me plan my project timeline",
        "What research methodology should I use?",
        "How can I improve my programming skills?",
        "Give me team collaboration advice"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAIResponse(inputMessage.trim());
      
      if (response && response.success && response.data) {
        const aiMessage = {
          type: 'ai',
          content: Array.isArray(response.data.response) 
            ? response.data.response.join('\n') 
            : response.data.response,
          suggestions: response.data.suggestions || [],
          timestamp: new Date().toISOString(),
          confidence: response.data.confidence || 'medium',
          source: response.data.source || 'ai'
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setError(error.message || 'Failed to get AI response');
      
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try rephrasing your question or try again later.',
        timestamp: new Date().toISOString(),
        isError: true,
        suggestions: [
          "Help me plan my project timeline",
          "What research methodology should I use?",
          "How can I improve my programming skills?",
          "Give me team collaboration advice"
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus back on input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([
      {
        type: 'ai',
        content: 'Chat cleared! How can I help you with your projects and research?',
        timestamp: new Date().toISOString(),
        suggestions: [
          "Help me plan my project timeline",
          "What research methodology should I use?",
          "How can I improve my programming skills?",
          "Give me team collaboration advice"
        ]
      }
    ]);
    setError(null);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="ai-chat-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '600px',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
            🤖 AI Assistant
          </h3>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Project Planning • Research • Skills • Collaboration
          </p>
        </div>
        <button
          onClick={clearChat}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            color: '#374151',
            fontSize: '12px',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: message.type === 'user' ? '#3b82f6' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0
            }}>
              {message.type === 'user' ? '👤' : '🤖'}
            </div>

            {/* Message Content */}
            <div style={{
              maxWidth: '70%',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: message.type === 'user' ? '#3b82f6' : '#f3f4f6',
                color: message.type === 'user' ? '#ffffff' : '#1f2937',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                border: message.isError ? '1px solid #ef4444' : 'none'
              }}>
                {message.content}
              </div>

              {/* Timestamp and confidence */}
              <div style={{
                fontSize: '11px',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <span>{formatTimestamp(message.timestamp)}</span>
                {message.confidence && (
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: message.confidence === 'high' ? '#dcfce7' : 
                                   message.confidence === 'medium' ? '#fef3c7' : '#fee2e2',
                    color: message.confidence === 'high' ? '#166534' : 
                           message.confidence === 'medium' ? '#92400e' : '#991b1b',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {message.confidence}
                  </span>
                )}
                {message.source && (
                  <span style={{ opacity: 0.7 }}>
                    • {message.source}
                  </span>
                )}
              </div>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginTop: '8px'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    💡 Try asking:
                  </span>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          color: '#374151',
                          fontSize: '11px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#e5e7eb';
                          e.target.style.borderColor = '#9ca3af';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                          e.target.style.borderColor = '#d1d5db';
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              🤖
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          borderTop: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc',
        borderRadius: '0 0 12px 12px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about project planning, research methods, skills, or team collaboration..."
            style={{
              flex: 1,
              minHeight: '40px',
              maxHeight: '120px',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              padding: '10px 16px',
              backgroundColor: (!inputMessage.trim() || isLoading) ? '#9ca3af' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              if (!(!inputMessage.trim() || isLoading)) {
                e.target.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseOut={(e) => {
              if (!(!inputMessage.trim() || isLoading)) {
                e.target.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
        
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>💡</span>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIChatBox;