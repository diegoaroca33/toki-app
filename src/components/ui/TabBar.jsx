import React from 'react';
import theme from '../../theme';

const { colors, spacing, radius, fontSizes, fontFamily } = theme;

export default function TabBar({
  tabs = [],
  value,
  onChange,
  style,
  tabStyle,
  activeTabStyle,
  ...props
}) {
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        gap: 4,
        background: colors.BG3,
        borderRadius: radius.md,
        padding: 4,
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const val = tab.value ?? tab.id ?? tab.key;
        const active = value === val;
        return (
          <button
            key={val}
            onClick={() => onChange && onChange(val)}
            style={{
              flex: 1,
              padding: spacing.md,
              borderRadius: radius.sm,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: fontFamily.base,
              fontWeight: 600,
              fontSize: fontSizes.base,
              background: active ? colors.GOLD : 'transparent',
              color: active ? '#1a1a2e' : colors.DIM,
              transition: 'all .2s',
              ...tabStyle,
              ...(active ? activeTabStyle : null),
            }}
          >
            {tab.label ?? tab.name ?? tab.title ?? val}
          </button>
        );
      })}
    </div>
  );
}
