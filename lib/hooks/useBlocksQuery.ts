'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { MAX_BLOCKS } from '@/lib/utils/constants';
import { useWebSocketBase } from '@/lib/hooks/useWebSocketBase';
import { WS_ENDPOINTS } from '@/lib/utils/constants/websocket';
import {
  BlockHeader,
  BlockQueryOptions,
  createQueryKeys
} from '@/lib/types/websocket';

// Create query keys for blocks
export const blocksKeys = createQueryKeys('blocks');

/**
 * React Query hook for live Base Sepolia blocks using WebSocket
 * Simplified version with cleaner implementation
 */
export function useBlocksQuery(options: BlockQueryOptions = {}) {
  const { maxBlocks = MAX_BLOCKS } = options;

  const queryClient = useQueryClient();
  const [blocks, setBlocks] = useState<BlockHeader[]>([]);
  const [blockTimeMs, setBlockTimeMs] = useState<number | null>(null);
  const [lastBlockTime, setLastBlockTime] = useState<number | null>(null);
  const [blockTimes, setBlockTimes] = useState<number[]>([]);
  const [connectionErrors, setConnectionErrors] = useState<string[]>([]);
  const subscriptionId = useRef<string | null>(null);
  const [lastReconnectTime, setLastReconnectTime] = useState<number | null>(
    null
  );

  // Process new block header
  const processNewBlock = useCallback(
    (blockHeader: BlockHeader) => {
      const now = Date.now();

      // Validate block header
      if (!blockHeader || !blockHeader.hash || !blockHeader.number) {
        console.warn('Received invalid block header:', blockHeader);
        return;
      }

      // Calculate block time
      if (lastBlockTime) {
        const newBlockTime = now - lastBlockTime;
        setBlockTimes((prev) => {
          const updated = [...prev, newBlockTime].slice(-5);
          const avgBlockTime = Math.round(
            updated.reduce((sum, time) => sum + time, 0) / updated.length
          );
          setBlockTimeMs(avgBlockTime);
          return updated;
        });
      }

      setLastBlockTime(now);

      // Enhanced logging for debugging transaction issues
      console.log('FULL BLOCK HEADER:', JSON.stringify(blockHeader, null, 2));

      // Check if transactions field exists and what type it is
      console.log('Transaction field details:', {
        exists: blockHeader.hasOwnProperty('transactions'),
        type: typeof blockHeader.transactions,
        value: blockHeader.transactions,
        isArray: Array.isArray(blockHeader.transactions),
        length: Array.isArray(blockHeader.transactions)
          ? blockHeader.transactions.length
          : 'N/A'
      });

      // Update blocks
      setBlocks((prevBlocks) => {
        // Check if we already have this block
        if (prevBlocks.some((block) => block.hash === blockHeader.hash)) {
          console.log(
            'Block already exists in cache, skipping:',
            blockHeader.number
          );
          return prevBlocks;
        }

        // Add new block to the beginning of the array
        const newBlocks = [blockHeader, ...prevBlocks];

        // Limit the number of blocks
        if (newBlocks.length > maxBlocks) {
          return newBlocks.slice(0, maxBlocks);
        }

        return newBlocks;
      });
    },
    [lastBlockTime, maxBlocks]
  );

  // Handle WebSocket message
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        // Log the raw message for debugging
        console.log(
          'Raw WebSocket message:',
          event.data.substring(0, 500) + (event.data.length > 500 ? '...' : '')
        );

        const data = JSON.parse(event.data);

        // Check if this is a subscription message
        if (data.method === 'eth_subscription' && data.params?.result) {
          // Store subscription ID if not already stored
          if (!subscriptionId.current && data.params.subscription) {
            subscriptionId.current = data.params.subscription;
            console.log('Stored subscription ID:', data.params.subscription);
          }

          // Log the subscription data structure
          console.log('Subscription data structure:', {
            method: data.method,
            paramsType: typeof data.params,
            resultType: typeof data.params.result,
            subscription: data.params.subscription
          });

          processNewBlock(data.params.result as BlockHeader);
        } else if (data.id && data.result) {
          // This is a response to our subscription request
          console.log('Subscription confirmed, ID:', data.result);
          subscriptionId.current = data.result;
        } else if (data.error) {
          // Handle error responses
          console.error('WebSocket error response:', data.error);
          setConnectionErrors((prev) => [
            ...prev.slice(-4),
            `Error: ${data.error.message || 'Unknown error'}`
          ]);
        } else {
          // Log other message types for debugging
          console.log('Other WebSocket message type:', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        setConnectionErrors((prev) => [
          ...prev.slice(-4),
          `Parse error: ${(error as Error).message}`
        ]);
      }
    },
    [processNewBlock]
  );

  // Subscribe to newHeads
  const subscribeToBlocks = useCallback(() => {
    console.log('Attempting to subscribe to newHeads');

    // Try subscription with includeTransactions parameter
    try {
      // Format with includeTransactions: true to get full transaction data
      sendJsonMessage({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'eth_subscribe',
        params: ['newHeads', { includeTransactions: true }]
      });

      // Also try the standard format as fallback
      setTimeout(() => {
        if (!subscriptionId.current) {
          console.log('Trying standard subscription format...');
          sendJsonMessage({
            jsonrpc: '2.0',
            id: Date.now() + 1,
            method: 'eth_subscribe',
            params: ['newHeads']
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Error sending subscription request:', error);
    }
  }, []);

  // Use the base WebSocket hook
  const {
    isConnected,
    connectionStatus,
    readyState,
    isStable,
    reconnect,
    sendJsonMessage
  } = useWebSocketBase({
    url: WS_ENDPOINTS.BASE_SEPOLIA,
    onMessage: handleMessage,
    onError: (event) => {
      console.error('WebSocket error event:', event);
      setConnectionErrors((prev) => [
        ...prev.slice(-4),
        `WebSocket error: ${(event as ErrorEvent).message || 'Unknown error'}`
      ]);
    },
    onClose: (event) => {
      console.log('WebSocket closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      subscriptionId.current = null;
    },
    onOpen: () => {
      console.log('WebSocket opened, subscribing to newHeads...');
      setConnectionErrors([]);
      subscriptionId.current = null;

      // Attempt to subscribe
      setTimeout(() => {
        subscribeToBlocks();
      }, 500);
    },
    reconnectAttempts: 10,
    maxReconnectTime: 30000
  });

  // Update the query cache whenever we get new blocks
  useEffect(() => {
    if (blocks.length > 0) {
      queryClient.setQueryData(blocksKeys.list(), blocks);
    }
  }, [blocks, queryClient]);

  // Query for the blocks list
  const blocksQuery = useQuery({
    queryKey: blocksKeys.list(),
    queryFn: () => blocks,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });

  // Handle manual reconnection with rate limiting
  const handleReconnect = useCallback(() => {
    const now = Date.now();
    // Prevent reconnecting more than once every 10 seconds
    if (!lastReconnectTime || now - lastReconnectTime > 10000) {
      setLastReconnectTime(now);
      // Clear subscription state
      subscriptionId.current = null;
      // Force reconnection
      reconnect();
    }
  }, [lastReconnectTime, reconnect]);

  return {
    // Data
    blocks: blocksQuery.data || [],
    isConnected,
    connectionStatus,
    blockTimeMs,
    isStable,
    connectionErrors,

    // Query states
    isLoading: blocksQuery.isLoading,
    isError: blocksQuery.isError,
    error: blocksQuery.error,

    // Actions
    reconnect: handleReconnect
  };
}
