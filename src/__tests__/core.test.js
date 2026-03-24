// ============================================================
// TOKI · Tests básicos
// ============================================================
import { describe, it, expect } from 'vitest'

// Pure functions extracted for testing (same logic as App.jsx)
function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}

function digToText(s){const m={'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez','11':'once','12':'doce','13':'trece','14':'catorce','15':'quince','16':'dieciséis','17':'diecisiete','18':'dieciocho','19':'diecinueve','20':'veinte','30':'treinta','40':'cuarenta','50':'cincuenta','60':'sesenta','70':'setenta','80':'ochenta','90':'noventa','100':'cien'};return s.replace(/\d+/g,n=>{if(m[n])return m[n];const num=parseInt(n);if(num>20&&num<30)return'veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][num-21];const d=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];const t=Math.floor(num/10),r=num%10;if(r===0)return d[t]||n;const u=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];return(d[t]||'')+' y '+(u[r]||'')})}

function score(said,tgt){if(!said||!said.trim())return 0;const c=s=>digToText(s.toLowerCase()).replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(!a)return 0;if(a===b)return 4;const sw=a.split(/\s+/),tw=b.split(/\s+/);let exact=0,close=0;tw.forEach(t=>{if(sw.some(s=>s===t))exact++;else{const maxLev=t.length<=3?0:t.length<=5?1:2;if(sw.some(s=>lev(s,t)<=maxLev))close++}});const exactR=exact/Math.max(tw.length,1);if(exactR>=1)return 4;if(exactR>=.8)return 3;const totalR=(exact+close*.7)/Math.max(tw.length,1);if(totalR>=.5||exact>=1)return 2;return 1}

function personalize(text,u){if(!text||!u)return text||'';const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);return text.replace(/\{nombre\}/g,u.name||'Nico').replace(/\{apellidos\}/g,u.apellidos||'').replace(/\{padre\}/g,u.padre||'Paco').replace(/\{madre\}/g,u.madre||'Ana').replace(/\{hermano1\}/g,h[0]||'Miguel').replace(/\{hermana1\}/g,h[0]||'Sofía').replace(/\{tel_padre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{tel_madre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{direccion\}/g,u.direccion||'mi casa').replace(/\{colegio\}/g,u.colegio||'el cole')}

function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}

function splitSyllables(text){const w=text.toLowerCase().replace(/[¿?¡!,\.;:]/g,'').trim();const words=w.split(/\s+/);const result=[];const vowels='aeiouáéíóúü';words.forEach(word=>{const syls=[];let cur='';for(let i=0;i<word.length;i++){const c=word[i];const isV=vowels.includes(c);cur+=c;if(isV){const next=word[i+1],next2=word[i+2];if(i===word.length-1){syls.push(cur);cur=''}else if(next&&!vowels.includes(next)){if(next2&&!vowels.includes(next2)){if('lrLR'.includes(next2)){syls.push(cur);cur=''}else{cur+=next;syls.push(cur);cur='';i++}}else{if(next2&&vowels.includes(next2)){syls.push(cur);cur=''}else if(!next2){}else{syls.push(cur);cur=''}}}else if(next&&vowels.includes(next)){syls.push(cur);cur=''}}}if(cur)syls.push(cur);result.push(syls)});return result}

// ============================================================
// TESTS
// ============================================================

describe('score — reconocimiento de voz', () => {
  it('puntuación perfecta para coincidencia exacta', () => {
    expect(score('hola soy guillermo', 'hola soy guillermo')).toBe(4)
  })

  it('puntuación parcial para casi exacto (2 palabras exactas de 3)', () => {
    // "hola soy guilermo" vs "hola soy guillermo": 2/3 exact words = score 2-3
    expect(score('hola soy guilermo', 'hola soy guillermo')).toBeGreaterThanOrEqual(2)
  })

  it('puntuación 0 para texto vacío', () => {
    expect(score('', 'hola')).toBe(0)
    expect(score(null, 'hola')).toBe(0)
    expect(score('   ', 'hola')).toBe(0)
  })

  it('puntuación baja para texto completamente diferente', () => {
    expect(score('mesa silla puerta', 'hola soy guillermo')).toBeLessThanOrEqual(1)
  })

  it('puntuación media para coincidencia parcial', () => {
    expect(score('hola', 'hola soy guillermo')).toBeGreaterThanOrEqual(1)
  })

  it('maneja números como texto', () => {
    expect(score('diez', '10')).toBe(4)
    expect(score('veinte', '20')).toBe(4)
  })
})

describe('personalize — personalización de frases', () => {
  it('reemplaza nombre', () => {
    expect(personalize('{nombre} es genial', {name:'Guillermo'})).toBe('Guillermo es genial')
  })

  it('reemplaza múltiples variables', () => {
    const u = {name:'Nico', padre:'Pablo', madre:'Laura', direccion:'Murcia', colegio:'San José'}
    expect(personalize('{nombre} vive en {direccion}', u)).toBe('Nico vive en Murcia')
    expect(personalize('Mi padre es {padre} y mi madre es {madre}', u)).toBe('Mi padre es Pablo y mi madre es Laura')
  })

  it('usa valores por defecto cuando faltan datos', () => {
    expect(personalize('{nombre} vive en {direccion}', {})).toBe('Nico vive en mi casa')
  })

  it('maneja texto sin variables', () => {
    expect(personalize('Hola mundo', {name:'Test'})).toBe('Hola mundo')
  })

  it('maneja texto null/undefined', () => {
    expect(personalize(null, {name:'Test'})).toBe('')
    expect(personalize(undefined, {name:'Test'})).toBe('')
  })
})

describe('cap — capitalizar', () => {
  it('capitaliza primera letra', () => {
    expect(cap('guillermo')).toBe('Guillermo')
    expect(cap('DIEGO')).toBe('Diego')
    expect(cap('a')).toBe('A')
  })
})

describe('splitSyllables — separar sílabas', () => {
  it('separa palabras simples', () => {
    const result = splitSyllables('casa')
    expect(result).toEqual([['ca','sa']])
  })

  it('separa múltiples palabras', () => {
    const result = splitSyllables('hola mundo')
    expect(result.length).toBe(2)
    expect(result[0]).toEqual(['ho','la'])
    expect(result[1]).toEqual(['mun','do'])
  })

  it('maneja una sola sílaba', () => {
    const result = splitSyllables('sol')
    expect(result).toEqual([['sol']])
  })
})

describe('lev — distancia Levenshtein', () => {
  it('distancia 0 para textos iguales', () => {
    expect(lev('hola', 'hola')).toBe(0)
  })

  it('distancia 1 para un cambio', () => {
    expect(lev('hola', 'hora')).toBe(1)
    expect(lev('gato', 'pato')).toBe(1)
  })

  it('distancia correcta para textos diferentes', () => {
    expect(lev('', 'abc')).toBe(3)
    expect(lev('abc', '')).toBe(3)
  })
})

describe('digToText — números a texto', () => {
  it('convierte números básicos', () => {
    expect(digToText('1')).toBe('uno')
    expect(digToText('10')).toBe('diez')
    expect(digToText('20')).toBe('veinte')
  })

  it('convierte números compuestos', () => {
    expect(digToText('21')).toBe('veintiuno')
    expect(digToText('35')).toBe('treinta y cinco')
  })

  it('mantiene texto sin números', () => {
    expect(digToText('hola')).toBe('hola')
  })
})
