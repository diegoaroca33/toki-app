import React from 'react';
import theme from '../../theme';

const { colors, radius } = theme;

export default function ProgressBar({
  value = 0,
  max = 100,
  height = 7,
  color,
  trackColor = 'rgba(255,255,255,.08)',
  style,
  ...props
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100));

  return (
    <div
      {...props}
      style={{
        height,
        width: '100%',
        background: trackColor,
        borderRadius: radius.xs || 4,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: color || `linear-gradient(90deg, ${colors.GREEN}, ${colors.BLUE})`,
          borderRadius: radius.xs || 4,
          transition: 'width .5s',
        }}
      />
    </div>
  );
}
