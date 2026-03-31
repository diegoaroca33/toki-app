import { useState, useMemo } from 'react'
import { BG, BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER } from '../constants.js'

// ===== Date helpers =====
const DIAS_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

function parseDt(dt) {
  if (!dt) return null
  // Supports "dd/M/yyyy" or "d/M/yyyy" format
  const parts = dt.split('/')
  if (parts.length === 3) {
    const [d, m, y] = parts.map(Number)
    return new Date(y, m - 1, d)
  }
  // Fallback: try ISO
  const d = new Date(dt)
  return isNaN(d.getTime()) ? null : d
}

function dateKey(date) {
  // Returns "YYYY-MM-DD" for grouping
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
}

function formatDateShort(date) {
  return date.getDate() + '/' + (date.getMonth() + 1)
}

function maxStreak(hist) {
  const dates = [...new Set(hist.map(h => {
    const d = parseDt(h.dt)
    return d ? dateKey(d) : null
  }).filter(Boolean))].sort()
  if (dates.length === 0) return 0
  let max = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const d1 = new Date(dates[i - 1]), d2 = new Date(dates[i])
    if ((d2 - d1) / 86400000 === 1) cur++
    else { max = Math.max(max, cur); cur = 1 }
  }
  return Math.max(max, cur)
}

