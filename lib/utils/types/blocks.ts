/**
 * Types for regular blocks
 */

export interface Block {
  number: string;
  hash: string;
  timestamp: string;
  transactions: any[];
  miner: string;
  gasUsed: string;
  gasLimit: string;
}

/**
 * Query key factory for regular blocks
 */
export const blocksKeys = {
  all: ['blocks'] as const,
  live: () => [...blocksKeys.all, 'live'] as const,
  list: () => [...blocksKeys.all, 'list'] as const
};
