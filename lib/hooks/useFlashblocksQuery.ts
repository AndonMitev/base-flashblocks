'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { MAX_BLOCKS } from '@/lib/utils/constants';
import { useWebSocketBase } from '@/lib/hooks/useWebSocketBase';
import { WS_ENDPOINTS } from '@/lib/utils/constants/websocket';
import { BlockQueryOptions, createQueryKeys } from '@/lib/types/websocket';
import { FlashblocksPayload } from '@/lib/types/flashblocks';
import { useTransactionCountStore } from '@/lib/utils/state/block';

// Create query keys for flashblocks
export const flashblocksKeys = createQueryKeys('flashblocks');

interface UseFlashblocksQueryOptions extends BlockQueryOptions {
  /**
   * Whether to auto-connect on mount
   * @default true
   */
  autoConnect?: boolean;
}

/**
 * React Query hook for Flashblocks data
 *
 * This hook combines the WebSocket connection with React Query's caching and state management.
 * It provides a clean interface for components to access real-time Flashblocks data.
 *
 * This hook is responsible for:
 * 1. Listening for flashblocks via WebSocket
 * 2. Populating React Query with the received data
 * 3. Ensuring each flashblock has its own unique data (not accumulated)
 */
export function useFlashblocksQuery(options: UseFlashblocksQueryOptions = {}) {
  const { maxBlocks = MAX_BLOCKS, autoConnect = true } = options;

  const queryClient = useQueryClient();
  const [blocks, setBlocks] = useState<FlashblocksPayload[]>([]);

  // Keep track of processed block hashes to avoid duplicates
  const processedBlockHashes = useRef<Set<string>>(new Set());

  // Get transaction count store actions
  const { addTransactions } = useTransactionCountStore();

  // Clear blocks function
  const clearBlocks = useCallback(() => {
    setBlocks([]);
    processedBlockHashes.current.clear();
    queryClient.setQueryData(flashblocksKeys.list(), []);
    // We don't clear the transaction count store here because regular blocks need this data
    // If you need to clear the transaction count store, call clear() directly from the store
  }, [queryClient]);

  // Message handler
  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        let jsonData;

        // Handle different message types
        if (event.data instanceof Blob) {
          // If the message is a Blob, read it as text
          const text = await event.data.text();
          jsonData = JSON.parse(text);
        } else {
          // If it's already a string
          jsonData = JSON.parse(event.data);
        }

        // Create a deep copy of the data to avoid reference issues
        // This is critical to prevent stacking of gas used, gas usage, and balance changes
        const data = JSON.parse(JSON.stringify(jsonData)) as FlashblocksPayload;

        // Skip if we don't have a block hash
        if (!data.diff?.block_hash) {
          console.warn(
            '[FLASHBLOCKS_QUERY] Received flashblock without block hash, skipping'
          );
          return;
        }

        // Generate a unique identifier for this flashblock
        const blockIdentifier = `${data.metadata?.block_number}-${data.index}-${data.diff.block_hash}`;

        // Skip if we've already processed this exact flashblock
        if (processedBlockHashes.current.has(blockIdentifier)) {
          console.log(
            `[FLASHBLOCKS_QUERY] Skipping already processed flashblock: ${blockIdentifier}`
          );
          return;
        }

        // Mark this flashblock as processed
        processedBlockHashes.current.add(blockIdentifier);

        // SIMPLIFIED: Just store transaction count in Zustand for blocks to use
        if (data.diff?.block_hash && data.metadata?.block_number) {
          const blockNumber = Number(data.metadata.block_number);
          const txCount = data.diff.transactions?.length || 0;

          // Add transactions to the block's total in Zustand
          // This data will be consumed by regular blocks, not flashblocks
          addTransactions(blockNumber, txCount);
        }

        // Log the flashblock data for debugging
        console.log(
          `[FLASHBLOCKS_QUERY] Processing new flashblock ${data.index} for block ${data.metadata?.block_number}:`,
          {
            txCount: data.diff.transactions?.length || 0,
            gasUsed: data.diff.gas_used,
            balanceChanges: Object.keys(
              data.metadata?.new_account_balances || {}
            ).length,
            receipts: Object.keys(data.metadata?.receipts || {}).length
          }
        );

        setBlocks((prevBlocks: FlashblocksPayload[]) => {
          // Check if we already have this flashblock by index and block number
          const existingBlockIndex = prevBlocks.findIndex(
            (block) =>
              block.index === data.index &&
              block.metadata?.block_number === data.metadata?.block_number &&
              block.diff?.block_hash === data.diff.block_hash
          );

          let newBlocks;

          if (existingBlockIndex !== -1) {
            // We already have this flashblock, don't update it
            console.log(
              `[FLASHBLOCKS_QUERY] Flashblock ${data.index} for block ${data.metadata?.block_number} already exists, skipping update`
            );
            return prevBlocks;
          } else {
            // Add new block to the beginning of the array
            // We already made a deep copy above, so we can use it directly
            newBlocks = [data, ...prevBlocks];
            console.log(
              `[FLASHBLOCKS_QUERY] Added new flashblock ${
                data.index
              } for block ${
                data.metadata?.block_number
              } with hash ${data.diff.block_hash.substring(0, 10)}...`
            );
          }

          // Limit the number of blocks
          if (newBlocks.length > maxBlocks) {
            return newBlocks.slice(0, maxBlocks);
          }

          return newBlocks;
        });
      } catch (error) {
        console.error(
          '[FLASHBLOCKS_QUERY] Error parsing WebSocket message:',
          error
        );
      }
    },
    [maxBlocks, addTransactions]
  );

  // Use the base WebSocket hook
  const { isConnected, connectionStatus, sendMessage, getWebSocket } =
    useWebSocketBase({
      url: WS_ENDPOINTS.FLASHBLOCKS,
      onMessage: handleMessage,
      onOpen: (event) => {
        console.log('[FLASHBLOCKS_QUERY] Flashblocks WebSocket connected');
        const ws = event.target as WebSocket;
        ws.binaryType = 'blob'; // Ensure binary type is set to blob
      }
    });

  // Manual connect function
  const connect = useCallback(() => {
    const ws = getWebSocket();
    if (ws && ws.readyState === WebSocket.CLOSED) {
      // The library will automatically attempt to reconnect
      // This is just to force a reconnection if needed
      ws.close();
    }
  }, [getWebSocket]);

  // Manual disconnect function
  const disconnect = useCallback(() => {
    const ws = getWebSocket();
    if (ws) {
      ws.close();
    }
  }, [getWebSocket]);

  // Update the query cache whenever we get new blocks from WebSocket
  useEffect(() => {
    if (blocks.length > 0) {
      // Update the blocks list in the cache
      queryClient.setQueryData(flashblocksKeys.list(), blocks);
      console.log(
        `[FLASHBLOCKS_QUERY] Updated React Query cache with ${blocks.length} flashblocks`
      );
    }
  }, [blocks, queryClient]);

  // Query for the blocks list
  const blocksQuery = useQuery({
    queryKey: flashblocksKeys.list(),
    queryFn: () => blocks,
    // No need to refetch as data comes from WebSocket
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    // Always return the cached data
    staleTime: Infinity
  });

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
      console.log(
        '[FLASHBLOCKS_QUERY] Auto-connecting to Flashblocks WebSocket'
      );
    }

    // Cleanup on unmount
    return () => {
      disconnect();
      console.log(
        '[FLASHBLOCKS_QUERY] Disconnecting from Flashblocks WebSocket'
      );
    };
  }, [autoConnect, connect, disconnect]);

  return {
    // Data
    blocks: blocksQuery.data || [],
    isConnected,
    connectionStatus,

    // Actions
    connect,
    disconnect,
    clearBlocks,

    // Query states
    isLoading: blocksQuery.isLoading,
    isError: blocksQuery.isError,
    error: blocksQuery.error
  };
}
