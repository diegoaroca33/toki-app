import React, { useState } from 'react'
import { BG, GOLD, GREEN, RED, DIM, CARD, BORDER } from '../../constants.js'
import { getStreak } from '../../utils.js'
import { MonthlyReport } from '../MonthlyReport.jsx'
import ControlCheckpoint, { getCheckpoints, getSessionsSinceLastCheckpoint, isCheckpointPending } from '../ControlCheckpoint.jsx'
import { Card, StatBox, Badge } from '../ui/index.js'

export default function SettingsProgressTab(props) {
  const { user, personas } = props
  const hist = user?.hist || []
  const [expandedCp, setExpandedCp] = useState(null)
  const [showRecording, setShowRecording] = useState(false)
  const totalOk = hist.reduce((a, h) => a + Number(h?.ok || 0), 0)
  const totalSk = hist.reduce((a, h) => a + Number(h?.sk || 0), 0)
  const totalStars = user?.totalStars3plus || 0
  const streak = getStreak()
  const cpPending = isCheckpointPending(user)

  if (showRecording) {
    return <ControlCheckpoint user={user} personas={personas}
      onComplete={() => setShowRecording(false)}
      onSkip={() => setShowRecording(false)} />
  }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {/* Red alert: checkpoint pending */}
      {cpPending && (
        <div style={{ background: `${RED}18`, border: `2px solid ${RED}55`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          onClick={() => setShowRecording(true)}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>🔴</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: RED, marginBottom: 2 }}>Grabación de control pendiente</div>
            <div style={{ fontSize: 13, color: DIM }}>
              {getSessionsSinceLastCheckpoint(user)} sesiones desde el último control. Pulsa para grabar las 25 frases de control.
            </div>
          </div>
          <div style={{ fontSize: 22 }}>→</div>
        </div>
      )}

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

      {/* ── Controles de progresión ── */}
      {(() => {
        const cps = getCheckpoints(user?.id)
        const sinceLastCp = getSessionsSinceLastCheckpoint(user)
        return (
          <Card>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🎯 Controles de progresión</div>
            <div style={{ color: DIM, fontSize: 13, marginBottom: 12 }}>
              Cada 30 sesiones se graban 25 frases para medir la evolución del habla.
              {cps.length > 0 && <> · Próximo control en <b style={{ color: '#fff' }}>{Math.max(0, 30 - sinceLastCp)}</b> sesiones</>}
              {cps.length === 0 && <> · Primer control en <b style={{ color: '#fff' }}>{Math.max(0, 30 - sinceLastCp)}</b> sesiones</>}
            </div>
            {cps.length === 0 ? (
              <div style={{ color: DIM, fontSize: 14 }}>Todavía no se ha realizado ningún control.</div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {[...cps].reverse().map((cp, ri) => {
                  const i = cps.length - 1 - ri
                  const prev = i > 0 ? cps[i - 1] : null
                  const improved = prev ? cp.avgScore > prev.avgScore : null
                  const isExpanded = expandedCp === i
                  return (
                    <div key={i} style={{ borderRadius: 12, border: `1px solid ${BORDER}`, background: CARD, overflow: 'hidden' }}>
                      <div onClick={() => setExpandedCp(isExpanded ? null : i)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>Control #{cp.number} — {cp.date}</div>
                          <div style={{ color: DIM, fontSize: 12 }}>
                            {cp.sessionStats?.sessions || '?'} sesiones · {cp.sessionStats?.accuracy || '?'}% aciertos
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Badge tone={cp.avgScore >= 3 ? 'green' : cp.avgScore >= 2 ? 'gold' : 'red'}>
                            ⭐ {cp.avgScore.toFixed(1)}
                          </Badge>
                          {improved !== null && (
                            <span style={{ fontSize: 18 }}>{improved ? '📈' : '📉'}</span>
                          )}
                          <span style={{ fontSize: 12, color: DIM }}>{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div style={{ padding: '0 14px 12px', display: 'grid', gap: 4 }}>
                          {prev && (
                            <div style={{ padding: '6px 10px', borderRadius: 8, background: improved ? `${GREEN}11` : `${RED}11`, fontSize: 13, marginBottom: 4 }}>
                              {improved ? '📈' : '📉'} vs Control #{prev.number}: <b>{(cp.avgScore - prev.avgScore) > 0 ? '+' : ''}{(cp.avgScore - prev.avgScore).toFixed(2)}</b> puntos
                            </div>
                          )}
                          {(cp.results || []).map((r, j) => (
                            <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 8px', borderRadius: 8, background: 'rgba(255,255,255,.03)', fontSize: 13 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.phrase}</div>
                                <div style={{ color: DIM, fontSize: 11 }}>→ {r.transcript || '(no reconocido)'}</div>
                              </div>
                              <span>{'⭐'.repeat(r.score)}{'☆'.repeat(4 - r.score)}</span>
                              {r.audio && (
                                <button onClick={() => { const a = new Audio(r.audio); a.play() }}
                                  style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', padding: 2 }}>🔊</button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        )
      })()}

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
