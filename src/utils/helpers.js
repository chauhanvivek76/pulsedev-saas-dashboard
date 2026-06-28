/**
 * General Utilities & Helper Functions
 */

/**
 * Simulates an asynchronous delay (sleep).
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formats an ISO date string into a localized readable format.
 * @param {string|Date} dateVal 
 * @returns {string} Formatted date
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Formats a short timestamp for the log visualizer.
 * @param {string|Date} dateVal 
 * @returns {string} Formatted time (HH:MM:SS)
 */
export const formatTime = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
};

/**
 * Formats a percentage rate
 * @param {number} value 
 * @returns {string} Formatted percentage
 */
export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};
