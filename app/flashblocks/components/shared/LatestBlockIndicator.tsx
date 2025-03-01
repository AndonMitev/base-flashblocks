import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';

interface LatestBlockIndicatorProps {
  isLatest?: boolean;
  theme: BlockTheme;
  indicatorGradient?: string;
  indicatorBlurGradient?: string;
  isFlashblock?: boolean;
}

const LatestBlockIndicator = memo(function LatestBlockIndicator({
  isLatest,
  theme,
  indicatorGradient,
  indicatorBlurGradient,
  isFlashblock = false
}: LatestBlockIndicatorProps) {
  const currentStyle = useTheme(theme);

  // If isLatest is false, return null
  if (isLatest === false) return null;

  // Use the provided gradients or get them from the theme
  const gradientClass = indicatorGradient || currentStyle.indicatorGradient;
  const blurGradientClass =
    indicatorBlurGradient || currentStyle.indicatorBlurGradient;

  // If it's a flashblock, render without animations
  if (isFlashblock) {
    return (
      <>
        <div
          className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradientClass} rounded-l-sm`}
          style={{ left: '0px' }}
        />
        <div
          className={`absolute left-0 top-0 h-full w-3 bg-gradient-to-b ${blurGradientClass} blur-md`}
          style={{ left: '-1px' }}
        />
      </>
    );
  }

  // For regular blocks, use animations
  return (
    <>
      <motion.div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradientClass} rounded-l-sm`}
        style={{ left: '0px' }}
        initial={{ opacity: 0, height: '0%' }}
        animate={{
          opacity: 1,
          height: '100%'
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: 'easeOut'
        }}
      />
      <motion.div
        className={`absolute left-0 top-0 h-full w-3 bg-gradient-to-b ${blurGradientClass} blur-md`}
        style={{ left: '-1px' }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.8, 0.6]
        }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          times: [0, 0.6, 1],
          ease: 'easeOut'
        }}
      />
    </>
  );
});

export default LatestBlockIndicator;
