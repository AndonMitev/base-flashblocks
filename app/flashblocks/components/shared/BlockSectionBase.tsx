'use client';

import { ReactNode, Children, memo, useCallback, useMemo } from 'react';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';

export interface BlockSectionBaseProps {
  theme: BlockTheme;
  headerComponent: ReactNode;
  blocksComponent: ReactNode;
  isLoading: boolean;
  blockTimeMs: number | null;
  isConnected: boolean;
  connectionStatus: string;
  loadingMessage?: string;
  waitingMessage?: string;
  footerText?: string;
  footerTimeUnit?: string;
  backgroundEffect?: ReactNode;
}

// Pre-compute UI components outside the component
const createEmptyStateMessage = (loadingSubtext: string) => (
  <div className='flex justify-center items-center flex-1'>
    <p className={`text-sm ${loadingSubtext}`}>No blocks to display</p>
  </div>
);

const createLoadingStateUI = (
  borderHighlight: string,
  loadingSpinnerBorder: string,
  loadingSpinnerBg: string,
  loadingIcon: string,
  loadingSubtext: string,
  loadingMessage: string,
  isConnected: boolean,
  waitingMessage: string,
  connectionStatus: string
) => (
  <div
    className={`mt-3 sm:mt-6 flex flex-col items-center justify-center rounded-xl bg-white/5 p-4 sm:p-8 text-center backdrop-blur-sm border ${borderHighlight} flex-1`}
  >
    <div className='relative h-10 w-10 sm:h-14 sm:w-14'>
      <div
        className={`absolute inset-0 h-full w-full animate-spin rounded-full border-b-2 border-t-2 ${loadingSpinnerBorder}`}
      ></div>
      <div
        className={`absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] animate-ping rounded-full ${loadingSpinnerBg}`}
      ></div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <svg
          className={`h-4 w-4 sm:h-5 sm:w-5 ${loadingIcon}`}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
          ></path>
        </svg>
      </div>
    </div>
    <p className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-white'>
      {loadingMessage}
    </p>
    <p className={`mt-1 text-xs ${loadingSubtext}`}>
      {isConnected ? waitingMessage : `Status: ${connectionStatus}`}
    </p>
  </div>
);

const createFooterUI = (
  footerBorder: string,
  footerText: string,
  theme: BlockTheme,
  isConnected: boolean,
  connectedBadgeText: string,
  connectedBadgeBg: string
) => (
  <div
    className={`flex items-center justify-between py-2.5 px-4 ${footerText}`}
  >
    <div className='flex items-center space-x-2'>
      <span className='text-xs opacity-80 font-medium'>
        {theme === 'blue' ? 'Base Blocks' : 'Base Flashblocks'}
      </span>
      {isConnected && (
        <span
          className={`inline-flex items-center rounded-full ${connectedBadgeBg} px-1.5 py-0.5 text-[10px] font-medium ${connectedBadgeText}`}
        >
          <span className='mr-0.5'>●</span> Live
        </span>
      )}
    </div>
    <div className='flex items-center'>
      <a
        href='https://base.org'
        target='_blank'
        rel='noopener noreferrer'
        className='text-xs opacity-70 hover:opacity-100 transition-opacity flex items-center'
      >
        <svg
          className='w-3 h-3 mr-1 opacity-70'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z'
            fill='currentColor'
          />
        </svg>
        base.org
      </a>
    </div>
  </div>
);

// Memoized BlockSectionBase component
const BlockSectionBase = memo(function BlockSectionBase({
  theme,
  headerComponent,
  blocksComponent,
  isLoading,
  blockTimeMs,
  isConnected,
  connectionStatus,
  loadingMessage = 'Connecting to Base',
  waitingMessage = 'Waiting for the next block...',
  footerText = 'Base Blocks',
  footerTimeUnit = 's',
  backgroundEffect
}: BlockSectionBaseProps) {
  const currentStyle = useTheme(theme);

  // Extract children from blocksComponent
  const blockItems = Children.toArray(blocksComponent);

  // Create a stable function for rendering block items
  const renderBlockItems = useCallback(() => {
    return blockItems.map((item, index) => (
      <div key={`block-wrapper-${index}`} className='mb-3'>
        {item}
      </div>
    ));
  }, [blockItems]);

  // Memoize the container className
  const containerClassName = useMemo(
    () =>
      `relative overflow-hidden rounded-2xl border ${currentStyle.sectionContainerBorder} bg-gradient-to-br ${currentStyle.sectionContainerBg} backdrop-blur-xl shadow-xl w-full max-w-full h-[95vh] max-h-[2400px] min-h-[1000px] flex flex-col`,
    [currentStyle.sectionContainerBorder, currentStyle.sectionContainerBg]
  );

  // Create UI elements using the helper functions
  const emptyStateMessage = createEmptyStateMessage(
    currentStyle.loadingSubtext
  );

  const loadingStateUI = createLoadingStateUI(
    currentStyle.borderHighlight,
    currentStyle.loadingSpinnerBorder,
    currentStyle.loadingSpinnerBg,
    currentStyle.loadingIcon,
    currentStyle.loadingSubtext,
    loadingMessage,
    isConnected,
    waitingMessage,
    connectionStatus
  );

  const footerUI = createFooterUI(
    currentStyle.footerBorder,
    currentStyle.footerText,
    theme,
    isConnected,
    currentStyle.connectedBadgeText,
    currentStyle.connectedBadgeBg
  );

  return (
    <div className={containerClassName}>
      {/* Decorative elements - simple versions */}
      <div
        className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${currentStyle.decorativeBlob1} blur-3xl opacity-30`}
      ></div>
      <div
        className={`absolute -bottom-10 -left-10 h-32 w-32 rounded-full ${currentStyle.decorativeBlob2} blur-3xl opacity-30`}
      ></div>

      {/* Background effect (particles) */}
      {backgroundEffect}

      <div className='relative flex flex-col h-full'>
        {/* Fixed header */}
        <div className='sticky top-0 z-10 p-4 sm:p-5 bg-inherit'>
          {headerComponent}
        </div>

        {/* Scrollable content */}
        {isLoading ? (
          <div className='flex-1 p-4 sm:px-5'>{loadingStateUI}</div>
        ) : (
          <div className='flex-1 overflow-y-auto scrollbar-styled p-4 sm:px-5 pb-2'>
            {blockItems.length > 0 ? (
              <div className='flex flex-col space-y-3 pb-2'>
                {renderBlockItems()}
              </div>
            ) : (
              emptyStateMessage
            )}
          </div>
        )}

        {/* Enhanced footer */}
        <div
          className={`sticky bottom-0 z-10 bg-inherit bg-opacity-95 backdrop-blur-sm border-t ${currentStyle.footerBorder}`}
        >
          {footerUI}
        </div>
      </div>
    </div>
  );
});

export default BlockSectionBase;
