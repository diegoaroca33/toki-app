import React from 'react';
import theme from '../../theme';

const { colors, spacing, radius, shadows } = theme;

export default function Card({
  variant = 'default',
  children,
  style,
  border,
  padding = spacing.xl,
  ...props
}) {
  const variants = {
    default: {
      background: colors.CARD,
      border: `2px solid ${border || colors.BORDER}`,
      boxShadow: shadows.soft,
    },
    highlight: {
      background: colors.BG2,
      border: `2px solid ${border || `${colors.GOLD}88`}`,
      boxShadow: shadows.glowGold,
    },
    stat: {
      background: colors.CARD,
      border: `2px solid ${border || colors.BORDER}`,
      boxShadow: shadows.none,
      textAlign: 'center',
      padding: spacing.lg,
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <div
      {...props}
      style={{
        borderRadius: radius.xxl,
        padding,
        color: colors.TXT,
        ...v,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
