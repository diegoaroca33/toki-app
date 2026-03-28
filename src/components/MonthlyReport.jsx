import { useState, useMemo } from 'react'
import { BG, BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER } from '../constants.js'
import { getExigencia, getModuleLv } from '../utils.js'

// ===== SVG Evolution Chart =====
function EvolutionChart({ data, freqData, xLabels, yMin, yMax, width, height }) {
  // data = [{x, y}], freqData = [{x, y}] (optional), xLabels = string[]
  if (!data || data.length === 0) return <p style={{fontSize:14,color:DIM,textAlign:'center',margin:'12px 0'}}>Sin datos suficientes para la gráfica</p>
  const pad = { top: 28, right: 20, bottom: 44, left: 40 }
  const w = width - pad.left - pad.right
  const h = height - pad.top - pad.bottom
  const xStep = data.length > 1 ? w / (data.length - 1) : w / 2
  const yRange = yMax - yMin || 1
  const toX = i => pad.left + (data.length > 1 ? i * xStep : w / 2)
  const toY = v => pad.top + h - ((v - yMin) / yRange) * h
  // Stars line path
  const starPts = data.map((d, i) => ({ px: toX(i), py: toY(d.y) }))
  const starPath = starPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.px.toFixed(1) + ',' + p.py.toFixed(1)).join(' ')
  // Frequency line (scaled to right axis)
  const maxFreq = freqData ? Math.max(...freqData.map(d => d.y), 1) : 1
  const freqToY = v => pad.top + h - (v / maxFreq) * h
  const freqPts = freqData ? freqData.map((d, i) => ({ px: toX(i), py: freqToY(d.y) })) : []
  const freqPath = freqPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.px.toFixed(1) + ',' + p.py.toFixed(1)).join(' ')
  // Grid lines for Y axis (1, 2, 3, 4 stars)
  const yTicks = [1, 2, 3, 4]
  // X labels: show up to ~8 labels evenly
  const maxLabels = 8
  const labelStep = Math.max(1, Math.ceil(xLabels.length / maxLabels))

  return <svg viewBox={`0 0 ${width} ${height}`} style={{width:'100%',height:'auto',display:'block'}}>
    {/* Background */}
    <rect x={pad.left} y={pad.top} width={w} height={h} rx={6} fill={BG3} opacity={0.5}/>
    {/* Grid lines */}
    {yTicks.map(t => {
      const yy = toY(t)
      return <g key={t}>
        <line x1={pad.left} y1={yy} x2={pad.left + w} y2={yy} stroke={BORDER} strokeWidth={1} strokeDasharray="4,4"/>
        <text x={pad.left - 6} y={yy + 4} textAnchor="end" fill={DIM} fontSize={11} fontFamily="Fredoka">{t}</text>
      </g>
    })}
    {/* Y axis label */}
    <text x={12} y={pad.top + h / 2} textAnchor="middle" fill={GOLD} fontSize={11} fontFamily="Fredoka" transform={`rotate(-90,12,${pad.top + h / 2})`}>Estrellas</text>
    {/* X axis labels */}
    {xLabels.map((l, i) => {
      if (i % labelStep !== 0 && i !== xLabels.length - 1) return null
      return <text key={i} x={toX(i)} y={pad.top + h + 18} textAnchor="middle" fill={DIM} fontSize={10} fontFamily="Fredoka">{l}</text>
    })}
    {/* Frequency line (behind) */}
    {freqData && freqPts.length > 1 && <>
      <path d={freqPath} fill="none" stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.5} strokeLinejoin="round"/>
      {freqPts.map((p, i) => <circle key={i} cx={p.px} cy={p.py} r={3} fill={BLUE} opacity={0.6}/>)}
    </>}
    {/* Stars line */}
    {starPts.length > 1 && <path d={starPath} fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>}
    {/* Star data points */}
    {starPts.map((p, i) => <g key={i}>
      <circle cx={p.px} cy={p.py} r={4.5} fill={GOLD} stroke="#fff" strokeWidth={1.5}/>
      <text x={p.px} y={p.py - 8} textAnchor="middle" fill={GOLD} fontSize={10} fontFamily="Fredoka" fontWeight={700}>{data[i].y.toFixed(1)}</text>
    </g>)}
    {/* Right axis label for frequency */}
    {freqData && <text x={width - 8} y={pad.top + h / 2} textAnchor="middle" fill={BLUE} fontSize={10} fontFamily="Fredoka" opacity={0.7} transform={`rotate(90,${width - 8},${pad.top + h / 2})`}>Ejercicios</text>}
    {/* Legend */}
    <g transform={`translate(${pad.left + 4},${pad.top - 14})`}>
      <rect x={0} y={-2} width={10} height={3} rx={1} fill={GOLD}/>
      <text x={14} y={2} fill={GOLD} fontSize={10} fontFamily="Fredoka">Media estrellas</text>
      {freqData && <>
        <rect x={110} y={-2} width={10} height={3} rx={1} fill={BLUE} opacity={0.6}/>
        <text x={124} y={2} fill={BLUE} fontSize={10} fontFamily="Fredoka" opacity={0.7}>Ejercicios</text>
      </>}
    </g>
  </svg>
}

