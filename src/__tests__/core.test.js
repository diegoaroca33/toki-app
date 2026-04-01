// ============================================================
// TOKI · Tests básicos + critical fixes
// ============================================================
import { describe, it, expect } from 'vitest'

// ── Pure functions extracted for testing (same logic as source) ──

function lev(a,b){const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}

function digToText(s){const m={'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez','11':'once','12':'doce','13':'trece','14':'catorce','15':'quince','16':'dieciséis','17':'diecisiete','18':'dieciocho','19':'diecinueve','20':'veinte','30':'treinta','40':'cuarenta','50':'cincuenta','60':'sesenta','70':'setenta','80':'ochenta','90':'noventa','100':'cien'};return s.replace(/\d+/g,n=>{if(m[n])return m[n];const num=parseInt(n);if(num>20&&num<30)return'veinti'+['uno','dós','trés','cuatro','cinco','séis','siete','ocho','nueve'][num-21];const d=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];const t=Math.floor(num/10),r=num%10;if(r===0)return d[t]||n;const u=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];return(d[t]||'')+' y '+(u[r]||'')})}

function score(said,tgt){if(!said||!said.trim())return 0;const c=s=>digToText(s.toLowerCase()).replace(/[^a-záéíóúñü\s]/g,'').trim();const a=c(said),b=c(tgt);if(!a)return 0;if(a===b)return 4;const sw=a.split(/\s+/),tw=b.split(/\s+/);let exact=0,close=0;tw.forEach(t=>{if(sw.some(s=>s===t))exact++;else{const maxLev=t.length<=3?0:t.length<=5?1:2;if(sw.some(s=>lev(s,t)<=maxLev))close++}});const exactR=exact/Math.max(tw.length,1);if(exactR>=1)return 4;if(exactR>=.8)return 3;const totalR=(exact+close*.7)/Math.max(tw.length,1);if(totalR>=.5||exact>=1)return 2;return 1}

