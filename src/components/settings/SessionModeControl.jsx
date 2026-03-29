import React from 'react'
import { BG3, GOLD, DIM } from '../../constants.js'

export default function SessionModeControl({ value, onChange }) {
  const opts = [
    { value: 'free', label: 'Libre', icon: '🪐' },
    { value: 'random', label: 'Random', icon: '🔀' },
    { value: 'guided', label: 'Guiada', icon: '🧑‍🏫' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        background: BG3,
        borderRadius: 12,
        padding: 4,
        flexWrap: 'wrap',
      }}
    >
      {opts.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            onClick={() => onChange && onChange(o.value)}
            style={{
              flex: 1,
              minWidth: 92,
              padding: '12px 10px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: active ? GOLD : 'transparent',
              color: active ? '#1a1a2e' : DIM,
              fontFamily: "'Fredoka'",
              fontWeight: 700,
              fontSize: 15,
              transition: 'all .2s',
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 2 }}>{o.icon}</div>
            <div>{o.label}</div>
          </button>
        )
      })}
    </div>
  )
}
