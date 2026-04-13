// ============================================================
// TOKI · Colored SVG objects for exercises with color+object
// Realistic inline SVGs that always match the described color
// ============================================================
import React from 'react'

const COLORS={
  rojo:'#E53935',azul:'#1E88E5',verde:'#43A047',amarillo:'#FDD835',
  naranja:'#FB8C00',rosa:'#EC407A',morado:'#8E24AA',negro:'#333',
  blanco:'#F5F5F5',roja:'#E53935',azul2:'#1565C0'
}

function Car({color='#E53935',size=120}){
  return <svg width={size} height={size} viewBox="0 0 120 80" fill="none">
    {/* Body */}
    <rect x="8" y="30" width="104" height="30" rx="8" fill={color}/>
    {/* Roof */}
    <path d="M30 30 L42 10 L82 10 L94 30" fill={color} stroke={color} strokeWidth="1"/>
    {/* Windows */}
    <path d="M44 12 L36 28 L60 28 L60 12 Z" fill="#B3E5FC" opacity=".85"/>
    <path d="M62 12 L62 28 L88 28 L80 12 Z" fill="#B3E5FC" opacity=".85"/>
    {/* Bumpers */}
    <rect x="2" y="42" width="18" height="8" rx="4" fill="#ccc"/>
    <rect x="100" y="42" width="18" height="8" rx="4" fill="#ccc"/>
    {/* Headlights */}
    <circle cx="108" cy="40" r="4" fill="#FFEE58"/>
    <circle cx="12" cy="40" r="4" fill="#FF7043"/>
    {/* Wheels */}
    <circle cx="32" cy="60" r="12" fill="#333"/>
    <circle cx="32" cy="60" r="6" fill="#777"/>
    <circle cx="88" cy="60" r="12" fill="#333"/>
    <circle cx="88" cy="60" r="6" fill="#777"/>
    {/* Shadow */}
    <ellipse cx="60" cy="74" rx="50" ry="5" fill="rgba(0,0,0,.12)"/>
  </svg>
}

function Motorcycle({color='#FDD835',size=120}){
  return <svg width={size} height={size} viewBox="0 0 120 80" fill="none">
    {/* Frame */}
    <path d="M40 35 L70 20 L85 35 L70 45 Z" fill={color} stroke={color} strokeWidth="1"/>
    {/* Tank */}
    <ellipse cx="58" cy="30" rx="14" ry="8" fill={color}/>
    <ellipse cx="58" cy="28" rx="10" ry="4" fill="rgba(255,255,255,.25)"/>
    {/* Seat */}
    <path d="M62 26 Q75 22 82 28 Q78 32 62 30 Z" fill="#333"/>
    {/* Engine */}
    <rect x="48" y="38" width="18" height="10" rx="3" fill="#666"/>
    <rect x="50" y="40" width="6" height="6" rx="1" fill="#888"/>
    {/* Exhaust */}
    <path d="M66 44 L90 48 L92 46 L68 42" fill="#999"/>
    {/* Handlebars */}
    <path d="M42 26 L36 18 M42 26 L48 18" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
    {/* Front wheel */}
    <circle cx="30" cy="55" r="14" fill="#333"/>
    <circle cx="30" cy="55" r="7" fill="#777"/>
    <circle cx="30" cy="55" r="3" fill="#555"/>
    {/* Rear wheel */}
    <circle cx="88" cy="55" r="14" fill="#333"/>
    <circle cx="88" cy="55" r="7" fill="#777"/>
    <circle cx="88" cy="55" r="3" fill="#555"/>
    {/* Fender */}
    <path d="M18 42 Q30 38 42 42" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    {/* Shadow */}
    <ellipse cx="60" cy="72" rx="44" ry="5" fill="rgba(0,0,0,.12)"/>
  </svg>
}

function Bicycle({color='#E53935',size=120}){
  return <svg width={size} height={size} viewBox="0 0 120 80" fill="none">
    {/* Frame */}
    <path d="M35 50 L55 25 L80 50 L55 50 Z" fill="none" stroke={color} strokeWidth="4"/>
    <line x1="55" y1="25" x2="45" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="55" y1="25" x2="65" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    {/* Handlebar */}
    <path d="M43 16 L47 18 M47 18 L42 22" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Seat */}
    <ellipse cx="68" cy="17" rx="7" ry="2.5" fill="#333"/>
    {/* Pedal area */}
    <circle cx="55" cy="50" r="4" fill="#666"/>
    {/* Front wheel */}
    <circle cx="30" cy="55" r="16" fill="none" stroke="#444" strokeWidth="3"/>
    <circle cx="30" cy="55" r="2" fill="#666"/>
    {/* Spokes */}
    <line x1="30" y1="40" x2="30" y2="70" stroke="#999" strokeWidth=".7"/>
    <line x1="15" y1="55" x2="45" y2="55" stroke="#999" strokeWidth=".7"/>
    {/* Rear wheel */}
    <circle cx="85" cy="55" r="16" fill="none" stroke="#444" strokeWidth="3"/>
    <circle cx="85" cy="55" r="2" fill="#666"/>
    <line x1="85" y1="40" x2="85" y2="70" stroke="#999" strokeWidth=".7"/>
    <line x1="70" y1="55" x2="100" y2="55" stroke="#999" strokeWidth=".7"/>
    {/* Chain */}
    <path d="M55 54 Q68 60 81 55" fill="none" stroke="#999" strokeWidth="1" strokeDasharray="2 2"/>
    {/* Shadow */}
    <ellipse cx="58" cy="74" rx="42" ry="4" fill="rgba(0,0,0,.1)"/>
  </svg>
}

