import React, { memo, ReactNode } from 'react';
import { BlockTheme, useTheme } from '@/lib/hooks/useTheme';

export interface BlockInfoItemProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  theme: BlockTheme;
  infoBg?: string;
  infoBorder?: string;
  infoLabelText?: string;
  infoValueText?: string;
}

// Pre-compute className functions outside component to avoid recreation
const getContainerClassName = (infoBg: string, infoBorder: string) =>
  `rounded-lg ${infoBg} p-2 border ${infoBorder} h-[80px] flex flex-col`;

const getLabelClassName = (infoLabelText: string) =>
  `text-xs font-medium uppercase ${infoLabelText}`;

const getValueClassName = (infoValueText: string) =>
  `mt-1 ${infoValueText} text-sm font-medium flex-1 flex items-center`;

const BlockInfoItem = memo(
  function BlockInfoItem({
    label,
    value,
    icon,
    theme,
    infoBg,
    infoBorder,
    infoLabelText,
    infoValueText
  }: BlockInfoItemProps) {
    const currentStyle = useTheme(theme);

    // Use provided props or fallback to theme values
    const bgClass = infoBg || currentStyle.infoBg;
    const borderClass = infoBorder || currentStyle.infoBorder;
    const labelTextClass = infoLabelText || currentStyle.infoLabelText;
    const valueTextClass = infoValueText || currentStyle.infoValueText;

    // Create the label with icon element
    const labelWithIcon = (
      <div className='flex items-center'>
        <span className='mr-1.5'>{icon}</span>
        {label}
      </div>
    );

    return (
      <div className={getContainerClassName(bgClass, borderClass)}>
        <div className={getLabelClassName(labelTextClass)}>{labelWithIcon}</div>
        <div className={getValueClassName(valueTextClass)}>{value}</div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom equality function to minimize re-renders
    return (
      prevProps.label === nextProps.label &&
      prevProps.icon === nextProps.icon &&
      prevProps.theme === nextProps.theme &&
      prevProps.value === nextProps.value &&
      prevProps.infoBg === nextProps.infoBg &&
      prevProps.infoBorder === nextProps.infoBorder &&
      prevProps.infoLabelText === nextProps.infoLabelText &&
      prevProps.infoValueText === nextProps.infoValueText
    );
  }
);

export default BlockInfoItem;