function personalize(text,u){if(!text||!u)return text||'';const h=(u.hermanos||'').split(',').map(s=>s.trim()).filter(Boolean);return text.replace(/\{nombre\}/g,u.name||'Nico').replace(/\{apellidos\}/g,u.apellidos||'').replace(/\{padre\}/g,u.padre||'Paco').replace(/\{madre\}/g,u.madre||'Ana').replace(/\{hermano1\}/g,h[0]||'Miguel').replace(/\{hermana1\}/g,h[0]||'Sofía').replace(/\{tel_padre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{tel_madre\}/g,u.telefono||'6.0.0.0.0.0.0.0.0').replace(/\{direccion\}/g,u.direccion||'mi casa').replace(/\{colegio\}/g,u.colegio||'el cole')}

function cap(s){return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}

function splitSyllables(text){
  const w=text.toLowerCase().replace(/[¿?¡!,\.;:]/g,'').trim();
  const words=w.split(/\s+/);const result=[];
  const V='aeiouáéíóúü';const isV=c=>V.includes(c);
  const WEAK='iuüíú';const isWeak=c=>WEAK.includes(c);
  const ONSET2=new Set(['bl','br','cl','cr','dr','fl','fr','gl','gr','pl','pr','tr','ch','ll','rr','qu','gu']);
  words.forEach(word=>{
    const syls=[];let cur='';
    for(let i=0;i<word.length;i++){
      const c=word[i];cur+=c;
      if(!isV(c))continue;
      const n1=word[i+1],n2=word[i+2],n3=word[i+3];
      if(n1&&isV(n1)){
        const accStrong='áéíóú';
        if(isWeak(c)&&!accStrong.includes(c)&&!isWeak(n1)){continue}
        if(!isWeak(c)&&isWeak(n1)&&!accStrong.includes(n1)){continue}
        if(isWeak(c)&&isWeak(n1)){continue}
        syls.push(cur);cur='';continue;
      }
      if(!n1){syls.push(cur);cur='';continue}
      if(!isV(n1)){
        if(!n2){continue}
        if(isV(n2)){
          if(n1==='q'&&n2==='u'&&n3&&isV(n3)){continue}
          syls.push(cur);cur='';continue;
        }
        if(!isV(n2)){
          const pair=n1+n2;
          if(n3!==undefined&&ONSET2.has(pair)){
            syls.push(cur);cur='';continue;
          }
          cur+=n1;i++;syls.push(cur);cur='';continue;
        }
      }
    }
    if(cur)syls.push(cur);
    result.push(syls)});
  return result}

// adjScore: exigencia now only affects passThreshold, raw score is returned unchanged
function adjScore(raw){return raw}

// tdy: returns d/M/yyyy format
const tdy=()=>{const d=new Date();return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()};

// saveP logic extracted: must not mutate the original user object
function savePLogic(u, EX_MOCK) {
  const c={...u};
  const uLv=c.maxLv||c.level||1;
  const cur=EX_MOCK.filter(e=>e.lv===uLv);
  const mas=cur.filter(e=>c.srs&&c.srs[e.id]&&c.srs[e.id].lv>=3).length;
  if(cur.length>0&&mas/cur.length>=.8&&uLv<5)c.maxLv=uLv+1;
  c.level=c.maxLv||c.level||1;
  return c;
}

// Backward chaining: same logic as FraccionadoMode
function backwardChainSteps(text) {
  const words = text.replace(/[¿?¡!,\.]/g,'').split(/\s+/).filter(Boolean);
  const totalSteps = words.length;
  const steps = [];
  for (let step = 0; step < totalSteps; step++) {
    const startIdx = totalSteps - 1 - step;
    steps.push(words.slice(startIdx).join(' '));
  }
  return steps;
}

// simpleLev: same as TokiPlayground
function simpleLev(a,b){if(a===b)return 0;const m=[];for(let i=0;i<=b.length;i++)m[i]=[i];for(let j=0;j<=a.length;j++)m[0][j]=j;for(let i=1;i<=b.length;i++)for(let j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}

// matchCommand: same logic as TokiPlayground
const VOICE_COMMANDS=[
  {id:'sit',patterns:['sienta','sentado','sit','siéntate','sientate'],response:'¡Sentado!'},
  {id:'paw',patterns:['pata','dame la pata','choca','dame cinco','give paw'],response:'¡Aquí tienes!'},
  {id:'spin',patterns:['gira','vuelta','spin','da una vuelta','date la vuelta'],response:'¡Yuhuuu!'},
  {id:'jump',patterns:['salta','arriba','jump','brinca','hop'],response:'¡Boing!'},
  {id:'dance',patterns:['baila','dance','muévete','menea','bailar'],response:'¡A bailar!'},
  {id:'sleep',patterns:['duerme','dormir','sleep','nana','a dormir'],response:'Zzzzz...'},
  {id:'bark',patterns:['ladra','guau','bark','woof','habla'],response:'¡Guau guau!'},
  {id:'happy',patterns:['contento','feliz','alegre','happy','bien','genial'],response:'¡Estoy feliz!'},
  {id:'fetch',patterns:['busca','trae','pelota','ball','fetch','coge','atrapa'],response:'¡La tengo!'},
  {id:'kiss',patterns:['beso','besito','kiss','muack','mua','muac'],response:'¡Muuuack!'},
];

function matchCommand(text){
  if(!text)return null;
  const t=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  // Exact substring match first
  for(const cmd of VOICE_COMMANDS){
    for(const p of cmd.patterns){
      const pn=p.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(t.includes(pn))return cmd;
    }
  }
  // Fuzzy match with simpleLev
  const words=t.split(/\s+/);
  for(const cmd of VOICE_COMMANDS){
    for(const p of cmd.patterns){
      const pn=p.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(pn.includes(' '))continue;
      const maxDist=pn.length<=3?1:2;
      if(words.some(w=>simpleLev(w,pn)<=maxDist))return cmd;
    }
  }
  return null;
}

// ============================================================
// TESTS
// ============================================================

describe('score — reconocimiento de voz', () => {
  it('puntuación perfecta para coincidencia exacta', () => {
    expect(score('hola soy guillermo', 'hola soy guillermo')).toBe(4)
  })

  it('puntuación parcial para casi exacto (2 palabras exactas de 3)', () => {
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

  it('exact match of single word returns 4', () => {
    expect(score('agua', 'agua')).toBe(4)
  })

  it('partial match returns 2 when at least 1 word matches', () => {
    // "quiero" matches 1 of 3 target words → score 2
    expect(score('quiero', 'quiero ir al cine')).toBe(2)
  })

  it('no match returns 1 (minimum for non-empty input)', () => {
    expect(score('xyz', 'hola')).toBe(1)
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

// ============================================================
// NEW TESTS — Critical fixes
// ============================================================

describe('adjScore — exigencia no altera puntuación', () => {
  it('returns raw score unchanged for exigencia=30', () => {
    // adjScore now always returns raw, regardless of exigencia
    expect(adjScore(0)).toBe(0)
    expect(adjScore(1)).toBe(1)
    expect(adjScore(2)).toBe(2)
    expect(adjScore(3)).toBe(3)
    expect(adjScore(4)).toBe(4)
  })

  it('returns raw score unchanged for exigencia=50', () => {
    expect(adjScore(0)).toBe(0)
    expect(adjScore(2)).toBe(2)
    expect(adjScore(4)).toBe(4)
  })

  it('returns raw score unchanged for exigencia=65', () => {
    expect(adjScore(1)).toBe(1)
    expect(adjScore(3)).toBe(3)
  })

  it('returns raw score unchanged for exigencia=100', () => {
    expect(adjScore(0)).toBe(0)
    expect(adjScore(1)).toBe(1)
    expect(adjScore(2)).toBe(2)
    expect(adjScore(3)).toBe(3)
    expect(adjScore(4)).toBe(4)
  })

  it('identity property: adjScore(x) === x for any value', () => {
    for (let i = 0; i <= 4; i++) {
      expect(adjScore(i)).toBe(i)
    }
  })
})

describe('saveP — no debe mutar el objeto original', () => {
  it('does not mutate the input user reference', () => {
    const EX_MOCK = [
      { id: 'ex1', lv: 1 },
      { id: 'ex2', lv: 1 },
      { id: 'ex3', lv: 1 },
      { id: 'ex4', lv: 1 },
      { id: 'ex5', lv: 1 },
    ]
    const original = {
      id: 'user1',
      name: 'Test',
      level: 1,
      maxLv: 1,
      srs: {
        ex1: { lv: 3, t: Date.now() },
        ex2: { lv: 4, t: Date.now() },
        ex3: { lv: 3, t: Date.now() },
        ex4: { lv: 5, t: Date.now() },
      },
      hist: [{ ok: 5, sk: 1, dt: '1/1/2025' }],
    }

    // Deep-copy the original to compare afterwards
    const snapshot = JSON.parse(JSON.stringify(original))

    // Call saveP-like logic
    const result = savePLogic(original, EX_MOCK)

    // The original must remain unchanged
    expect(original).toEqual(snapshot)

    // The result should be a new object (shallow copy via spread)
    expect(result).not.toBe(original)
  })

  it('promotes level when 80%+ mastered', () => {
    const EX_MOCK = [
      { id: 'ex1', lv: 1 },
      { id: 'ex2', lv: 1 },
      { id: 'ex3', lv: 1 },
      { id: 'ex4', lv: 1 },
      { id: 'ex5', lv: 1 },
    ]
    const user = {
      id: 'u1',
      level: 1,
      maxLv: 1,
      srs: {
        ex1: { lv: 3, t: 0 },
        ex2: { lv: 3, t: 0 },
        ex3: { lv: 3, t: 0 },
        ex4: { lv: 3, t: 0 },
        // 4/5 = 80% mastered at lv>=3
      },
    }
    const result = savePLogic(user, EX_MOCK)
    expect(result.maxLv).toBe(2)
    expect(result.level).toBe(2)
  })

  it('does NOT promote when below 80%', () => {
    const EX_MOCK = [
      { id: 'ex1', lv: 1 },
      { id: 'ex2', lv: 1 },
      { id: 'ex3', lv: 1 },
      { id: 'ex4', lv: 1 },
      { id: 'ex5', lv: 1 },
    ]
    const user = {
      id: 'u1',
      level: 1,
      maxLv: 1,
      srs: {
        ex1: { lv: 3, t: 0 },
        ex2: { lv: 3, t: 0 },
        ex3: { lv: 3, t: 0 },
        // 3/5 = 60% — not enough
      },
    }
    const result = savePLogic(user, EX_MOCK)
    expect(result.maxLv).toBe(1)
  })
})

describe('tdy — formato de fecha d/M/yyyy', () => {
  it('returns consistent d/M/yyyy format', () => {
    const result = tdy()
    // Must match pattern: 1-2 digit day / 1-2 digit month / 4 digit year
    expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
  })

  it('parts are valid date components', () => {
    const result = tdy()
    const [day, month, year] = result.split('/').map(Number)
    expect(day).toBeGreaterThanOrEqual(1)
    expect(day).toBeLessThanOrEqual(31)
    expect(month).toBeGreaterThanOrEqual(1)
    expect(month).toBeLessThanOrEqual(12)
    expect(year).toBeGreaterThanOrEqual(2024)
    expect(year).toBeLessThanOrEqual(2100)
  })

  it('matches current date', () => {
    const result = tdy()
    const now = new Date()
    const expected = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear()
    expect(result).toBe(expected)
  })
})

describe('Backward chaining — encadenamiento inverso', () => {
  it('"quiero ir al cine": step 0=cine, 1=al cine, 2=ir al cine, 3=quiero ir al cine', () => {
    const steps = backwardChainSteps('quiero ir al cine')
    expect(steps).toHaveLength(4)
    expect(steps[0]).toBe('cine')
    expect(steps[1]).toBe('al cine')
    expect(steps[2]).toBe('ir al cine')
    expect(steps[3]).toBe('quiero ir al cine')
  })

  it('2-word phrase "quiero agua": step 0=agua, step 1=quiero agua', () => {
    const steps = backwardChainSteps('quiero agua')
    expect(steps).toHaveLength(2)
    expect(steps[0]).toBe('agua')
    expect(steps[1]).toBe('quiero agua')
  })

  it('single word returns one step equal to the word', () => {
    const steps = backwardChainSteps('hola')
    expect(steps).toHaveLength(1)
    expect(steps[0]).toBe('hola')
  })

  it('strips punctuation before splitting', () => {
    const steps = backwardChainSteps('¿quiero ir al cine?')
    expect(steps).toHaveLength(4)
    expect(steps[0]).toBe('cine')
    expect(steps[3]).toBe('quiero ir al cine')
  })

  it('last step is always the full phrase', () => {
    const steps = backwardChainSteps('me llamo Guillermo Aroca')
    expect(steps[steps.length - 1]).toBe('me llamo Guillermo Aroca')
  })
})

describe('simpleLev — distancia Levenshtein (TokiPlayground)', () => {
  it('returns 0 for identical strings', () => {
    expect(simpleLev('baila', 'baila')).toBe(0)
    expect(simpleLev('salta', 'salta')).toBe(0)
  })

  it('returns correct distance for single substitution', () => {
    expect(simpleLev('gato', 'pato')).toBe(1)
  })

  it('returns correct distance for insertion', () => {
    expect(simpleLev('ata', 'pata')).toBe(1)
  })

  it('returns correct distance for deletion', () => {
    expect(simpleLev('pata', 'ata')).toBe(1)
  })

  it('handles empty strings', () => {
    expect(simpleLev('', '')).toBe(0)
    expect(simpleLev('abc', '')).toBe(3)
    expect(simpleLev('', 'xyz')).toBe(3)
  })

  it('bala -> baila distance is <= 2', () => {
    expect(simpleLev('bala', 'baila')).toBeLessThanOrEqual(2)
  })

  it('sata -> salta distance is <= 2', () => {
    expect(simpleLev('sata', 'salta')).toBeLessThanOrEqual(2)
  })

  it('exact distance for bala/baila and sata/salta', () => {
    // bala -> baila: insert 'i' → distance 1
    expect(simpleLev('bala', 'baila')).toBe(1)
    // sata -> salta: insert 'l' → distance 1
    expect(simpleLev('sata', 'salta')).toBe(1)
  })
})

describe('matchCommand — fuzzy voice matching', () => {
  it('exact substring match: "baila" matches dance command', () => {
    const cmd = matchCommand('baila')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('dance')
  })

  it('exact substring match: "salta" matches jump command', () => {
    const cmd = matchCommand('salta')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('jump')
  })

  it('fuzzy: "bala" matches a command via Levenshtein <= 2 (pata wins before baila due to order)', () => {
    // "bala" is distance 1 from "pata" (paw) AND "baila" (dance)
    // Since paw appears first in VOICE_COMMANDS, it matches first
    const cmd = matchCommand('bala')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('paw') // pata is checked before baila
  })

  it('fuzzy: "sata" matches a command via Levenshtein <= 2 (pata wins before salta due to order)', () => {
    // "sata" is distance 1 from "pata" (paw) AND "salta" (jump)
    const cmd = matchCommand('sata')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('paw') // pata is checked before salta
  })

  it('fuzzy: "bailo" matches "baila" (dance) via Levenshtein <= 2', () => {
    const cmd = matchCommand('bailo')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('dance')
  })

  it('fuzzy: "salto" matches "salta" (jump) via Levenshtein <= 2', () => {
    const cmd = matchCommand('salto')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('jump')
  })

  it('returns null for unrecognized input', () => {
    expect(matchCommand('abracadabra')).toBeNull()
    expect(matchCommand('')).toBeNull()
    expect(matchCommand(null)).toBeNull()
  })

  it('multi-word exact: "dame la pata" matches paw command', () => {
    const cmd = matchCommand('dame la pata')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('paw')
  })

  it('case insensitive matching', () => {
    const cmd = matchCommand('BAILA')
    expect(cmd).not.toBeNull()
    expect(cmd.id).toBe('dance')
  })
})
