/**
 * Format a hex timestamp to a human-readable date string
 */
export function formatTimestamp(timestamp: string | bigint): string {
  if (!timestamp) return 'N/A';

  // Handle different types
  let timestampNum: number;
  if (typeof timestamp === 'bigint') {
    timestampNum = Number(timestamp);
  } else if (typeof timestamp === 'string' && timestamp.startsWith('0x')) {
    // Convert hex timestamp to number
    timestampNum = parseInt(timestamp, 16);
  } else {
    timestampNum = parseInt(String(timestamp), 10);
  }

  const date = new Date(timestampNum * 1000);
  return date.toLocaleString();
}

/**
 * Format a timestamp to a relative time string
 */
export function formatRelativeTime(
  timestamp?: number | string | bigint
): string {
  if (!timestamp) return 'Just now';

  try {
    let timestampNum: number;

    if (typeof timestamp === 'bigint') {
      timestampNum = Number(timestamp);
    } else if (typeof timestamp === 'string') {
      // Handle hex string
      if (timestamp.startsWith('0x')) {
        timestampNum = parseInt(timestamp, 16);
      } else {
        timestampNum = parseInt(timestamp, 10);
      }
    } else {
      timestampNum = timestamp;
    }

    // Import dynamically to avoid server-side issues
    const { formatDistanceToNow } = require('date-fns');
    const date = new Date(timestampNum * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Just now';
  }
}

/**
 * Format time difference in a detailed way (hours, minutes, seconds, milliseconds)
 */
export function formatDetailedTimeDiff(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  // Format the time difference
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const ms = diff % 1000;

  let timeString = '';
  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0) timeString += `${minutes}m `;
  if (seconds > 0) timeString += `${seconds}s `;
  timeString += `${ms}ms`;

  return timeString.trim();
}

/**
 * Format block time display
 */
export function formatBlockTime(ms: number | null): string {
  if (ms === null) return 'Waiting for blocks...';
  return `Flash Block time: ${ms}ms`;
}

/**
 * Format ETH value from wei
 */
export function formatEthValue(value: string): string {
  if (!value || value === '0x0') return '0 ETH';
  try {
    const wei = BigInt(value);
    const eth = Number(wei) / 1e18;
    return eth.toFixed(6) + ' ETH';
  } catch (error) {
    return '0 ETH';
  }
}

/**
 * Format gas used to a human-readable format
 */
export function formatGasUsed(gas: string | bigint): string {
  if (!gas) return 'N/A';

  if (typeof gas === 'bigint') {
    return gas.toLocaleString();
  }

  // Handle hex strings
  if (gas.startsWith('0x')) {
    return BigInt(gas).toLocaleString();
  }

  // Handle decimal strings
  try {
    return BigInt(gas).toLocaleString();
  } catch (e) {
    return 'N/A';
  }
}

/**
 * Truncate a hash for display
 */
export function formatHashTruncated(hash: string): string {
  if (!hash) return 'N/A';
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

/**
 * Format a block number for display
 * Handles both string and bigint block numbers
 */
export function formatBlockNumber(
  blockNumber: string | bigint | number
): string {
  // Convert to string if it's a bigint or number
  const blockNumberStr =
    typeof blockNumber === 'string' ? blockNumber : String(blockNumber);

  // Remove '0x' prefix if present
  const cleanNumber = blockNumberStr.startsWith('0x')
    ? BigInt(blockNumberStr).toString()
    : blockNumberStr;

  return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Process Flashblocks data for display
 * This is a utility function that combines multiple formatters
 */
export function processFlashblocksData(
  payload_id: string,
  index: number,
  blockNumber: string | number,
  blockHash: string,
  gasUsed: string,
  timestamp?: string,
  transactionCount?: number
) {
  return {
    payload_id,
    index,
    blockNumber: formatBlockNumber(blockNumber),
    blockHash: formatHashTruncated(blockHash),
    gasUsed: formatGasUsed(gasUsed),
    timestamp: timestamp ? formatTimestamp(timestamp) : null,
    transactionCount: transactionCount || 0
  };
}
