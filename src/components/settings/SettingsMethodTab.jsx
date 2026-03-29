import React, { useEffect, useState } from 'react'
import { GOLD, DIM, BG3, BORDER, LV_OPTS } from '../../constants.js'
import { getDynamicDilo, setDynamicDilo, getDynamicDiloLevel } from '../../utils.js'
import { Button, Card, Badge } from '../ui/index.js'

function ToggleRow({ label, help, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{label}</div>
        {help ? <div style={{ color: DIM, fontSize: 13 }}>{help}</div> : null}
      </div>
      <button onClick={() => onChange && onChange(!value)} style={{
        width: 68, height: 38, borderRadius: 999,
        border: `2px solid ${value ? '#2ECC71' : BORDER}`,
        background: value ? 'rgba(46,204,113,.14)' : BG3,
        position: 'relative', cursor: 'pointer',
      }}>
        <div style={{ position: 'absolute', top: 4, left: value ? 34 : 4, width: 26, height: 26, borderRadius: '50%', background: value ? '#2ECC71' : '#A0AEC0', transition: 'all .2s' }} />
      </button>
    </div>
  )
}

export default function SettingsMethodTab(props) {
  const { user, oralAll, setOralAll, setShowRec, sec, setSec, secLv, setSecLv } = props
  const [dynamicDilo, setDynamicDiloLocal] = useState(false)
  const [dynamicLv, setDynamicLv] = useState(1)

  useEffect(() => {
    if (!user?.id) return
    setDynamicDiloLocal(getDynamicDilo(user.id))
    setDynamicLv(getDynamicDiloLevel(user.id))
  }, [user])

  const handleDynamic = (v) => { setDynamicDiloLocal(v); if (user?.id) setDynamicDilo(user.id, v) }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Método pedagógico</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <ToggleRow label="Producción oral en todos los planetas" help="Práctica oral extra tras cada acierto" value={!!oralAll} onChange={setOralAll} />
          <ToggleRow label="DILO dinámico" help="Sube o baja de nivel según rendimiento" value={dynamicDilo} onChange={handleDynamic} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 700 }}>Nivel actual DILO</div><div style={{ color: DIM, fontSize: 13 }}>Nivel automático</div></div>
            <Badge tone="gold">N{dynamicLv}</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Grabaciones</div>
        <Button variant="gold" fullWidth={false} onClick={() => setShowRec && setShowRec(true)}>🎙️ Grabar voces</Button>
      </Card>

      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Acceso rápido a niveles</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {['decir', 'frase', 'contar', 'math', 'multi', 'frac'].map((k) => {
            const opts = LV_OPTS[k] || []
            if (opts.length === 0) return null
            return (
              <div key={k}>
                <div style={{ fontWeight: 700, marginBottom: 6, textTransform: 'capitalize' }}>{k}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {opts.map((lv) => {
                    const active = sec === k && (Array.isArray(secLv) ? secLv.includes(lv.n) : false)
                    return <Button key={lv.n} variant={active ? 'gold' : 'ghost'} fullWidth={false} size="sm" onClick={() => { setSec && setSec(k); setSecLv && setSecLv([lv.n]) }}>{lv.l}</Button>
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
