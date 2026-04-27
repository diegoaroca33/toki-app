// Reescribe VOICE_COMMANDS en TokiPlayground.jsx usando toki-commands.json.
//
// Uso:  node scripts/apply-toki-commands.mjs
//
// Seguridad: deja una copia .bak la primera vez. No toca el resto del fichero —
// solo sustituye el bloque entre `const VOICE_COMMANDS=[` y su `];` cerrador.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
const SRC = path.join(ROOT, 'src/components/TokiPlayground.jsx');
const IN  = path.join(ROOT, 'toki-commands.json');

if (!fs.existsSync(IN)) {
  console.error(`Falta ${IN}. Corre primero: npm run extract-toki-commands`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(IN, 'utf8'));
const cmds = data.commands;
if (!Array.isArray(cmds) || !cmds.length) {
  console.error('JSON inválido: se esperaba { commands: [...] } no vacío.');
  process.exit(1);
}

// Validación: patrones no vacíos, respuesta no contiene repeticiones letra
for (const c of cmds) {
  if (!c.id || !Array.isArray(c.patterns) || !c.patterns.length) {
    console.error(`Comando inválido:`, c);
    process.exit(1);
  }
  if (typeof c.response === 'string' && /(.)\1{3,}/.test(c.response)) {
    console.warn(`⚠️  [${c.id}] response tiene letras repetidas, el TTS las leerá literal: "${c.response}"`);
  }
}

const src = fs.readFileSync(SRC, 'utf8');
const start = src.indexOf('const VOICE_COMMANDS=[');
if (start < 0) { console.error('No se encontró VOICE_COMMANDS'); process.exit(1); }
let depth = 0, i = start, end = -1;
for (; i < src.length; i++) {
  const c = src[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) { console.error('No se pudo cerrar el bloque'); process.exit(1); }
// incluir el `;` siguiente
let endWithSemi = end;
while (src[endWithSemi] === ' ' || src[endWithSemi] === '\t') endWithSemi++;
if (src[endWithSemi] === ';') endWithSemi++;

const qStr = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const serialize = (c) => {
  const pats = c.patterns.map(qStr).join(',');
  const resp = c.response === null ? 'null' : qStr(c.response);
  return `  {id:${qStr(c.id)},patterns:[${pats}],response:${resp}},`;
};
const newBlock = 'const VOICE_COMMANDS=[\n' + cmds.map(serialize).join('\n') + '\n];';

// Backup la primera vez
const bak = SRC + '.bak';
if (!fs.existsSync(bak)) fs.writeFileSync(bak, src, 'utf8');

const next = src.slice(0, start) + newBlock + src.slice(endWithSemi);
fs.writeFileSync(SRC, next, 'utf8');

console.log(`OK · ${cmds.length} comandos escritos en ${path.relative(ROOT, SRC)}`);
console.log(`Copia de seguridad: ${path.relative(ROOT, bak)}`);
