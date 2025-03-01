import React, { memo, ReactNode } from 'react';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';
import { motion } from 'framer-motion';

// Define type for gas usage levels
type GasUsageLevel = 'low' | 'medium' | 'high';

// Map for gas usage colors to avoid recreating strings
const GAS_USAGE_COLORS: Record<GasUsageLevel, { bg: string; fill: string }> = {
  low: {
    bg: 'bg-green-500/20',
    fill: 'bg-green-500'
  },
  medium: {
    bg: 'bg-amber-500/20',
    fill: 'bg-amber-500'
  },
  high: {
    bg: 'bg-red-500/20',
    fill: 'bg-red-500'
  }
};

// Helper function to calculate gas usage percentage and color
const calculateGasUsage = (
  gasUsed: bigint | string | number,
  gasLimit: bigint | string | number
) => {
  try {
    // Convert to BigInt if needed
    const gasUsedBigInt =
      typeof gasUsed === 'bigint' ? gasUsed : BigInt(gasUsed.toString());
    const gasLimitBigInt =
      typeof gasLimit === 'bigint' ? gasLimit : BigInt(gasLimit.toString());

    // Ensure we have valid values
    if (gasLimitBigInt <= BigInt(0)) {
      return { percentage: 0, colorKey: 'low' as GasUsageLevel };
    }

    // Calculate percentage (with BigInt math)
    // Convert to number for percentage calculation
    const gasUsedNum = Number(gasUsedBigInt);
    const gasLimitNum = Number(gasLimitBigInt);

    // Calculate percentage
    const percentage = Math.min(
      Math.round((gasUsedNum / gasLimitNum) * 100),
      100
    );

    // Determine color based on percentage
    let colorKey: GasUsageLevel = 'low';
    if (percentage >= 80) {
      colorKey = 'high';
    } else if (percentage >= 50) {
      colorKey = 'medium';
    }

    return { percentage, colorKey };
  } catch (error) {
    console.error('Error calculating gas usage:', error);
    return { percentage: 0, colorKey: 'low' as GasUsageLevel };
  }
};

export interface GasUsageDisplayProps {
  gasUsed: bigint | string | number;
  gasLimit: bigint | string | number;
  theme: BlockTheme;
  infoBg?: string;
  infoBorder?: string;
  infoLabelText?: string;
  infoValueText?: string;
  icon?: ReactNode;
  isFlashblock?: boolean;
  blockIndex?: number;
}

const GasUsageDisplay = memo(function GasUsageDisplay({
  gasUsed,
  gasLimit,
  theme,
  infoBg,
  infoBorder,
  infoLabelText,
  infoValueText,
  icon,
  isFlashblock = false,
  blockIndex = -1
}: GasUsageDisplayProps) {
  const currentStyle = useTheme(theme);

  // Use provided props or fallback to theme values
  const bgClass = infoBg || currentStyle.infoBg;
  const borderClass = infoBorder || currentStyle.infoBorder;
  const labelTextClass = infoLabelText || currentStyle.infoLabelText;
  const valueTextClass = infoValueText || currentStyle.infoValueText;

  // Calculate gas usage percentage and get color key
  const { percentage, colorKey } = calculateGasUsage(gasUsed, gasLimit);

  // Get colors based on usage level
  const colors = GAS_USAGE_COLORS[colorKey];

  // Determine if we should animate (only for new regular blocks)
  const shouldAnimate = !isFlashblock && blockIndex === 0;

  return (
    <div
      className={`rounded-lg ${bgClass} p-2 border ${borderClass} h-[80px] flex flex-col`}
    >
      <div className={`text-xs font-medium uppercase ${labelTextClass}`}>
        <div className='flex items-center'>
          {icon && <span className='mr-1.5'>{icon}</span>}
          GAS USAGE
        </div>
      </div>
      <div
        className={`mt-1 ${valueTextClass} text-sm flex-1 flex items-center`}
      >
        <div className='flex items-center'>
          <div className={`h-2.5 w-24 rounded-full ${colors.bg}`}>
            {shouldAnimate ? (
              <motion.div
                className={`h-2.5 rounded-full ${colors.fill}`}
                initial={{ width: '0%' }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: 'easeOut'
                }}
              ></motion.div>
            ) : (
              <div
                className={`h-2.5 rounded-full ${colors.fill}`}
                style={{ width: `${percentage}%` }}
              ></div>
            )}
          </div>
          {shouldAnimate ? (
            <motion.span
              className='ml-2 text-sm font-medium'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.9 }}
            >
              {percentage}%
            </motion.span>
          ) : (
            <span className='ml-2 text-sm font-medium'>{percentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
});

export default GasUsageDisplay;
