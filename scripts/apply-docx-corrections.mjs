// Aplica correcciones y frases nuevas de corrections.json a src/exercises.js.
//   - Filtra correcciones sin cambio real (original === correction)
//   - Reemplaza el texto exacto en exercises.js preservando el resto del objeto
//   - Si el mismo texto aparece en varios sitios, usa el ID para localizarlo
//   - Para frases nuevas: crea áreas si faltan y añade objetos {ty:'flu'}
//
// Uso: node scripts/apply-docx-corrections.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
const EX_PATH = path.join(ROOT, 'src/exercises.js');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'corrections.json'), 'utf8'));

let src = fs.readFileSync(EX_PATH, 'utf8');

// Backup
const bakPath = EX_PATH + '.bak';
if (!fs.existsSync(bakPath)) fs.writeFileSync(bakPath, src, 'utf8');

// ── 1) Correcciones ──
const corrections = DATA.corrections.filter(c => c.original && c.correction && c.original !== c.correction);
console.log(`Correcciones a aplicar: ${corrections.length} (de ${DATA.corrections.length} totales; descartadas ${DATA.corrections.length - corrections.length} sin cambio)`);

// Extraer id del original_cell para cada corrección (viene como "id [type lvN] · Label...")
corrections.forEach(c => {
  const m = /^([a-zA-Z0-9_]+)\s*\[/.exec(c.original_cell);
  c.id = m ? m[1] : null;
  // El field puede ser op[N] → operamos distinto
  const fm = /·\s*(op\[\d+\]|\w+)/.exec(c.original_cell);
  c.field = fm ? fm[1] : null;
});

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

let applied = 0, failed = 0;
for (const c of corrections) {
  // Localizar el objeto por id primero
  const idMatch = new RegExp(`(\\{id:'${esc(c.id)}'[^}]*\\})`).exec(src);
  if (!idMatch) {
    console.warn(`  ✗ No encontrado id=${c.id}`);
    failed++;
    continue;
  }
  const block = idMatch[1];
  const blockStart = idMatch.index;
  const blockEnd = blockStart + block.length;

  let newBlock = block;
  const origQ = `'${c.original.replace(/'/g, "\\'")}'`;
  const newQ  = `'${c.correction.replace(/'/g, "\\'")}'`;

  if (block.includes(origQ)) {
    newBlock = block.replace(origQ, newQ);
  } else {
    // Fallback: buscar el original como string literal dentro del bloque ignorando escapes
    // (p.ej. si el texto tiene apóstrofo, el literal en source está escapado como \')
    const altOrig = `'${c.original.replace(/'/g, "\\\\'")}'`;
    if (block.includes(altOrig)) newBlock = block.replace(altOrig, newQ);
    else {
      console.warn(`  ✗ No match texto en ${c.id}: "${c.original}"`);
      failed++;
      continue;
    }
  }
  src = src.slice(0, blockStart) + newBlock + src.slice(blockEnd);
  applied++;
  console.log(`  ✓ ${c.id}${c.field ? ' ('+c.field+')' : ''}: "${c.original}" → "${c.correction}"`);
}

// ── 2) Frases nuevas ──
const newT = DATA.newPhrases?.[0];
const newRows = newT?.rows || [];
console.log(`\nFrases nuevas: ${newRows.length}`);

const CATS = {
  'AUTONOMÍA':   { id:'autonomia',   n:'💪 Autonomía',    prefix:'au' },
  'CONFLICTO':   { id:'conflicto',   n:'⚖️ Conflicto',   prefix:'cf' },
  'IDENTIDAD':   { id:'identidad',   n:'✨ Identidad',    prefix:'id' },
  'SOCIAL':      { id:'social',      n:'👥 Social',       prefix:'so' },
  'PROFESIONES': { id:'profesiones', n:'🧑‍⚕️ Profesiones', prefix:'pf' },
  'CUERPO':      { id:'cuerpo',      n:'🫀 Cuerpo',       prefix:'cu' },
  'TIEMPO':      { id:'tiempo',      n:'☀️ Tiempo',       prefix:'ti' },
  'BARRIO':      { id:'barrio',      n:'🏘️ Barrio',       prefix:'ba' },
  'SEGURIDAD':   { id:'seguridad',   n:null,              prefix:'se' }, // ya existe
};

function pickEmoji(cat, phrase) {
  const p = phrase.toLowerCase();
  // Palabras clave primero
  if (/baño|bañador/.test(p)) return '🚽';
  if (/paraguas|llueve|llover/.test(p)) return '☔';
  if (/sol\b|calor/.test(p)) return '☀️';
  if (/invierno|abrigo|bufanda/.test(p)) return '🧥';
  if (/piscina|toalla/.test(p)) return '🏊';
  if (/médico|enferm/.test(p)) return '🏥';
  if (/profesora|colegio|enseña/.test(p)) return '👩‍🏫';
  if (/bombero|incendi/.test(p)) return '🚒';
  if (/policía/.test(p)) return '🚓';
  if (/autobús|conductor|parada/.test(p)) return '🚌';
  if (/farmacia/.test(p)) return '💊';
  if (/supermercado/.test(p)) return '🛒';
  if (/parque/.test(p)) return '🌳';
  if (/centro de salud/.test(p)) return '🏥';
  if (/cabeza|duele/.test(p)) return '🤕';
  if (/barriga|estómago/.test(p)) return '🫃';
  if (/rodilla|daño/.test(p)) return '🦵';
  if (/pañuelo|moco/.test(p)) return '🤧';
  if (/lava.*manos|manos/.test(p)) return '🧼';
  if (/dientes|cepillo/.test(p)) return '🦷';
  if (/contraseña|clave/.test(p)) return '🔒';
  if (/teléfono|mensaje/.test(p)) return '📱';
  if (/firmar|consult/.test(p)) return '✍️';
  if (/broma|risa|gracioso/.test(p)) return '😄';
  if (/color/.test(p)) return '🎨';
  if (/dolido|molest|enfad/.test(p)) return '😔';
  if (/solo\b|manera|encarg/.test(p)) return '💪';
  // Default por categoría
  return {
    'AUTONOMÍA':'💪','CONFLICTO':'⚖️','IDENTIDAD':'✨','SOCIAL':'👥',
    'PROFESIONES':'🧑‍💼','CUERPO':'🫀','TIEMPO':'🌤️','BARRIO':'🏘️','SEGURIDAD':'🛡️'
  }[cat] || '⭐';
}

// Encontrar el mayor número por prefijo existente en el código para continuar
function findNextSerial(prefix) {
  const re = new RegExp(`\\bid:'${prefix}(\\d+)'`, 'g');
  let max = 0, m;
  while ((m = re.exec(src))) max = Math.max(max, parseInt(m[1], 10));
  return max + 1;
}

// Agregar nuevas áreas a AREAS si faltan
const missingAreas = [];
for (const key of Object.keys(CATS)) {
  const cat = CATS[key];
  if (!cat.n) continue; // ya existente
  const re = new RegExp(`\\{\\s*id:'${cat.id}'`);
  if (!re.test(src)) missingAreas.push(cat);
}
if (missingAreas.length) {
  // Insertar antes del cierre del array AREAS (`];`)
  const areasEndRe = /(\];\s*\n\s*export const EX)/;
  const m = areasEndRe.exec(src);
  if (m) {
    const insert = missingAreas.map(c => `  { id:'${c.id}', n:'${c.n}' },`).join('\n') + '\n';
    src = src.slice(0, m.index) + insert + src.slice(m.index);
    console.log(`  ✓ Añadidas ${missingAreas.length} áreas: ${missingAreas.map(c=>c.id).join(', ')}`);
  }
}

