'use client';

import BlockHeaderBase from '../shared/BlockHeaderBase';

interface BlockHeaderProps {
  blockTimeMs: number;
  blocksCount: number;
  isConnected: boolean;
  connectionStatus: string;
}

function BlockHeader({
  blockTimeMs,
  blocksCount,
  isConnected,
  connectionStatus
}: BlockHeaderProps) {
  // Custom formatter for block time
  const blockTimeFormatter = (ms: number) => {
    // Log to verify we're getting the correct value
    console.log(`[BLOCK_FORMATTER] Formatting time: ${ms}ms`);

    // Format the time in a more readable way
    if (ms < 1000) {
      return `Block time: ${ms}ms`;
    } else {
      return `Block time: ${(ms / 1000).toFixed(1)}s`;
    }
  };

  // Log the current values for debugging
  console.log('[BLOCK_HEADER] Rendering with values:', {
    blockTimeMs
  });

  // Format the time for the secondary badge
  const formattedTime = `${(blockTimeMs / 1000).toFixed(1)}s`;

  return (
    <BlockHeaderBase
      blockTimeMs={blockTimeMs}
      blocksCount={blocksCount}
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      title='Blocks'
      theme='blue'
      secondaryBadgeText={formattedTime}
      secondaryBadgeIcon='⏱️'
      badgeText='Real-time'
      blockTimeFormatter={blockTimeFormatter}
    />
  );
}

export default BlockHeader;
