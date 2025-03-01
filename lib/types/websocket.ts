/**
 * Types for WebSocket connections and block data
 */

// Base block header type from Ethereum JSON-RPC
export interface BlockHeader {
  hash: string;
  number: string;
  parentHash: string;
  timestamp: string;
  gasUsed?: string;
  gasLimit?: string;
  baseFeePerGas?: string;
  miner?: string;
  transactions?: string[];
  // Add any other fields you need from the header
}

// Query key factories for React Query
export const createQueryKeys = (prefix: string) => ({
  all: [prefix] as const,
  live: () => [...createQueryKeys(prefix).all, 'live'] as const,
  list: () => [...createQueryKeys(prefix).all, 'list'] as const
});

// Base options interface for WebSocket block query hooks
export interface BlockQueryOptions {
  /**
   * Maximum number of blocks to keep in cache
   * @default 20 (typically from MAX_BLOCKS constant)
   */
  maxBlocks?: number;
}
