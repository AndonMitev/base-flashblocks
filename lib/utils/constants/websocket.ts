/**
 * WebSocket-related constants
 */

// WebSocket endpoints
export const WS_ENDPOINTS = {
  // Base Sepolia WebSocket endpoint
  BASE_SEPOLIA: 'wss://base-sepolia.drpc.org',

  // Flashblocks WebSocket endpoint (from FLASHBLOCKS_WS_URL in constants)
  FLASHBLOCKS: 'wss://sepolia.flashblocks.base.org/ws'
};

// Common WebSocket options
export const WS_OPTIONS = {
  // Default reconnection attempts
  DEFAULT_RECONNECT_ATTEMPTS: 10,

  // Default maximum reconnection time in milliseconds
  DEFAULT_MAX_RECONNECT_TIME: 30000, // 30 seconds

  // Exponential backoff function for reconnection
  // Returns delay in milliseconds based on attempt number
  getReconnectInterval: (attemptNumber: number) =>
    Math.min(Math.pow(2, attemptNumber) * 1000, 30000) // Exponential backoff with max of 30 seconds
};
