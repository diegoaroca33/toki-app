import React, { useState, useEffect, useRef, useCallback } from 'react'
import { BG, BG2, GOLD, GREEN, RED, BLUE, DIM, CARD, BORDER } from '../constants.js'
import { say, stopVoice } from '../voice.js'
import { Button, Card, Badge, ProgressBar } from './ui/index.js'

// ── Control phrases — always the same set for comparison ──────
function getControlPhrases(user, personas) {
  const ps = personas || []
  const padre = ps.find(p => p.relation === 'Padre' && p.name)
  const madre = ps.find(p => p.relation === 'Madre' && p.name)
  const name = user?.name || 'niño'

  const phrases = [
    // Identidad
    'Me llamo ' + name,
    'Hoy es ' + getDayName(),
    // Familia
    padre ? 'Mi papá se llama ' + padre.name : 'Tengo una familia',
    madre ? 'Mi mamá se llama ' + madre.name : 'Quiero a mi familia',
    // Necesidades básicas
    'Quiero agua por favor',
    'Tengo mucho hambre',
    'Necesito ir al baño',
    'Me duele la cabeza',
    // Social
    'Buenos días',
    'Muchas gracias',
    'Hasta luego',
    'Por favor',
    // Frases complejas
    'Hoy hace buen tiempo',
    'Me gusta mucho la música',
    'Quiero jugar en el parque',
    // Datos personales
    user?.telefono ? 'Llama al ' + user.telefono : 'No sé mi teléfono',
    user?.direccion ? 'Vivo en ' + user.direccion : 'Vivo en mi casa',
    user?.colegio ? 'Voy al cole ' + user.colegio : 'Voy al colegio',
    // Emociones
    'Estoy muy contento',
    'No me gusta eso',
    // Articulación (fonemas difíciles)
    'El perro corre rápido',
    'La rana salta mucho',
    'Tres tristes tigres',
    'El sol sale por la mañana',
    'Chocolate con churros',
  ]
  return phrases.slice(0, 25) // always 25 phrases
}

function getDayName() {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  return days[new Date().getDay()]
}

// ── Save/load checkpoints from localStorage ──────────────────
const CHECKPOINT_KEY = 'toki_checkpoints'

export function getCheckpoints(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(CHECKPOINT_KEY) || '{}')
    return all[userId] || []
  } catch (e) { return [] }
}

export function saveCheckpoint(userId, checkpoint) {
  try {
    const all = JSON.parse(localStorage.getItem(CHECKPOINT_KEY) || '{}')
    if (!all[userId]) all[userId] = []
    all[userId].push(checkpoint)
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(all))
  } catch (e) {}
}

export function getSessionsSinceLastCheckpoint(user) {
  const hist = user?.hist || []
  const checkpoints = getCheckpoints(user?.id)
  const lastCheckpointDate = checkpoints.length > 0
    ? checkpoints[checkpoints.length - 1].date
    : null
  if (!lastCheckpointDate) return hist.length
  return hist.filter(h => h.dt > lastCheckpointDate).length
}

// Returns true when baseline is missing OR 28+ sessions since last checkpoint
export function isCheckpointPending(user) {
  const cps = getCheckpoints(user?.id)
  if (cps.length === 0) return true // No baseline → always pending
  const since = getSessionsSinceLastCheckpoint(user)
  return since >= 28
}

// Can we do a checkpoint right now? (at least 7 days since last)
export function canDoCheckpointNow(user) {
  const cps = getCheckpoints(user?.id)
  if (cps.length === 0) return true // Baseline always allowed
  const last = cps[cps.length - 1]
  if (!last.date) return true
  const lastDate = new Date(last.date)
  const now = new Date()
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))
  return diffDays >= 7
}

// Days until next checkpoint is allowed
export function daysUntilNextCheckpoint(user) {
  const cps = getCheckpoints(user?.id)
  if (cps.length === 0) return 0
  const last = cps[cps.length - 1]
  if (!last.date) return 0
  const lastDate = new Date(last.date)
  const now = new Date()
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))
  return Math.max(0, 7 - diffDays)
}

// Legacy — kept for compatibility
export function shouldTriggerCheckpoint(user) {
  return isCheckpointPending(user)
}

