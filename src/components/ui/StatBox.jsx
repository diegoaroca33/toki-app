import React from 'react';
import theme from '../../theme';
import Card from './Card';

const { colors, spacing, fontSizes, fontFamily } = theme;

export default function StatBox({
  label,
  value,
  sublabel,
  icon,
  style,
  valueStyle,
  labelStyle,
  ...props
}) {
  return (
    <Card
      variant="stat"
      {...props}
      style={{
        minWidth: 88,
        ...style,
      }}
    >
      {icon ? (
        <div style={{ fontSize: fontSizes.xl, marginBottom: spacing.xs }}>{icon}</div>
      ) : null}

      <div
        style={{
          fontFamily: fontFamily.base,
          fontSize: fontSizes.xxxl,
          fontWeight: 700,
          color: colors.TXT,
          lineHeight: 1.05,
          ...valueStyle,
        }}
      >
        {value}
      </div>

      {label ? (
        <div
          style={{
            marginTop: spacing.xs,
            fontSize: fontSizes.sm,
            fontWeight: 600,
            color: colors.DIM,
            ...labelStyle,
          }}
        >
          {label}
        </div>
      ) : null}

      {sublabel ? (
        <div
          style={{
            marginTop: 2,
            fontSize: fontSizes.xs,
            color: colors.DIM,
            opacity: 0.9,
          }}
        >
          {sublabel}
        </div>
      ) : null}
    </Card>
  );
}
