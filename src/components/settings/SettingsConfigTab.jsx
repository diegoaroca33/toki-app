import React, { useMemo } from 'react'
import {
  BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER,
  SMINS, LV_OPTS
} from '../../constants.js'
import { Button, Card, Badge } from '../ui/index.js'
import SessionModeControl from './SessionModeControl.jsx'
import { NumPad } from '../UIKit.jsx'
import { saveData } from '../../utils.js'

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

export default function SettingsConfigTab(props) {
  const {
    sm, setSm,
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
          {chgStep === 'new' && <><p style={{ fontSize: 15, color: DIM, margin: '0 0 8px', fontWeight: 600 }}>Nuevo PIN (4 dígitos)</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><NumPad value={pp} onChange={v => { setPp(v); setChgErr('') }} onSubmit={() => { if (pp.length === 4) { setChgNew(pp); setPp(''); setChgStep('confirm') } }} maxLen={4} /></div></>}
          {chgStep === 'confirm' && <><p style={{ fontSize: 15, color: GOLD, margin: '0 0 8px', fontWeight: 600 }}>Confirma el nuevo PIN</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><NumPad value={pp} onChange={v => { setPp(v); setChgErr('') }} onSubmit={() => { if (pp.length === 4) { if (pp === chgNew) { setSupPin(pp); saveData('sup_pin', pp); setPp(''); setChgStep('closed'); setChgNew(''); setChgErr('') } else { setChgErr('Los PIN no coinciden'); setPp(''); setChgStep('new'); setChgNew('') } } }} maxLen={4} /></div></>}
        </div>}
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Modo de sesión</div>
        <SessionModeControl value={currentMode} onChange={setMode} />
        <div style={{ color: DIM, fontSize: 13, marginTop: 10 }}>
          {currentMode === 'free' && 'El niño elige planeta y módulo.'}
          {currentMode === 'random' && 'Mezcla automática de los módulos activos.'}
          {currentMode === 'guided' && 'El supervisor configura qué se trabaja.'}
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Sesión y límites</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Duración de sesión</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SMINS.map((n, i) => (
                <Button key={i} variant={sm === n ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => setSm && setSm(n)}>
                  {n === 0 ? '∞' : `${n} min`}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Tiempo máximo diario</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[30, 60, 120, 0].map((n) => (
                <Button key={n} variant={maxDaily === n ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => setMaxDaily && setMaxDaily(n)}>
                  {n === 0 ? '∞' : `${n} min`}
                </Button>
              ))}
            </div>
          </div>
        </div>
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
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Accesibilidad</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <ToggleRow label="Casco astronauta" help="Casco visual sobre el avatar" value={helmetMode ?? showHelmet} onChange={setHelmetMode} />
          <ToggleRow label="Producción oral" help="Práctica oral extra tras los aciertos" value={!!oralAll} onChange={setOralAll} />
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Planetas y módulos activos</div>
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
                <div style={{ padding: '0 12px 12px', display: 'grid', gap: 8 }}>
                  {g.modules.map((m) => {
                    const active = activeMods?.[m.lvKey] !== false
                    const levels = LV_OPTS[m.lvKey] || LV_OPTS[m.k] || []
                    return (
                      <div key={m.lvKey} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: levels.length > 0 && active ? 8 : 0 }}>
                          <div style={{ fontWeight: 700 }}>{m.l}</div>
                          <Button variant={active ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => setActiveMods && setActiveMods({ ...(activeMods || {}), [m.lvKey]: !active })}>
                            {active ? 'Activo' : 'Oculto'}
                          </Button>
                        </div>
                        {levels.length > 0 && active && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {levels.map((lv) => {
                              const selected = sec === m.k && (Array.isArray(secLv) ? secLv.includes(lv.n) : false)
                              return (
                                <Button key={lv.n} variant={selected ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => { setSec && setSec(m.k); setSecLv && setSecLv([lv.n]) }}>
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
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
