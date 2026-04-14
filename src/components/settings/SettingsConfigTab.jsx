import React, { useMemo, useState } from 'react'
import {
  BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER,
  SESSION_TIMES, SESSION_TIME_LABELS, SESSION_GOALS, GOAL_LABELS, GOAL_ESTIMATES, GOAL_EMOJIS, LV_OPTS, SUPPORT_EMAIL, VER, LEVEL_PRESETS
} from '../../constants.js'
import { Button, Card, Badge } from '../ui/index.js'
import SessionModeControl from './SessionModeControl.jsx'
import { NumPad } from '../UIKit.jsx'
import { saveData, getModuleLvOrDef, setModuleLv, getDynamicDilo, setDynamicDilo, loadData } from '../../utils.js'
import { fbGetMyPublicVoiceCount, fbDeleteMyPublicVoices, track } from '../../firebase.js'
import { getVoicePriority, setVoicePriority as setVPrio, getForcedVoice, setForcedVoice as setFV } from '../../voice.js'

function PublicVoiceManager({ fbUser }) {
  const [count, setCount] = React.useState(null)
  const [deleting, setDeleting] = React.useState(false)
  const [confirmDel, setConfirmDel] = React.useState(false)
  const [deleted, setDeleted] = React.useState(false)

  React.useEffect(() => {
    if (fbUser) fbGetMyPublicVoiceCount(fbUser.uid).then(c => setCount(c)).catch(() => setCount(0))
  }, [fbUser, deleted])

  if (!fbUser || count === null || count === 0) return null

  return (
    <div style={{ padding: '10px 16px', background: CARD, border: '2px solid ' + BORDER, borderRadius: 12, textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>🎙️ Voces públicas: {count}</div>
          <div style={{ fontSize: 11, color: DIM }}>Grabaciones cedidas como modelo educativo</div>
        </div>
        {!confirmDel && !deleted && (
          <button onClick={() => setConfirmDel(true)} style={{ background: RED + '22', border: '2px solid ' + RED + '44', borderRadius: 10, padding: '6px 12px', color: RED, fontSize: 12, cursor: 'pointer', fontFamily: "'Fredoka'", fontWeight: 600 }}>Revocar</button>
        )}
      </div>
      {confirmDel && !deleted && (
        <div style={{ marginTop: 10, padding: 12, background: RED + '11', borderRadius: 10, border: '1px solid ' + RED + '33' }}>
          <p style={{ fontSize: 13, color: DIM, margin: '0 0 8px' }}>Esto eliminará permanentemente tus {count} grabaciones públicas. Otros usuarios ya no podrán escucharlas.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setConfirmDel(false)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid ' + BORDER, background: 'transparent', color: DIM, fontSize: 13, cursor: 'pointer', fontFamily: "'Fredoka'" }}>Cancelar</button>
            <button disabled={deleting} onClick={async () => {
              setDeleting(true)
              await fbDeleteMyPublicVoices(fbUser.uid)
              setDeleting(false)
              setConfirmDel(false)
              setDeleted(true)
              setCount(0)
            }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '2px solid ' + RED, background: RED + '22', color: RED, fontSize: 13, cursor: 'pointer', fontFamily: "'Fredoka'", fontWeight: 700 }}>{deleting ? 'Eliminando...' : 'Sí, revocar todo'}</button>
          </div>
        </div>
      )}
      {deleted && <p style={{ fontSize: 13, color: GREEN, margin: '8px 0 0', fontWeight: 600 }}>✅ Voces públicas eliminadas correctamente</p>}
    </div>
  )
}

function VoicePriorityCard({ user }) {
  const voices = user?.voices || []
  const [prio, setPrio] = React.useState(() => getVoicePriority())
  const [forced, setForced] = React.useState(() => getForcedVoice())

  const options = [
    { value: 'personal', emoji: '🏠', label: 'Personales primero', desc: 'Voces grabadas para ' + (user?.name || 'el alumno') + ', luego públicas, luego Toki' },
    { value: 'public', emoji: '🌐', label: 'Públicas primero', desc: 'Voces reales de otros usuarios (por edad/género), luego personales' },
    { value: 'tts', emoji: '🤖', label: 'Solo Toki (TTS)', desc: 'Voz sintética del dispositivo, sin grabaciones' },
  ]
  if (voices.length > 0) {
    options.push({ value: 'forced', emoji: '🎯', label: 'Forzar una voz', desc: 'Usa siempre una voz específica de las grabadas' })
  }

  function handlePrio(v) {
    setPrio(v)
    setVPrio(v)
    if (v !== 'forced') { setForced(''); setFV('') }
  }
  function handleForced(vid) {
    setForced(vid)
    setFV(vid)
    setPrio('forced')
    setVPrio('forced')
  }

  return (
    <Card>
      <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>🎙️ Prioridad de voces</div>
      <div style={{ display: 'grid', gap: 8, marginBottom: voices.length > 0 && prio === 'forced' ? 12 : 0 }}>
        {options.map(o => (
          <button key={o.value} onClick={() => handlePrio(o.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 12, border: `2px solid ${prio === o.value ? GOLD : BORDER}`,
              background: prio === o.value ? GOLD + '18' : 'transparent',
              cursor: 'pointer', textAlign: 'left', fontFamily: "'Fredoka'", color: TXT,
              transition: 'all .15s'
            }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{o.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: prio === o.value ? GOLD : TXT }}>{o.label}</div>
              <div style={{ fontSize: 11, color: DIM, lineHeight: 1.3 }}>{o.desc}</div>
            </div>
            {prio === o.value && <span style={{ color: GOLD, fontSize: 16, fontWeight: 800 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Force specific voice selector */}
      {prio === 'forced' && voices.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: DIM, marginBottom: 8 }}>Selecciona la voz:</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {voices.map(v => (
              <button key={v.id} onClick={() => handleForced(v.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  borderRadius: 10, border: `2px solid ${forced === v.id ? GREEN : BORDER}`,
                  background: forced === v.id ? GREEN + '18' : 'transparent',
                  cursor: 'pointer', fontFamily: "'Fredoka'", color: TXT
                }}>
                <span style={{ fontSize: 24 }}>{v.avatar}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: DIM }}>{v.saved} grabaciones · {v.sex === 'f' ? 'Chica' : 'Chico'}{v.age ? ' · ' + v.age + ' años' : ''}</div>
                </div>
                {forced === v.id && <span style={{ color: GREEN, fontWeight: 800 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current priority explanation */}
      <div style={{ marginTop: 10, padding: '8px 12px', background: BG2, borderRadius: 10, fontSize: 12, color: DIM, lineHeight: 1.5 }}>
        {prio === 'personal' && '🏠 → 🌐 → 🤖  Busca primero en las voces grabadas para ' + (user?.name || 'el alumno') + '. Si no existe esa frase, busca voces públicas reales. Si tampoco hay, usa la voz sintética de Toki.'}
        {prio === 'public' && '🌐 → 🏠 → 🤖  Busca primero voces reales de otros usuarios (por género y edad similar). Si no hay, usa las personales. Último recurso: Toki.'}
        {prio === 'tts' && '🤖  Solo la voz sintética del dispositivo. No se reproducen grabaciones.'}
        {prio === 'forced' && forced && '🎯  Siempre usa la voz "' + (voices.find(v => v.id === forced)?.name || '?') + '". Si esa voz no tiene la frase grabada, usa Toki.'}
        {prio === 'forced' && !forced && '⚠️  Selecciona una voz de la lista de arriba.'}
      </div>
    </Card>
  )
}

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
        {['letras', 'palabras', 'frases', 'misfrases'].map((t) => {
          const on = types.includes(t)
          const labelMap = { letras: 'Letras', palabras: 'Palabras', frases: 'Frases', misfrases: '✏️ Mis frases' }
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
    fraccionado, setFraccionado,
    focalModule, setFocalModule,
    focalWeight, setFocalWeight,
    guidedTasks, setGuidedTasks,
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

  // Level preset application with confirmation modal
  const [currentCompetency, setCurrentCompetency] = React.useState(() => loadData('competency_level', null))
  const [pendingPreset, setPendingPreset] = React.useState(null) // key when user wants to apply a preset
  const [manualConfirmAsked, setManualConfirmAsked] = React.useState(() => !!loadData('competency_level', null) ? false : true) // if no preset, no need to confirm manual
  const [pendingManual, setPendingManual] = React.useState(null) // function to run after confirming manual
  function requestPreset(key) {
    // If same preset already active, do nothing
    if (currentCompetency === key) return
    setPendingPreset(key)
  }
  function applyPresetNow(key) {
    const preset = LEVEL_PRESETS[key]
    if (!preset) return
    const na = { ...(activeMods || {}) }
    Object.entries(preset.active).forEach(([lvKey, active]) => { na[lvKey] = active })
    setActiveMods && setActiveMods(na)
    saveData('active_mods', na)
    Object.entries(preset.levels).forEach(([lvKey, lvs]) => { setModuleLv(lvKey, lvs) })
    saveData('competency_level', key)
    setCurrentCompetency(key)
    setManualConfirmAsked(false) // reset: next manual change will ask
    setPendingPreset(null)
  }
  // Interceptor for manual changes to modules/levels
  // Call guardManualChange(actionFn) before any manual modification.
  // If a preset is active and confirmation not yet asked, shows modal first.
  function guardManualChange(actionFn) {
    if (currentCompetency && !manualConfirmAsked) {
      setPendingManual(() => actionFn)
    } else {
      actionFn()
    }
  }
  function confirmManualChange() {
    if (pendingManual) {
      pendingManual()
    }
    saveData('competency_level', null)
    setCurrentCompetency(null)
    setManualConfirmAsked(true)
    setPendingManual(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Competency level selector — ORDER 1 (LO PRIMERO que ve un supervisor nuevo) */}
      <Card style={{ order: 1 }}>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Nivel de competencia</div>
        <p style={{ color: DIM, fontSize: 13, margin: '0 0 12px' }}>Configura todos los módulos de una vez según el nivel del alumno</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {Object.entries(LEVEL_PRESETS).map(([key, preset]) => {
            const active = currentCompetency === key
            return <button key={key} onClick={() => requestPreset(key)} style={{
              padding: '14px 16px', borderRadius: 14, border: active ? `2px solid ${GOLD}` : `2px solid ${BORDER}`,
              background: active ? GOLD + '15' : CARD, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Fredoka'", transition: 'all .2s',
            }}>
              <span style={{ fontSize: 32 }}>{preset.label.split(' ')[0]}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: active ? GOLD : TXT }}>{preset.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ fontSize: 12, color: DIM }}>{preset.desc}</div>
              </div>
              {active && <span style={{ marginLeft: 'auto', fontSize: 18, color: GOLD }}>✓</span>}
            </button>
          })}
        </div>
        <p style={{ color: DIM, fontSize: 11, margin: '10px 0 0', textAlign: 'center' }}>Puedes personalizar módulos individuales más abajo</p>
      </Card>
      {/* PIN change — ORDER 90 (near bottom) */}
      <Card style={{ padding: 0, overflow: 'hidden', order: 90 }}>
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

      {/* Modo sesion — ORDER 70 (near bottom, cerca del botón A jugar) */}
      <Card style={{ order: 70 }}>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Modo de sesion</div>
        <SessionModeControl value={currentMode} onChange={setMode} />
        <div style={{ color: DIM, fontSize: 13, marginTop: 10 }}>
          {currentMode === 'free' && 'El nino elige planeta y modulo.'}
          {currentMode === 'random' && 'Mezcla automatica de los modulos activos.'}
          {currentMode === 'guided' && 'El supervisor configura que se trabaja.'}
        </div>
        {/* Guided: select 1-4 modules */}
        {currentMode === 'guided' && <div style={{ marginTop: 14, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 8 }}>Modulos para esta sesion (max 4)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dynGroups.flatMap(g => g.modules).filter(m => activeMods[m.lvKey] !== false).map(m => {
              const sel = (guidedTasks || []).includes(m.lvKey)
              return <Button key={m.lvKey} variant={sel ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => {
                const cur = guidedTasks || []
                let next
                if (sel) { next = cur.filter(k => k !== m.lvKey) }
                else if (cur.length < 4) { next = [...cur, m.lvKey] }
                else return
                setGuidedTasks && setGuidedTasks(next)
                saveData('guided_tasks', next)
              }}>{m.l}</Button>
            })}
          </div>
          {(guidedTasks || []).length === 0 && <div style={{ color: RED, fontSize: 12, marginTop: 4 }}>Selecciona al menos 1 modulo</div>}
        </div>}
        {/* Focal module + weight — only for random/guided */}
        {(currentMode === 'random' || currentMode === 'guided') && <>
          <div style={{ marginTop: 14, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 8 }}>Modulo principal</div>
            <select value={focalModule || 'decir'} onChange={e => setFocalModule && setFocalModule(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${BORDER}`, background: BG3, color: TXT, fontSize: 15, fontFamily: "'Fredoka'" }}>
              {dynGroups.flatMap(g => g.modules).filter(m => activeMods[m.lvKey] !== false).map(m => <option key={m.lvKey} value={m.k}>{m.l}</option>)}
            </select>
            <div style={{ color: DIM, fontSize: 12, marginTop: 4 }}>Este modulo tendra mas peso en la sesion</div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 6 }}>Intensidad: <span style={{ color: GOLD }}>{focalWeight || 3}</span>/5</div>
            <input type="range" min={1} max={5} step={1} value={focalWeight || 3} onChange={e => setFocalWeight && setFocalWeight(parseInt(e.target.value))} style={{ width: '100%', accentColor: GOLD }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: DIM }}>
              <span>Equilibrado</span>
              <span>Mas foco</span>
            </div>
          </div>
        </>}
      </Card>

      {/* Sesion (time/goal) — ORDER 75 (after modo sesion) */}
      <Card style={{ order: 75 }}>
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

      {/* Tema visual — ORDER 50 */}
      <Card style={{ order: 50 }}>
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

      {/* Metodo pedagogico — ORDER 60 */}
      <Card style={{ order: 60 }}>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Metodo pedagogico</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <ToggleRow label="DILO dinamico" help="Ajusta nivel automaticamente segun aciertos" value={!!dynDilo} onChange={handleDynDilo} />
          <ToggleRow label="Modo rafaga" help="Repite cada ejercicio varias veces seguidas" value={!!burstMode} onChange={(v) => { setBurstMode && setBurstMode(v); saveData('burst_mode', v); track('settings_changed',{field:'burst_mode',value:v}) }} />
          {burstMode && (
            <div style={{ marginLeft: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Repeticiones:</span>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 18, minWidth: 24, textAlign: 'center' }}>{burstReps}</span>
              </div>
              <input type="range" min={2} max={5} step={1} value={Math.min(burstReps,5)}
                onChange={e => { const v = parseInt(e.target.value); setBurstReps && setBurstReps(v) }}
                style={{ width: '100%', accentColor: GOLD, height: 6, cursor: 'pointer', marginTop: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: DIM, marginTop: 2 }}>
                <span>2</span><span>3</span><span>5</span>
              </div>
            </div>
          )}
          <div style={{ color: DIM, fontSize: 12, marginTop: -4 }}>
            Rafaga se activa automaticamente en sesiones intensas (1h+ o 200+ ejercicios)
          </div>
          <ToggleRow label="Encadenamiento inverso" help="Frases de 4+ palabras: empieza por la ultima y va sumando" value={!!fraccionado} onChange={(v) => { setFraccionado && setFraccionado(v); saveData('fraccionado', v); track('settings_changed',{field:'fraccionado',value:v}) }} />
          {fraccionado && (
            <div style={{ color: DIM, fontSize: 12, marginTop: -4 }}>
              Ej: "quiero agua" → agua → quiero agua{burstMode ? '. Con rafaga: la cadena completa se repite ' + Math.min(burstReps||2,3) + ' veces (max 3).' : ''}
            </div>
          )}
          <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>🎯 Tolerancia del micrófono:</span>
              <span style={{ color: GOLD, fontWeight: 800, fontSize: 18, minWidth: 36, textAlign: 'center' }}>{exigencia}%</span>
            </div>
            <input type="range" min={30} max={100} step={5} value={exigencia}
              onChange={e => { const v = parseInt(e.target.value); setExigencia && setExigencia(v) }}
              style={{ width: '100%', accentColor: GOLD, height: 6, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: DIM, marginTop: 2 }}>
              <span>Flexible</span><span>Exigente</span>
            </div>
            <p style={{ fontSize: 12, color: DIM, marginTop: 4 }}>
              {exigencia <= 50 ? 'Acepta aproximaciones amplias — ideal para empezar' :
               exigencia <= 75 ? 'Equilibrado — acepta buenas aproximaciones' :
               'Exigente — requiere buena dicción para puntuar'}
            </p>
          </div>
        </div>
      </Card>

      {/* Voice priority — ORDER 65 */}
      <div style={{ order: 65 }}><VoicePriorityCard user={props.user} /></div>

      {/* Planetas y modulos — ORDER 10 (arriba, lo primero) */}
      <Card style={{ order: 10 }}>
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
                  <div style={{ padding: '0 12px 12px' }}>
                    {g.modules.map((m) => {
                      const active = activeMods?.[m.lvKey] !== false
                      return (
                        <div key={m.lvKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ fontWeight: 700 }}>{m.l}</div>
                          <Button variant={active ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => guardManualChange(() => {
                            const na = { ...(activeMods || {}), [m.lvKey]: !active }
                            setActiveMods && setActiveMods(na)
                            saveData('active_mods', na)
                          })}>
                            {active ? 'Activo' : 'Oculto'}
                          </Button>
                        </div>
                      )
                    })}
                    {g.modules.some(m => activeMods?.[m.lvKey] !== false) && (
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
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '0 12px 12px', display: 'grid', gap: 8 }}>
                    {g.modules.map((m) => {
                      const active = activeMods?.[m.lvKey] !== false
                      const levels = LV_OPTS[m.lvKey] || LV_OPTS[m.k] || []
                      return (
                        <div key={m.lvKey} style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, padding: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: levels.length > 0 && active ? 8 : 0 }}>
                            <div style={{ fontWeight: 700 }}>{m.l}</div>
                            <Button variant={active ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => guardManualChange(() => {
                              const na = { ...(activeMods || {}), [m.lvKey]: !active }
                              setActiveMods && setActiveMods(na)
                              saveData('active_mods', na)
                            })}>
                              {active ? 'Activo' : 'Oculto'}
                            </Button>
                          </div>
                          {levels.length > 0 && active && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {levels.map((lv) => {
                                const curLvs = getModuleLvOrDef(m.lvKey, m.defLv)
                                const selected = curLvs.includes(lv.n)
                                return (
                                  <Button key={lv.n} variant={selected ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => guardManualChange(() => {
                                    const freshLvs = getModuleLvOrDef(m.lvKey, m.defLv)
                                    const wasOn = freshLvs.includes(lv.n)
                                    let newLvs
                                    if (wasOn) { newLvs = freshLvs.filter(l => l !== lv.n) }
                                    else { newLvs = [...freshLvs, lv.n] }
                                    setModuleLv(m.lvKey, newLvs)
                                    const na = { ...activeMods, [m.lvKey]: newLvs.length > 0 }
                                    setActiveMods(na)
                                    saveData('active_mods', na)
                                  })}>
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

      {/* Support + legal + public voices */}
      <div style={{ textAlign: 'center', padding: '12px 0 4px', display: 'grid', gap: 8 }}>
        <a href={'mailto:' + SUPPORT_EMAIL + '?subject=Soporte%20Toki%20' + VER} style={{ color: DIM, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 20px', background: CARD, border: '2px solid ' + BORDER, borderRadius: 12, cursor: 'pointer' }}>
          📩 <span style={{ color: GOLD, fontWeight: 600 }}>Soporte Toki</span>
        </a>
        <PublicVoiceManager fbUser={props.fbUser} />
      </div>

      {/* Modal: Confirmar aplicar preset */}
      {pendingPreset && (() => {
        const preset = LEVEL_PRESETS[pendingPreset]
        return <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setPendingPreset(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:BG2,border:`2px solid ${GOLD}`,borderRadius:20,padding:28,maxWidth:420,textAlign:'center',fontFamily:"'Fredoka'"}}>
            <div style={{fontSize:64,marginBottom:12}}>{preset.label.split(' ')[0]}</div>
            <h2 style={{color:GOLD,fontSize:22,margin:'0 0 8px'}}>¿Pasar a itinerario por defecto?</h2>
            <p style={{color:TXT,fontSize:15,margin:'0 0 6px',fontWeight:600}}>{preset.label.split(' ').slice(1).join(' ')}</p>
            <p style={{color:DIM,fontSize:13,margin:'0 0 20px',lineHeight:1.4}}>Esto configurará automáticamente todos los módulos según este nivel. Podrás personalizar después.</p>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <Button variant="ghost" fullWidth={false} onClick={()=>setPendingPreset(null)}>Cancelar</Button>
              <Button variant="gold" fullWidth={false} onClick={()=>applyPresetNow(pendingPreset)}>Sí, aplicar</Button>
            </div>
          </div>
        </div>
      })()}

      {/* Modal: Confirmar pasar a manual */}
      {pendingManual && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setPendingManual(null)}>
        <div onClick={e=>e.stopPropagation()} style={{background:BG2,border:`2px solid ${GOLD}`,borderRadius:20,padding:28,maxWidth:420,textAlign:'center',fontFamily:"'Fredoka'"}}>
          <div style={{fontSize:56,marginBottom:12}}>🔧</div>
          <h2 style={{color:GOLD,fontSize:22,margin:'0 0 8px'}}>¿Pasar a itinerario manual?</h2>
          <p style={{color:DIM,fontSize:14,margin:'0 0 20px',lineHeight:1.4}}>Estás modificando un módulo. Si continúas, ya no estarás en el itinerario <b style={{color:TXT}}>{LEVEL_PRESETS[currentCompetency]?.label.split(' ').slice(1).join(' ')}</b> por defecto. Podrás volver a aplicarlo cuando quieras.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center'}}>
            <Button variant="ghost" fullWidth={false} onClick={()=>setPendingManual(null)}>Cancelar</Button>
            <Button variant="gold" fullWidth={false} onClick={confirmManualChange}>Sí, continuar</Button>
          </div>
        </div>
      </div>}
    </div>
  )
}
