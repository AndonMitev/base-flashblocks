/**
 * Types for regular blocks
 */

export interface Block {
  number: string;
  hash: string;
  timestamp: string;
  transactions: any[]; // Using any[] to accommodate both string hashes and full transaction objects
  miner: string;
  gasUsed: string;
  gasLimit: string;
}
