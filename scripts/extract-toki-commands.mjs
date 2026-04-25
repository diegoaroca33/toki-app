// Extrae la lista VOICE_COMMANDS de TokiPlayground.jsx a un JSON editable.
// Diego puede abrir toki-commands.json, añadir/modificar comandos y patrones,
// y luego correr `npm run apply-toki-commands` para sobrescribir el código fuente.
//
// Uso:  node scripts/extract-toki-commands.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
const SRC = path.join(ROOT, 'src/components/TokiPlayground.jsx');
const OUT = path.join(ROOT, 'toki-commands.json');

const src = fs.readFileSync(SRC, 'utf8');

// Localiza el bloque `const VOICE_COMMANDS=[ ... ];`
const start = src.indexOf('const VOICE_COMMANDS=[');
if (start < 0) { console.error('No se encontró VOICE_COMMANDS'); process.exit(1); }
// Buscar el `];` que cierra, contando corchetes (simple porque no hay anidados más allá del array raíz)
let depth = 0, i = start, end = -1;
for (; i < src.length; i++) {
  const c = src[i];
  if (c === '[') depth++;
  else if (c === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) { console.error('No se pudo cerrar el bloque'); process.exit(1); }
const block = src.slice(start, end);

// Parsear cada `{id:'...',patterns:[...],response:'...'},` con regex tolerante
const entryRe = /\{\s*id:\s*'([^']+)'\s*,\s*patterns:\s*\[([^\]]*)\]\s*,\s*response:\s*(null|'((?:[^'\\]|\\.)*)')\s*\}/g;
const commands = [];
let m;
while ((m = entryRe.exec(block))) {
  const id = m[1];
  const patternsRaw = m[2];
  const responseIsNull = m[3] === 'null';
  const response = responseIsNull ? null : (m[4] || '').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  const patterns = [...patternsRaw.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
  commands.push({ id, patterns, response });
}

const payload = {
  _readme: [
    'Lista editable de comandos de voz que Toki reconoce.',
    'Cada entrada tiene:',
    '  id       → clave interna (no cambiar sin tocar el código)',
    '  patterns → lista de palabras/frases que activan el comando',
    '  response → lo que Toki dice en voz alta (null = solo ladra/anima)',
    '',
    'Reglas:',
    '- response NO debe contener repeticiones tipo "Zzzz" o "mmmm" (el TTS las lee literal).',
    '- Las patterns deben estar en minúsculas, sin tildes duras (se normalizan en código).',
    '- Puedes añadir nuevos patterns a comandos existentes.',
    '- Para AÑADIR un comando nuevo: copia una entrada, cambia id/patterns/response,',
    '  y avísame — yo añado el handler en el switch del componente.',
    '',
    'Tras editar: corre `npm run apply-toki-commands` para aplicarlo al código fuente.',
  ],
  commands,
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8');
console.log(`OK · ${commands.length} comandos → ${OUT}`);
