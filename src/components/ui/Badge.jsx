import React from 'react';
import theme from '../../theme';

const { colors, spacing, radius, fontSizes, fontFamily } = theme;

export default function Badge({
  children,
  tone = 'gold',
  size = 'md',
  style,
  ...props
}) {
  const tones = {
    gold: { background: colors.GOLD, color: '#1a1a2e', borderColor: '#d4ac0d' },
    green: { background: colors.GREEN, color: '#0B1D3A', borderColor: '#27ae60' },
    blue: { background: colors.BLUE, color: '#fff', borderColor: '#2980b9' },
    red: { background: colors.RED, color: '#fff', borderColor: '#c0392b' },
    purple: { background: colors.PURPLE, color: '#fff', borderColor: '#7d3c98' },
    ghost: { background: 'rgba(255,255,255,.08)', color: colors.TXT, borderColor: 'rgba(255,255,255,.14)' },
  };

  const sizes = {
    sm: { fontSize: fontSizes.sm, padding: '4px 8px' },
    md: { fontSize: fontSizes.md, padding: '6px 10px' },
    lg: { fontSize: fontSizes.base, padding: '8px 12px' },
  };

  const t = tones[tone] || tones.gold;
  const s = sizes[size] || sizes.md;

  return (
    <span
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        borderRadius: 999,
        border: '2px solid',
        fontFamily: fontFamily.base,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...t,
        ...s,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
