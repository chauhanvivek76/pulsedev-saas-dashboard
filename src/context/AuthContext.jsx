import { createContext, useContext, useState, useEffect } from 'react';
import { logger, LOG_CATEGORIES } from '../middleware/logger';

const AuthContext = createContext(null);

const MOCK_USER_KEY = 'pulsedev_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(MOCK_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  // Check for active mock user session on startup
  useEffect(() => {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        logger.info(LOG_CATEGORIES.AUTH, `Restored active session for user: ${parsedUser.email}`, { email: parsedUser.email });
      } catch (error) {
        logger.error(LOG_CATEGORIES.ERROR, 'Failed to parse session on startup', { error: error.message });
      }
    } else {
      logger.info(LOG_CATEGORIES.AUTH, 'No active user session found on startup');
    }
  }, []);

  const login = async (email, password) => {
    logger.info(LOG_CATEGORIES.AUTH, `Login attempt initiated`, { email });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple validation
    if (!email || !password) {
      const errMsg = 'Email and password are required';
      logger.warn(LOG_CATEGORIES.AUTH, `Login failed: missing fields`, { email });
      throw new Error(errMsg);
    }

    if (password.length < 6) {
      const errMsg = 'Password must be at least 6 characters';
      logger.warn(LOG_CATEGORIES.AUTH, `Login failed: password too short`, { email });
      throw new Error(errMsg);
    }

    // Mock successful authentication
    const mockUser = {
      id: 'usr_mock_123',
      name: email.split('@')[0].toUpperCase(),
      email,
      role: 'Administrator',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);

    logger.info(LOG_CATEGORIES.AUTH, `User authenticated successfully: ${email}`, {
      userId: mockUser.id,
      email: mockUser.email
    });

    return mockUser;
  };

  const register = async (name, email, password) => {
    logger.info(LOG_CATEGORIES.AUTH, `Registration attempt initiated`, { email, name });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      const errMsg = 'All signup fields are required';
      logger.warn(LOG_CATEGORIES.AUTH, `Registration failed: missing fields`, { email });
      throw new Error(errMsg);
    }

    if (password.length < 6) {
      const errMsg = 'Password must be at least 6 characters';
      logger.warn(LOG_CATEGORIES.AUTH, `Registration failed: password too short`, { email });
      throw new Error(errMsg);
    }

    const mockUser = {
      id: `usr_mock_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role: 'Administrator',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);

    logger.info(LOG_CATEGORIES.AUTH, `New account registered and logged in: ${email}`, {
      userId: mockUser.id,
      email: mockUser.email
    });

    return mockUser;
  };

  const logout = () => {
    const userEmail = user?.email || 'Unknown';
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    logger.info(LOG_CATEGORIES.AUTH, `User logged out: ${userEmail}`, { email: userEmail });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
