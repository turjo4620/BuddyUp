import React, { useState, useEffect } from 'react';
import { testBackendConnection, getCurrentMode, setMockMode } from '../api/api';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState(getCurrentMode());

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    const connected = await testBackendConnection();
    setIsConnected(connected);
    setIsLoading(false);
    
    // If backend is not connected, automatically switch to mock mode
    if (!connected && currentMode === 'REAL') {
      handleModeSwitch(true);
    }
  };

  const handleModeSwitch = (useMock) => {
    setMockMode(useMock);
    setCurrentMode(getCurrentMode());
    
    if (!useMock) {
      // If switching to real mode, test connection
      checkConnection();
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '0.5rem 1rem', 
        background: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        textAlign: 'center',
        fontSize: '0.875rem'
      }}>
        🔍 Checking backend connection...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '0.5rem 1rem', 
      background: isConnected ? '#d4edda' : '#fff3cd', 
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.875rem'
    }}>
      <div>
        {isConnected ? (
          <span>✅ Backend Connected (http://localhost:5000)</span>
        ) : (
          <span>⚠️ Backend Offline - Using Mock Data</span>
        )}
        <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>
          Mode: {currentMode}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => handleModeSwitch(true)}
          disabled={currentMode === 'MOCK'}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #ccc',
            borderRadius: '3px',
            background: currentMode === 'MOCK' ? '#007bff' : 'white',
            color: currentMode === 'MOCK' ? 'white' : 'black',
            cursor: currentMode === 'MOCK' ? 'default' : 'pointer',
            fontSize: '0.75rem'
          }}
        >
          Mock
        </button>
        
        <button
          onClick={() => handleModeSwitch(false)}
          disabled={currentMode === 'REAL'}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #ccc',
            borderRadius: '3px',
            background: currentMode === 'REAL' ? '#007bff' : 'white',
            color: currentMode === 'REAL' ? 'white' : 'black',
            cursor: currentMode === 'REAL' ? 'default' : 'pointer',
            fontSize: '0.75rem'
          }}
        >
          Real
        </button>
        
        <button
          onClick={checkConnection}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #28a745',
            borderRadius: '3px',
            background: '#28a745',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          Test
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus;