'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WS_OPTIONS } from '@/lib/utils/constants/websocket';

// Generate a unique ID for each request
let requestId = 1;

export interface WebSocketOptions {
  /**
   * WebSocket URL to connect to
   */
  url: string;

  /**
   * Callback for when a message is received
   */
  onMessage: (event: MessageEvent) => void;

  /**
   * Callback for when the WebSocket is opened
   * @default undefined
   */
  onOpen?: (event: Event) => void;

  /**
   * Callback for when the WebSocket is closed
   * @default undefined
   */
  onClose?: (event: CloseEvent) => void;

  /**
   * Callback for when an error occurs
   * @default undefined
   */
  onError?: (event: Event) => void;

  /**
   * Maximum number of reconnection attempts
   * @default 10
   */
  reconnectAttempts?: number;

  /**
   * Whether to automatically reconnect when the connection is lost
   * @default true
   */
  shouldAutoReconnect?: boolean;

  /**
   * Maximum time to wait between reconnection attempts in milliseconds
   * @default 30000 (30 seconds)
   */
  maxReconnectTime?: number;
}

/**
 * Base hook for WebSocket connections with common functionality
 */
export function useWebSocketBase(options: WebSocketOptions) {
  const {
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectAttempts = WS_OPTIONS.DEFAULT_RECONNECT_ATTEMPTS,
    shouldAutoReconnect = true,
    maxReconnectTime = WS_OPTIONS.DEFAULT_MAX_RECONNECT_TIME
  } = options;

  // Track connection attempts and last successful connection
  const reconnectCount = useRef(0);
  const lastSuccessfulConnection = useRef<number | null>(null);
  const [isStable, setIsStable] = useState(false);
  const stableConnectionTimer = useRef<NodeJS.Timeout | null>(null);

  // Custom reconnect logic
  const shouldReconnect = useCallback(
    (closeEvent: CloseEvent) => {
      // Don't reconnect if auto-reconnect is disabled
      if (!shouldAutoReconnect) return false;

      // Check if we've exceeded the maximum number of reconnection attempts
      if (reconnectCount.current >= reconnectAttempts) {
        console.warn(
          `WebSocket reconnection failed after ${reconnectAttempts} attempts`
        );
        return false;
      }

      // Increment the reconnection counter
      reconnectCount.current += 1;

      // Log the reconnection attempt
      console.log(
        `WebSocket reconnecting (attempt ${reconnectCount.current}/${reconnectAttempts})`
      );

      return true;
    },
    [reconnectAttempts, shouldAutoReconnect]
  );

  // Custom reconnect interval with exponential backoff
  const getReconnectInterval = useCallback(
    (attemptNumber: number) => {
      // Calculate exponential backoff with jitter
      const baseDelay = Math.min(
        Math.pow(1.5, attemptNumber) * 1000,
        maxReconnectTime
      );
      // Add jitter (±20%) to prevent all clients reconnecting simultaneously
      const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
      return Math.floor(baseDelay + jitter);
    },
    [maxReconnectTime]
  );

  // Use the react-use-websocket hook
  const {
    sendJsonMessage,
    readyState,
    getWebSocket,
    sendMessage,
    lastMessage
  } = useWebSocket(url, {
    onMessage,
    shouldReconnect,
    reconnectAttempts,
    reconnectInterval: getReconnectInterval,
    onOpen: (event) => {
      console.log(`WebSocket connected to ${url}`);

      // Reset reconnect counter on successful connection
      reconnectCount.current = 0;

      // Record successful connection time
      lastSuccessfulConnection.current = Date.now();

      // Set a timer to mark the connection as stable after 10 seconds without disconnection
      if (stableConnectionTimer.current) {
        clearTimeout(stableConnectionTimer.current);
      }

      stableConnectionTimer.current = setTimeout(() => {
        setIsStable(true);
        console.log(`WebSocket connection to ${url} is now stable`);
      }, 10000);

      if (onOpen) onOpen(event);
    },
    onError: (event) => {
      console.error('WebSocket error:', event);
      setIsStable(false);
      if (onError) onError(event);
    },
    onClose: (event) => {
      console.log(`WebSocket disconnected from ${url}`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });

      // Clear the stable connection timer
      if (stableConnectionTimer.current) {
        clearTimeout(stableConnectionTimer.current);
        stableConnectionTimer.current = null;
      }

      setIsStable(false);

      if (onClose) onClose(event);
    },
    // Heartbeat to keep the connection alive
    heartbeat: {
      message: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_ping',
        id: 'heartbeat'
      }),
      interval: 30000, // Send a heartbeat every 30 seconds
      timeout: 10000 // Consider connection dead if no response in 10 seconds
    }
  });

  // Map the ready state to a more user-friendly status
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Disconnecting',
    [ReadyState.CLOSED]: 'Disconnected',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState];

  // Check if connected
  const isConnected = readyState === ReadyState.OPEN;

  // Helper to subscribe to Ethereum JSON-RPC
  const subscribeToNewHeads = useCallback(() => {
    if (isConnected) {
      console.log('Subscribing to newHeads');
      sendJsonMessage({
        jsonrpc: '2.0',
        id: requestId++,
        method: 'eth_subscribe',
        params: ['newHeads']
      });
    } else {
      console.warn('Cannot subscribe to newHeads: WebSocket not connected');
    }
  }, [isConnected, sendJsonMessage]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    const ws = getWebSocket();
    if (ws) {
      console.log('Manually reconnecting WebSocket...');
      ws.close();
      // The library will automatically attempt to reconnect
    }
  }, [getWebSocket]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stableConnectionTimer.current) {
        clearTimeout(stableConnectionTimer.current);
      }
    };
  }, []);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    readyState,
    isStable,
    reconnectCount: reconnectCount.current,

    // WebSocket methods
    sendJsonMessage,
    sendMessage,
    getWebSocket,
    lastMessage,
    reconnect,

    // Ethereum specific helpers
    subscribeToNewHeads
  };
}

// Export ReadyState enum for external use
export { ReadyState };
