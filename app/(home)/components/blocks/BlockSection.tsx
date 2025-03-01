'use client';

import { memo, useMemo, useRef, useState, useEffect } from 'react';
import { useBlocksQuery } from '@/lib/hooks/useBlocksQuery';
import BlockHeader from './BlockHeader';
import BlockItem from './BlockItem';
import { MAX_BLOCKS } from '@/lib/utils/constants';
import BlockSectionBase from '../shared/BlockSectionBase';
import { Block } from 'viem';
import { BlockHeader as BlockHeaderType } from '@/lib/types/websocket';

interface BlockSectionProps {
  maxBlocks?: number;
}

const BLOCK_TIME_MS = 2000; // Default block time in ms (2s)

// Helper function to convert block header to block object
const createBlockObject = (
  blockHeader: BlockHeaderType
): Block & { _needToFetchTransactions?: boolean } => {
  // Parse gas values as BigInt for consistent handling
  const gasUsed = blockHeader.gasUsed
    ? BigInt(parseInt(blockHeader.gasUsed, 16))
    : BigInt(0);

  const gasLimit = blockHeader.gasLimit
    ? BigInt(parseInt(blockHeader.gasLimit, 16))
    : BigInt(1);

  return {
    hash: blockHeader.hash as `0x${string}`,
    number: blockHeader.number
      ? BigInt(parseInt(blockHeader.number, 16))
      : BigInt(0),
    timestamp: blockHeader.timestamp
      ? BigInt(parseInt(blockHeader.timestamp, 16))
      : BigInt(0),
    transactions: [] as `0x${string}`[],
    gasUsed,
    gasLimit,
    _needToFetchTransactions:
      !blockHeader.transactions ||
      (typeof blockHeader.transactions === 'boolean' &&
        blockHeader.transactions === true)
  } as Block & { _needToFetchTransactions?: boolean };
};

// Optimized BlockItem with better equality checking
const OptimizedBlockItem = memo(
  ({
    blockHeader,
    blockIndex
  }: {
    blockHeader: BlockHeaderType;
    blockIndex: number;
  }) => {
    // Create block object only when needed
    const block = createBlockObject(blockHeader);

    return <BlockItem block={block} blockIndex={blockIndex} />;
  },
  // Custom equality function to minimize re-renders
  (prevProps, nextProps) => {
    // Only re-render if the block hash changes or if the blockIndex changes
    if (prevProps.blockHeader.hash !== nextProps.blockHeader.hash) return false;
    if (prevProps.blockIndex !== nextProps.blockIndex) return false;

    return true;
  }
);

// Memoized BlockItems component with optimized rendering
const BlockItems = memo(
  ({ blocks }: { blocks: BlockHeaderType[] }) => {
    // Keep a reference to the previous blocks to compare
    const prevBlocksRef = useRef<string[]>([]);

    // Extract block hashes for comparison
    const blockHashes = blocks.map((block) => block.hash || '');

    // Check if blocks have actually changed
    const hasChanged =
      JSON.stringify(blockHashes) !== JSON.stringify(prevBlocksRef.current);

    // Update the reference if changed
    if (hasChanged) {
      prevBlocksRef.current = blockHashes;
    }

    return (
      <div className='flex flex-col gap-6 pb-2'>
        {blocks.map((blockHeader, blockIndex) => (
          <OptimizedBlockItem
            key={`block-${blockIndex}-${blockHeader.hash || Date.now()}`}
            blockHeader={blockHeader}
            blockIndex={blockIndex}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the blocks array length changes or if the first block changes
    if (prevProps.blocks.length !== nextProps.blocks.length) return false;

    // Check if the first block has changed (most important for UI)
    if (prevProps.blocks.length > 0 && nextProps.blocks.length > 0) {
      const prevFirstBlock = prevProps.blocks[0];
      const nextFirstBlock = nextProps.blocks[0];

      if (prevFirstBlock.hash !== nextFirstBlock.hash) {
        return false;
      }
    }

    // If we get here, we can skip re-rendering
    return true;
  }
);

// Memoized BlockHeader component
const MemoizedBlockHeader = memo(BlockHeader);

const BlockSection = memo(function BlockSection({
  maxBlocks = MAX_BLOCKS
}: BlockSectionProps) {
  const { blocks, isConnected, connectionStatus } = useBlocksQuery({
    maxBlocks
  });

  // Simplified time tracking - just track the last block time
  const [blockTimeMs, setBlockTimeMs] = useState<number>(BLOCK_TIME_MS);
  const lastBlockTimeRef = useRef<number | null>(null);
  const lastBlockHashRef = useRef<string | null>(null);

  // Update time whenever a new block is received
  useEffect(() => {
    if (blocks.length === 0) return;

    // Get the latest block hash
    const latestBlockHash = blocks[0]?.hash;

    // Skip if it's the same block we already processed
    if (latestBlockHash === lastBlockHashRef.current) return;

    // Update the last block hash
    lastBlockHashRef.current = latestBlockHash;

    const now = Date.now();

    // If we have a previous timestamp, calculate the time difference
    if (lastBlockTimeRef.current) {
      const timeDiff = now - lastBlockTimeRef.current;

      // Only update if it's a reasonable value
      if (timeDiff > 0 && timeDiff < 30000) {
        // Allow up to 30 seconds for blocks
        setBlockTimeMs(timeDiff);
        console.log(`[BLOCK_TIME] New time between blocks: ${timeDiff}ms`);
      }
    }

    // Update the timestamp for next calculation
    lastBlockTimeRef.current = now;
    console.log(
      `[BLOCK_TIME] Block received at: ${new Date(now).toISOString()}`
    );
  }, [blocks]);

  // Memoize the header component
  const headerComponent = useMemo(
    () => (
      <MemoizedBlockHeader
        blockTimeMs={blockTimeMs}
        blocksCount={blocks.length}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />
    ),
    [blockTimeMs, blocks.length, isConnected, connectionStatus]
  );

  // Memoize the blocks component
  const blocksComponent = useMemo(
    () => <BlockItems blocks={blocks} />,
    [blocks]
  );

  return (
    <BlockSectionBase
      theme='blue'
      headerComponent={headerComponent}
      blocksComponent={blocksComponent}
      isLoading={blocks.length === 0}
      blockTimeMs={blockTimeMs}
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      loadingMessage='Connecting to Base'
      waitingMessage='Waiting for the next block...'
      footerText='Base Blocks'
      footerTimeUnit='s'
    />
  );
});

export default BlockSection;
