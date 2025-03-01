import React, { memo } from 'react';

type IconSize = 'small' | 'medium' | 'large';

interface BlockIconProps {
  size?: IconSize;
}

const getSizeClass = (size: IconSize = 'small') => {
  switch (size) {
    case 'large':
      return 'h-4 w-4 sm:h-5 sm:w-5';
    case 'medium':
      return 'h-3 w-3 sm:h-4 sm:w-4';
    case 'small':
    default:
      return 'h-2.5 w-2.5 sm:h-3 sm:w-3';
  }
};

export const HashIcon = memo(({ size }: BlockIconProps) => (
  <svg
    className={`mr-1 ${getSizeClass(size)}`}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13 10V3L4 14h7v7l9-11h-7z'
    />
  </svg>
));

export const TransactionIcon = memo(({ size }: BlockIconProps) => (
  <svg
    className={`mr-1 ${getSizeClass(size)}`}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    />
  </svg>
));

export const GasIcon = memo(({ size }: BlockIconProps) => (
  <svg
    className={`mr-1 ${getSizeClass(size)}`}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13 10V3L4 14h7v7l9-11h-7z'
    />
  </svg>
));

export const GasUsageIcon = memo(({ size }: BlockIconProps) => (
  <svg
    className={`mr-1 ${getSizeClass(size)}`}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    />
  </svg>
));
