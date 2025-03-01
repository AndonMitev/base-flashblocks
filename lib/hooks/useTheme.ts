export type BlockTheme = 'blue' | 'purple';

// Define the theme styles outside of any component to avoid recreation
export const blockStyles = {
  blue: {
    // Block Item Styles
    containerBorder: 'border-blue-500/10',
    containerBg: 'from-gray-900/30 to-blue-900/10',
    containerHoverBorder: 'hover:border-blue-400/20',
    containerHoverBg: 'hover:from-gray-900/40 hover:to-blue-900/20',
    ringColor: 'ring-blue-500/20',
    glowColor: 'bg-blue-600/5',
    indicatorGradient: 'from-blue-400 to-indigo-500',
    indicatorBlurGradient: 'from-blue-400/30 to-indigo-500/30',
    blockNumberBg: 'from-blue-500 to-indigo-600',
    blockNumberText: 'from-blue-400 to-indigo-500',
    timeDisplayBg: 'bg-blue-900/20',
    timeDisplayText: 'text-blue-200',
    infoBg: 'bg-blue-900/10',
    infoBorder: 'border-blue-500/5',
    infoLabelText: 'text-blue-300',
    infoValueText: 'text-white',
    loadingText: 'text-blue-300/70',

    // BlockSection Styles
    sectionContainerBorder: 'border-blue-500/10',
    sectionContainerBg: 'from-gray-950 to-blue-950/80',
    decorativeBlob1: 'bg-blue-600/10',
    decorativeBlob2: 'bg-indigo-600/10',
    decorativeBlob3: 'bg-blue-500/5',
    loadingSpinnerBorder: 'border-blue-500',
    loadingSpinnerBg: 'bg-blue-500/20',
    loadingIcon: 'text-blue-500',
    loadingTextColor: 'text-white',
    loadingSubtext: 'text-blue-300/70',
    footerBorder: 'border-white/5',
    footerText: 'text-blue-300/70',
    footerBadgeBg: 'from-blue-500 to-indigo-600',
    footerBadgeText: 'text-white',
    connectedBadgeBg: 'bg-green-500/80',
    connectedBadgeText: 'text-white',
    borderHighlight: 'border-blue-500/10',

    // BlockHeaderBase Styles
    titleGradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    badgeDarkBg: 'dark:bg-blue-900/40',
    badgeDarkText: 'dark:text-blue-300',
    secondaryBadgeBg: 'bg-amber-100',
    secondaryBadgeText: 'text-amber-800',
    secondaryBadgeDarkBg: 'dark:bg-amber-900/40',
    secondaryBadgeDarkText: 'dark:text-amber-300',
    infoTextColor: 'text-gray-500/80 dark:text-gray-400/80',
    iconColor: 'text-blue-400',
    connectionBg:
      'bg-white/10 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30',
    connectionBorder: 'border-blue-500/20',
    connectionText: 'text-gray-700 dark:text-blue-200',
    connectedDot: 'bg-blue-500',
    headingText: 'text-gray-800 dark:text-gray-200',
    countBadgeBg: 'bg-blue-100',
    countBadgeText: 'text-blue-800',
    countBadgeDarkBg: 'dark:bg-blue-900/40',
    countBadgeDarkText: 'dark:text-blue-300'
  },
  purple: {
    // Block Item Styles
    containerBorder: 'border-purple-500/30',
    containerBg: 'from-gray-900/50 to-purple-900/30',
    containerHoverBorder: 'hover:border-purple-400/40',
    containerHoverBg: 'hover:from-gray-900/60 hover:to-purple-900/40',
    ringColor: 'ring-purple-500/40',
    glowColor: 'bg-purple-600/10',
    indicatorGradient: 'from-purple-400 to-blue-500',
    indicatorBlurGradient: 'from-purple-400/40 to-blue-500/40',
    blockNumberBg: 'from-purple-500 to-blue-600',
    blockNumberText: 'from-purple-400 to-blue-500',
    timeDisplayBg: 'bg-purple-900/40',
    timeDisplayText: 'text-purple-200',
    infoBg: 'bg-purple-900/30',
    infoBorder: 'border-purple-500/20',
    infoLabelText: 'text-purple-300',
    infoValueText: 'text-white',
    loadingText: 'text-purple-300/70',

    // BlockSection Styles
    sectionContainerBorder: 'border-purple-500/30',
    sectionContainerBg: 'from-gray-950 to-purple-950',
    decorativeBlob1: 'bg-purple-600/30',
    decorativeBlob2: 'bg-blue-600/30',
    decorativeBlob3: 'bg-purple-500/20',
    loadingSpinnerBorder: 'border-purple-500',
    loadingSpinnerBg: 'bg-purple-500/30',
    loadingIcon: 'text-purple-500',
    loadingTextColor: 'text-white',
    loadingSubtext: 'text-purple-300/70',
    footerBorder: 'border-white/10',
    footerText: 'text-purple-300/80',
    footerBadgeBg: 'from-purple-500 to-blue-600',
    footerBadgeText: 'text-white',
    connectedBadgeBg: 'bg-green-500/90',
    connectedBadgeText: 'text-white',
    borderHighlight: 'border-purple-500/20',

    // BlockHeaderBase Styles
    titleGradient: 'from-purple-400 to-blue-500',
    badgeBg: 'bg-purple-100/20',
    badgeText: 'text-purple-200',
    badgeDarkBg: '',
    badgeDarkText: '',
    secondaryBadgeBg: 'bg-green-100/20',
    secondaryBadgeText: 'text-green-200',
    secondaryBadgeDarkBg: '',
    secondaryBadgeDarkText: '',
    infoTextColor: 'text-purple-300/80',
    iconColor: 'text-purple-400',
    connectionBg: 'bg-purple-900/40 hover:bg-purple-900/50',
    connectionBorder: 'border-purple-500/30',
    connectionText: 'text-purple-200',
    connectedDot: 'bg-green-500',
    headingText: 'text-purple-100',
    countBadgeBg: 'bg-purple-100/20',
    countBadgeText: 'text-purple-200',
    countBadgeDarkBg: '',
    countBadgeDarkText: ''
  }
};

// Cache for theme styles to avoid unnecessary recalculations
const themeCache: Record<BlockTheme, any> = {
  blue: blockStyles.blue,
  purple: blockStyles.purple
};

/**
 * Hook to get theme styles with efficient memoization
 * Since we only have two themes, we can use a simple cache
 */
export function useTheme(theme: BlockTheme) {
  // Since the theme styles are static and defined outside the component,
  // we can simply return the cached value directly without useMemo
  return themeCache[theme];
}
