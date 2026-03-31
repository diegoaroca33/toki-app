import React, { useState } from 'react'
import { BG, GOLD, GREEN, RED, DIM, CARD, BORDER } from '../../constants.js'
import { getStreak } from '../../utils.js'
import { MonthlyReport } from '../MonthlyReport.jsx'
import ControlCheckpoint, { getCheckpoints, getSessionsSinceLastCheckpoint, isCheckpointPending, canDoCheckpointNow, daysUntilNextCheckpoint } from '../ControlCheckpoint.jsx'
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
      {/* Red alert: checkpoint pending (baseline or periodic) */}
      {cpPending && getCheckpoints(user?.id).length > 0 && (
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
        const canDoNow = canDoCheckpointNow(user)
        const daysLeft = daysUntilNextCheckpoint(user)
        const baseline = cps.length > 0 ? cps[0] : null
        return (
          <Card>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🎯 Controles de progresión</div>
            <div style={{ color: DIM, fontSize: 13, marginBottom: 12 }}>
              Se graban 25 frases para medir la evolución del habla. Sugerencia automática cada ~30 sesiones.
              {cps.length > 0 && <> · {sinceLastCp} sesiones desde el último control.</>}
            </div>

            {/* No baseline yet — informative alert (not blocking) */}
            {cps.length === 0 && (
              <div style={{ background: `${GOLD}18`, border: `2px solid ${GOLD}55`, borderRadius: 14, padding: '14px 18px', marginBottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: GOLD, marginBottom: 4 }}>📋 Control inicial recomendado</div>
                <div style={{ fontSize: 13, color: DIM, lineHeight: 1.5, marginBottom: 6 }}>
                  Recomendamos hacer un control inicial antes de empezar a entrenar. Toki grabará <b style={{ color: '#fff' }}>25 frases</b> que servirán como punto de partida para medir la evolución.
                </div>
                <div style={{ fontSize: 12, color: DIM, lineHeight: 1.4, marginBottom: 10 }}>
                  No es obligatorio — puedes entrenar sin él, pero sin un punto de partida no podrás comparar el progreso.
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: GOLD, color: '#000', fontWeight: 700, padding: '6px 16px', borderRadius: 20, fontSize: 14, cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => setShowRecording(true)}>
                    🎤 Hacer control inicial
                  </span>
                </div>
              </div>
            )}

            {/* Manual control button — always visible when baseline exists */}
            {cps.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {canDoNow ? (
                  <div style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}44`, borderRadius: 12, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                    onClick={() => setShowRecording(true)}>
                    <span style={{ fontSize: 22 }}>🎤</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Realizar control ahora</div>
                      <div style={{ fontSize: 12, color: DIM }}>{sinceLastCp} sesiones desde el último</div>
                    </div>
                    <span style={{ fontSize: 16 }}>→</span>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 14px', opacity: 0.6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>🎤 Próximo control disponible en {daysLeft} día{daysLeft !== 1 ? 's' : ''}</div>
                    <div style={{ fontSize: 12, color: DIM }}>Mínimo 7 días entre controles para que la comparación sea significativa</div>
                  </div>
                )}
              </div>
            )}

            {/* Baseline summary if exists */}
            {baseline && (
              <div style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 12px', marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: GOLD, fontWeight: 700 }}>Punto de partida</span> ({baseline.date}): ⭐ {baseline.avgScore.toFixed(1)} · {(baseline.results || []).filter(r => r.score >= 3).length}/25 frases bien
              </div>
            )}

            {cps.length === 0 ? (
              <div style={{ color: DIM, fontSize: 14 }}>Todavía no se ha realizado ningún control.</div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {[...cps].reverse().map((cp, ri) => {
                  const i = cps.length - 1 - ri
                  const prev = i > 0 ? cps[i - 1] : null
                  const improved = prev ? cp.avgScore > prev.avgScore : null
                  const isExpanded = expandedCp === i
                  const vsBaseline = baseline && i > 0 ? cp.avgScore - baseline.avgScore : null
                  return (
                    <div key={i} style={{ borderRadius: 12, border: `1px solid ${BORDER}`, background: CARD, overflow: 'hidden' }}>
                      <div onClick={() => setExpandedCp(isExpanded ? null : i)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>
                            {i === 0 ? '📋 Control inicial' : `Control #${cp.number}`} — {cp.date}
                          </div>
                          <div style={{ color: DIM, fontSize: 12 }}>
                            {cp.sessionStats?.sessions || '?'} sesiones
                            {vsBaseline !== null && <> · <span style={{ color: vsBaseline >= 0 ? GREEN : RED }}>{vsBaseline >= 0 ? '+' : ''}{vsBaseline.toFixed(1)} vs inicio</span></>}
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
                          {vsBaseline !== null && prev !== baseline && (
                            <div style={{ padding: '6px 10px', borderRadius: 8, background: `${GOLD}11`, fontSize: 13, marginBottom: 4 }}>
                              📋 vs Punto de partida: <b>{vsBaseline >= 0 ? '+' : ''}{vsBaseline.toFixed(2)}</b> puntos desde el inicio
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
              const total = Number(h?.ok || 0) + Number(h?.sk || 0)
              const min = Number(h?.min || 0)
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{h?.dt || h?.d || `Sesión ${hist.length - idx}`}</div>
                    <div style={{ color: DIM, fontSize: 13 }}>{total} ejercicios · {min} min</div>
                  </div>
                  <Badge tone="gold">{total}</Badge>
                </div>
              )
            })}
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Texto para logopeda</div>
        <textarea readOnly value={`TOKI · Resumen\nNombre: ${user?.name || ''}\nSesiones: ${hist.length}\nEjercicios totales: ${totalOk + totalSk}\nTiempo total: ${hist.reduce((a,h) => a + (h.min || 0), 0)} min\nDías entrenados: ${new Set(hist.map(h => h.dt)).size}\nRacha: ${streak}\nEstrellas: ${totalStars}`}
          style={{ width: '100%', minHeight: 120, resize: 'vertical', borderRadius: 12, padding: 12, border: '2px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.04)', color: '#fff', fontFamily: 'inherit', fontSize: 14 }} />
      </Card>
    </div>
  )
}
