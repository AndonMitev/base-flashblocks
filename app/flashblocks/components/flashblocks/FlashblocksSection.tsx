'use client';

import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { useFlashblocksQuery } from '@/lib/hooks/useFlashblocksQuery';
import FlashblockItem from './FlashblockItem';
import FlashblockHeader from './FlashblockHeader';
import { MAX_BLOCKS } from '@/lib/utils/constants';
import BlockSectionBase from '../shared/BlockSectionBase';
import { FlashblocksPayload } from '@/lib/types/flashblocks';

interface FlashblocksSectionProps {
  maxBlocks?: number;
}

const BLOCK_TIME_MS = 200;

// Optimized FlashblockItem with better key strategy
const OptimizedFlashblockItem = memo(
  ({
    block,
    blockIndex
  }: {
    block: FlashblocksPayload;
    blockIndex: number;
  }) => {
    return <FlashblockItem block={block} blockIndex={blockIndex} />;
  },
  // Custom equality function to minimize re-renders
  (prevProps, nextProps) => {
    // Only re-render if the block hash changes or if the blockIndex changes
    const prevHash = prevProps.block.diff?.block_hash;
    const nextHash = nextProps.block.diff?.block_hash;
    const prevIndex = prevProps.block.index;
    const nextIndex = nextProps.block.index;
    const prevBlockNumber = prevProps.block.metadata?.block_number;
    const nextBlockNumber = nextProps.block.metadata?.block_number;

    // Always re-render if any of these key properties change
    if (prevHash !== nextHash) return false;
    if (prevIndex !== nextIndex) return false;
    if (prevBlockNumber !== nextBlockNumber) return false;
    if (prevProps.blockIndex !== nextProps.blockIndex) return false;

    return true;
  }
);

// Memoized FlashblockItems component with optimized rendering
const FlashblockItems = memo(({ blocks }: { blocks: FlashblocksPayload[] }) => {
  // Log the blocks being rendered for debugging
  useEffect(() => {
    console.log(`Rendering ${blocks.length} flashblocks`);
    blocks.forEach((block, index) => {
      console.log(`Block at index ${index}:`, {
        blockNumber: block.metadata?.block_number,
        flashblockIndex: block.index,
        hash: block.diff?.block_hash?.substring(0, 10) + '...',
        txCount: block.diff?.transactions?.length || 0,
        gasUsed: block.diff?.gas_used
      });
    });
  }, [blocks]);

  return (
    <div className='flex flex-col gap-6 pb-2'>
      {blocks.map((block: FlashblocksPayload, blockIndex: number) => {
        // Create a truly unique key for each flashblock that includes all relevant identifiers
        const uniqueKey = `flashblock-${block.metadata?.block_number}-${
          block.index
        }-${block.diff?.block_hash?.substring(0, 10) || Date.now()}`;

        return (
          <OptimizedFlashblockItem
            key={uniqueKey}
            block={block}
            blockIndex={blockIndex}
          />
        );
      })}
    </div>
  );
});

// Memoized header component
const MemoizedFlashblockHeader = memo(FlashblockHeader);

// Return to using memo for the main component
const FlashblocksSection = memo(function FlashblocksSection({
  maxBlocks = MAX_BLOCKS
}: FlashblocksSectionProps) {
  const { blocks, isConnected, connectionStatus, clearBlocks } =
    useFlashblocksQuery({
      maxBlocks
    });

  // Simplified time tracking - just track the last block time
  const [blockTimeMs, setBlockTimeMs] = useState<number>(BLOCK_TIME_MS);
  const lastBlockTimeRef = useRef<number | null>(null);
  const lastBlockHashRef = useRef<string | null>(null);

  // Update time whenever a new block is received, regardless of blocks.length
  useEffect(() => {
    if (blocks.length === 0) return;

    // Get the latest block hash
    const latestBlockHash = blocks[0]?.diff?.block_hash;

    // Skip if it's the same block we already processed
    if (latestBlockHash === lastBlockHashRef.current) return;

    // Update the last block hash
    lastBlockHashRef.current = latestBlockHash;

    const now = Date.now();

    // If we have a previous timestamp, calculate the time difference
    if (lastBlockTimeRef.current) {
      const timeDiff = now - lastBlockTimeRef.current;

      // Only update if it's a reasonable value
      if (timeDiff > 0 && timeDiff < 10000) {
        setBlockTimeMs(timeDiff);
        console.log(`[FLASHBLOCK_TIME] New time between blocks: ${timeDiff}ms`);
      }
    }

    // Update the timestamp for next calculation
    lastBlockTimeRef.current = now;
    console.log(
      `[FLASHBLOCK_TIME] Block received at: ${new Date(now).toISOString()}`
    );
  }, [blocks]);

  // Clear blocks when component unmounts to prevent stale data
  useEffect(() => {
    return () => {
      clearBlocks();
    };
  }, [clearBlocks]);

  // Create the header component with memoization
  const headerComponent = useMemo(
    () => (
      <MemoizedFlashblockHeader
        blockTimeMs={blockTimeMs}
        blocksCount={blocks.length}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />
    ),
    [blockTimeMs, blocks.length, isConnected, connectionStatus]
  );

  // Memoize the blocks component for performance
  const blocksComponent = useMemo(
    () => <FlashblockItems blocks={blocks} />,
    [blocks]
  );

  return (
    <BlockSectionBase
      theme='purple'
      headerComponent={headerComponent}
      blocksComponent={blocksComponent}
      isLoading={blocks.length === 0}
      blockTimeMs={blockTimeMs}
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      loadingMessage='Connecting to Base'
      waitingMessage='Waiting for the next flashblock...'
      footerText='Base Flashblocks'
      footerTimeUnit='ms'
    />
  );
});

export default FlashblocksSection;
