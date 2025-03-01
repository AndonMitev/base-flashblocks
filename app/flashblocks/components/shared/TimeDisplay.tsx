import React, { memo } from 'react';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';

export interface TimeDisplayProps {
  timeDisplay: string;
  theme: BlockTheme;
  timeDisplayBg?: string;
  timeDisplayText?: string;
}

const TimeDisplay = memo(function TimeDisplay({
  timeDisplay,
  theme,
  timeDisplayBg,
  timeDisplayText
}: TimeDisplayProps) {
  const currentStyle = useTheme(theme);

  // Use the provided styles or get them from the theme
  const bgClass = timeDisplayBg || currentStyle.timeDisplayBg;
  const textClass = timeDisplayText || currentStyle.timeDisplayText;

  // Only render if there's actual content to display
  if (!timeDisplay) return null;

  return (
    <div
      className={`inline-flex items-center rounded-full ${bgClass} px-2 py-0.5 text-xs font-medium ${textClass}`}
    >
      {timeDisplay}
    </div>
  );
});

export default TimeDisplay;
