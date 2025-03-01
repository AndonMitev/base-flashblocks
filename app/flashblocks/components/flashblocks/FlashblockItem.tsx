'use client';

import { FlashblocksPayload } from '@/lib/types/flashblocks';
import { useEffect } from 'react';
import BlockItemBase from '../shared/BlockItemBase';

interface FlashblockItemProps {
  block: FlashblocksPayload;
  blockIndex: number;
}

function FlashblockItem({ block, blockIndex }: FlashblockItemProps) {
  // For flashblocks, we need to ensure we're only showing data for THIS specific flashblock
  // not accumulated data from multiple flashblocks for the same block number

  // Get transaction count for this specific flashblock only
  const transactionCount = block.diff?.transactions?.length || 0;

  // Parse the gas_limit as a BigInt with improved handling
  const gasLimitHex = block.base?.gas_limit || '0x1c9c380';
  const gasLimit = gasLimitHex.startsWith('0x')
    ? BigInt(parseInt(gasLimitHex, 16))
    : BigInt(gasLimitHex);

  // Use gas_used directly from the flashblock data
  // If it's missing or zero, estimate based on THIS flashblock's transactions only
  const gasUsedHex = block.diff?.gas_used || '0x0';
  let gasUsed = gasUsedHex.startsWith('0x')
    ? BigInt(parseInt(gasUsedHex, 16))
    : BigInt(gasUsedHex);

  // If gas used is zero but we have transactions in THIS flashblock,
  // estimate a reasonable value (21000 gas per tx)
  if (gasUsed === BigInt(0) && transactionCount > 0) {
    gasUsed = BigInt(transactionCount * 21000);
  }

  // Get balance changes for THIS flashblock only
  const balanceChanges = Object.keys(
    block.metadata?.new_account_balances || {}
  ).length;

  // Get receipts for THIS flashblock only
  const receiptsCount = Object.keys(block.metadata?.receipts || {}).length;

  // Log detailed information about this flashblock on mount
  useEffect(() => {
    // Create a unique identifier for this flashblock
    const flashblockId = `Block ${block.metadata?.block_number}, Flashblock ${block.index}`;

    // Log detailed gas analysis
    console.log(`[FLASHBLOCK_GAS_ANALYSIS] ${flashblockId} - MOUNTED`, {
      blockHash: block.diff?.block_hash?.substring(0, 10) + '...',
      transactionCount,
      gasUsed: gasUsed.toString(),
      gasLimit: gasLimit.toString(),
      gasUsedPercentage: `${Number(
        (gasUsed * BigInt(100)) / (gasLimit || BigInt(1))
      )}%`,
      balanceChanges,
      receiptsCount,
      rawGasUsed: block.diff?.gas_used,
      rawGasLimit: block.base?.gas_limit,
      estimatedGas:
        transactionCount > 0 && gasUsed === BigInt(transactionCount * 21000)
          ? 'Yes'
          : 'No',
      transactions: block.diff?.transactions?.map((tx: any, i: number) => ({
        index: i,
        hash:
          typeof tx === 'string'
            ? tx.substring(0, 10) + '...'
            : tx.hash?.substring(0, 10) + '...',
        gasUsed: typeof tx === 'string' ? 'unknown' : tx.gas || 'unknown'
      }))
    });

    // Log the full block data for debugging
    console.log(
      `[FLASHBLOCK_FULL_DATA] ${flashblockId}:`,
      JSON.stringify(block, null, 2)
    );

    return () => {
      console.log(`[FLASHBLOCK_GAS_ANALYSIS] ${flashblockId} - UNMOUNTED`);
    };
  }, [
    block,
    transactionCount,
    gasUsed,
    gasLimit,
    balanceChanges,
    receiptsCount
  ]);

  // Only show badges if THIS flashblock has balance changes
  const additionalInfo = balanceChanges > 0 && (
    <span className='inline-flex items-center rounded-full bg-green-500/70 px-2.5 py-1 text-xs font-medium text-white'>
      <svg
        className='mr-1.5 h-3 w-3'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
      <span className='whitespace-nowrap'>
        {balanceChanges} Balance {balanceChanges === 1 ? 'Change' : 'Changes'}
      </span>
    </span>
  );

  // Log the data for debugging
  console.log(
    `[FLASHBLOCK_RENDER] Rendering Flashblock ${block.index} for Block ${block.metadata?.block_number}:`,
    {
      transactionCount,
      gasUsed: gasUsed.toString(),
      gasLimit: gasLimit.toString(),
      gasUsedPercentage: `${Number(
        (gasUsed * BigInt(100)) / (gasLimit || BigInt(1))
      )}%`,
      balanceChanges,
      receiptsCount,
      estimatedGas:
        transactionCount > 0 && gasUsed === BigInt(transactionCount * 21000)
          ? 'Yes'
          : 'No'
    }
  );

  return (
    <BlockItemBase
      blockIndex={blockIndex}
      blockNumber={block.metadata?.block_number || 0}
      blockHash={block.diff?.block_hash || ''}
      transactionCount={transactionCount}
      gasUsed={gasUsed}
      gasLimit={gasLimit}
      timeDisplay=''
      theme='purple'
      isFlashblock={true}
      flashblockIndex={block.index}
      additionalInfo={additionalInfo}
    />
  );
}

export default FlashblockItem;