// ===== MAIN COMPONENT =====
export function MonthlyReport({ user, activeMods, exigencia }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  const hist = user.hist || []

  // ---- Group hist by date ----
  const byDate = useMemo(() => {
    const map = {}
    hist.forEach(h => {
      const d = parseDt(h.dt)
      if (!d) return
      const key = dateKey(d)
      if (!map[key]) map[key] = { exercises: 0, min: 0, date: d }
      map[key].exercises += (h.ok || 0) + (h.sk || 0)
      map[key].min += (h.min || 0)
    })
    return map
  }, [hist])

  // ---- Today stats ----
  const todayKey = dateKey(new Date())
  const todayData = byDate[todayKey] || { exercises: 0, min: 0 }

  // ---- Last 10 days ----
  const last10Days = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = dateKey(d)
      const data = byDate[key]
      days.push({
        date: key,
        label: DIAS_SHORT[d.getDay()] + '\n' + d.getDate(),
        shortLabel: d.getDate() + '',
        dayName: DIAS_SHORT[d.getDay()],
        count: data ? data.exercises : 0,
        min: data ? data.min : 0,
      })
    }
    return days
  }, [byDate])

  const maxCount = Math.max(...last10Days.map(d => d.count), 1)

  // ---- Consistency (last 7 days) ----
  const last7 = last10Days.slice(-7)
  const trainedDays7 = last7.filter(d => d.count > 0).length

  // ---- Overall stats ----
  const totalExercises = hist.reduce((s, h) => s + (h.ok || 0) + (h.sk || 0), 0)
  const totalTime = hist.reduce((s, h) => s + (h.min || 0), 0)
  const totalDaysTrained = new Set(hist.map(h => { const d = parseDt(h.dt); return d ? dateKey(d) : null }).filter(Boolean)).size
  const streak = maxStreak(hist)

  // ---- Active config ----
  const activeModNames = useMemo(() => {
    if (!activeMods) return []
    return Object.entries(activeMods).filter(([, v]) => v !== false).map(([k]) => k)
  }, [activeMods])

  // ---- Generate text report ----
  function generateTextReport() {
    let txt = 'INFORME — ' + (user.name || 'Alumno') + '\n\n'
    txt += 'Ejercicios totales: ' + totalExercises + '\n'
    txt += 'Tiempo total: ' + Math.floor(totalTime / 60) + 'h ' + (totalTime % 60) + 'min\n'
    txt += 'Días entrenados: ' + totalDaysTrained + '\n'
    txt += 'Racha máxima: ' + streak + ' días\n\n'
    txt += 'Últimos 7 días: entrenó ' + trainedDays7 + ' de 7 días (' + Math.round((trainedDays7 / 7) * 100) + '%)\n'
    txt += 'Hoy: ' + todayData.exercises + ' ejercicios · ' + todayData.min + ' min\n\n'
    if (activeModNames.length > 0) {
      txt += 'Módulos activos: ' + activeModNames.length + '\n'
    }
    if (typeof exigencia === 'number') {
      txt += 'Tolerancia micrófono: ' + exigencia + '%\n'
    }
    txt += '\nÚltimos 10 días:\n'
    last10Days.forEach(d => {
      txt += '  ' + d.date + ': ' + d.count + ' ejercicios, ' + d.min + ' min\n'
    })
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

      {/* 1. Daily Summary Card */}
      <div style={{ background: BG3, borderRadius: 14, padding: '16px 18px', marginBottom: 16, border: '2px solid ' + GOLD + '44' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 6 }}>Hoy</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: TXT }}>
          {todayData.exercises} <span style={{ fontSize: 16, fontWeight: 600, color: DIM }}>ejercicios</span>
          <span style={{ color: DIM, margin: '0 8px' }}>·</span>
          {todayData.min} <span style={{ fontSize: 16, fontWeight: 600, color: DIM }}>min</span>
        </div>
      </div>

      {/* 2. Summary stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { l: 'Ejercicios totales', v: totalExercises, c: BLUE },
          { l: 'Tiempo total', v: Math.floor(totalTime / 60) + 'h ' + (totalTime % 60) + 'm', c: PURPLE },
          { l: 'Días entrenados', v: totalDaysTrained, c: GREEN },
          { l: 'Racha máx.', v: streak + ' días', c: GOLD },
        ].map((s, i) => <div key={i} style={{ textAlign: 'center', background: BG3, borderRadius: 10, padding: '12px 4px' }}>
          <div style={{ fontSize: 22, color: s.c, fontWeight: 700 }}>{s.v}</div>
          <div style={{ fontSize: 12, color: DIM, marginTop: 2 }}>{s.l}</div>
        </div>)}
      </div>

      {/* 3. Weekly Chart (last 10 days) */}
      <div style={{ background: BG3 + '88', borderRadius: 14, padding: '14px 10px', marginBottom: 16, border: '1px solid ' + BORDER }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: GOLD, margin: '0 0 12px', textAlign: 'center' }}>Últimos 10 días</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, height: 120, paddingBottom: 4 }}>
          {last10Days.map(day => (
            <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
              {day.count > 0 && <div style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>{day.count}</div>}
              <div style={{
                width: '100%',
                maxWidth: 28,
                background: day.count > 0 ? GOLD : BORDER,
                borderRadius: 4,
                height: day.count > 0 ? Math.max((day.count / maxCount) * 80, 6) : 3,
                opacity: day.count > 0 ? 1 : 0.4,
                transition: 'height 0.3s ease',
              }}></div>
              <div style={{ fontSize: 10, color: DIM, textAlign: 'center', lineHeight: 1.2 }}>
                <div>{day.dayName}</div>
                <div>{day.shortLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Consistency */}
      <div style={{ background: BG3, borderRadius: 14, padding: '14px 18px', marginBottom: 16, border: '1px solid ' + BORDER }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: GREEN, marginBottom: 6 }}>Constancia</div>
        <div style={{ fontSize: 16, color: TXT }}>
          Últimos 7 días: entrenó <b style={{ color: GREEN }}>{trainedDays7}</b> de 7 días
          <span style={{ color: DIM, marginLeft: 8 }}>({Math.round((trainedDays7 / 7) * 100)}%)</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {last7.map((d, i) => (
            <div key={i} style={{
              flex: 1, height: 8, borderRadius: 4,
              background: d.count > 0 ? GREEN : BORDER,
              opacity: d.count > 0 ? 1 : 0.3,
            }} title={d.dayName + ': ' + d.count + ' ejercicios'} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
          {last7.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: DIM }}>{d.dayName}</div>
          ))}
        </div>
      </div>

      {/* 5. Active config */}
      {(activeModNames.length > 0 || typeof exigencia === 'number') && (
        <div style={{ background: BG3, borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: DIM, fontWeight: 600 }}>Módulos activos: <span style={{ color: GREEN }}>{activeModNames.length}</span></span>
          {typeof exigencia === 'number' && <span style={{ fontSize: 14, color: DIM, fontWeight: 600 }}>Tolerancia: <span style={{ color: GOLD }}>{exigencia}%</span></span>}
        </div>
      )}
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
