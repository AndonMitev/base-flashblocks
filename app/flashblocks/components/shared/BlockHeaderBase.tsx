'use client';

import { formatBlockTime } from '@/lib/utils/formatters';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';

export interface BlockHeaderBaseProps {
  blockTimeMs: number | null;
  blocksCount: number;
  isConnected: boolean;
  connectionStatus: string;
  title: string;
  theme: BlockTheme;
  blockTimeFormatter?: (blockTimeMs: number) => string;
  badgeText?: string;
  secondaryBadgeText?: string;
  secondaryBadgeIcon?: string;
}

function BlockHeaderBase({
  blockTimeMs,
  blocksCount,
  isConnected,
  connectionStatus,
  title,
  theme,
  blockTimeFormatter = (ms) => `~${(ms / 1000).toFixed(1)}s per block`,
  badgeText = 'Live Feed',
  secondaryBadgeText = '2s',
  secondaryBadgeIcon = '⏱️'
}: BlockHeaderBaseProps) {
  const currentStyle = useTheme(theme);

  return (
    <div className='space-y-1.5 h-[80px] overflow-hidden'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h2
            className={`flex flex-wrap items-center text-lg font-bold tracking-tight ${
              theme === 'blue' ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}
          >
            <span
              className={`bg-gradient-to-r ${currentStyle.titleGradient} bg-clip-text text-transparent`}
            >
              {title}
            </span>
            <div className='ml-2 flex flex-wrap gap-1.5'>
              <span
                className={`inline-flex items-center rounded-full ${currentStyle.badgeBg} px-2 py-0.5 text-xs font-medium ${currentStyle.badgeText} ${currentStyle.badgeDarkBg} ${currentStyle.badgeDarkText}`}
              >
                {badgeText}
              </span>
              <span
                className={`inline-flex ${
                  theme === 'purple' ? 'animate-pulse' : ''
                } items-center rounded-full ${
                  currentStyle.secondaryBadgeBg
                } px-2 py-0.5 text-xs font-medium ${
                  currentStyle.secondaryBadgeText
                } ${currentStyle.secondaryBadgeDarkBg} ${
                  currentStyle.secondaryBadgeDarkText
                }`}
              >
                <span className='mr-0.5'>{secondaryBadgeIcon}</span>
                {secondaryBadgeText}
              </span>
            </div>
          </h2>
        </div>

        <div
          className={`flex items-center space-x-1.5 rounded-full ${currentStyle.connectionBg} px-2 py-0.5 shadow-sm backdrop-blur-sm border ${currentStyle.connectionBorder} cursor-pointer transition-colors`}
          title={
            isConnected
              ? 'Connected - Click to reconnect'
              : 'Disconnected - Click to reconnect'
          }
        >
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected
                ? `${currentStyle.connectedDot} animate-pulse`
                : 'bg-red-500'
            }`}
          ></div>
          <span
            className={`text-xs font-medium ${currentStyle.connectionText}`}
          >
            {connectionStatus}
          </span>
        </div>
      </div>

      {blockTimeMs !== null && (
        <div
          className={`flex flex-wrap items-center gap-2 text-xs ${currentStyle.infoTextColor}`}
        >
          <div className='flex items-center space-x-1'>
            <svg
              className={`h-3.5 w-3.5 ${currentStyle.iconColor}`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>
              {theme === 'blue'
                ? blockTimeFormatter(blockTimeMs)
                : formatBlockTime(blockTimeMs)}
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <svg
              className={`h-3.5 w-3.5 ${currentStyle.iconColor}`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
            <span>
              {blocksCount} {theme === 'blue' ? 'blocks synced' : 'blocks'}
            </span>
          </div>
        </div>
      )}

      <div className='flex items-center'>
        <h3
          className={`text-sm font-semibold ${currentStyle.headingText} mr-2`}
        >
          Recent Blocks
        </h3>
        <span
          className={`inline-flex items-center rounded-full ${currentStyle.countBadgeBg} px-2 py-0.5 text-xs font-medium ${currentStyle.countBadgeText} ${currentStyle.countBadgeDarkBg} ${currentStyle.countBadgeDarkText}`}
        >
          {blocksCount}
        </span>
      </div>
    </div>
  );
}

export default BlockHeaderBase;
