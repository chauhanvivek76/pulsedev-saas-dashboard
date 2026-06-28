/**
 * Centralized Logging Middleware
 * 
 * Exposes methods to log application events systematically.
 * Integrates with log listeners so pages (like the Logs Console) can display logs live.
 */

// Log categories supported by the application
export const LOG_CATEGORIES = {
  APP: 'APP',
  NAVIGATION: 'NAVIGATION',
  API_REQ: 'API_REQUEST',
  API_RES: 'API_RESPONSE',
  FORM: 'FORM_SUBMIT',
  BUTTON: 'BUTTON_CLICK',
  CRUD: 'CRUD_OP',
  AUTH: 'AUTH_EVENT',
  ERROR: 'ERROR_EXCEPTION'
};

// Log levels
export const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

// In-memory array of listeners subscribing to new logs
const listeners = new Set();

/**
 * Subscribes a listener function to log events.
 * @param {Function} listener 
 * @returns {Function} Unsubscribe function
 */
export const subscribeToLogs = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Formats and writes a log entry, notifying all subscribers.
 */
const createLog = (level, category, message, data = null) => {
  const timestamp = new Date().toISOString();
  // Safe random ID generation
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const logEntry = {
    id,
    timestamp,
    level,
    category,
    message,
    data: data ? JSON.parse(JSON.stringify(data)) : null // Deep copy to prevent mutability issues
  };

  // 1. Output to browser console with professional styling
  const colors = {
    [LOG_LEVELS.INFO]: 'color: #0ea5e9; font-weight: bold;',
    [LOG_LEVELS.WARN]: 'color: #eab308; font-weight: bold;',
    [LOG_LEVELS.ERROR]: 'color: #ef4444; font-weight: bold;'
  };
  
  const categoryStyles = 'color: #a855f7; font-weight: 500; font-family: monospace;';

  console.log(
    `%c[${level}]%c [${category}] %c${message}`,
    colors[level],
    categoryStyles,
    'color: inherit;',
    data ? data : ''
  );

  // 2. Dispatch to all active log subscribers (e.g. Logs Context/UI Console)
  listeners.forEach((listener) => {
    try {
      listener(logEntry);
    } catch (err) {
      // Prevent listener errors from crashing the app or creating infinite logging loops
      console.error('Error executing log listener:', err);
    }
  });

  return logEntry;
};

export const logger = {
  info: (category, message, data) => createLog(LOG_LEVELS.INFO, category, message, data),
  warn: (category, message, data) => createLog(LOG_LEVELS.WARN, category, message, data),
  error: (category, message, data) => createLog(LOG_LEVELS.ERROR, category, message, data)
};
