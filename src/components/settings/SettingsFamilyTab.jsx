import React from 'react'
import { BG, BG2, BG3, GOLD, GREEN, RED, BLUE, PURPLE, TXT, DIM, CARD, BORDER, AVS, PERSONA_RELATIONS } from '../../constants.js'
import { generateAutoPresentation } from '../../cloud.js'
import { fbCreateShareCode } from '../../firebase.js'
import { AstronautAvatar } from '../UIKit.jsx'
import { Button, Card, Badge } from '../ui/index.js'

// ── PersonaRow ──────────────────────────────────────────────────
function PersonaRow({ p, idx, onPatch, onRequestDelete, delPersonaIdx, setDelPersonaIdx, onPhoto }) {
  const confirmingDelete = delPersonaIdx === idx

  const cycleAvatar = () => {
    const cur = AVS.indexOf(p.avatar)
    const next = (cur + 1) % AVS.length
    onPatch({ avatar: AVS[next] })
  }

  return (
    <Card style={{ padding: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 10, alignItems: 'center' }}>
        {/* Avatar circle — tap to cycle, camera overlay for photo */}
        <div style={{ position: 'relative', width: 52, height: 52 }}>
          <div
            onClick={cycleAvatar}
            style={{
              width: 52, height: 52, borderRadius: '50%', background: BG3,
              border: `2px solid ${BORDER}`, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, cursor: 'pointer'
            }}
          >
            {p.photo
              ? <img src={p.photo} alt={p.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (p.avatar || AVS[0])}
          </div>
          {/* Camera overlay button — bottom-right */}
          <button
            onClick={(e) => { e.stopPropagation(); onPhoto() }}
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 22, height: 22, borderRadius: '50%',
              background: GOLD, border: `2px solid ${BG}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, cursor: 'pointer', padding: 0, lineHeight: 1
            }}
          >📷</button>
        </div>

        {/* Name input */}
        <input
          className="inp"
          placeholder="Nombre"
          value={p.name || ''}
          onChange={(e) => onPatch({ name: e.target.value })}
          style={{ fontSize: 17, padding: 10 }}
        />

        {/* Delete button with confirmation */}
        {confirmingDelete ? (
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={onRequestDelete} style={{ background: RED, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, padding: '6px 10px', cursor: 'pointer' }}>Sí</button>
            <button onClick={() => setDelPersonaIdx(null)} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, color: DIM, fontSize: 13, padding: '6px 8px', cursor: 'pointer' }}>No</button>
          </div>
        ) : (
          <Button variant="danger" fullWidth={false} size="sm" onClick={() => setDelPersonaIdx(idx)}>🗑️</Button>
        )}
      </div>

      {/* Relation dropdown */}
      <div style={{ marginTop: 8 }}>
        <select
          className="inp"
          value={p.relation || 'Padre'}
          onChange={(e) => onPatch({ relation: e.target.value })}
          style={{ fontSize: 16, padding: 10, appearance: 'auto' }}
        >
          {PERSONA_RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </Card>
  )
}

// ── Presentation edit (inline) ──────────────────────────────────
function PresEditInline({ pres, onSave, onCancel, setPhotoCrop, editIdx }) {
  const [name, setName] = React.useState(pres.name || '')
  const [slides, setSlides] = React.useState(pres.slides || [])

  const patchSlide = (i, patch) => {
    const next = [...slides]
    next[i] = { ...next[i], ...patch }
    setSlides(next)
  }
  const removeSlide = (i) => setSlides(slides.filter((_, si) => si !== i))
  const addSlide = () => {
    if (slides.length >= 30) return
    setSlides([...slides, { text: '', img: null }])
  }

  return (
    <Card style={{ border: `2px solid ${GOLD}55` }}>
      <div style={{ color: GOLD, fontWeight: 800, fontSize: 16, marginBottom: 10 }}>
        {editIdx != null ? 'Editar presentación' : 'Nueva presentación'}
      </div>

      <input
        className="inp"
        placeholder="Nombre de la presentación"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 12, fontSize: 17 }}
      />

      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        {slides.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', background: BG3, borderRadius: 10, padding: 8 }}>
            {/* Photo thumbnail / upload */}
            <div
              onClick={() => setPhotoCrop && setPhotoCrop({ type: 'presSlide', presIdx: editIdx, slideIdx: i })}
              style={{
                width: 48, height: 48, borderRadius: 8, background: BG,
                border: `1px solid ${BORDER}`, cursor: 'pointer', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0
              }}
            >
              {s.img
                ? <img src={s.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '📷'}
            </div>

            {/* Slide text */}
            <input
              className="inp"
              placeholder={`Línea ${i + 1}`}
              value={s.text || ''}
              onChange={(e) => patchSlide(i, { text: e.target.value })}
              style={{ flex: 1, fontSize: 15, padding: 8 }}
            />

            {/* Delete slide */}
            <button
              onClick={() => removeSlide(i)}
              style={{
                background: 'none', border: 'none', color: RED, fontSize: 18,
                cursor: 'pointer', padding: 4, flexShrink: 0
              }}
            >✕</button>
          </div>
        ))}
      </div>

      {slides.length < 30 && (
        <Button variant="ghost" size="sm" onClick={addSlide} style={{ marginBottom: 12 }}>
          ＋ Añadir línea
        </Button>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" fullWidth={false} size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="gold" fullWidth={false} size="sm" onClick={() => onSave({ name: name || 'Presentación', slides, auto: false })}>
          Guardar
        </Button>
      </div>
    </Card>
  )
}

// ── Main component ──────────────────────────────────────────────
export default function SettingsFamilyTab(props) {
  const {
    user, setUser, saveP, personas, savePersonas, setPhotoCrop,
    presEdit, setPresEdit, presNewMode, setPresNewMode,
    presDelIdx, setPresDelIdx,
    shareCode, setShareCode, shareMsg, setShareMsg,
    fbUser, hasConfig, helmetMode, showHelmet, setShowRec,
    delConf, setDelConf, delPersonaIdx, setDelPersonaIdx
  } = props

  const safeUser = user || {}
  const safePersonas = personas || []
  const safePresentations = safeUser.presentations || []

  // ── Helpers ────────────────────────────────────────────────────
  const patchUser = (patch) => {
    const next = { ...safeUser, ...patch }
    setUser && setUser(next)
    saveP && saveP(next)
  }

  const patchPersona = (idx, patch) => {
    const next = [...safePersonas]
    next[idx] = { ...(next[idx] || {}), ...patch }
    savePersonas && savePersonas(next)
  }

  const addPersona = () => {
    if (safePersonas.length >= 10) return
    savePersonas && savePersonas([...safePersonas, { name: '', relation: 'Padre', avatar: AVS[0], photo: '' }])
  }

  const deletePersona = (idx) => {
    savePersonas && savePersonas(safePersonas.filter((_, i) => i !== idx))
    setDelPersonaIdx && setDelPersonaIdx(null)
  }

  // ── Presentations ─────────────────────────────────────────────
  const savePres = (idx, data) => {
    const next = [...safePresentations]
    next[idx] = { ...next[idx], ...data }
    patchUser({ presentations: next })
    setPresEdit(null)
  }

  const addNewPres = (data) => {
    patchUser({ presentations: [...safePresentations, data] })
    setPresNewMode(null)
  }

  const deletePres = (idx) => {
    patchUser({ presentations: safePresentations.filter((_, i) => i !== idx) })
    setPresDelIdx(null)
  }

  const addAutoPresentation = () => {
    if (safePresentations.length >= 5) return
    const auto = generateAutoPresentation(safeUser, safePersonas)
    patchUser({
      presentations: [...safePresentations, {
        name: `Presentación ${safePresentations.length + 1}`,
        slides: auto.slides || [],
        auto: true,
        date: new Date().toISOString().slice(0, 10)
      }]
    })
    setPresNewMode(null)
  }

  // ── Delete profile ────────────────────────────────────────────
  const deleteProfile = () => {
    if (!delConf) { setDelConf && setDelConf(true); return }
    try { localStorage.removeItem('toki_user'); localStorage.removeItem('toki_personas') } catch (e) {}
    setUser && setUser(null)
    savePersonas && savePersonas([])
    setDelConf && setDelConf(false)
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{ display: 'grid', gap: 14 }}>

      {/* ─── Profile ─────────────────────────────────────────── */}
      <Card>
        <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Perfil principal</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <input className="inp" placeholder="Nombre" value={safeUser.name || ''} onChange={(e) => patchUser({ name: e.target.value })} />
          <input className="inp" placeholder="Apellidos" value={safeUser.apellidos || ''} onChange={(e) => patchUser({ apellidos: e.target.value })} />
          <input className="inp" placeholder="Colegio" value={safeUser.colegio || ''} onChange={(e) => patchUser({ colegio: e.target.value })} />
          <input className="inp" placeholder="Teléfono" value={safeUser.telefono || ''} onChange={(e) => patchUser({ telefono: e.target.value })} />
          <input className="inp" placeholder="Dirección" value={safeUser.direccion || ''} onChange={(e) => patchUser({ direccion: e.target.value })} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="ghost" fullWidth={false} onClick={() => setPhotoCrop && setPhotoCrop({ type: 'user' })}>📷 Foto perfil</Button>
            <Badge tone="ghost">{safeUser.photo ? 'Con foto' : 'Sin foto'}</Badge>
          </div>
        </div>
      </Card>

      {/* ─── Personas ────────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>Mis personas</div>
          {safePersonas.length < 10 && (
            <Button variant="gold" fullWidth={false} size="sm" onClick={addPersona}>＋ Añadir</Button>
          )}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {safePersonas.length === 0
            ? <div style={{ color: DIM, fontSize: 14 }}>No hay personas añadidas todavía.</div>
            : safePersonas.map((p, idx) => (
                <PersonaRow
                  key={idx}
                  p={p}
                  idx={idx}
                  onPatch={(patch) => patchPersona(idx, patch)}
                  onRequestDelete={() => deletePersona(idx)}
                  delPersonaIdx={delPersonaIdx}
                  setDelPersonaIdx={setDelPersonaIdx}
                  onPhoto={() => setPhotoCrop && setPhotoCrop({ type: 'persona', idx })}
                />
              ))}
        </div>
      </Card>

      {/* ─── Presentations ───────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>Presentaciones</div>
          {presEdit == null && presNewMode == null && safePresentations.length < 5 && (
            <Button variant="gold" fullWidth={false} size="sm" onClick={() => setPresNewMode('choose')}>
              ＋ Nueva
            </Button>
          )}
        </div>

        {/* Existing presentations list */}
        <div style={{ display: 'grid', gap: 10 }}>
          {safePresentations.length === 0 && presNewMode == null
            ? <div style={{ color: DIM, fontSize: 14 }}>No hay presentaciones creadas.</div>
            : safePresentations.map((p, idx) => {
                // If editing this presentation inline
                if (presEdit === idx) {
                  return (
                    <PresEditInline
                      key={idx}
                      pres={p}
                      editIdx={idx}
                      setPhotoCrop={setPhotoCrop}
                      onSave={(data) => savePres(idx, data)}
                      onCancel={() => setPresEdit(null)}
                    />
                  )
                }

                // Delete confirmation
                if (presDelIdx === idx) {
                  return (
                    <Card key={idx} style={{ padding: 12, border: `2px solid ${RED}55` }}>
                      <div style={{ textAlign: 'center', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>Eliminar "{p.name}"?</div>
                        <div style={{ color: DIM, fontSize: 13 }}>Esta acción no se puede deshacer</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <Button variant="danger" fullWidth={false} size="sm" onClick={() => deletePres(idx)}>Eliminar</Button>
                        <Button variant="ghost" fullWidth={false} size="sm" onClick={() => setPresDelIdx(null)}>Cancelar</Button>
                      </div>
                    </Card>
                  )
                }

                // Normal row
                return (
                  <Card key={idx} style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>
                          {p.name || `Presentación ${idx + 1}`}
                          {p.auto && <Badge tone="blue" style={{ marginLeft: 8, fontSize: 11 }}>auto</Badge>}
                        </div>
                        <div style={{ color: DIM, fontSize: 13 }}>
                          {(p.slides || []).length} líneas
                          {p.date ? ` · ${p.date}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="ghost" fullWidth={false} size="sm" onClick={() => setPresEdit(idx)}>✏️</Button>
                        <Button variant="danger" fullWidth={false} size="sm" onClick={() => setPresDelIdx(idx)}>🗑️</Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
        </div>

        {/* New presentation — choice modal */}
        {presNewMode === 'choose' && (
          <div style={{ marginTop: 12 }}>
            <Card style={{ border: `2px solid ${GOLD}55`, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 16 }}>Nueva presentación</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="gold" fullWidth={false} onClick={addAutoPresentation}>
                  🤖 Automática
                </Button>
                <Button variant="ghost" fullWidth={false} onClick={() => setPresNewMode('manual')}>
                  ✏️ Personalizada
                </Button>
              </div>
              <div style={{ marginTop: 10 }}>
                <Button variant="ghost" fullWidth={false} size="sm" onClick={() => setPresNewMode(null)}>Cancelar</Button>
              </div>
            </Card>
          </div>
        )}

        {/* New presentation — manual editor */}
        {presNewMode === 'manual' && (
          <div style={{ marginTop: 12 }}>
            <PresEditInline
              pres={{ name: '', slides: [{ text: '', img: null }] }}
              editIdx={null}
              setPhotoCrop={setPhotoCrop}
              onSave={(data) => addNewPres({ ...data, date: new Date().toISOString().slice(0, 10) })}
              onCancel={() => setPresNewMode(null)}
            />
          </div>
        )}
      </Card>

      {/* ─── Voice recording ─────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>Grabar voces</div>
            <div style={{ color: DIM, fontSize: 13, marginTop: 2 }}>Graba la voz de familiares para los ejercicios</div>
          </div>
          <Button variant="gold" fullWidth={false} onClick={() => setShowRec && setShowRec(true)}>🎙️</Button>
        </div>
      </Card>

      {/* ─── Share code ──────────────────────────────────────── */}
      {hasConfig && fbUser && (
        <Card>
          <div style={{ color: GOLD, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Compartir perfil</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ color: DIM, fontSize: 14 }}>Código de vinculación entre dispositivos</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="gold" fullWidth={false} onClick={async () => {
                if (!fbUser || !safeUser?.id) return
                try {
                  const code = await fbCreateShareCode(fbUser.uid, safeUser.id, safeUser.name || 'TOKI')
                  setShareCode && setShareCode(code)
                  setShareMsg && setShareMsg('Código creado')
                } catch (e) {
                  setShareMsg && setShareMsg('Error')
                }
              }}>🔗 Crear código</Button>
              {shareCode ? <Badge tone="blue">{shareCode}</Badge> : null}
            </div>
            {shareMsg ? <div style={{ color: DIM, fontSize: 13 }}>{shareMsg}</div> : null}
          </div>
        </Card>
      )}

      {/* ─── Delete profile ──────────────────────────────────── */}
      <Card style={{ border: delConf ? `2px solid ${RED}55` : undefined }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ color: RED, fontWeight: 800, fontSize: 16 }}>Eliminar perfil</div>
            <div style={{ color: DIM, fontSize: 13 }}>Borra todos los datos del dispositivo</div>
          </div>
          {delConf ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="danger" fullWidth={false} size="sm" onClick={deleteProfile}>Confirmar</Button>
              <Button variant="ghost" fullWidth={false} size="sm" onClick={() => setDelConf && setDelConf(false)}>Cancelar</Button>
            </div>
          ) : (
            <Button variant="danger" fullWidth={false} size="sm" onClick={() => setDelConf && setDelConf(true)}>🗑️ Eliminar</Button>
          )}
        </div>
      </Card>
    </div>
  )
}
