// Aplica las correcciones marcadas en frases-para-revisar.md (o frases-sospechosas.md).
//
// Formato esperado:
//   - `id` field: Frase original
//   → Frase corregida
//
// Uso:
//   node scripts/apply-phrases.mjs [archivo.md]
//
// Por cada línea que empiece con `→ `, buscamos en los ficheros fuente la frase
// original exacta y la reemplazamos. Si aparece en más de un sitio, avisamos.
// Hacemos un dry-run primero — con --apply se aplican los cambios.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const mdFile = args.find(a => a.endsWith('.md')) || 'frases-para-revisar.md';
const mdPath = path.join(ROOT, mdFile);

if (!fs.existsSync(mdPath)) {
  console.error(`No existe: ${mdPath}`);
  process.exit(1);
}

const md = fs.readFileSync(mdPath, 'utf8');
const lines = md.split('\n');

const corrections = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Buscar línea de frase: `- \`id\` field: texto`
  const entry = /^- `([^`]+)` ([^:]+): (.+)$/.exec(line);
  if (!entry) continue;
  // Siguiente línea empieza con `→ `?
  const next = (lines[i + 1] || '').trim();
  if (!next.startsWith('→ ') && !next.startsWith('-> ')) continue;
  const original = entry[3].trim();
  const corrected = next.replace(/^[→-]> ?/, '').trim();
  if (!corrected || corrected === original) continue;
  corrections.push({ id: entry[1], field: entry[2], original, corrected });
}

if (!corrections.length) {
  console.log('No hay correcciones marcadas con → en', mdFile);
  process.exit(0);
}

console.log(`Correcciones detectadas: ${corrections.length}`);
corrections.forEach((c, i) => {
  console.log(`  ${i + 1}. [${c.id}] ${c.field}`);
  console.log(`     - ${c.original}`);
  console.log(`     + ${c.corrected}`);
});
console.log();

// Aplicar: buscar en los archivos fuente
const SOURCE_FILES = [
  'src/exercises.js',
  'src/constants.js',
  'src/modules/ExLee.jsx',
  'src/modules/ExRazona.jsx',
  'src/modules/ExQuienSoy.jsx',
  'src/modules/ExWriting.jsx',
  'src/cloud.js',
];

function escapeLiteral(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let applied = 0;
let skipped = 0;
const changes = {};

for (const c of corrections) {
  const origQ = `'${c.original.replace(/'/g, "\\'")}'`;
  const newQ = `'${c.corrected.replace(/'/g, "\\'")}'`;
  let found = false;
  for (const relPath of SOURCE_FILES) {
    const abs = path.join(ROOT, relPath);
    if (!fs.existsSync(abs)) continue;
    const src = changes[abs] ?? fs.readFileSync(abs, 'utf8');
    // Contar ocurrencias
    const count = src.split(origQ).length - 1;
    if (count === 0) continue;
    if (count > 1) {
      console.warn(`  ⚠️  [${c.id}] "${c.original}" aparece ${count} veces en ${relPath} — no aplico`);
      skipped++;
      found = true;
      break;
    }
    changes[abs] = src.split(origQ).join(newQ);
    console.log(`  ✓  [${c.id}] ${relPath}: corregido`);
    applied++;
    found = true;
    break;
  }
  if (!found) {
    console.warn(`  ✗  [${c.id}] No encontrado: "${c.original}"`);
    skipped++;
  }
}

console.log();
if (apply) {
  for (const [abs, content] of Object.entries(changes)) {
    fs.writeFileSync(abs, content, 'utf8');
    console.log(`Escrito: ${path.relative(ROOT, abs)}`);
  }
  console.log(`\nAplicadas: ${applied} · Saltadas: ${skipped}`);
} else {
  console.log(`[DRY-RUN] Aplicables: ${applied} · Saltadas: ${skipped}`);
  console.log('Corre con --apply para escribir los cambios.');
}
