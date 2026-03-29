import React from 'react';
import theme from '../../theme';

const { colors, spacing, radius, fontSizes, shadows, fontFamily } = theme;

const VARIANTS = {
  primary: {
    background: colors.GREEN,
    borderColor: '#27ae60',
    color: '#fff',
    boxShadow: shadows.green,
  },
  gold: {
    background: colors.GOLD,
    borderColor: '#d4ac0d',
    color: '#1a1a2e',
    boxShadow: shadows.gold,
  },
  ghost: {
    background: 'rgba(255,255,255,.06)',
    borderColor: 'rgba(255,255,255,.12)',
    color: colors.DIM,
    boxShadow: shadows.none,
  },
  danger: {
    background: colors.RED,
    borderColor: '#c0392b',
    color: '#fff',
    boxShadow: shadows.danger,
  },
  circular: {
    background: colors.GOLD,
    borderColor: '#d4ac0d',
    color: '#1a1a2e',
    boxShadow: shadows.gold,
  },
};

export default function Button({
  variant = 'primary',
  children,
  style,
  disabled = false,
  fullWidth = true,
  size = 'md',
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;

  const isCircular = variant === 'circular';

  const sizeMap = {
    sm: { fontSize: fontSizes.md, paddingY: 10, paddingX: 14, minHeight: 40 },
    md: { fontSize: fontSizes.lg, paddingY: 14, paddingX: 16, minHeight: 44 },
    lg: { fontSize: fontSizes.xl, paddingY: 18, paddingX: 22, minHeight: 48 },
  };

  const s = sizeMap[size] || sizeMap.md;

  const baseStyle = isCircular
    ? {
        width: 72,
        height: 72,
        minWidth: 72,
        minHeight: 72,
        borderRadius: radius.round,
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSizes.xxl,
        fontWeight: 700,
      }
    : {
        width: fullWidth ? '100%' : 'auto',
        minHeight: s.minHeight,
        padding: `${s.paddingY}px ${s.paddingX}px`,
        borderRadius: radius.lg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: v === VARIANTS.ghost ? fontSizes.base : s.fontSize,
        fontWeight: 600,
      };

  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...baseStyle,
        fontFamily: fontFamily.base,
        border: '3px solid',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform .1s, opacity .2s, filter .2s',
        textAlign: 'center',
        opacity: disabled ? 0.35 : 1,
        ...v,
        ...style,
      }}
      onMouseDown={(e) => {
        if (props.onMouseDown) props.onMouseDown(e);
      }}
    >
      {children}
    </button>
  );
}
