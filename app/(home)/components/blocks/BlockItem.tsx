'use client';

import { formatDistanceToNow } from 'date-fns';
import { Block } from 'viem';
import { useTransactionCountStore } from '@/lib/utils/state/block';
import BlockItemBase from '../shared/BlockItemBase';

interface BlockItemProps {
  block: Block & { _needToFetchTransactions?: boolean };
  blockIndex: number;
}

function BlockItem({ block, blockIndex }: BlockItemProps) {
  // Get transaction count from our Zustand store
  const { getTransactionCount } = useTransactionCountStore();

  // Get block properties
  const blockHash = block.hash || '';
  const blockNumber = Number(block.number);

  // Determine the transaction count to display
  const txCount = getTransactionCount(blockNumber) || 0;

  // Format timestamp
  const timestamp = Number(block.timestamp || 0) * 1000;
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  // Simplify time display to just show "ago" part without "less than" prefix
  const simplifiedTimeAgo = timeAgo.replace('less than ', '');

  return (
    <BlockItemBase
      blockIndex={blockIndex}
      blockNumber={block.number || BigInt(0)}
      blockHash={blockHash}
      transactionCount={txCount}
      gasUsed={block.gasUsed || BigInt(0)}
      gasLimit={block.gasLimit || BigInt(1)}
      timeDisplay={simplifiedTimeAgo}
      theme='blue'
    />
  );
}

export default BlockItem;
