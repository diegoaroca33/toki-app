import React, { useEffect, useMemo, useState } from 'react'
import { BG, BG2, GOLD, GREEN, BLUE, DIM, CARD } from '../constants.js'
import { getMascotTier, getDogGrowth, getDogPhase } from '../utils.js'
import { sayFB, starBeep } from '../voice.js'
import { SpaceMascot, DogMascot, Confetti } from './UIKit.jsx'
import { Button, Card, Badge, ProgressBar, StatBox } from './ui/index.js'

export function victoryBeeps() {
  try {
    starBeep(4)
    setTimeout(() => starBeep(3), 420)
  } catch (e) {}
}

function getPraise(ok = 0, sk = 0) {
  const total = Math.max(1, ok + sk)
  const pct = (ok / total) * 100
  if (pct >= 80) return '¡Genial!'
  if (pct >= 40) return '¡Buen trabajo!'
  return 'Has practicado mucho'
}

function getTierMeta(totalStars = 0) {
  const tier = getMascotTier(totalStars)
  const thresholds = [0, 50, 150, 300, 500, 1000]
  const labels = ['Estrellita', 'Bronce', 'Plata', 'Oro', 'Superestrella', 'Legendaria']
  const curMin = thresholds[tier]
  const next = tier < 5 ? thresholds[tier + 1] : thresholds[5]
  const progress = tier >= 5 ? 100 : ((totalStars - curMin) / Math.max(1, next - curMin)) * 100
  return {
    tier,
    label: labels[tier],
    nextLabel: labels[Math.min(tier + 1, 5)],
    progress: Math.max(0, Math.min(100, progress)),
    remaining: Math.max(0, next - totalStars),
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

  useEffect(() => {
    victoryBeeps()
    try {
      sayFB(`${praise} ${user?.name || ''}`.trim())
    } catch (e) {}
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: BG,
        zIndex: 120,
        overflowY: 'auto',
        padding: 16,
      }}
    >
      <Confetti show />
      <div style={{ maxWidth: 780, margin: '0 auto', paddingBottom: 24 }}>
        <div
          style={{
            background: `linear-gradient(180deg, ${BG2} 0%, ${CARD} 100%)`,
            border: `2px solid ${GOLD}55`,
            borderRadius: 24,
            padding: 20,
            boxShadow: '0 12px 30px rgba(0,0,0,.26)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Badge tone="gold" size="lg">🎉 Fin de sesión</Badge>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: GOLD, lineHeight: 1.05, marginBottom: 6 }}>
              {randomStats ? 'Sesión variada completada' : 'Sesión completada'}
            </div>
            <div style={{ color: DIM, fontSize: 16 }}>
              {user?.name ? `${user.name}, ` : ''}has terminado tu sesión
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 26,
              flexWrap: 'wrap',
              marginBottom: 20,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <SpaceMascot tier={tierMeta.tier} mood={accuracy >= 70 ? 'dance' : 'happy'} size={110} />
              <div style={{ marginTop: 8 }}>
                <Badge tone="gold">⭐ {tierMeta.label}</Badge>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <DogMascot
                phase={dogPhase}
                mood={showFeedDog && !fedThisDone ? 'hungry' : fedThisDone ? 'eating' : 'dance'}
                size={112}
                interactive
              />
              <div style={{ marginTop: 8 }}>
                <Badge tone="blue">
                  🐶 {dogPhase === 0 ? 'Cachorro' : dogPhase === 1 ? 'Joven' : 'Héroe'}
                </Badge>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <StatBox icon="✅" value={ok} label="Aciertos" />
            <StatBox icon="⭐" value={sessionStars} label="Estrellas" />
            <StatBox icon="🔥" value={maxStreak} label="Racha máx." />
            <StatBox icon="⏱️" value={Math.round(elapsed / 60)} label="Minutos" />
          </div>

          <Card variant="highlight" style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
                  Mascota evolutiva
                </div>
                <div style={{ color: DIM, fontSize: 14 }}>
                  Nivel actual: <b style={{ color: '#fff' }}>{tierMeta.label}</b>
                  {tierMeta.tier < 5 ? ` · faltan ${tierMeta.remaining} para ${tierMeta.nextLabel}` : ' · nivel máximo'}
                </div>
              </div>
              <Badge tone="purple">Tier {tierMeta.tier + 1}/6</Badge>
            </div>
            <div style={{ marginTop: 12 }}>
              <ProgressBar value={tierMeta.progress} max={100} />
            </div>
          </Card>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 1fr',
              gap: 14,
              marginBottom: 18,
            }}
          >
            <Card>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>🏆 Podio personal</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {podium.map((p, i) => (
                  <Card
                    key={i}
                    variant="stat"
                    style={{
                      flex: 1,
                      minWidth: 90,
                      background: i === 0 ? `${GOLD}18` : CARD,
                      borderColor: i === 0 ? `${GOLD}88` : `${BLUE}55`,
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{p.medal}</div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{p.score}</div>
                    <div style={{ fontSize: 12, color: DIM }}>{i === 0 ? 'Mejor marca' : `Puesto ${i + 1}`}</div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>📊 Resumen</div>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: DIM }}>
                  <span>Total ejercicios</span>
                  <b style={{ color: '#fff' }}>{ok + sk}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: DIM }}>
                  <span>Precisión</span>
                  <b style={{ color: '#fff' }}>{accuracy}%</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: DIM }}>
                  <span>Estrellas vida</span>
                  <b style={{ color: '#fff' }}>{totalLifetimeStars || user?.totalStars3plus || 0}</b>
                </div>
                {supPin ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: DIM }}>
                    <span>Supervisor</span>
                    <b style={{ color: GREEN }}>PIN activo</b>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          {randomRows.length > 0 && (
            <Card style={{ marginBottom: 18 }}>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 10 }}>
                🔀 Desglose random
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {randomRows.map((r) => (
                  <div
                    key={r.key}
                    style={{
                      background: 'rgba(255,255,255,.04)',
                      border: '1px solid rgba(255,255,255,.08)',
                      borderRadius: 14,
                      padding: 10,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>
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
          )}

          {showFeedDog && (
            <Card
              variant="highlight"
              style={{
                textAlign: 'center',
                marginBottom: 18,
                background: fedThisDone ? `${GREEN}18` : undefined,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 6 }}>{fedThisDone ? '🥣✨' : '🥣💧'}</div>
              <div style={{ color: GOLD, fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
                {fedThisDone ? '¡Toki ya ha comido!' : '¡Toki tiene hambre!'}
              </div>
              <div style={{ color: DIM, fontSize: 14, marginBottom: 14 }}>
                {fedThisDone
                  ? 'Hoy has cuidado genial de tu compañero.'
                  : 'Después de una sesión larga, dale su comida y agua.'}
              </div>
              {!fedThisDone && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <Button variant="circular" onClick={() => onExit && onExit('repeat')}>
                🔄
              </Button>
              <div style={{ color: DIM, fontSize: 13, marginTop: 8 }}>¡Otra ronda!</div>
            </div>

            <div style={{ textAlign: 'center' }}>
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
              <div style={{ color: DIM, fontSize: 13, marginTop: 8 }}>Menú</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoneScreen
