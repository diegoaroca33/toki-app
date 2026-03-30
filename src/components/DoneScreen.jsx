import React, { useEffect, useMemo, useState } from 'react'
import { BG, BG2, GOLD, GREEN, BLUE, DIM, CARD } from '../constants.js'
import { getMascotTier, getMascotCycle, CYCLE_NAMES, getDogGrowth, getDogPhase } from '../utils.js'
import { sayFB, victoryJingle } from '../voice.js'
import { SpaceMascot, DogMascot, Confetti } from './UIKit.jsx'
import { Button, Card, Badge, ProgressBar, StatBox } from './ui/index.js'

function getPraise(ok = 0, sk = 0) {
  const total = Math.max(1, ok + sk)
  const pct = (ok / total) * 100
  if (pct >= 80) return '¡Genial!'
  if (pct >= 40) return '¡Buen trabajo!'
  return 'Has practicado mucho'
}

function getTierMeta(totalStars = 0) {
  const tier = getMascotTier(totalStars)
  const cycle = getMascotCycle(totalStars)
  const inCycle = totalStars - cycle * 1000
  const thresholds = [0, 50, 150, 300, 500, 1000]
  const labels = ['Estrellita', 'Bronce', 'Plata', 'Oro', 'Superestrella', 'Legendaria']
  const curMin = thresholds[tier]
  const next = tier < 5 ? thresholds[tier + 1] : thresholds[5]
  const progress = tier >= 5 ? 100 : ((inCycle - curMin) / Math.max(1, next - curMin)) * 100
  const cycleName = CYCLE_NAMES[cycle % CYCLE_NAMES.length] || ''
  return {
    tier,
    cycle,
    label: cycle > 0 ? `${labels[tier]} ${cycleName}` : labels[tier],
    nextLabel: tier < 5 ? labels[tier + 1] : (cycle < 5 ? `${labels[0]} ${CYCLE_NAMES[(cycle + 1) % CYCLE_NAMES.length]}` : labels[5]),
    progress: Math.max(0, Math.min(100, progress)),
    remaining: tier >= 5 ? Math.max(0, (cycle + 1) * 1000 - totalStars) : Math.max(0, cycle * 1000 + next - totalStars),
  }
}

function getPodium(hist = [], todayOk = 0) {
  const all = [...(hist || []).map((h) => Number(h?.ok || 0)), Number(todayOk || 0)]
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a)
    .slice(0, 3)
  const medals = ['🥇', '🥈', '🥉']
  return all.map((score, idx) => ({ score, medal: medals[idx] }))
}

function getRandomRows(randomStats) {
  if (!randomStats) return []
  return Object.entries(randomStats)
    .map(([k, v]) => {
      const ok = Number(v?.ok || 0)
      const total = Number(v?.total || 0)
      return {
        key: k,
        ok,
        total,
        pct: total ? Math.round((ok / total) * 100) : 0,
      }
    })
    .sort((a, b) => b.ok - a.ok)
}

