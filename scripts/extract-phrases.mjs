// Extrae TODAS las frases que Toki puede decir al niño y las escribe a un
// archivo Markdown editable. Después Diego revisa y marca errores de acentos
// o mayúsculas; luego aplicamos los fixes directamente al fichero fuente.
//
// Fuentes cubiertas:
//   - src/exercises.js  → ejercicios (ph, fu, su, si, q, op, blank)
//   - src/modules/ExLee.jsx  → lectura
//   - src/modules/ExRazona.jsx  → razonamiento, emociones, etc.
//   - src/modules/ExQuienSoy.jsx  → presentación SD
//   - src/modules/ExWriting.jsx  → palabras y frases de escritura
//   - src/cloud.js  → autobiografía generada
//   - src/constants.js  → mensajes de ánimo / feedback
//
// Uso: node scripts/extract-phrases.mjs
// Output: frases-para-revisar.md

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
const out = [];

function add(source, id, field, text) {
  if (!text || typeof text !== 'string') return;
  const t = text.trim();
  if (!t) return;
  out.push({ source, id, field, text: t });
}

// ── exercises.js ──────────────────────────────────────────────
function parseExercises() {
  const src = fs.readFileSync(path.join(ROOT, 'src/exercises.js'), 'utf8');
  // Las entradas son literales de objeto en un array. Usamos regex por cada objeto {...}.
  // Soporta campos que buscamos: id, ty, ph, fu, su, si, q, blank, text, op (array)
  const re = /\{\s*id:\s*'([^']+)'[^}]*\}/g;
  let m;
  while ((m = re.exec(src))) {
    const block = m[0];
    const id = m[1];
    const ty = /\bty:\s*'([^']+)'/.exec(block)?.[1] || '';
    const tag = (f) => {
      const r = new RegExp(`\\b${f}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 'm');
      const v = r.exec(block)?.[1];
      return v ? v.replace(/\\'/g, "'") : null;
    };
    add('exercises', `${id} [${ty}]`, 'ph', tag('ph'));
    add('exercises', `${id} [${ty}]`, 'fu', tag('fu'));
    add('exercises', `${id} [${ty}]`, 'su', tag('su'));
    add('exercises', `${id} [${ty}]`, 'si', tag('si'));
    add('exercises', `${id} [${ty}]`, 'q', tag('q'));
    add('exercises', `${id} [${ty}]`, 'blank', tag('blank'));
    add('exercises', `${id} [${ty}]`, 'text', tag('text'));
    // array op:
    const opRaw = /\bop:\s*\[([^\]]*)\]/s.exec(block)?.[1];
    if (opRaw) {
      const items = [...opRaw.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
      items.forEach((t, i) => add('exercises', `${id} [${ty}]`, `op[${i}]`, t));
    }
    // array words: (ExLee tendrá su propio parser más abajo; aquí por si alguno en exercises.js)
    const wordsRaw = /\bwords:\s*\[([^\]]*)\]/s.exec(block)?.[1];
    if (wordsRaw) {
      const items = [...wordsRaw.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
      add('exercises', `${id} [${ty}]`, 'words', items.join(' '));
    }
  }
}

// ── constants.js: mensajes de ánimo, cheers, perfect ─────────
function parseConstants() {
  const src = fs.readFileSync(path.join(ROOT, 'src/constants.js'), 'utf8');
  // Extraer arrays de strings por nombre: PERFECT_T, SHORT_OK, SHORT_FAIL, BUILD_OK, GOOD_MSG, CHEER_ALL, IDLE_TIPS
  const arrays = ['PERFECT_T', 'SHORT_OK', 'SHORT_FAIL', 'BUILD_OK', 'GOOD_MSG', 'CHEER_ALL'];
  for (const name of arrays) {
    const re = new RegExp(`export\\s+const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm');
    const m = re.exec(src);
    if (!m) continue;
    const items = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
    items.forEach((t, i) => add('constants', name, String(i), t));
  }
  // NUMS_1_100 si existiera
  const numsRe = /export\s+const\s+NUMS_1_100\s*=\s*\[([\s\S]*?)\]/m.exec(src);
  if (numsRe) {
    const items = [...numsRe[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1]);
    items.forEach((t, i) => add('constants', 'NUMS_1_100', String(i + 1), t));
  }
}

// ── ExLee.jsx: lectura (plantillas {sentence, full, ans, ...}) ─
function parseExLee() {
  const src = fs.readFileSync(path.join(ROOT, 'src/modules/ExLee.jsx'), 'utf8');
  // Capturar cualquier objeto que contenga "full:'...'" o "sentence:['...']"
  const fullRe = /\bfull:\s*'((?:[^'\\]|\\.)*)'/g;
  let m, i = 0;
  while ((m = fullRe.exec(src))) {
    add('ExLee', `full${i++}`, 'full', m[1].replace(/\\'/g, "'"));
  }
  const ansRe = /\bans:\s*'((?:[^'\\]|\\.)*)'/g;
  i = 0;
  while ((m = ansRe.exec(src))) {
    add('ExLee', `ans${i++}`, 'ans', m[1].replace(/\\'/g, "'"));
  }
}

// ── ExRazona.jsx ──────────────────────────────────────────────
function parseExRazona() {
  const src = fs.readFileSync(path.join(ROOT, 'src/modules/ExRazona.jsx'), 'utf8');
  // Campos text/prompt/question/answer dentro de objetos
  const keys = ['text', 'prompt', 'question', 'answer', 'title', 'label', 'q', 'a'];
  let i = 0;
  for (const key of keys) {
    const re = new RegExp(`\\b${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 'g');
    let m;
    while ((m = re.exec(src))) {
      add('ExRazona', `${key}${i++}`, key, m[1].replace(/\\'/g, "'"));
    }
  }
}

// ── ExQuienSoy.jsx ────────────────────────────────────────────
function parseExQuienSoy() {
  const src = fs.readFileSync(path.join(ROOT, 'src/modules/ExQuienSoy.jsx'), 'utf8');
  const re = /\btext:\s*'((?:[^'\\]|\\.)*)'/g;
  let m, i = 0;
  while ((m = re.exec(src))) {
    add('ExQuienSoy', `text${i++}`, 'text', m[1].replace(/\\'/g, "'"));
  }
}

// ── ExWriting.jsx: palabras y frases de escritura ─────────────
function parseExWriting() {
  const src = fs.readFileSync(path.join(ROOT, 'src/modules/ExWriting.jsx'), 'utf8');
  const arrays = ['WRITE_WORDS', 'WRITE_PHRASES', 'WRITE_WORDS_LOWER', 'WRITE_PHRASES_LOWER'];
  for (const name of arrays) {
    const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm');
    const m = re.exec(src);
    if (!m) continue;
    const items = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
    items.forEach((t, i) => add('ExWriting', name, String(i), t));
  }
}

// ── cloud.js: autobiografía generada dinámicamente ────────────
// Solo capturamos literales de una línea que empiecen por mayúscula o signo
// de apertura (¿ ¡). Así evitamos todo el código JS entre strings.
function parseCloud() {
  const src = fs.readFileSync(path.join(ROOT, 'src/cloud.js'), 'utf8');
  // Single-line literal con comillas simples, que empiece por algo "de frase"
  const re = /'([¿¡A-ZÁÉÍÓÚÑ][^'\n]{3,})'/g;
  let m, i = 0;
  while ((m = re.exec(src))) {
    add('cloud', `line${i++}`, 'text', m[1]);
  }
}

// ── Run + write ───────────────────────────────────────────────
parseExercises();
parseConstants();
parseExLee();
parseExRazona();
parseExQuienSoy();
parseExWriting();
parseCloud();

// Dedup
const seen = new Set();
const dedup = out.filter(e => {
  const k = e.source + '|' + e.text;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

// Group by source
const bySrc = {};
for (const e of dedup) {
  (bySrc[e.source] ||= []).push(e);
}

// Markdown output
const md = [];
md.push('# Toki · Revisión de frases');
md.push('');
md.push(`_Generado: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}_`);
md.push('');
md.push('## Cómo usar este archivo');
md.push('');
md.push('1. Lee cada frase. Si ves un error, **añade una línea debajo** empezando con `→ `:');
md.push('');
md.push('```');
md.push('- `se0039 [flu]` ph: Mi papa se llama {padre}');
md.push('→ Mi papá se llama {padre}');
md.push('```');
md.push('');
md.push('2. Al terminar, avísame y ejecuto `npm run apply-phrases` para aplicar las correcciones al código automáticamente.');
md.push('3. Puedes enviarme solo las líneas marcadas (no hace falta el archivo entero).');
md.push('');
md.push('**Abreviaturas de tipo:** `flu`=Dilo · `frases`=Forma la frase · `frases_blank`=Completar · `sit`=Situación · `count`=Contar · `math/multi/frac`=Mates · `lee`=Lectura · `razona`=Razonar · `quiensoy`=Quién soy · `writing`=Escribir');
md.push('');
md.push(`**Total frases extraídas: ${dedup.length}**`);
md.push('');
md.push('---');
md.push('');

for (const src of Object.keys(bySrc)) {
  md.push(`## ${src}  (${bySrc[src].length})`);
  md.push('');
  for (const e of bySrc[src]) {
    md.push(`- \`${e.id}\` ${e.field}: ${e.text}`);
  }
  md.push('');
}

const outPath = path.join(ROOT, 'frases-para-revisar.md');
fs.writeFileSync(outPath, md.join('\n'), 'utf8');

// ── Segundo archivo: SOLO sospechosas (heurística de tildes) ─────
// Lista ESTRICTA: solo palabras que siempre llevan tilde en uso normal.
// Excluidas homógrafas ambiguas (mi/mí, tu/tú, el/él, si/sí, se/sé, mas/más,
// te/té, de/dé, esta/está, este/esté, solo/sólo) porque la mayoría de veces
// están bien como están y producirían falsos positivos masivos.
// Solo variantes SIN TILDE que deberían llevarla. Si la palabra ya tiene el
// acento correcto en el corpus, no aparecerá en el match (buscamos exactamente
// la versión incorrecta).
const ACCENT_SUSPECTS = [
  'papa','mama','tio','tia','bebe','mami','papi',
  'musica','telefono','jabon','autobus','movil','sabado','miercoles',
  'rio','dia','dias','frio','leon','camion','balon','cancion','corazon',
  'salon','direccion','habitacion','avion','limon','melon','jamon','tambien',
  'despues','aqui','alli','ahi','asi','facil','dificil','arbol','util','ultimo',
  'ultima','rapido','rapida','lapiz','carcel','cafe','pais','paises','medico',
  'medica','tecnico','practico','publico','publica','economico','historico',
  'mecanico','organico','fotografico','simpatico','antipatico','magnifico',
  'cumpleanos','numero','numeros','angel','angeles','america','espana',
  'television','silaba','silabas',
];
// Interrogativos: solo verdadero positivo cuando están al principio de una
// pregunta/exclamación. Muy frecuente falso positivo con "que" subordinativo
// ("dijo que…"), así que los dejamos fuera por ahora.
const INTERROG = new Set([]);
// Construimos regex de palabras sospechosas (boundary de ASCII + sin tilde).
// Nota: en el dataset las frases correctas ya tienen tilde ("música"),
// así que marcamos solo cuando la palabra aparece SIN tilde.
const WORD_RE = new RegExp('\\b(' + ACCENT_SUSPECTS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'giu');

// Adicional: frases que empiezan en minúscula (salvo que sean solo una palabra
// intraducible o el inicio correcto es mayúscula automática en display).
function hasLowercaseStart(s) {
  const first = s.trim().match(/[A-Za-záéíóúñüÁÉÍÓÚÑÜ¿¡]/);
  return first && first[0] === first[0].toLowerCase() && first[0].toUpperCase() !== first[0].toLowerCase();
}

// Palabras que son OK sin tilde en algunos contextos: "papa" puede ser patata.
// Para minimizar falsos positivos, si la frase contiene indicadores familiares
// ("mi", "tu", "se llama", "quiere", etc.) la marcamos fuerte.
const FAMILY_HINTS = /\b(mi|tu|su|se llama)\b/i;

const suspects = [];
const isInterrogative = (s) => /[¿?¡!]/.test(s);
for (const e of dedup) {
  const txt = e.text;
  const hits = new Set();
  WORD_RE.lastIndex = 0;
  let m;
  while ((m = WORD_RE.exec(txt)) !== null) {
    hits.add(m[1].toLowerCase());
  }
  // Interrogativos: solo sospechoso si la frase tiene ?/!
  if (isInterrogative(txt)) {
    for (const word of INTERROG) {
      const re = new RegExp(`\\b${word}\\b`, 'i');
      if (re.test(txt)) hits.add(word);
    }
  }
  // Lowercase intencional en listas tipo ExLee ans (palabra única para rellenar)
  // y ExWriting *_LOWER. Ignorar esos casos.
  const isIntentionallyLower =
    (e.source === 'ExLee' && e.field === 'ans') ||
    (e.source === 'ExWriting' && /LOWER$/.test(e.id));
  const lowerStart = !isIntentionallyLower && hasLowercaseStart(txt);
  const upperWords = txt.split(/\s+/).filter(w => /^[A-ZÑÜ]{4,}$/.test(w) && ACCENT_SUSPECTS.includes(w.toLowerCase()));
  if (hits.size || lowerStart || upperWords.length) {
    suspects.push({ ...e, hits: [...hits], lowerStart, upperWords });
  }
}

const sus = [];
sus.push('# Toki · Frases sospechosas (revisión prioritaria)');
sus.push('');
sus.push(`_Generado: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}_`);
sus.push('');
sus.push('Estas frases pueden tener errores de acento o mayúscula. El resto del dataset');
sus.push('está en `frases-para-revisar.md`. Para corregir, añade una línea `→ …` debajo.');
sus.push('');
sus.push(`**Total sospechosas: ${suspects.length}**  (de ${dedup.length} totales)`);
sus.push('');
sus.push('---');
sus.push('');

const susBySrc = {};
for (const e of suspects) (susBySrc[e.source] ||= []).push(e);

for (const src of Object.keys(susBySrc)) {
  sus.push(`## ${src}  (${susBySrc[src].length})`);
  sus.push('');
  for (const e of susBySrc[src]) {
    const flags = [];
    if (e.hits.length) flags.push(`posibles sin tilde: **${e.hits.join(', ')}**`);
    if (e.lowerStart) flags.push('**inicia en minúscula**');
    if (e.upperWords.length) flags.push(`mayúsculas sin tilde: **${e.upperWords.join(', ')}**`);
    sus.push(`- \`${e.id}\` ${e.field}: ${e.text}`);
    if (flags.length) sus.push(`    · _${flags.join(' · ')}_`);
  }
  sus.push('');
}

const susPath = path.join(ROOT, 'frases-sospechosas.md');
fs.writeFileSync(susPath, sus.join('\n'), 'utf8');

console.log(`OK · ${dedup.length} frases → ${outPath}`);
console.log(`     ${suspects.length} sospechosas → ${susPath}`);
console.log('Por fuente:');
for (const k of Object.keys(bySrc)) console.log(`  ${k}: ${bySrc[k].length}`);
