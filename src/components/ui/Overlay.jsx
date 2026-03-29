import React from 'react';
import theme from '../../theme';

const { colors, spacing, radius } = theme;

export default function Overlay({
  children,
  onClose,
  backdropStyle,
  panelStyle,
  closeOnBackdrop = true,
  maxWidth = 400,
  centered = true,
  ...props
}) {
  return (
    <div
      {...props}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget && onClose) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: centered ? 'center' : 'flex-start',
        justifyContent: 'center',
        zIndex: 100,
        padding: spacing.xl,
        background: 'rgba(0,0,0,.92)',
        ...backdropStyle,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          background: colors.BG2,
          border: `2px solid ${colors.GOLD}55`,
          borderRadius: radius.xxl,
          padding: `${spacing.xxxl}px ${spacing.xxl}px`,
          color: colors.TXT,
          textAlign: 'center',
          ...panelStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
