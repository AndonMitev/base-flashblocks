'use client';

import React, { memo, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {
  formatHashTruncated,
  formatBlockNumber,
  formatGasUsed
} from '@/lib/utils/formatters';
import BlockNumberDisplay from './BlockNumberDisplay';
import TimeDisplay from './TimeDisplay';
import BlockInfoItem from './BlockInfoItem';
import GasUsageDisplay from './GasUsageDisplay';
import LatestBlockIndicator from './LatestBlockIndicator';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';
import { HashIcon, TransactionIcon, GasIcon, GasUsageIcon } from './BlockIcons';

// Static icons defined outside component to avoid recreation
const staticIcons = {
  hashIcon: <HashIcon />,
  txIcon: <TransactionIcon />,
  gasIcon: <GasIcon />,
  gasUsageIcon: <GasUsageIcon />
};

// Helper function to format hash with larger font
const formatHashDisplay = (blockHash: string, infoValueTextClass: string) => (
  <div
    className={`mt-0.5 font-mono text-sm truncate ${infoValueTextClass}`}
    title={blockHash}
  >
    {formatHashTruncated(blockHash)}
  </div>
);

// Helper functions for formatting values
const formatTxCountDisplay = (
  transactionCount: string | number,
  loadingTextClass: string
) => {
  return transactionCount === '?' ? (
    <span
      className='text-sm'
      title='Transaction count not available in block header'
    >
      {transactionCount}{' '}
      <span className={`text-xs ${loadingTextClass}`}>(loading)</span>
    </span>
  ) : (
    <span className='text-sm font-medium'>{transactionCount}</span>
  );
};

const getContainerClassName = (
  containerBorder: string,
  containerBg: string,
  containerHoverBorder: string,
  containerHoverBg: string,
  ringColor: string,
  blockIndex: number
) => {
  return `relative flex flex-col rounded-xl border ${containerBorder} bg-gradient-to-br ${containerBg} p-3 backdrop-blur-sm transition-colors ${containerHoverBorder} ${containerHoverBg} h-[270px]`;
};

export interface BlockItemBaseProps {
  blockIndex: number;
  blockNumber: string | number | bigint;
  blockHash: string;
  transactionCount: string | number;
  gasUsed: string | number | bigint;
  gasLimit: string | number | bigint;
  timeDisplay: string;
  theme: BlockTheme;
  additionalInfo?: React.ReactNode;
  isFlashblock?: boolean;
  flashblockIndex?: number | string;
}

// Shine effect component
const ShineEffect = ({
  isActive,
  theme
}: {
  isActive: boolean;
  theme: BlockTheme;
}) => {
  const currentStyle = useTheme(theme);
  const gradientColor = theme === 'purple' ? 'purple' : 'blue';

  if (!isActive) return null;

  return (
    <motion.div
      className='absolute inset-0 overflow-hidden rounded-xl pointer-events-none'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`absolute inset-0 w-[200%] translate-x-[-50%] bg-gradient-to-r from-transparent via-${gradientColor}-500/15 to-transparent`}
        animate={{
          translateX: ['0%', '100%']
        }}
        transition={{
          duration: 1.4,
          ease: 'easeInOut',
          delay: 0.2,
          repeat: 0
        }}
      />
    </motion.div>
  );
};

