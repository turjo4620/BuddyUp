import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false initially to prevent blocking
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simplified auth check that won't fail
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('buddyup_token') || sessionStorage.getItem('buddyup_token');
        const userId = localStorage.getItem('currentUserId');
        const userName = localStorage.getItem('userName');
        
        if (token && userId) {
          // Set auth state with stored user data
          setIsAuthenticated(true);
          setUser({ 
            _id: userId, 
            name: userName || 'User' // Use stored name or fallback to 'User'
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      // Import the API function dynamically to avoid initial load issues
      const { login: apiLogin } = await import('../api/api');
      const response = await apiLogin(username, password);
      
      if (response && response.success) {
        const { token, profile } = response;
        
        // Store token
        if (rememberMe) {
          localStorage.setItem('buddyup_token', token);
          localStorage.setItem('buddyup_remember', 'true');
        } else {
          sessionStorage.setItem('buddyup_token', token);
          localStorage.removeItem('buddyup_remember');
        }
        
        // Store user data
        setUser(profile);
        setIsAuthenticated(true);
        localStorage.setItem('currentUserId', profile._id);
        localStorage.setItem('userName', profile.name); // Store user name for persistence
        
        return { success: true, profile };
      } else {
        return { success: false, message: response?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Import the API function dynamically
      const { register: apiRegister } = await import('../api/api');
      const response = await apiRegister(userData);
      
      if (response && response.success) {
        return { success: true, message: 'Account created successfully! Please log in.' };
      } else {
        return { success: false, message: response?.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all stored data
    localStorage.removeItem('buddyup_token');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userName'); // Clear stored user name
    localStorage.removeItem('buddyup_remember');
    sessionStorage.removeItem('buddyup_token');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedProfile) => {
    setUser(updatedProfile);
    // Update stored user name if it changed
    if (updatedProfile.name) {
      localStorage.setItem('userName', updatedProfile.name);
    }
  };

  const getToken = () => {
    return localStorage.getItem('buddyup_token') || sessionStorage.getItem('buddyup_token');
  };

  const checkAuthStatus = async () => {
    // Simplified version that doesn't make API calls on startup
    const token = localStorage.getItem('buddyup_token') || sessionStorage.getItem('buddyup_token');
    return !!token;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};