/* ---------- responsive CSS with ds- prefix ---------- */
const DS_STYLES = `
/* ===== BASE (portrait) ===== */
.ds-root {
  position: fixed;
  inset: 0;
  background: ${BG};
  z-index: 120;
  overflow-y: auto;
  padding: 16px;
}
.ds-wrapper {
  max-width: 780px;
  margin: 0 auto;
  padding-bottom: 24px;
}
.ds-card-outer {
  background: linear-gradient(180deg, ${BG2} 0%, ${CARD} 100%);
  border: 2px solid ${GOLD}55;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,.26);
}
.ds-header-badge {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.ds-title-block {
  text-align: center;
  margin-bottom: 18px;
}
.ds-title {
  font-size: 34px;
  font-weight: 800;
  color: ${GOLD};
  line-height: 1.05;
  margin-bottom: 6px;
}
.ds-subtitle {
  color: ${DIM};
  font-size: 16px;
}
.ds-mascots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 26px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.ds-mascot-item {
  text-align: center;
}
.ds-mascot-badge {
  margin-top: 8px;
}
.ds-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.ds-evo-card {
  margin-bottom: 18px;
}
.ds-evo-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.ds-evo-title {
  color: ${GOLD};
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 4px;
}
.ds-evo-sub {
  color: ${DIM};
  font-size: 14px;
}
.ds-evo-bar {
  margin-top: 12px;
}
.ds-mid-row {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}
.ds-podium-title,
.ds-resumen-title {
  color: ${GOLD};
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 10px;
}
.ds-podium-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.ds-podium-medal {
  font-size: 28px;
  margin-bottom: 4px;
}
.ds-podium-score {
  font-size: 24px;
  font-weight: 800;
}
.ds-podium-label {
  font-size: 12px;
  color: ${DIM};
}
.ds-resumen-grid {
  display: grid;
  gap: 8px;
}
.ds-resumen-row {
  display: flex;
  justify-content: space-between;
  color: ${DIM};
}
.ds-random-card {
  margin-bottom: 18px;
}
.ds-random-title {
  color: ${GOLD};
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 10px;
}
.ds-random-grid {
  display: grid;
  gap: 8px;
}
.ds-random-item {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 14px;
  padding: 10px;
}
.ds-random-item-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}
.ds-random-item-name {
  font-weight: 700;
  text-transform: capitalize;
}
.ds-feed-card {
  text-align: center;
  margin-bottom: 18px;
}
.ds-feed-emoji {
  font-size: 36px;
  margin-bottom: 6px;
}
.ds-feed-title {
  color: ${GOLD};
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 4px;
}
.ds-feed-sub {
  color: ${DIM};
  font-size: 14px;
  margin-bottom: 14px;
}
.ds-feed-btn-wrap {
  display: flex;
  justify-content: center;
}
.ds-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}
.ds-action-item {
  text-align: center;
}
.ds-action-label {
  color: ${DIM};
  font-size: 13px;
  margin-top: 8px;
}

/* Portrait top-section is just stacked (no special grid) */
.ds-top-section {}
.ds-title-area {}
.ds-mid-section {}
.ds-bottom-section {}

/* ===== LANDSCAPE — short screens (phones rotated, small tablets) ===== */
@media (orientation: landscape) and (max-height: 600px) {
  .ds-root {
    padding: 6px 10px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .ds-wrapper {
    max-width: 98vw;
    padding-bottom: 6px;
    width: 100%;
  }
  .ds-card-outer {
    padding: 8px 12px;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 12px);
    box-sizing: border-box;
  }

  /* Top row: mascots left + title right */
  .ds-top-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  .ds-top-section .ds-mascots {
    gap: 10px;
    margin-bottom: 0;
    flex-shrink: 0;
    flex-wrap: nowrap;
  }
  .ds-top-section .ds-title-area {
    flex: 1;
    min-width: 0;
  }
  .ds-top-section .ds-header-badge {
    justify-content: flex-start;
    margin-bottom: 2px;
  }
  .ds-top-section .ds-title-block {
    text-align: left;
    margin-bottom: 0;
  }
  .ds-title {
    font-size: 18px;
    margin-bottom: 1px;
  }
  .ds-subtitle {
    font-size: 11px;
  }
  .ds-mascot-badge { margin-top: 4px; }

  /* Middle row: stats | podium | resumen in 3 columns */
  .ds-mid-section {
    display: grid;
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: 8px;
    margin-bottom: 6px;
    align-items: start;
  }
  .ds-stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    margin-bottom: 0;
  }
  .ds-mid-row {
    display: contents;
  }
  .ds-podium-title,
  .ds-resumen-title {
    font-size: 13px;
    margin-bottom: 5px;
  }
  .ds-podium-medal {
    font-size: 16px;
    margin-bottom: 1px;
  }
  .ds-podium-score {
    font-size: 14px;
  }
  .ds-podium-label {
    font-size: 9px;
  }
  .ds-podium-items {
    gap: 4px;
  }
  .ds-resumen-row {
    font-size: 11px;
  }
  .ds-resumen-grid {
    gap: 4px;
  }

  /* Bottom row: evo + random + feed side by side */
  .ds-bottom-section {
    display: flex;
    gap: 8px;
    align-items: stretch;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .ds-evo-card {
    margin-bottom: 0;
    flex: 1;
    min-width: 180px;
  }
  .ds-evo-title {
    font-size: 13px;
    margin-bottom: 2px;
  }
  .ds-evo-sub {
    font-size: 10px;
  }
  .ds-evo-bar {
    margin-top: 4px;
  }
  .ds-random-card {
    margin-bottom: 0;
    flex: 1;
    min-width: 180px;
  }
  .ds-random-title {
    font-size: 13px;
    margin-bottom: 4px;
  }
  .ds-random-item {
    padding: 5px 7px;
    border-radius: 8px;
  }
  .ds-random-item-header {
    margin-bottom: 3px;
    font-size: 11px;
  }
  .ds-random-item-name {
    font-size: 11px;
  }
  .ds-random-grid {
    gap: 4px;
  }
  .ds-feed-card {
    margin-bottom: 0;
    flex: 1;
    min-width: 140px;
  }
  .ds-feed-emoji {
    font-size: 22px;
    margin-bottom: 2px;
  }
  .ds-feed-title {
    font-size: 13px;
    margin-bottom: 2px;
  }
  .ds-feed-sub {
    font-size: 10px;
    margin-bottom: 6px;
  }
  .ds-actions {
    gap: 14px;
    margin-top: 2px;
  }
  .ds-action-label {
    font-size: 10px;
    margin-top: 3px;
  }
}

/* ===== LANDSCAPE — taller screens (tablets) ===== */
@media (orientation: landscape) and (min-height: 601px) {
  .ds-root {
    padding: 10px 16px;
  }
  .ds-wrapper {
    max-width: 960px;
  }
  .ds-card-outer {
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 20px);
    box-sizing: border-box;
  }
  .ds-top-section {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
  }
  .ds-top-section .ds-mascots {
    gap: 14px;
    margin-bottom: 0;
    flex-shrink: 0;
    flex-wrap: nowrap;
  }
  .ds-top-section .ds-title-area {
    flex: 1;
    min-width: 0;
  }
  .ds-top-section .ds-header-badge {
    justify-content: flex-start;
    margin-bottom: 4px;
  }
  .ds-top-section .ds-title-block {
    text-align: left;
    margin-bottom: 0;
  }
  .ds-title {
    font-size: 26px;
  }
  .ds-subtitle {
    font-size: 14px;
  }
  .ds-mid-section {
    display: grid;
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
    align-items: start;
  }
  .ds-stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 0;
  }
  .ds-mid-row {
    display: contents;
  }
  .ds-bottom-section {
    display: flex;
    gap: 10px;
    align-items: stretch;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .ds-evo-card {
    margin-bottom: 0;
    flex: 1;
    min-width: 220px;
  }
  .ds-random-card {
    margin-bottom: 0;
    flex: 1;
    min-width: 220px;
  }
  .ds-feed-card {
    margin-bottom: 0;
    flex: 1;
    min-width: 180px;
  }
}
`

