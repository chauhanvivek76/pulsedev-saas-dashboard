import { logger, LOG_CATEGORIES } from '../middleware/logger';
import { sleep } from '../utils/helpers';

/**
 * Mock API Service Layer
 * 
 * Simulates REST API communication. Hooks into centralized logger
 * to record API requests and responses, adding simulated latency.
 */

// Environment Variables simulator (as requested: "Use environment variables for API URLs")
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pulsedev.internal/v1';

// Initial Mock data for server commit activities
let MOCK_ACTIVITIES = [
  { id: 'act-1', developer: 'Alex Mercer', action: 'git push', target: 'main', status: 'Success', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 'act-2', developer: 'Sarah Conner', action: 'deploy build', target: 'production-v2.1', status: 'Success', timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString() },
  { id: 'act-3', developer: 'John Doe', action: 'db backup', target: 'postgres-backup-db', status: 'Success', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'act-4', developer: 'David Miller', action: 'git merge', target: 'feature/auth-hooks', status: 'Failed', timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
  { id: 'act-5', developer: 'Alex Mercer', action: 'git commit', target: 'feature/logs-middleware', status: 'Success', timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString() },
  { id: 'act-6', developer: 'Sarah Conner', action: 'docker compose up', target: 'redis-cache-cluster', status: 'Success', timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString() },
];

/**
 * Helper to log and wrap API Requests
 */
const mockFetch = async (method, endpoint, payload = null, simulateError = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log request initiation
  logger.info(LOG_CATEGORIES.API_REQ, `${method} Request sent to ${endpoint}`, {
    url,
    method,
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });

  // Simulate network delay
  const latency = Math.floor(Math.random() * 600) + 200; // 200ms - 800ms
  await sleep(latency);

  if (simulateError) {
    const errorMsg = 'Internal Server Exception (Simulated API Failure)';
    
    // Log request failure
    logger.error(LOG_CATEGORIES.API_RES, `${method} Request failed: ${endpoint}`, {
      url,
      status: 500,
      statusText: 'Internal Server Error',
      error: errorMsg
    });
    
    throw new Error(errorMsg);
  }

  // Generate success payload
  let data;

  if (endpoint === '/metrics') {
    data = {
      cpuUsage: +(40 + Math.random() * 25).toFixed(1),
      memoryUsage: +(60 + Math.random() * 15).toFixed(1),
      uptime: '14d 6h 32m',
      requestsPerSecond: Math.floor(180 + Math.random() * 80),
      activeSessions: Math.floor(1250 + Math.random() * 300),
      latencyMs: Math.floor(40 + Math.random() * 25)
    };
  } else if (endpoint === '/activities') {
    data = [...MOCK_ACTIVITIES];
  } else if (endpoint === '/activities/create') {
    const newActivity = {
      id: `act-${Date.now()}`,
      developer: payload.developer || 'System Scheduler',
      action: payload.action || 'Unknown Event',
      target: payload.target || 'N/A',
      status: payload.status || 'Success',
      timestamp: new Date().toISOString()
    };
    MOCK_ACTIVITIES = [newActivity, ...MOCK_ACTIVITIES];
    data = newActivity;
  } else if (endpoint === '/settings') {
    data = { success: true, updatedFields: payload };
  } else {
    data = { success: true };
  }

  // Log response success
  logger.info(LOG_CATEGORIES.API_RES, `${method} Response received: ${endpoint}`, {
    url,
    status: 200,
    statusText: 'OK',
    responseData: data
  });

  return data;
};

export const apiService = {
  getMetrics: () => mockFetch('GET', '/metrics'),
  getActivities: (simulateError = false) => mockFetch('GET', '/activities', null, simulateError),
  createActivity: (activityPayload) => mockFetch('POST', '/activities/create', activityPayload),
  updateSettings: (settingsPayload) => mockFetch('POST', '/settings', settingsPayload),
  triggerApiError: () => mockFetch('GET', '/trigger-error', null, true)
};

export default apiService;