function Bus({color='#43A047',size=120}){
  return <svg width={size} height={size} viewBox="0 0 120 80" fill="none">
    {/* Body */}
    <rect x="6" y="14" width="108" height="44" rx="8" fill={color}/>
    {/* Stripe */}
    <rect x="6" y="38" width="108" height="6" fill="rgba(255,255,255,.2)"/>
    {/* Windows */}
    <rect x="16" y="20" width="14" height="14" rx="3" fill="#B3E5FC" opacity=".9"/>
    <rect x="34" y="20" width="14" height="14" rx="3" fill="#B3E5FC" opacity=".9"/>
    <rect x="52" y="20" width="14" height="14" rx="3" fill="#B3E5FC" opacity=".9"/>
    <rect x="70" y="20" width="14" height="14" rx="3" fill="#B3E5FC" opacity=".9"/>
    {/* Windshield */}
    <rect x="90" y="18" width="18" height="18" rx="4" fill="#B3E5FC" opacity=".9"/>
    {/* Door */}
    <rect x="52" y="40" width="12" height="16" rx="2" fill="rgba(0,0,0,.15)"/>
    {/* Headlights */}
    <circle cx="110" cy="46" r="3.5" fill="#FFEE58"/>
    <circle cx="10" cy="46" r="3" fill="#FF7043"/>
    {/* Wheels */}
    <circle cx="28" cy="62" r="10" fill="#333"/>
    <circle cx="28" cy="62" r="5" fill="#777"/>
    <circle cx="92" cy="62" r="10" fill="#333"/>
    <circle cx="92" cy="62" r="5" fill="#777"/>
    {/* Shadow */}
    <ellipse cx="60" cy="74" rx="52" ry="5" fill="rgba(0,0,0,.12)"/>
  </svg>
}

function TShirt({color='#E53935',size=120}){
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Shirt body */}
    <path d="M25 28 L15 38 L25 48 L30 42 L30 82 Q50 88 70 82 L70 42 L75 48 L85 38 L75 28 L65 18 Q50 12 35 18 Z" fill={color}/>
    {/* Collar */}
    <path d="M38 20 Q50 28 62 20" fill="none" stroke="rgba(0,0,0,.15)" strokeWidth="2.5"/>
    {/* Sleeves fold */}
    <path d="M30 42 L25 48" stroke="rgba(0,0,0,.1)" strokeWidth="1.5"/>
    <path d="M70 42 L75 48" stroke="rgba(0,0,0,.1)" strokeWidth="1.5"/>
    {/* Fabric highlight */}
    <path d="M40 30 Q50 40 45 60" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3"/>
  </svg>
}

// Map: object keyword + color → component
const OBJ_MAP={
  'coche':(c,s)=><Car color={c} size={s}/>,
  'moto':(c,s)=><Motorcycle color={c} size={s}/>,
  'bici':(c,s)=><Bicycle color={c} size={s}/>,
  'autobús':(c,s)=><Bus color={c} size={s}/>,
  'autobus':(c,s)=><Bus color={c} size={s}/>,
  'camiseta':(c,s)=><TShirt color={c} size={s}/>,
}

const COLOR_MAP={
  'rojo':COLORS.rojo,'roja':COLORS.roja,'rojas':COLORS.roja,'rojos':COLORS.rojo,
  'azul':COLORS.azul,'azules':COLORS.azul,
  'verde':COLORS.verde,'verdes':COLORS.verde,
  'amarillo':COLORS.amarillo,'amarilla':COLORS.amarillo,'amarillos':COLORS.amarillo,'amarillas':COLORS.amarillo,
  'naranja':COLORS.naranja,'naranjas':COLORS.naranja,
  'rosa':COLORS.rosa,'rosas':COLORS.rosa,
  'morado':COLORS.morado,'morada':COLORS.morado,'morados':COLORS.morado,'moradas':COLORS.morado,
  'negro':COLORS.negro,'negra':COLORS.negro,'negros':COLORS.negro,'negras':COLORS.negro,
  'blanco':COLORS.blanco,'blanca':COLORS.blanco,'blancos':COLORS.blanco,'blancas':COLORS.blanco,
}

/**
 * Given a phrase, returns a colored SVG if it contains a known object + color.
 * Returns null if no match → caller should fall back to emoji.
 */
export function getColoredObject(phrase, size=120){
  if(!phrase)return null
  const lower=phrase.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  let foundObj=null, foundColor=null
  for(const key of Object.keys(OBJ_MAP)){
    const nk=key.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    if(lower.includes(nk)){foundObj=key;break}
  }
  if(!foundObj)return null
  const words=phrase.toLowerCase().split(/\s+/)
  for(const w of words){
    const nw=w.replace(/[^a-záéíóúñü]/g,'')
    if(COLOR_MAP[nw]){foundColor=COLOR_MAP[nw];break}
  }
  if(!foundColor)return null
  return OBJ_MAP[foundObj](foundColor,size)
}

export { Car, Motorcycle, Bicycle, Bus, TShirt, COLORS }