// ===== Period helpers =====
function filterByPeriod(hist, period) {
  const now = new Date()
  let cutoff = null
  if (period === '1m') { cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 1) }
  else if (period === '3m') { cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 3) }
  else if (period === '1y') { cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1) }
  // 'all' => no cutoff
  if (!cutoff) return hist
  return hist.filter(h => { if (!h.dt) return false; return new Date(h.dt) >= cutoff })
}

function groupByWeek(entries) {
  const weeks = {}
  entries.forEach(h => {
    if (!h.dt) return
    const d = new Date(h.dt)
    // ISO week start (Monday)
    const day = d.getDay() || 7
    const mon = new Date(d)
    mon.setDate(d.getDate() - day + 1)
    const key = mon.toISOString().slice(0, 10)
    if (!weeks[key]) weeks[key] = []
    weeks[key].push(h)
  })
  return Object.entries(weeks).sort((a, b) => a[0].localeCompare(b[0]))
}

function groupByMonth(entries) {
  const months = {}
  entries.forEach(h => {
    if (!h.dt) return
    const key = h.dt.slice(0, 7) // YYYY-MM
    if (!months[key]) months[key] = []
    months[key].push(h)
  })
  return Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]))
}

function avgStars(entries) {
  const total = entries.reduce((s, h) => s + (h.ok || 0) + (h.sk || 0), 0)
  const ok = entries.reduce((s, h) => s + (h.ok || 0), 0)
  return total > 0 ? (ok / total) * 4 : 0
}

function maxStreak(entries) {
  const dates = [...new Set(entries.map(h => h.dt).filter(Boolean))].sort()
  if (dates.length === 0) return 0
  let max = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const d1 = new Date(dates[i - 1]), d2 = new Date(dates[i])
    if ((d2 - d1) / 86400000 === 1) cur++
    else { max = Math.max(max, cur); cur = 1 }
  }
  return Math.max(max, cur)
}

const MESES_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
function weekLabel(dateStr) {
  const d = new Date(dateStr)
  return d.getDate() + ' ' + MESES_SHORT[d.getMonth()]
}
function monthLabel(ym) {
  const [y, m] = ym.split('-')
  return MESES_SHORT[parseInt(m) - 1] + ' ' + y.slice(2)
}

// ===== Top phrases from localStorage toki_rep_* =====
function getRepPhrases() {
  const phrases = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('toki_rep_')) {
        const data = JSON.parse(localStorage.getItem(k))
        if (data && typeof data.count === 'number') {
          phrases.push({ key: k.slice(9), count: data.count || 0, avgStars: data.avgStars || 0, text: data.text || k.slice(9) })
        }
      }
    }
  } catch (e) {}
  return phrases
}