const BlockItemBase = memo(function BlockItemBase({
  blockIndex,
  blockNumber,
  blockHash,
  transactionCount,
  gasUsed,
  gasLimit,
  timeDisplay,
  theme,
  additionalInfo,
  isFlashblock = false,
  flashblockIndex
}: BlockItemBaseProps) {
  const currentStyle = useTheme(theme);
  const controls = useAnimation();

  // Get container class name
  const containerClassName = getContainerClassName(
    currentStyle.containerBorder,
    currentStyle.containerBg,
    currentStyle.containerHoverBorder,
    currentStyle.containerHoverBg,
    currentStyle.ringColor,
    blockIndex
  );

  // Format transaction count for display
  const txCountDisplay = formatTxCountDisplay(
    transactionCount,
    currentStyle.loadingText
  );

  // Format hash for display
  const hashDisplay = formatHashDisplay(blockHash, currentStyle.infoValueText);

  // Animation for new blocks
  useEffect(() => {
    const animateBlock = async () => {
      if (blockIndex === 0 && !isFlashblock) {
        // Reset to initial state
        await controls.start({
          scale: 0.98,
          opacity: 0.7,
          y: 15,
          transition: { duration: 0 }
        });

        // Animate in
        await controls.start({
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 250,
            damping: 20,
            mass: 1,
            duration: 0.6
          }
        });
      }
    };

    animateBlock();
  }, [blockIndex, blockHash, controls, isFlashblock]);

  return (
    <motion.div
      className={containerClassName}
      initial={
        blockIndex === 0 && !isFlashblock
          ? { scale: 0.98, opacity: 0.7, y: 15 }
          : false
      }
      animate={controls}
    >
      {/* Decorative glow effect */}
      <motion.div
        className={`absolute -inset-0.5 rounded-xl ${currentStyle.glowColor} opacity-0 blur-lg transition-opacity duration-500`}
        animate={
          blockIndex === 0 && !isFlashblock
            ? {
                opacity: [0, 0.3, 0],
                scale: [1, 1.01, 1]
              }
            : { opacity: 0 }
        }
        transition={
          blockIndex === 0 && !isFlashblock
            ? {
                duration: 1.5,
                ease: 'easeInOut',
                times: [0, 0.5, 1],
                repeat: 0
              }
            : {}
        }
      />

      {/* Shine effect for new blocks */}
      {!isFlashblock && (
        <ShineEffect isActive={blockIndex === 0} theme={theme} />
      )}

      {/* Latest block indicator */}
      {blockIndex === 0 && (
        <LatestBlockIndicator
          theme={theme}
          indicatorGradient={currentStyle.indicatorGradient}
          indicatorBlurGradient={currentStyle.indicatorBlurGradient}
          isFlashblock={isFlashblock}
        />
      )}

      <div className='relative flex flex-row items-center justify-between gap-2 mb-2'>
        {/* Block number */}
        <div className='flex items-center'>
          <BlockNumberDisplay
            theme={theme}
            blockNumber={blockNumber}
            blockNumberBg={currentStyle.blockNumberBg}
            isFlashblock={isFlashblock}
            flashblockIndex={flashblockIndex}
          />
        </div>

        {/* Time display and additional info on the right */}
        <div className='flex items-center gap-2'>
          {timeDisplay && (
            <TimeDisplay
              theme={theme}
              timeDisplay={timeDisplay}
              timeDisplayBg={currentStyle.timeDisplayBg}
              timeDisplayText={currentStyle.timeDisplayText}
            />
          )}
          {additionalInfo && additionalInfo}
        </div>
      </div>

      {/* Block details grid */}
      <div className='mt-2 grid grid-cols-2 gap-2 flex-1'>
        <BlockInfoItem
          theme={theme}
          icon={staticIcons.hashIcon}
          label='HASH'
          value={hashDisplay}
          infoBg={currentStyle.infoBg}
          infoBorder={currentStyle.infoBorder}
          infoLabelText={currentStyle.infoLabelText}
        />
        <BlockInfoItem
          theme={theme}
          icon={staticIcons.txIcon}
          label='TRANSACTIONS'
          value={txCountDisplay}
          infoBg={currentStyle.infoBg}
          infoBorder={currentStyle.infoBorder}
          infoLabelText={currentStyle.infoLabelText}
          infoValueText={currentStyle.infoValueText}
        />
        <BlockInfoItem
          theme={theme}
          icon={staticIcons.gasIcon}
          label='GAS USED'
          value={formatGasUsed(gasUsed.toString())}
          infoBg={currentStyle.infoBg}
          infoBorder={currentStyle.infoBorder}
          infoLabelText={currentStyle.infoLabelText}
          infoValueText={currentStyle.infoValueText}
        />
        <GasUsageDisplay
          theme={theme}
          gasUsed={gasUsed}
          gasLimit={gasLimit}
          infoBg={currentStyle.infoBg}
          infoBorder={currentStyle.infoBorder}
          infoLabelText={currentStyle.infoLabelText}
          infoValueText={currentStyle.infoValueText}
          icon={staticIcons.gasUsageIcon}
          isFlashblock={isFlashblock}
          blockIndex={blockIndex}
        />
      </div>
    </motion.div>
  );
});

export default BlockItemBase;
