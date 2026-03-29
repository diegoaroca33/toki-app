import React from 'react'
import { BG, BG2, GOLD, TXT, DIM } from '../constants.js'
import { TabBar } from './ui/index.js'
import SettingsConfigTab from './settings/SettingsConfigTab.jsx'
import SettingsFamilyTab from './settings/SettingsFamilyTab.jsx'
import SettingsProgressTab from './settings/SettingsProgressTab.jsx'
import SettingsMethodTab from './settings/SettingsMethodTab.jsx'

export function Settings(props) {
  const { user, setUser, saveP, sm, freeChoice, setFreeChoice, sec, secLv, ptab, setPtab, setOv, setOpenGroup } = props

  const tabs = [
    { value: 'config', label: '⚙ Config' },
    { value: 'familia', label: '👨‍👩‍👧 Familia' },
    { value: 'progreso', label: '📈 Progreso' },
    { value: 'metodo', label: '🧠 Método' },
  ]

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: BG, overflowY: 'auto', zIndex: 100, padding: 16 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <p style={{ fontSize: 22, color: GOLD, fontWeight: 700, margin: 0 }}>👨‍👩‍👦 Panel</p>
          <button className="btn btn-gold" style={{ width: 'auto', padding: '12px 20px', fontSize: 18, minHeight: 52 }} onClick={() => {
            const up = { ...user, sessionMin: sm, freeChoice, sec, secLv }
            setUser(up); saveP(up); setFreeChoice(true); setOv(null); setOpenGroup && setOpenGroup(null)
          }}>🎮 ¡A jugar!</button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <TabBar tabs={tabs} value={ptab} onChange={setPtab} />
        </div>

        {ptab === 'config' && <SettingsConfigTab {...props} />}
        {ptab === 'familia' && <SettingsFamilyTab {...props} />}
        {ptab === 'progreso' && <SettingsProgressTab {...props} />}
        {ptab === 'metodo' && <SettingsMethodTab {...props} />}
      </div>
    </div>
  )
}

export default Settings
