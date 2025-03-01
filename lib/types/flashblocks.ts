/**
 * Types for Flashblocks WebSocket data
 */

export interface FlashblocksBase {
  parent_hash: string;
  fee_recipient: string;
  block_number: string;
  gas_limit: string;
  timestamp: string;
  base_fee_per_gas: string;
  // ... other base fields ...
}

export interface FlashblocksDiff {
  state_root: string;
  block_hash: string;
  gas_used: string;
  transactions: string[];
  withdrawals: any[];
  receipts_root?: string;
  logs_bloom?: string;
  prev_randao?: string;
  extra_data?: string;
  // ... other diff fields ...
}

export interface FlashblocksReceiptDetails {
  status?: string;
  gasUsed?: string;
  logs?: any[];
  logsBloom?: string;
  transactionHash?: string;
  contractAddress?: string | null;
  blockHash?: string;
  blockNumber?: string;
  transactionIndex?: string;
  cumulativeGasUsed?: string;
  effectiveGasPrice?: string;
  type?: string;
  from?: string;
  to?: string;
}

export interface FlashblocksReceipt {
  status?: string;
  gasUsed?: string;
  logs?: any[];
  logsBloom?: string;
  transactionHash?: string;
  contractAddress?: string | null;
  blockHash?: string;
  blockNumber?: string;
  transactionIndex?: string;
  cumulativeGasUsed?: string;
  effectiveGasPrice?: string;
  type?: string;
  from?: string;
  to?: string;
  Eip1559?: FlashblocksReceiptDetails;
  Deposit?: {
    status: string;
    depositNonce: string;
    // ... other deposit fields ...
  };
  // ... other receipt fields ...
}

export interface FlashblocksMetadata {
  block_number: number;
  new_account_balances: Record<string, string>;
  receipts: Record<string, FlashblocksReceipt>;
  timestamp?: number;
}

export interface FlashblocksPayload {
  payload_id: string;
  index: number;
  base?: FlashblocksBase;
  diff: FlashblocksDiff;
  metadata: FlashblocksMetadata;
}

/**
 * Processed Flashblocks data with formatted values
 */
export interface FormattedFlashblocksData {
  blockNumber: string;
  blockHash: string;
  gasUsed: string;
  timestamp: string | null;
  transactionCount: number;
}

export interface ProcessedFlashblocksPayload extends FlashblocksPayload {
  formattedData: FormattedFlashblocksData;
}
