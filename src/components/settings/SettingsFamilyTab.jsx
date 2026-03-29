import React from 'react'
import { BG3, GOLD, DIM, BORDER, AVS, PERSONA_RELATIONS } from '../../constants.js'
import { generateAutoPresentation } from '../../cloud.js'
import { Button, Card, Badge } from '../ui/index.js'

function AvatarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {AVS.slice(0, 18).map((av) => {
        const active = value === av
        return (
          <button key={av} onClick={() => onChange && onChange(av)} style={{
            width: 44, height: 44, borderRadius: 12,
            border: `2px solid ${active ? '#F0C850' : BORDER}`,
            background: BG3, fontSize: 24, cursor: 'pointer',
          }}>{av}</button>
        )
      })}
    </div>
  )
}

function PersonaRow({ p, onPatch, onDelete, onPhoto }) {
  return (
    <Card style={{ padding: 12 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: BG3, border: `2px solid ${BORDER}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            {p.photo ? <img src={p.photo} alt={p.name || 'persona'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.avatar || '🧑‍🚀')}
          </div>
          <input className="inp" placeholder="Nombre" value={p.name || ''} onChange={(e) => onPatch({ name: e.target.value })} />
          <Button variant="danger" fullWidth={false} size="sm" onClick={onDelete}>🗑️</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
          <select className="inp" value={p.relation || 'Padre'} onChange={(e) => onPatch({ relation: e.target.value })} style={{ appearance: 'none' }}>
            {PERSONA_RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <Button variant="ghost" fullWidth={false} size="sm" onClick={onPhoto}>📷 Foto</Button>
        </div>
        <AvatarPicker value={p.avatar} onChange={(v) => onPatch({ avatar: v })} />
      </div>
    </Card>
  )
}

export default function SettingsFamilyTab(props) {
  const { user, setUser, saveP, personas, savePersonas, setPhotoCrop, presEdit, setPresEdit, presDelIdx, setPresDelIdx, presNewMode, setPresNewMode, shareCode, setShareCode, shareMsg, setShareMsg, fbUser, hasConfig } = props
  const safeUser = user || {}
  const safePersonas = personas || []
  const safePresentations = safeUser.presentations || []

  const patchUser = (patch) => { const next = { ...safeUser, ...patch }; setUser && setUser(next); saveP && saveP(next) }
  const patchPersona = (idx, patch) => { const next = [...safePersonas]; next[idx] = { ...(next[idx] || {}), ...patch }; savePersonas && savePersonas(next) }
  const addPersona = () => { savePersonas && savePersonas([...safePersonas, { name: '', relation: 'Padre', avatar: '🧑‍🚀', photo: '' }]) }
  const deletePersona = (idx) => { savePersonas && savePersonas(safePersonas.filter((_, i) => i !== idx)) }

  const addAutoPresentation = () => {
    if (safePresentations.length >= 5) return
    const auto = generateAutoPresentation(safeUser, safePersonas)
    patchUser({ presentations: [...safePresentations, { name: `Presentación ${safePresentations.length + 1}`, slides: auto.slides || [], auto: true }] })
  }

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Perfil principal</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <input className="inp" placeholder="Nombre" value={safeUser.name || ''} onChange={(e) => patchUser({ name: e.target.value })} />
          <input className="inp" placeholder="Apellidos" value={safeUser.apellidos || ''} onChange={(e) => patchUser({ apellidos: e.target.value })} />
          <input className="inp" placeholder="Colegio" value={safeUser.colegio || ''} onChange={(e) => patchUser({ colegio: e.target.value })} />
          <input className="inp" placeholder="Teléfono" value={safeUser.telefono || ''} onChange={(e) => patchUser({ telefono: e.target.value })} />
          <input className="inp" placeholder="Dirección" value={safeUser.direccion || ''} onChange={(e) => patchUser({ direccion: e.target.value })} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="ghost" fullWidth={false} onClick={() => setPhotoCrop && setPhotoCrop({ type: 'user' })}>📷 Foto perfil</Button>
            <Badge tone="ghost">{safeUser.photo ? 'Con foto' : 'Sin foto'}</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>Mis personas</div>
          <Button variant="gold" fullWidth={false} size="sm" onClick={addPersona}>＋ Añadir</Button>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {safePersonas.length === 0 ? <div style={{ color: DIM, fontSize: 14 }}>No hay personas añadidas todavía.</div>
            : safePersonas.map((p, idx) => <PersonaRow key={idx} p={p} onPatch={(patch) => patchPersona(idx, patch)} onDelete={() => deletePersona(idx)} onPhoto={() => setPhotoCrop && setPhotoCrop({ type: 'persona', idx })} />)}
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>Presentaciones</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="gold" fullWidth={false} size="sm" onClick={addAutoPresentation}>⚡ Auto</Button>
            <Button variant="ghost" fullWidth={false} size="sm" onClick={() => setPresNewMode && setPresNewMode('manual')}>✍️ Manual</Button>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {safePresentations.length === 0 ? <div style={{ color: DIM, fontSize: 14 }}>No hay presentaciones creadas.</div>
            : safePresentations.map((p, idx) => (
              <Card key={idx} style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{p.name || `Presentación ${idx + 1}`}</div>
                    <div style={{ color: DIM, fontSize: 13 }}>{(p.slides || []).length} slides</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="ghost" fullWidth={false} size="sm" onClick={() => setPresEdit && setPresEdit(idx)}>✏️</Button>
                    <Button variant="danger" fullWidth={false} size="sm" onClick={() => setPresDelIdx && setPresDelIdx(idx)}>🗑️</Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </Card>

      {hasConfig && fbUser && (
        <Card>
          <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Compartir perfil</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ color: DIM, fontSize: 14 }}>Código de vinculación entre dispositivos</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="gold" fullWidth={false} onClick={async () => {
                if (!fbUser || !safeUser?.id) return
                try { const { fbCreateShareCode } = await import('../../firebase.js'); const code = await fbCreateShareCode(fbUser.uid, safeUser.id, safeUser.name || 'TOKI'); setShareCode && setShareCode(code); setShareMsg && setShareMsg('Código creado') } catch (e) { setShareMsg && setShareMsg('Error') }
              }}>🔗 Crear código</Button>
              {shareCode ? <Badge tone="blue">{shareCode}</Badge> : null}
            </div>
            {shareMsg ? <div style={{ color: DIM, fontSize: 13 }}>{shareMsg}</div> : null}
          </div>
        </Card>
      )}
    </div>
  )
}
