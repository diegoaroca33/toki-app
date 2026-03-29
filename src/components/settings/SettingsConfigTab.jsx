import React, { useMemo, useState } from 'react'
import {
  BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER,
  SESSION_TIMES, SESSION_TIME_LABELS, SESSION_GOALS, GOAL_LABELS, GOAL_ESTIMATES, GOAL_EMOJIS, LV_OPTS
} from '../../constants.js'
import { Button, Card, Badge } from '../ui/index.js'
import SessionModeControl from './SessionModeControl.jsx'
import { NumPad } from '../UIKit.jsx'
import { saveData, getModuleLvOrDef, setModuleLv, getDynamicDilo, setDynamicDilo } from '../../utils.js'

function Dot({ color, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: `3px solid ${active ? GOLD : 'rgba(255,255,255,.12)'}`,
        background: color,
        boxShadow: active ? `0 0 0 3px ${GOLD}22` : 'none',
        cursor: 'pointer',
      }}
    />
  )
}

function ToggleRow({ label, help, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{label}</div>
        {help ? <div style={{ color: DIM, fontSize: 13 }}>{help}</div> : null}
      </div>
      <button
        onClick={() => onChange && onChange(!value)}
        style={{
          width: 68,
          height: 38,
          borderRadius: 999,
          border: `2px solid ${value ? GREEN : BORDER}`,
          background: value ? `${GREEN}22` : BG3,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: value ? 34 : 4,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: value ? GREEN : DIM,
            transition: 'all .2s',
          }}
        />
      </button>
    </div>
  )
}