export function DoneScreen({
  st,
  elapsed,
  user,
  supPin,
  sessionStars = 0,
  maxStreak = 0,
  totalLifetimeStars = 0,
  randomStats = null,
  showFeedDog = false,
  onFeedDog,
  onExit,
}) {
  const [fedThisDone, setFedThisDone] = useState(false)
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
  )

  const ok = Number(st?.ok || 0)
  const sk = Number(st?.sk || 0)
  const praise = useMemo(() => getPraise(ok, sk), [ok, sk])
  const tierMeta = useMemo(
    () => getTierMeta(totalLifetimeStars || user?.totalStars3plus || 0),
    [totalLifetimeStars, user]
  )
  const podium = useMemo(() => getPodium(user?.hist || [], ok), [user, ok])
  const randomRows = useMemo(() => getRandomRows(randomStats), [randomStats])
  const dogGrowth = user?.id ? getDogGrowth(user.id) : 0
  const dogPhase = getDogPhase(dogGrowth)
  const accuracy = ok + sk ? Math.round((ok / (ok + sk)) * 100) : 0

  const mascotSize = isLandscape ? 74 : 110
  const dogSize = isLandscape ? 76 : 112

  useEffect(() => {
    victoryJingle()
    try {
      sayFB(`${praise} ${user?.name || ''}`.trim())
    } catch (e) {}
  }, [])

  useEffect(() => {
    const handler = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handler)
    const mql = window.matchMedia?.('(orientation: landscape)')
    mql?.addEventListener?.('change', handler)
    return () => {
      window.removeEventListener('resize', handler)
      mql?.removeEventListener?.('change', handler)
    }
  }, [])

  /* ----- shared sub-blocks ----- */
  const headerBadge = (
    <div className="ds-header-badge">
      <Badge tone="gold" size="lg">🎉 Fin de sesión</Badge>
    </div>
  )

  const titleBlock = (
    <div className="ds-title-block">
      <div className="ds-title">
        {randomStats ? 'Sesión variada completada' : 'Sesión completada'}
      </div>
      <div className="ds-subtitle">
        {user?.name ? `${user.name}, ` : ''}has terminado tu sesión
      </div>
    </div>
  )

  const mascotsBlock = (
    <div className="ds-mascots">
      <div className="ds-mascot-item">
        <SpaceMascot tier={tierMeta.tier} cycle={tierMeta.cycle || 0} mood={accuracy >= 70 ? 'dance' : 'happy'} size={mascotSize} />
        <div className="ds-mascot-badge">
          <Badge tone="gold">⭐ {tierMeta.label}</Badge>
        </div>
      </div>
      <div className="ds-mascot-item">
        <DogMascot
          phase={dogPhase}
          mood={showFeedDog && !fedThisDone ? 'hungry' : fedThisDone ? 'eating' : 'dance'}
          size={dogSize}
          interactive
        />
        <div className="ds-mascot-badge">
          <Badge tone="blue">
            🐶 {dogPhase === 0 ? 'Cachorro' : dogPhase === 1 ? 'Joven' : 'Héroe'}
          </Badge>
        </div>
      </div>
    </div>
  )

  const statsGrid = (
    <div className="ds-stats-grid">
      <StatBox icon="✅" value={ok} label="Aciertos" />
      <StatBox icon="⭐" value={sessionStars} label="Estrellas" />
      <StatBox icon="🔥" value={maxStreak} label="Racha máx." />
      <StatBox icon="⏱️" value={Math.round(elapsed / 60)} label="Minutos" />
    </div>
  )

  const podiumCard = (
    <Card>
      <div className="ds-podium-title">🏆 Podio personal</div>
      <div className="ds-podium-items">
        {podium.map((p, i) => (
          <Card
            key={i}
            variant="stat"
            style={{
              flex: 1,
              minWidth: isLandscape ? 56 : 90,
              background: i === 0 ? `${GOLD}18` : CARD,
              borderColor: i === 0 ? `${GOLD}88` : `${BLUE}55`,
            }}
          >
            <div className="ds-podium-medal">{p.medal}</div>
            <div className="ds-podium-score">{p.score}</div>
            <div className="ds-podium-label">{i === 0 ? 'Mejor marca' : `Puesto ${i + 1}`}</div>
          </Card>
        ))}
      </div>
    </Card>
  )

  const resumenCard = (
    <Card>
      <div className="ds-resumen-title">📊 Resumen</div>
      <div className="ds-resumen-grid">
        <div className="ds-resumen-row">
          <span>Total ejercicios</span>
          <b style={{ color: '#fff' }}>{ok + sk}</b>
        </div>
        <div className="ds-resumen-row">
          <span>Precisión</span>
          <b style={{ color: '#fff' }}>{accuracy}%</b>
        </div>
        <div className="ds-resumen-row">
          <span>Estrellas vida</span>
          <b style={{ color: '#fff' }}>{totalLifetimeStars || user?.totalStars3plus || 0}</b>
        </div>
        {supPin ? (
          <div className="ds-resumen-row">
            <span>Supervisor</span>
            <b style={{ color: GREEN }}>PIN activo</b>
          </div>
        ) : null}
      </div>
    </Card>
  )

  const evoCard = (
    <Card variant="highlight" className="ds-evo-card">
      <div className="ds-evo-header">
        <div>
          <div className="ds-evo-title">Mascota evolutiva</div>
          <div className="ds-evo-sub">
            Nivel actual: <b style={{ color: '#fff' }}>{tierMeta.label}</b>
            {tierMeta.tier < 5
              ? ` · faltan ${tierMeta.remaining} para ${tierMeta.nextLabel}`
              : ` · faltan ${tierMeta.remaining} para ${tierMeta.nextLabel}`}
          </div>
        </div>
        <Badge tone="purple">Tier {tierMeta.tier + 1}/6</Badge>
      </div>
      <div className="ds-evo-bar">
        <ProgressBar value={tierMeta.progress} max={100} />
      </div>
    </Card>
  )

  const randomCard = randomRows.length > 0 ? (
    <Card className="ds-random-card">
      <div className="ds-random-title">🔀 Desglose random</div>
      <div className="ds-random-grid">
        {randomRows.map((r) => (
          <div key={r.key} className="ds-random-item">
            <div className="ds-random-item-header">
              <div className="ds-random-item-name">
                {r.key.replace(/_/g, ' ')}
              </div>
              <Badge tone={r.pct >= 70 ? 'green' : r.pct >= 40 ? 'gold' : 'red'}>
                {r.ok}/{r.total}
              </Badge>
            </div>
            <ProgressBar value={r.pct} max={100} />
          </div>
        ))}
      </div>
    </Card>
  ) : null

  const feedCard = showFeedDog ? (
    <Card
      variant="highlight"
      className="ds-feed-card"
      style={{ background: fedThisDone ? `${GREEN}18` : undefined }}
    >
      <div className="ds-feed-emoji">{fedThisDone ? '🥣✨' : '🥣💧'}</div>
      <div className="ds-feed-title">
        {fedThisDone ? '¡Toki ya ha comido!' : '¡Toki tiene hambre!'}
      </div>
      <div className="ds-feed-sub">
        {fedThisDone
          ? 'Hoy has cuidado genial de tu compañero.'
          : 'Después de una sesión larga, dale su comida y agua.'}
      </div>
      {!fedThisDone && (
        <div className="ds-feed-btn-wrap">
          <Button
            variant="gold"
            fullWidth={false}
            onClick={() => {
              if (onFeedDog) onFeedDog()
              setFedThisDone(true)
            }}
          >
            🦴 Dar de comer
          </Button>
        </div>
      )}
    </Card>
  ) : null

  const actionsBlock = (
    <div className="ds-actions">
      <div className="ds-action-item">
        <Button variant="circular" onClick={() => onExit && onExit('repeat')}>
          🔄
        </Button>
        <div className="ds-action-label">¡Otra ronda!</div>
      </div>
      <div className="ds-action-item">
        <Button
          variant="circular"
          onClick={() => onExit && onExit('menu')}
          style={{
            background: BLUE,
            borderColor: '#2980b9',
            color: '#fff',
            boxShadow: '4px 4px 0 #1a5276',
          }}
        >
          🪐
        </Button>
        <div className="ds-action-label">Menú</div>
      </div>
    </div>
  )

  /* ===== LANDSCAPE render ===== */
  if (isLandscape) {
    return (
      <div className="ds-root">
        <style>{DS_STYLES}</style>
        <Confetti show />
        <div className="ds-wrapper">
          <div className="ds-card-outer">
            {/* Top: mascots + title side by side */}
            <div className="ds-top-section">
              {mascotsBlock}
              <div className="ds-title-area">
                {headerBadge}
                {titleBlock}
              </div>
            </div>

            {/* Middle: stats | podium | resumen in 3 columns */}
            <div className="ds-mid-section">
              {statsGrid}
              <div className="ds-mid-row">
                {podiumCard}
                {resumenCard}
              </div>
            </div>

            {/* Bottom: evo + random + feed side by side */}
            <div className="ds-bottom-section">
              {evoCard}
              {randomCard}
              {feedCard}
            </div>

            {actionsBlock}
          </div>
        </div>
      </div>
    )
  }

  /* ===== PORTRAIT render (original stacked) ===== */
  return (
    <div className="ds-root">
      <style>{DS_STYLES}</style>
      <Confetti show />
      <div className="ds-wrapper">
        <div className="ds-card-outer">
          {headerBadge}
          {titleBlock}
          {mascotsBlock}
          {statsGrid}
          {evoCard}
          <div className="ds-mid-row">
            {podiumCard}
            {resumenCard}
          </div>
          {randomCard}
          {feedCard}
          {actionsBlock}
        </div>
      </div>
    </div>
  )
}

export default DoneScreen
