import React from 'react'
import { GOLD, DIM } from '../../constants.js'
import { getStreak } from '../../utils.js'
import { MonthlyReport } from '../MonthlyReport.jsx'
import { Card, StatBox, Badge } from '../ui/index.js'

export default function SettingsProgressTab(props) {
  const { user } = props
  const hist = user?.hist || []
  const totalOk = hist.reduce((a, h) => a + Number(h?.ok || 0), 0)
  const totalSk = hist.reduce((a, h) => a + Number(h?.sk || 0), 0)
  const totalStars = user?.totalStars3plus || 0
  const streak = getStreak()

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12 }}>
        <StatBox icon="⭐" value={totalStars} label="Estrellas" />
        <StatBox icon="✅" value={totalOk} label="Aciertos" />
        <StatBox icon="🌀" value={hist.length} label="Sesiones" />
        <StatBox icon="🔥" value={streak} label="Racha" />
      </div>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Informe mensual</div>
        <MonthlyReport user={user} />
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Historial</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {hist.length === 0 ? <div style={{ color: DIM, fontSize: 14 }}>Todavía no hay sesiones.</div>
            : [...hist].slice(-14).reverse().map((h, idx) => {
              const ok = Number(h?.ok || 0), sk = Number(h?.sk || 0)
              const pct = ok + sk ? Math.round((ok / (ok + sk)) * 100) : 0
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{h?.dt || h?.d || `Sesión ${hist.length - idx}`}</div>
                    <div style={{ color: DIM, fontSize: 13 }}>{ok} aciertos · {sk} fallos</div>
                  </div>
                  <Badge tone={pct >= 70 ? 'green' : pct >= 40 ? 'gold' : 'red'}>{pct}%</Badge>
                </div>
              )
            })}
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Texto para logopeda</div>
        <textarea readOnly value={`TOKI · Resumen\nNombre: ${user?.name || ''}\nSesiones: ${hist.length}\nAciertos: ${totalOk}\nFallos: ${totalSk}\nEstrellas: ${totalStars}\nRacha: ${streak}`}
          style={{ width: '100%', minHeight: 120, resize: 'vertical', borderRadius: 12, padding: 12, border: '2px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.04)', color: '#fff', fontFamily: 'inherit', fontSize: 14 }} />
      </Card>
    </div>
  )
}