// Generar bloque de nuevas frases, agrupado por prefijo con IDs consecutivos
const groups = {};
newRows.forEach(row => {
  const cm = /^([A-ZÑÁÉÍÓÚ]+)\s*\[lv(\d+)\]/.exec(row[0] || '');
  if (!cm) return;
  const catKey = cm[1];
  const lv = parseInt(cm[2], 10);
  const phrase = row[1]?.trim();
  if (!phrase) return;
  const cat = CATS[catKey];
  if (!cat) return;
  (groups[cat.prefix] ||= { cat, items: [] }).items.push({ lv, phrase });
});

// Serializar cada grupo con IDs consecutivos, insertar al final del array EX
const newEntries = [];
for (const pfx of Object.keys(groups)) {
  const { cat, items } = groups[pfx];
  let n = findNextSerial(pfx);
  items.forEach(it => {
    const id = pfx + String(n).padStart(4, '0');
    const em = pickEmoji(Object.keys(CATS).find(k => CATS[k].id === cat.id), it.phrase);
    newEntries.push(`{id:'${id}',a:'${cat.id}',ty:'flu',lv:${it.lv},ph:'${it.phrase.replace(/'/g, "\\'")}',em:'${em}'},`);
    n++;
  });
}
console.log(`  ✓ Generadas ${newEntries.length} entradas nuevas`);

// Insertarlas justo antes del cierre del array EX (`];`)
const exCloseRe = /\n\];(\s*)$/;
if (exCloseRe.test(src)) {
  src = src.replace(exCloseRe, '\n// ── Añadidas por revisión del supervisor ──\n' + newEntries.join('\n') + '\n];$1');
} else {
  console.warn('  ⚠️ No encontré cierre de EX — revisa exercises.js');
}

fs.writeFileSync(EX_PATH, src, 'utf8');
console.log(`\nAplicadas: ${applied} correcciones · ${newEntries.length} frases nuevas`);
console.log(`Fallidas: ${failed}`);
console.log(`Backup: ${path.relative(ROOT, bakPath)}`);