// ===== MAIN COMPONENT =====
export function MonthlyReport({ user, activeMods, exigencia }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const [period, setPeriod] = useState('1m')

  const hist = user.hist || []
  const filtered = useMemo(() => filterByPeriod(hist, period), [hist, period])

  // ---- 1. Summary stats ----
  const sessions = filtered.length
  const totalOk = filtered.reduce((s, h) => s + (h.ok || 0), 0)
  const totalTime = filtered.reduce((s, h) => s + (h.min || 0), 0)
  const streak = maxStreak(filtered)
  const totalAll = filtered.reduce((s, h) => s + (h.ok || 0) + (h.sk || 0), 0)
  const pct = totalAll > 0 ? Math.round((totalOk / totalAll) * 100) : 0

  // ---- 2. Active config ----
  const activeModNames = useMemo(() => {
    if (!activeMods) return []
    return Object.entries(activeMods).filter(([, v]) => v !== false).map(([k]) => k)
  }, [activeMods])

  // ---- 3. Phrase stats from SRS ----
  const srs = user.srs || {}
  const phraseList = useMemo(() => {
    return Object.entries(srs).map(([k, v]) => {
      const attempts = (v.ok || 0) + (v.fail || 0)
      const avg = attempts > 0 ? ((v.ok || 0) / attempts) * 4 : 0
      return { key: k, attempts, avg, lv: v.lv || 0 }
    }).filter(p => p.attempts > 0)
  }, [srs])
  const topRepeated = [...phraseList].sort((a, b) => b.attempts - a.attempts).slice(0, 10)
  const topHardest = [...phraseList].filter(p => p.attempts > 2).sort((a, b) => a.avg - b.avg).slice(0, 10)

  // ---- 5. Evolution graph data ----
  const useWeeks = period === '1m' || period === '3m'
  const graphData = useMemo(() => {
    if (filtered.length === 0) return { stars: [], freq: [], labels: [] }
    const grouped = useWeeks ? groupByWeek(filtered) : groupByMonth(filtered)
    const stars = grouped.map(([, entries]) => ({ y: avgStars(entries) }))
    const freq = grouped.map(([, entries]) => ({ y: entries.reduce((s, h) => s + (h.ok || 0) + (h.sk || 0), 0) }))
    const labels = grouped.map(([key]) => useWeeks ? weekLabel(key) : monthLabel(key))
    return { stars, freq, labels }
  }, [filtered, useWeeks])

  // ---- Generate text report ----
  function generateTextReport() {
    const periodNames = { '1m': 'Último mes', '3m': '3 meses', '1y': '1 año', 'all': 'Todo el historial' }
    let txt = 'INFORME — ' + (user.name || 'Alumno') + '\n'
    txt += 'Periodo: ' + (periodNames[period] || period) + '\n\n'
    txt += 'Sesiones: ' + sessions + '\n'
    txt += 'Aciertos: ' + totalOk + ' de ' + totalAll + ' (' + pct + '%)\n'
    txt += 'Tiempo total: ' + Math.floor(totalTime / 60) + 'h ' + (totalTime % 60) + 'min\n'
    txt += 'Racha máxima: ' + streak + ' días\n\n'
    if (activeModNames.length > 0) {
      txt += 'Módulos activos: ' + activeModNames.length + '\n'
    }
    if (typeof exigencia === 'number') {
      txt += 'Tolerancia micrófono: ' + exigencia + '%\n'
    }
    txt += '\n'
    if (topRepeated.length > 0) {
      txt += 'Frases más practicadas:\n'
      topRepeated.forEach((p, i) => { txt += '  ' + (i + 1) + '. ' + p.key + ' — ' + p.attempts + ' intentos, ' + p.avg.toFixed(1) + ' avg\n' })
      txt += '\n'
    }
    if (topHardest.length > 0) {
      txt += 'Frases con más dificultad:\n'
      topHardest.forEach((p, i) => { txt += '  ' + (i + 1) + '. ' + p.key + ' — ' + p.avg.toFixed(1) + ' avg (' + p.attempts + ' intentos)\n' })
      txt += '\n'
    }
    // Graph summary
    if (graphData.stars.length > 1) {
      const first = graphData.stars[0].y, last = graphData.stars[graphData.stars.length - 1].y
      const diff = last - first
      txt += 'Evolución: ' + (diff > 0.2 ? 'Mejorando' : diff < -0.2 ? 'Bajando' : 'Estable') + ' (' + first.toFixed(1) + ' → ' + last.toFixed(1) + ' estrellas)\n'
    }
    return txt
  }

  // ---- Button to open ----
  if (!show) return <button onClick={() => setShow(true)} style={{ marginTop: 16, width: '100%', padding: '16px 20px', borderRadius: 14, border: '2px solid ' + GOLD + '55', background: GOLD + '15', color: GOLD, fontSize: 20, fontWeight: 700, fontFamily: "'Fredoka'", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>{'📊 Informe de evolución'}</button>

  const canShare = typeof navigator !== 'undefined' && navigator.share

  return <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 300, background: BG, color: TXT, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column' }}>
    <div style={{ maxWidth: 650, width: '100%', margin: '0 auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 22, fontWeight: 700, color: GOLD, margin: 0 }}>📊 Informe — {user.name || 'Alumno'}</p>
        <button onClick={() => { setShow(false); setCopied(false) }} style={{ background: 'none', border: '2px solid ' + DIM, borderRadius: 10, padding: '8px 16px', color: DIM, fontSize: 16, fontWeight: 600, fontFamily: "'Fredoka'", cursor: 'pointer' }}>✕</button>
      </div>

      {/* Period selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {[['1m', 'Último mes'], ['3m', '3 meses'], ['1y', '1 año'], ['all', 'Todo']].map(([k, l]) =>
          <button key={k} onClick={() => setPeriod(k)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `3px solid ${period === k ? GOLD : BORDER}`, background: period === k ? GOLD + '22' : BG3, color: period === k ? GOLD : DIM, fontFamily: "'Fredoka'", fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 48 }}>{l}</button>
        )}
      </div>

      {/* 1. Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { l: 'Sesiones', v: sessions, c: GREEN },
          { l: 'Aciertos', v: totalOk + '/' + totalAll, c: BLUE },
          { l: 'Tiempo', v: Math.floor(totalTime / 60) + 'h ' + (totalTime % 60) + 'm', c: PURPLE },
          { l: 'Racha máx.', v: streak + ' días', c: GOLD },
        ].map((s, i) => <div key={i} style={{ textAlign: 'center', background: BG3, borderRadius: 10, padding: '12px 4px' }}>
          <div style={{ fontSize: 22, color: s.c, fontWeight: 700 }}>{s.v}</div>
          <div style={{ fontSize: 12, color: DIM, marginTop: 2 }}>{s.l}</div>
        </div>)}
      </div>

      {/* 2. Active config */}
      <div style={{ background: BG3, borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: DIM, fontWeight: 600 }}>Módulos activos: <span style={{ color: GREEN }}>{activeModNames.length}</span></span>
        {typeof exigencia === 'number' && <span style={{ fontSize: 14, color: DIM, fontWeight: 600 }}>Tolerancia: <span style={{ color: GOLD }}>{exigencia}%</span></span>}
      </div>

      {/* 5. EVOLUTION GRAPH — most important */}
      <div style={{ background: BG3 + '88', borderRadius: 14, padding: '14px 10px', marginBottom: 16, border: '1px solid ' + BORDER }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: GOLD, margin: '0 0 8px', textAlign: 'center' }}>Evolución</p>
        <EvolutionChart
          data={graphData.stars}
          freqData={graphData.freq}
          xLabels={graphData.labels}
          yMin={0}
          yMax={4}
          width={600}
          height={260}
        />
        {graphData.stars.length > 1 && (() => {
          const first = graphData.stars[0].y, last = graphData.stars[graphData.stars.length - 1].y
          const diff = last - first
          const trend = diff > 0.2 ? 'Mejorando' : diff < -0.2 ? 'Bajando' : 'Estable'
          const trendColor = diff > 0.2 ? GREEN : diff < -0.2 ? RED : GOLD
          return <p style={{ fontSize: 15, fontWeight: 700, color: trendColor, textAlign: 'center', margin: '8px 0 0' }}>
            {diff > 0.2 ? '📈' : diff < -0.2 ? '📉' : '➡️'} {trend} ({first.toFixed(1)} → {last.toFixed(1)} estrellas)
          </p>
        })()}
      </div>

      {/* 3. Top 10 most repeated phrases */}
      {topRepeated.length > 0 && <div style={{ background: BG3, borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: BLUE, margin: '0 0 8px' }}>Frases más practicadas</p>
        {topRepeated.map((p, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < topRepeated.length - 1 ? '1px solid ' + BORDER : 'none' }}>
          <span style={{ fontSize: 13, color: DIM, width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}.</span>
          <span style={{ fontSize: 14, color: TXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.key}</span>
          <span style={{ fontSize: 12, color: DIM, flexShrink: 0 }}>{p.attempts}x</span>
          <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, flexShrink: 0 }}>{p.avg.toFixed(1)}★</span>
        </div>)}
      </div>}

      {/* 4. Top 10 hardest phrases */}
      {topHardest.length > 0 && <div style={{ background: BG3, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: RED, margin: '0 0 8px' }}>Frases con más dificultad</p>
        {topHardest.map((p, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < topHardest.length - 1 ? '1px solid ' + BORDER : 'none' }}>
          <span style={{ fontSize: 13, color: DIM, width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}.</span>
          <span style={{ fontSize: 14, color: TXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.key}</span>
          <span style={{ fontSize: 12, color: DIM, flexShrink: 0 }}>{p.attempts}x</span>
          <span style={{ fontSize: 12, color: RED, fontWeight: 600, flexShrink: 0 }}>{p.avg.toFixed(1)}★</span>
        </div>)}
      </div>}
    </div>

    {/* Bottom buttons */}
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '16px 0', position: 'sticky', bottom: 0, background: BG, borderTop: '1px solid ' + BORDER, maxWidth: 650, width: '100%', margin: '0 auto' }}>
      <button onClick={() => {
        const txt = generateTextReport()
        navigator.clipboard?.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
      }} style={{ padding: '14px 24px', borderRadius: 14, border: '2px solid ' + GREEN, background: GREEN, color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: "'Fredoka'", cursor: 'pointer', minHeight: 52 }}>{copied ? '¡Copiado!' : '📋 Copiar texto'}</button>
      {canShare && <button onClick={() => {
        const txt = generateTextReport()
        navigator.share({ title: 'Informe Toki — ' + (user.name || ''), text: txt }).catch(() => {})
      }} style={{ padding: '14px 24px', borderRadius: 14, border: '2px solid ' + BLUE, background: BLUE, color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: "'Fredoka'", cursor: 'pointer', minHeight: 52 }}>📤 Compartir</button>}
      <button onClick={() => { setShow(false); setCopied(false) }} style={{ padding: '14px 24px', borderRadius: 14, border: '2px solid ' + BORDER, background: BG3, color: DIM, fontSize: 17, fontWeight: 700, fontFamily: "'Fredoka'", cursor: 'pointer', minHeight: 52 }}>Cerrar</button>
    </div>
  </div>
}