function SmallSegmented({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: BG3, borderRadius: 12, padding: 4, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            onClick={() => onChange && onChange(o.value)}
            style={{
              flex: 1,
              minWidth: 120,
              padding: '10px 12px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: active ? GOLD : 'transparent',
              color: active ? '#1a1a2e' : DIM,
              fontFamily: "'Fredoka'",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

const PAUTA_MIN = 14, PAUTA_MAX = 40, PAUTA_DEFAULT = 26
function pautaLabel(v) {
  if (v >= 34) return 'Principiante'
  if (v >= 26) return 'Medio'
  if (v >= 20) return 'Avanzado'
  return 'Experto'
}

function EscribeConfig({ escribeCase, setEscribeCase, escribeTypes, setEscribeTypes, escribeGuide, setEscribeGuide, escribePauta, setEscribePauta }) {
  const types = escribeTypes || ['letras']
  const guide = escribeGuide || {}
  // escribePauta: legacy 0-3 index OR new direct px value (14-40)
  const pautaPx = (() => {
    const v = escribePauta
    if (v == null) return PAUTA_DEFAULT
    if (v <= 3) return [40, 26, 20, 16][v] // legacy index → px
    return Math.max(PAUTA_MIN, Math.min(PAUTA_MAX, v))
  })()

  const toggleType = (t) => {
    const on = types.includes(t)
    let next
    if (on) {
      next = types.filter(x => x !== t)
      if (next.length === 0) next = ['letras']
    } else {
      if (types.length >= 2) return
      next = [...types, t]
    }
    setEscribeTypes(next)
  }

  const toggleGuide = (t) => {
    const newG = { ...guide, [t]: !guide[t] }
    setEscribeGuide(newG)
  }

  const sampleText = escribeCase === 'upper' ? 'HOLA' : 'hola'

  return (
    <div style={{ padding: '0 12px 12px', display: 'grid', gap: 12 }}>
      {/* Case toggle */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Tipo de letra</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant={escribeCase === 'upper' ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => setEscribeCase('upper')}>
            MAYUSCULAS
          </Button>
          <Button variant={escribeCase !== 'upper' ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => setEscribeCase('lower')}>
            minusculas
          </Button>
        </div>
      </div>

      {/* Type checkboxes */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Contenido (max 2)</div>
        {['letras', 'palabras', 'frases'].map((t) => {
          const on = types.includes(t)
          const labelMap = { letras: 'Letras', palabras: 'Palabras', frases: 'Frases' }
          return (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <button
                onClick={() => toggleType(t)}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  border: `2px solid ${on ? GOLD : BORDER}`,
                  background: on ? `${GOLD}22` : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: on ? GOLD : DIM, fontWeight: 700, fontSize: 16,
                }}
              >
                {on ? '✓' : ''}
              </button>
              <span style={{ fontWeight: 600, flex: 1 }}>{labelMap[t]}</span>
              {on && (
                <Button variant={guide[t] ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => toggleGuide(t)}>
                  Guia {guide[t] ? 'ON' : 'OFF'}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Pauta size slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontWeight: 700 }}>Tamano de pauta</span>
          <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{pautaLabel(pautaPx)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: DIM }}>A</span>
          <input type="range" min={PAUTA_MIN} max={PAUTA_MAX} step={1} value={pautaPx}
            onChange={e => setEscribePauta(Number(e.target.value))}
            style={{ flex: 1, accentColor: GOLD, cursor: 'pointer' }} />
          <span style={{ fontSize: 20, color: DIM, fontWeight: 700 }}>A</span>
        </div>
      </div>

      {/* Preview — larger, realistic */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Vista previa</div>
        <div style={{
          background: '#fff', borderRadius: 12, padding: '20px 16px',
          position: 'relative', minHeight: pautaPx * 3 + 30,
        }}>
          <div style={{ position: 'relative' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                height: pautaPx,
                borderBottom: '2px solid #bbb',
                borderTop: i === 0 ? '1px dashed #ccc' : 'none',
                display: 'flex', alignItems: 'flex-end',
                paddingLeft: 6,
              }}>
                {i === 0 && (
                  <span style={{
                    fontFamily: "'Fredoka'", fontSize: pautaPx * 0.82,
                    color: '#333', lineHeight: 1,
                  }}>
                    {sampleText}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsConfigTab(props) {
  const {
    sm, setSm,
    sessionType, setSessionType,
    sessionTime, setSessionTime,
    sessionGoal, setSessionGoal,
    theme, setTheme,
    rocketColor, setRocketColor,
    exigencia, setExigencia,
    maxDaily, setMaxDaily,
    sessionMode, setSessionMode,
    freeChoice, setFreeChoice,
    helmetMode, setHelmetMode,
    showHelmet,
    oralAll, setOralAll,
    dynGroups,
    activeMods, setActiveMods,
    pOpenPlanet, setPOpenPlanet,
    openSection, setOpenSection,
    sec, setSec,
    secLv, setSecLv,
    escribeCase, setEscribeCase,
    escribeTypes, setEscribeTypes,
    escribeGuide, setEscribeGuide,
    escribePauta, setEscribePauta,
    setShowRec,
    supPin, setSupPin, pp, setPp,
    user,
    burstMode, setBurstMode,
    burstReps, setBurstReps,
  } = props

  const currentMode = useMemo(() => {
    if (sessionMode === 'random') return 'random'
    if (sessionMode === 'guided' || freeChoice === false) return 'guided'
    return 'free'
  }, [sessionMode, freeChoice])

  const setMode = (mode) => {
    if (mode === 'random') {
      setSessionMode && setSessionMode('random')
      setFreeChoice && setFreeChoice(false)
    } else if (mode === 'guided') {
      setSessionMode && setSessionMode('guided')
      setFreeChoice && setFreeChoice(false)
    } else {
      setSessionMode && setSessionMode('free')
      setFreeChoice && setFreeChoice(true)
    }
  }

  const rocketColors = [
    { value: 'red', color: RED, label: 'Rojo' },
    { value: 'blue', color: BLUE, label: 'Azul' },
    { value: 'green', color: GREEN, label: 'Verde' },
    { value: 'gold', color: GOLD, label: 'Dorado' },
    { value: 'purple', color: PURPLE, label: 'Morado' },
  ]

  // PIN change state
  const [chgStep, setChgStep] = React.useState('closed')
  const [chgCur, setChgCur] = React.useState('')
  const [chgNew, setChgNew] = React.useState('')
  const [chgErr, setChgErr] = React.useState('')

  // Dynamic DILO state
  const userId = user?.id
  const [dynDilo, setDynDiloLocal] = useState(() => userId ? getDynamicDilo(userId) : false)
  const handleDynDilo = (v) => {
    if (userId) { setDynamicDilo(userId, v) }
    setDynDiloLocal(v)
  }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {/* PIN change */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <button onClick={() => { if (chgStep === 'closed') setChgStep('current'); else { setChgStep('closed'); setChgCur(''); setChgNew(''); setChgErr('') } }} style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Fredoka'", color: TXT }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>🔒 Cambiar PIN</span>
          <span style={{ fontSize: 16, color: DIM }}>{chgStep !== 'closed' ? '▼' : '▸'}</span>
        </button>
        {chgStep !== 'closed' && <div style={{ padding: '0 20px 20px' }}>
          {chgErr && <p style={{ fontSize: 14, color: RED, fontWeight: 600, margin: '0 0 8px', textAlign: 'center' }}>{chgErr}</p>}
          {chgStep === 'current' && <><p style={{ fontSize: 15, color: DIM, margin: '0 0 8px', fontWeight: 600 }}>Introduce el PIN actual</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><NumPad value={chgCur} onChange={v => { setChgCur(v); setChgErr('') }} onSubmit={() => { if (chgCur.length === 4) { if (chgCur === supPin) { setChgStep('new'); setChgCur('') } else { setChgErr('PIN incorrecto'); setChgCur('') } } }} maxLen={4} /></div></>}
          {chgStep === 'new' && <><p style={{ fontSize: 15, color: DIM, margin: '0 0 8px', fontWeight: 600 }}>Nuevo PIN (4 digitos)</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><NumPad value={pp} onChange={v => { setPp(v); setChgErr('') }} onSubmit={() => { if (pp.length === 4) { setChgNew(pp); setPp(''); setChgStep('confirm') } }} maxLen={4} /></div></>}
          {chgStep === 'confirm' && <><p style={{ fontSize: 15, color: GOLD, margin: '0 0 8px', fontWeight: 600 }}>Confirma el nuevo PIN</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><NumPad value={pp} onChange={v => { setPp(v); setChgErr('') }} onSubmit={() => { if (pp.length === 4) { if (pp === chgNew) { setSupPin(pp); saveData('sup_pin', pp); setPp(''); setChgStep('closed'); setChgNew(''); setChgErr('') } else { setChgErr('Los PIN no coinciden'); setPp(''); setChgStep('new'); setChgNew('') } } }} maxLen={4} /></div></>}
        </div>}
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Modo de sesion</div>
        <SessionModeControl value={currentMode} onChange={setMode} />
        <div style={{ color: DIM, fontSize: 13, marginTop: 10 }}>
          {currentMode === 'free' && 'El nino elige planeta y modulo.'}
          {currentMode === 'random' && 'Mezcla automatica de los modulos activos.'}
          {currentMode === 'guided' && 'El supervisor configura que se trabaja.'}
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Sesion</div>
        {/* Mode selector tabs */}
        <div style={{ display: 'flex', gap: 4, background: BG3, borderRadius: 12, padding: 4, marginBottom: 14 }}>
          {[['time', '⏱ Por tiempo'], ['goal', '🎯 Por objetivo']].map(([v, l]) => (
            <button key={v} onClick={() => { setSessionType(v); saveData('session_type', v) }}
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: sessionType === v ? GOLD : 'transparent',
                color: sessionType === v ? '#1a1a2e' : DIM,
                fontFamily: "'Fredoka'", fontWeight: 700, fontSize: 15,
              }}>{l}</button>
          ))}
        </div>

        {sessionType === 'time' ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SESSION_TIMES.map((n, i) => (
              <Button key={n} variant={sessionTime === n ? 'gold' : 'ghost'} fullWidth={false}
                onClick={() => { setSessionTime(n); saveData('session_time', n) }}>
                {SESSION_TIME_LABELS[i]}
              </Button>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {SESSION_GOALS.map((n, i) => (
                <Button key={n} variant={sessionGoal === n ? 'gold' : 'ghost'} fullWidth={false}
                  onClick={() => { setSessionGoal(n); saveData('session_goal', n) }}>
                  {GOAL_EMOJIS[i]} {n}
                </Button>
              ))}
            </div>
            <div style={{ color: DIM, fontSize: 13 }}>
              {GOAL_LABELS[SESSION_GOALS.indexOf(sessionGoal)]} · {GOAL_ESTIMATES[SESSION_GOALS.indexOf(sessionGoal)]}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Tema visual</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Button variant={theme === 'space' ? 'gold' : 'ghost'} fullWidth={false} onClick={() => setTheme && setTheme('space')}>
            🌌 Espacial
          </Button>
          <Button variant={theme === 'sober' ? 'gold' : 'ghost'} fullWidth={false} onClick={() => setTheme && setTheme('sober')}>
            🌙 Sobrio
          </Button>
        </div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Color del cohete</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {rocketColors.map((r) => (
            <Dot key={r.value} color={r.color} label={r.label} active={rocketColor === r.value} onClick={() => setRocketColor && setRocketColor(r.value)} />
          ))}
        </div>
        {theme !== 'sober' && <div style={{ marginTop: 14 }}>
          <ToggleRow label="🪖 Casco de astronauta" help="Muestra casco sobre las fotos de perfil" value={!!helmetMode} onChange={v => setHelmetMode && setHelmetMode(v)} />
        </div>}
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Metodo pedagogico</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <ToggleRow label="DILO dinamico" help="Ajusta nivel automaticamente segun aciertos" value={!!dynDilo} onChange={handleDynDilo} />
          <ToggleRow label="Modo rafaga" help="Repite cada ejercicio varias veces seguidas" value={!!burstMode} onChange={(v) => { setBurstMode && setBurstMode(v); saveData('burst_mode', v) }} />
          {burstMode && (
            <div style={{ marginLeft: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Repeticiones:</span>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 18, minWidth: 24, textAlign: 'center' }}>{burstReps}</span>
              </div>
              <input type="range" min={2} max={10} step={1} value={burstReps}
                onChange={e => { const v = parseInt(e.target.value); setBurstReps && setBurstReps(v) }}
                style={{ width: '100%', accentColor: GOLD, height: 6, cursor: 'pointer', marginTop: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: DIM, marginTop: 2 }}>
                <span>2</span><span>5</span><span>10</span>
              </div>
            </div>
          )}
          <div style={{ color: DIM, fontSize: 12, marginTop: -4 }}>
            Rafaga se activa automaticamente en sesiones intensas (1h+ o 200+ ejercicios)
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Planetas y modulos activos</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {(dynGroups || []).map((g) => (
            <div key={g.id} style={{ background: BG2, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <button
                onClick={() => {
                  setPOpenPlanet && setPOpenPlanet(pOpenPlanet === g.id ? null : g.id)
                  setOpenSection && setOpenSection(openSection === g.id ? null : g.id)
                }}
                style={{
                  width: '100%', background: 'transparent', border: 'none', color: TXT, textAlign: 'left',
                  padding: '12px 14px', cursor: 'pointer', fontFamily: "'Fredoka'",
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 700 }}>{g.emoji} {g.name}</span>
                <Badge tone="ghost">{g.modules?.length || 0}</Badge>
              </button>
              {(pOpenPlanet === g.id || openSection === g.id) && (
                g.id === 'escribe' ? (
                  <EscribeConfig
                    escribeCase={escribeCase}
                    setEscribeCase={setEscribeCase}
                    escribeTypes={escribeTypes}
                    setEscribeTypes={setEscribeTypes}
                    escribeGuide={escribeGuide}
                    setEscribeGuide={setEscribeGuide}
                    escribePauta={escribePauta}
                    setEscribePauta={setEscribePauta}
                  />
                ) : (
                  <div style={{ padding: '0 12px 12px', display: 'grid', gap: 8 }}>
                    {g.modules.map((m) => {
                      const active = activeMods?.[m.lvKey] !== false
                      const levels = LV_OPTS[m.lvKey] || LV_OPTS[m.k] || []
                      return (
                        <div key={m.lvKey} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: levels.length > 0 && active ? 8 : 0 }}>
                            <div style={{ fontWeight: 700 }}>{m.l}</div>
                            <Button variant={active ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => {
                              const na = { ...(activeMods || {}), [m.lvKey]: !active }
                              setActiveMods && setActiveMods(na)
                              saveData('active_mods', na)
                            }}>
                              {active ? 'Activo' : 'Oculto'}
                            </Button>
                          </div>
                          {levels.length > 0 && active && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {levels.map((lv) => {
                                const curLvs = getModuleLvOrDef(m.lvKey, m.defLv)
                                const selected = curLvs.includes(lv.n)
                                return (
                                  <Button key={lv.n} variant={selected ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => {
                                    const freshLvs = getModuleLvOrDef(m.lvKey, m.defLv)
                                    const wasOn = freshLvs.includes(lv.n)
                                    let newLvs
                                    if (wasOn) { newLvs = freshLvs.filter(l => l !== lv.n) }
                                    else { newLvs = [...freshLvs, lv.n] }
                                    setModuleLv(m.lvKey, newLvs)
                                    const na = { ...activeMods, [m.lvKey]: newLvs.length > 0 }
                                    setActiveMods(na)
                                    saveData('active_mods', na)
                                  }}>
                                    {lv.l}
                                  </Button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
