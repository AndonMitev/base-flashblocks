import React, { memo } from 'react';
import { formatBlockNumber } from '@/lib/utils/formatters';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';

export interface BlockNumberDisplayProps {
  blockNumber: string | number | bigint;
  blockIndex?: number;
  isFlashblock?: boolean;
  flashblockIndex?: number | string;
  theme: BlockTheme;
  blockNumberBg?: string;
  blockNumberText?: string;
}

const BlockNumberDisplay = memo(function BlockNumberDisplay({
  blockNumber,
  blockIndex = 0,
  isFlashblock = false,
  flashblockIndex,
  theme,
  blockNumberBg,
  blockNumberText
}: BlockNumberDisplayProps) {
  const currentStyle = useTheme(theme);

  // Use the provided styles or get them from the theme
  const bgClass = blockNumberBg || currentStyle.blockNumberBg;
  const textClass = blockNumberText || currentStyle.blockNumberText;

  return (
    <div className='h-[40px] flex flex-col justify-center'>
      {isFlashblock ? (
        // Flashblock display - show flashblock index as primary
        <>
          <div className='flex items-center font-medium text-white'>
            <span className='text-yellow-400 mr-1'>⚡</span>
            <span
              className={`text-base bg-gradient-to-r ${textClass} bg-clip-text text-transparent font-bold`}
            >
              Flashblock:
              <span className='ml-1 text-white'>{flashblockIndex}</span>
            </span>
          </div>
          <div className='mt-0.5 flex items-center'>
            <span className='text-xs font-medium text-purple-300'>Block:</span>
            <span
              className={`ml-1 bg-gradient-to-r ${textClass} bg-clip-text text-xs font-bold text-transparent`}
            >
              #{formatBlockNumber(blockNumber)}
            </span>
          </div>
        </>
      ) : (
        // Regular block display
        <div className='flex items-center font-medium text-white'>
          <span
            className={`text-sm bg-gradient-to-r ${textClass} bg-clip-text text-transparent font-bold`}
          >
            Block #{formatBlockNumber(blockNumber)}
          </span>
        </div>
      )}
    </div>
  );
});

export default BlockNumberDisplay;