// ── Recording component ──────────────────────────────────────
export default function ControlCheckpoint({ user, personas, onComplete, onSkip }) {
  const phrases = getControlPhrases(user, personas)
  const [currentIdx, setCurrentIdx] = useState(0)
  const currentIdxRef = useRef(0)
  const [phase, setPhase] = useState('intro') // intro, listen, recording, result, done
  const [results, setResults] = useState([]) // {phrase, transcript, score, confidence, audioBlob}
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [transcript, setTranscript] = useState('')

  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  const srRef = useRef(null)
  const timerRef = useRef(null)
  const alive = useRef(true)
  const transcriptRef = useRef('')
  const confidenceRef = useRef(0)
  const resultsRef = useRef([])

  useEffect(() => { return () => { alive.current = false; cleanup() } }, [])

  const cleanup = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      try { mediaRecorder.current.stop() } catch (e) {}
    }
    if (srRef.current) { try { srRef.current.abort() } catch (e) {} }
    if (timerRef.current) clearTimeout(timerRef.current)
    stopVoice()
  }

  // Score: compare transcript to target phrase
  const scorePhrase = (said, target) => {
    if (!said || !target) return 0
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim()
    const saidN = norm(said)
    const tgtN = norm(target)
    if (saidN === tgtN) return 4
    const saidW = saidN.split(/\s+/)
    const tgtW = tgtN.split(/\s+/)
    // Exact word matches
    let exact = 0
    tgtW.forEach(w => { if (saidW.includes(w)) exact++ })
    // Approximate matches (Levenshtein ≤ 2 for words > 3 chars)
    let approx = 0
    const lev = (a,b) => {const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
    tgtW.forEach(w => {
      if (saidW.includes(w)) return // already counted as exact
      const maxDist = w.length <= 3 ? 1 : 2
      if (saidW.some(s => lev(s, w) <= maxDist)) approx++
    })
    const total = exact + approx * 0.7
    const pct = total / Math.max(1, tgtW.length)
    if (pct >= 0.9) return 4
    if (pct >= 0.6) return 3
    if (pct >= 0.3 || exact >= 1) return 2
    if (saidN.length > 0) return 1 // child spoke something
    return 0
  }

  // Start recording a single phrase
  const startPhrase = useCallback(async () => {
    const phrase = phrases[currentIdxRef.current]
    setPhase('listen')
    setTranscript('')
    transcriptRef.current = ''
    confidenceRef.current = 0
    setCountdown(3)

    // First, Toki says the phrase
    await say(phrase, 0.7)
    if (!alive.current) return

    // Countdown 3..2..1
    setPhase('recording')
    let c = 3
    setCountdown(c)
    const countdownTimer = setInterval(() => {
      c--
      if (!alive.current) { clearInterval(countdownTimer); return }
      setCountdown(c)
      if (c <= 0) clearInterval(countdownTimer)
    }, 800)

    // After countdown, start recording
    setTimeout(async () => {
      if (!alive.current) return
      setIsRecording(true)
      audioChunks.current = []

      // Start MediaRecorder for audio
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
        mediaRecorder.current = mr
        mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.current.push(e.data) }
        mr.onstop = () => { stream.getTracks().forEach(t => t.stop()) }
        mr.start()
      } catch (e) { console.warn('MediaRecorder not available', e) }

      // Start speech recognition
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SR) {
        const r = new SR()
        r.lang = 'es-ES'; r.continuous = false; r.interimResults = false; r.maxAlternatives = 5
        r.onresult = (e) => {
          for (let i = 0; i < e.results[0].length; i++) {
            const alt = e.results[0][i]
            if (alt.confidence > confidenceRef.current) {
              confidenceRef.current = alt.confidence
              transcriptRef.current = alt.transcript
              setTranscript(alt.transcript)
            }
          }
        }
        r.onerror = () => {}
        r.onend = () => {}
        srRef.current = r
        r.start()
      }

      // Stop after 5 seconds
      timerRef.current = setTimeout(() => {
        if (!alive.current) return
        setIsRecording(false)
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
          try { mediaRecorder.current.stop() } catch (e) {}
        }
        if (srRef.current) { try { srRef.current.stop() } catch (e) {} }

        // Wait a bit for final SR results
        setTimeout(() => {
          if (!alive.current) return
          const said = transcriptRef.current || ''
          const conf = confidenceRef.current || 0
          const sc = scorePhrase(said, phrase)

          // Convert audio to base64
          if (audioChunks.current.length > 0) {
            const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
            const reader = new FileReader()
            reader.onload = () => {
              finishPhrase(phrase, said, sc, conf, reader.result)
            }
            reader.readAsDataURL(blob)
            return
          }
          finishPhrase(phrase, said, sc, conf, null)
        }, 500)
      }, 5000)
    }, 2500) // 3x800ms countdown
  }, [phrases])

  const finishPhrase = (phrase, said, score, confidence, audioB64) => {
    const result = {
      phrase,
      transcript: said,
      score,
      confidence: Math.round(confidence * 100),
      audio: audioB64,
    }
    resultsRef.current = [...resultsRef.current, result]
    setResults(resultsRef.current)
    setPhase('result')
  }

  const nextPhrase = () => {
    const nextIdx = currentIdxRef.current + 1
    if (nextIdx >= phrases.length) {
      setPhase('done')
    } else {
      currentIdxRef.current = nextIdx
      setCurrentIdx(nextIdx)
      setPhase('listen')
      setTimeout(() => startPhrase(), 500)
    }
  }

  const finishCheckpoint = () => {
    // Build checkpoint data
    const hist = user?.hist || []
    const checkpoints = getCheckpoints(user?.id)
    const lastDate = checkpoints.length > 0 ? checkpoints[checkpoints.length - 1].date : null

    // Session stats since last checkpoint
    const recentSessions = lastDate
      ? hist.filter(h => h.dt > lastDate)
      : hist
    const totalOk = recentSessions.reduce((s, h) => s + (h.ok || 0), 0)
    const totalSk = recentSessions.reduce((s, h) => s + (h.sk || 0), 0)
    const totalMin = recentSessions.reduce((s, h) => s + (h.min || 0), 0)

    const checkpoint = {
      date: new Date().toISOString().slice(0, 10),
      number: checkpoints.length + 1,
      results: results.map(r => ({ phrase: r.phrase, transcript: r.transcript, score: r.score, confidence: r.confidence, audio: r.audio })),
      sessionStats: {
        sessions: recentSessions.length,
        ok: totalOk,
        sk: totalSk,
        minutes: totalMin,
        accuracy: totalOk + totalSk > 0 ? Math.round((totalOk / (totalOk + totalSk)) * 100) : 0,
      },
      avgScore: results.length > 0 ? Math.round((results.reduce((s, r) => s + r.score, 0) / results.length) * 100) / 100 : 0,
    }

    saveCheckpoint(user?.id, checkpoint)
    if (onComplete) onComplete(checkpoint)
  }

  // ── Render ────────────────────────────────────────────────────
  const progress = Math.round((currentIdx / phrases.length) * 100)
  const avgScore = results.length > 0 ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1) : '—'

  if (phase === 'intro') {
    const existingCps = getCheckpoints(user?.id)
    const isBaseline = existingCps.length === 0
    return (
      <div style={{ position: 'fixed', inset: 0, background: BG, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Card style={{ maxWidth: 500, textAlign: 'center', padding: 30 }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>{isBaseline ? '📋' : '🎯'}</div>
          <h2 style={{ color: GOLD, fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>
            {isBaseline ? 'Control inicial (punto de partida)' : 'Control de progresión'}
          </h2>
          {isBaseline ? (
            <>
              <p style={{ color: DIM, fontSize: 15, margin: '0 0 8px', lineHeight: 1.5 }}>
                Antes de empezar a entrenar, vamos a hacer un <b style={{ color: '#fff' }}>control inicial</b> para
                saber desde dónde parte {user?.name || 'el alumno'}.
              </p>
              <p style={{ color: DIM, fontSize: 14, margin: '0 0 8px', lineHeight: 1.5 }}>
                Toki dirá <b style={{ color: '#fff' }}>25 frases</b> y {user?.name || 'el alumno'} las repetirá.
                Se grabarán como referencia para medir el progreso futuro.
              </p>
              <p style={{ color: GOLD, fontSize: 13, margin: '0 0 20px', lineHeight: 1.5, fontWeight: 600 }}>
                Este control es muy importante: sin él no podremos comparar la evolución.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: DIM, fontSize: 15, margin: '0 0 8px', lineHeight: 1.5 }}>
                Es hora de comprobar cómo progresa {user?.name || 'el alumno'}.
              </p>
              <p style={{ color: DIM, fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>
                Toki dirá <b style={{ color: '#fff' }}>25 frases</b> y {user?.name || 'el alumno'} las repetirá.
                Se compararán con el control anterior y el punto de partida.
              </p>
            </>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="gold" fullWidth={false} onClick={() => { setPhase('listen'); setTimeout(() => startPhrase(), 600) }}>
              🎤 {isBaseline ? 'Hacer control inicial' : 'Empezar control'}
            </Button>
            <Button variant="ghost" fullWidth={false} onClick={onSkip}>
              Ahora no
            </Button>
          </div>

          {existingCps.length > 0 && (
            <div style={{ marginTop: 16, color: DIM, fontSize: 13 }}>
              Control anterior: #{existingCps.length} ({existingCps[existingCps.length - 1]?.date})
            </div>
          )}
        </Card>
      </div>
    )
  }

  if (phase === 'done') {
    const prevCheckpoints = getCheckpoints(user?.id)
    const prev = prevCheckpoints.length > 0 ? prevCheckpoints[prevCheckpoints.length - 1] : null
    const baseline = prevCheckpoints.length > 0 ? prevCheckpoints[0] : null
    const prevAvg = prev ? prev.avgScore : null
    const baselineAvg = baseline ? baseline.avgScore : null
    const currentAvg = results.reduce((s, r) => s + r.score, 0) / Math.max(1, results.length)
    const improved = prevAvg !== null ? currentAvg > prevAvg : null
    const isBaseline = prevCheckpoints.length === 0
    const vsBaseline = baselineAvg !== null && !isBaseline ? currentAvg - baselineAvg : null

    return (
      <div style={{ position: 'fixed', inset: 0, background: BG, zIndex: 200, overflowY: 'auto', padding: 16 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Card style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 50, marginBottom: 8 }}>{isBaseline ? '📋' : improved === true ? '📈' : improved === false ? '📊' : '🎯'}</div>
              <h2 style={{ color: GOLD, fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>
                {isBaseline ? 'Control inicial completado' : `Control #${prevCheckpoints.length + 1} completado`}
              </h2>
              <p style={{ color: DIM, fontSize: 14 }}>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              {isBaseline && (
                <p style={{ color: GOLD, fontSize: 13, marginTop: 6 }}>
                  Este es el punto de partida. Los próximos controles se compararán con este.
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: prevAvg !== null ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <Card variant="stat">
                <div style={{ fontSize: 24, fontWeight: 800 }}>{currentAvg.toFixed(1)}</div>
                <div style={{ fontSize: 12, color: DIM }}>Puntuación media</div>
              </Card>
              <Card variant="stat">
                <div style={{ fontSize: 24, fontWeight: 800 }}>{results.filter(r => r.score >= 3).length}/{results.length}</div>
                <div style={{ fontSize: 12, color: DIM }}>Frases bien</div>
              </Card>
              {prevAvg !== null && (
                <Card variant="stat" style={{ background: improved ? `${GREEN}15` : `${RED}15` }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: improved ? GREEN : RED }}>
                    {improved ? '⬆️' : '⬇️'} {(currentAvg - prevAvg).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: DIM }}>vs anterior</div>
                </Card>
              )}
            </div>

            {/* Comparison vs baseline (only if we have 2+ previous checkpoints) */}
            {vsBaseline !== null && prev !== baseline && (
              <div style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 16, background: vsBaseline > 0 ? `${GREEN}11` : `${RED}11`, border: `1px solid ${vsBaseline > 0 ? GREEN : RED}33` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: vsBaseline > 0 ? GREEN : RED }}>
                  {vsBaseline > 0 ? '📈' : '📉'} Desde el punto de partida: {vsBaseline > 0 ? '+' : ''}{vsBaseline.toFixed(1)} puntos
                </div>
                <div style={{ fontSize: 12, color: DIM, marginTop: 2 }}>
                  Control inicial ({baseline.date}): ⭐ {baselineAvg.toFixed(1)} → Ahora: ⭐ {currentAvg.toFixed(1)}
                </div>
              </div>
            )}

            {/* Per-phrase results */}
            <div style={{ fontWeight: 700, color: GOLD, fontSize: 16, marginBottom: 8 }}>Detalle por frase</div>
            <div style={{ display: 'grid', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: `${CARD}`, border: `1px solid ${BORDER}`, borderRadius: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.phrase}
                    </div>
                    <div style={{ fontSize: 11, color: DIM, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      → {r.transcript || '(no reconocido)'}
                    </div>
                  </div>
                  <Badge tone={r.score >= 3 ? 'green' : r.score >= 2 ? 'gold' : 'red'}>
                    {'⭐'.repeat(r.score)}{'☆'.repeat(4 - r.score)}
                  </Badge>
                  {r.audio && (
                    <button
                      onClick={() => { const a = new Audio(r.audio); a.play() }}
                      style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', padding: 2 }}
                    >🔊</button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="gold" fullWidth={false} onClick={finishCheckpoint}>
              ✅ Guardar control
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Recording phase
  const phrase = phrases[currentIdx]
  const lastResult = results.length > 0 ? results[results.length - 1] : null

  return (
    <div style={{ position: 'fixed', inset: 0, background: BG, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 500, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: DIM }}>
          <span>Frase {currentIdx + 1} de {phrases.length}</span>
          <span>⭐ Media: {avgScore}</span>
        </div>
        <ProgressBar value={progress} max={100} />
      </div>

      <Card style={{ maxWidth: 500, width: '100%', textAlign: 'center', padding: 24 }}>
        {/* Current phrase display */}
        <div style={{
          background: `${GOLD}15`, border: `2px solid ${GOLD}44`, borderRadius: 16,
          padding: '16px 20px', marginBottom: 20, fontSize: 22, fontWeight: 700,
          fontFamily: "'Fredoka'", color: '#fff', lineHeight: 1.3
        }}>
          "{phrase}"
        </div>

        {phase === 'listen' && (
          <div>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔊</div>
            <div style={{ color: DIM, fontSize: 16 }}>Escucha a Toki...</div>
          </div>
        )}

        {phase === 'recording' && !isRecording && (
          <div>
            <div style={{ fontSize: 60, fontWeight: 800, color: GOLD }}>{countdown}</div>
            <div style={{ color: DIM, fontSize: 16 }}>Prepárate...</div>
          </div>
        )}

        {phase === 'recording' && isRecording && (
          <div>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: `${RED}22`,
              border: `3px solid ${RED}`, margin: '0 auto 12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 36,
              animation: 'pulse 1s ease-in-out infinite'
            }}>🎤</div>
            <div style={{ color: RED, fontSize: 18, fontWeight: 700 }}>Grabando...</div>
            <div style={{ color: DIM, fontSize: 14, marginTop: 4 }}>Repite la frase</div>
            {transcript && (
              <div style={{ marginTop: 10, color: GREEN, fontSize: 15, fontStyle: 'italic' }}>
                "{transcript}"
              </div>
            )}
          </div>
        )}

        {phase === 'result' && lastResult && (
          <div>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {lastResult.score >= 3 ? '✅' : lastResult.score >= 2 ? '👍' : '🔄'}
            </div>
            <div style={{ fontSize: 16, color: DIM, marginBottom: 6 }}>
              Dicho: <b style={{ color: '#fff' }}>{lastResult.transcript || '(no reconocido)'}</b>
            </div>
            <Badge tone={lastResult.score >= 3 ? 'green' : lastResult.score >= 2 ? 'gold' : 'red'} size="lg">
              {'⭐'.repeat(lastResult.score)}{'☆'.repeat(4 - lastResult.score)}
            </Badge>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              {lastResult.audio && (
                <Button variant="ghost" fullWidth={false} onClick={() => { const a = new Audio(lastResult.audio); a.play() }}>
                  🔊 Escuchar
                </Button>
              )}
              <Button variant="ghost" fullWidth={false} onClick={() => { stopVoice(); say(phrase, 0.7) }}>
                🗣️ Modelo
              </Button>
              <Button variant="gold" fullWidth={false} onClick={nextPhrase}>
                {currentIdx + 1 >= phrases.length ? '📊 Ver resultados' : '→ Siguiente'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.7}}`}</style>

      <Button variant="ghost" fullWidth={false} onClick={() => { cleanup(); onSkip() }}
        style={{ marginTop: 16, opacity: 0.6 }}>
        Saltar control
      </Button>
    </div>
  )
}
