// Lee frases-para-revisar.docx y extrae:
//   1) Correcciones: filas donde la columna B (corrección) tiene texto
//   2) Frases nuevas: tablas añadidas al final del documento con estructura
//      distinta (categoría/nivel/frase) — detectadas heurísticamente.
//
// Estrategia: el docx es un ZIP. Descomprimimos document.xml y parseamos
// las tablas <w:tbl>. Cada <w:tr> tiene celdas <w:tc>, cada celda contiene
// párrafos con runs <w:t>. Concatenamos textos por fila.
//
// Uso: node scripts/read-docx-corrections.mjs [ruta.docx]
// Output: corrections.json en la raíz con { corrections: [...], newPhrases: [...] }

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import os from 'node:os';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');
const docxPath = process.argv[2] || path.join(ROOT, 'frases-para-revisar.docx');

if (!fs.existsSync(docxPath)) { console.error('No existe:', docxPath); process.exit(1); }

// Descomprimir document.xml a un temp dir
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'toki-docx-'));
try {
  execSync(`unzip -o -q "${docxPath}" word/document.xml -d "${tmp}"`);
} catch(e) { console.error('unzip falló:', e.message); process.exit(1); }
const xml = fs.readFileSync(path.join(tmp, 'word', 'document.xml'), 'utf8');

// Parser minimal de tablas. Tokenizamos los elementos relevantes.
// No parseamos XML completo — usamos regex que funciona con el layout de docx-js.
function extractText(fragment) {
  // Recupera todo el texto de <w:t>, respetando w:tab (→ ' ') y breaks
  let out = '';
  const re = /<w:(t|tab|br)\b[^>]*(?:\/>|>([\s\S]*?)<\/w:\1>)/g;
  let m;
  while ((m = re.exec(fragment))) {
    if (m[1] === 't') out += (m[2] || '');
    else out += ' ';
  }
  return out.replace(/\s+/g, ' ').trim();
}

function parseTables(xml) {
  const tables = [];
  // Match <w:tbl>...</w:tbl> (non-greedy, con dotAll)
  const tblRe = /<w:tbl\b[\s\S]*?<\/w:tbl>/g;
  let tm;
  while ((tm = tblRe.exec(xml))) {
    const tblXml = tm[0];
    const rows = [];
    const trRe = /<w:tr\b[\s\S]*?<\/w:tr>/g;
    let rm;
    while ((rm = trRe.exec(tblXml))) {
      const trXml = rm[0];
      const cells = [];
      const tcRe = /<w:tc\b[\s\S]*?<\/w:tc>/g;
      let cm;
      while ((cm = tcRe.exec(trXml))) {
        cells.push(extractText(cm[0]));
      }
      rows.push(cells);
    }
    tables.push(rows);
  }
  return tables;
}

const tables = parseTables(xml);
console.log(`Tablas detectadas: ${tables.length}`);

// Las tablas de frases originales tienen formato:
//  - Fila 0: ["Frase original", "Corrección (si hay error)"]
//  - Filas N: [ID + Fieldlabel + Texto_original,  Corrección_vacía_o_llena ]
// Donde "ID + Fieldlabel + Texto_original" vienen en la misma celda porque
// docx-js los generó como dos <w:p> dentro de la misma <w:tc>.

const corrections = [];
const newPhrases = [];

// Identificar tablas "correcciones" vs "frases nuevas":
// Una tabla de correcciones tiene header exacto: ["Frase original", "Corrección (si hay error)"]
// Una tabla nueva tendrá otros headers.
for (const rows of tables) {
  if (!rows.length) continue;
  const header = rows[0];
  const isCorrectionsTable =
    header.length === 2 &&
    /frase.*original/i.test(header[0] || '') &&
    /correcci/i.test(header[1] || '');

  if (isCorrectionsTable) {
    for (let i = 1; i < rows.length; i++) {
      const [orig, correction] = rows[i];
      if (!orig) continue;
      // orig viene como "id [ty lvN] · label  texto"
      // Separamos meta y texto por " · " o doble espacio del docx-js layout
      // La estructura real era: 2 párrafos en la celda → al concatenar queda "meta  texto".
      // Usamos regex para separar: meta acaba en el segundo espacio después del último " · "
      // Mejor: el original es TODO el string (nos vale para buscar en el código fuente).
      if (correction && correction.trim().length > 0) {
        corrections.push({ original_cell: orig.trim(), correction: correction.trim() });
      }
    }
  } else {
    // Tabla de frases nuevas — la guardamos para inspección manual
    newPhrases.push({ header, rows: rows.slice(1) });
  }
}

// Para cada corrección, extraer el texto real (sin el prefijo meta)
// El prefijo meta tiene la forma: "xxxxx [xxx lvN]  ·  Label"  seguido del texto real.
// docx-js concatena los dos <w:p> como "meta texto" o "meta  texto".
// Regla: el prefijo termina en el último " · <Label>  " donde Label es una de:
const LABELS = ['Frase a decir', 'Frase completa', 'Frase sugerida', 'Situación', 'Pregunta', 'Palabra', 'Texto', 'Frase', 'Respuesta'];
function stripMetaPrefix(s) {
  for (const lab of LABELS) {
    const idx = s.indexOf(' · ' + lab);
    if (idx >= 0) {
      // El texto viene justo después de "<Label>" + un espacio
      const after = s.slice(idx + (' · ' + lab).length).trimStart();
      if (after) return after;
    }
  }
  // Fallback: si empieza por un id tipo "seXXXX [", busca dos espacios seguidos o tab
  const m = /^[a-zA-Z0-9_]+\s*\[[^\]]+\]\s+(.+)$/.exec(s);
  if (m) return m[1].trim();
  return s;
}

corrections.forEach(c => { c.original = stripMetaPrefix(c.original_cell); });

console.log(`Correcciones encontradas: ${corrections.length}`);
console.log(`Tablas extra (frases nuevas): ${newPhrases.length}`);

// Guardar resultado
const outPath = path.join(ROOT, 'corrections.json');
fs.writeFileSync(outPath, JSON.stringify({ corrections, newPhrases }, null, 2), 'utf8');
console.log(`→ ${outPath}`);

// Print a quick preview
console.log('\n── Correcciones (primeras 5) ──');
corrections.slice(0, 5).forEach((c, i) => {
  console.log(`${i + 1}. "${c.original}"`);
  console.log(`   → "${c.correction}"`);
});

if (newPhrases.length) {
  console.log('\n── Tablas extras ──');
  newPhrases.forEach((t, i) => {
    console.log(`Tabla ${i + 1}: header = [${t.header.join(' | ')}]  (${t.rows.length} filas)`);
    t.rows.slice(0, 3).forEach(r => console.log(`   [${r.join(' | ')}]`));
  });
}
