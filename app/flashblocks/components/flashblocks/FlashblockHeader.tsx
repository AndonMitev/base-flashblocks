'use client';

import BlockHeaderBase from '../shared/BlockHeaderBase';

interface FlashblockHeaderProps {
  blockTimeMs: number;
  blocksCount: number;
  isConnected: boolean;
  connectionStatus: string;
}

function FlashblockHeader({
  blockTimeMs,
  blocksCount,
  isConnected,
  connectionStatus
}: FlashblockHeaderProps) {
  // Custom formatter for flashblock time - this will be called by BlockHeaderBase
  const blockTimeFormatter = (ms: number) => {
    // Log to verify we're getting the correct value
    console.log(`[FLASHBLOCK_FORMATTER] Formatting time: ${ms}ms`);

    // Format the time in a more readable way
    if (ms < 1000) {
      return `Flash Block time: ${ms}ms`;
    } else {
      return `Flash Block time: ${(ms / 1000).toFixed(2)}s`;
    }
  };

  // Log the current values for debugging
  console.log('[FLASHBLOCK_HEADER] Rendering with values:', {
    blockTimeMs
  });

  return (
    <BlockHeaderBase
      blockTimeMs={blockTimeMs}
      blocksCount={blocksCount}
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      title='Flashblocks'
      theme='purple'
      secondaryBadgeText={`⚡ ${blockTimeMs}ms`}
      badgeText='Real-time'
      blockTimeFormatter={blockTimeFormatter}
    />
  );
}

export default FlashblockHeader;
