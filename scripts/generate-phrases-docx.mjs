// Genera frases-para-revisar.docx con TODAS las frases organizadas por módulo.
// Formato optimizado para revisión en Word:
//   - Encabezado con instrucciones
//   - Por cada módulo, heading + tabla de 2 columnas (ID+Original | Corrección vacía)
//   - Diego rellena la columna "Corrección" para frases con error
//   - Luego se puede volcar al MD con apply-phrases si él prefiere
//
// Uso: npm run generate-phrases-docx

import fs from 'node:fs';
import path from 'node:path';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, PageBreak,
} from 'docx';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');

// Reusa la MISMA lógica del extractor MD — copiada aquí para no depender del MD
// (evita que tenga que correr extract-phrases antes).
const out = [];
const add = (source, id, field, text) => {
  if (!text || typeof text !== 'string') return;
  const t = text.trim();
  if (!t) return;
  out.push({ source, id, field, text: t });
};

// ── exercises.js ──
const exSrc = fs.readFileSync(path.join(ROOT, 'src/exercises.js'), 'utf8');
const entryRe = /\{\s*id:\s*'([^']+)'[^}]*\}/g;
let m;
while ((m = entryRe.exec(exSrc))) {
  const block = m[0];
  const id = m[1];
  const ty = /\bty:\s*'([^']+)'/.exec(block)?.[1] || '';
  const lv = /\blv:\s*(\d+)/.exec(block)?.[1] || '';
  const tag = (f) => {
    const r = new RegExp(`\\b${f}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 'm');
    const v = r.exec(block)?.[1];
    return v ? v.replace(/\\'/g, "'") : null;
  };
  const tag1 = `${id} [${ty} lv${lv}]`;
  add('exercises', tag1, 'ph', tag('ph'));
  add('exercises', tag1, 'fu', tag('fu'));
  add('exercises', tag1, 'su', tag('su'));
  add('exercises', tag1, 'si', tag('si'));
  add('exercises', tag1, 'q', tag('q'));
  add('exercises', tag1, 'blank', tag('blank'));
  add('exercises', tag1, 'text', tag('text'));
  const opRaw = /\bop:\s*\[([^\]]*)\]/s.exec(block)?.[1];
  if (opRaw) {
    const items = [...opRaw.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
    items.forEach((t, i) => add('exercises', tag1, `op[${i}]`, t));
  }
}

// ── constants.js ──
const cSrc = fs.readFileSync(path.join(ROOT, 'src/constants.js'), 'utf8');
for (const name of ['PERFECT_T', 'SHORT_OK', 'SHORT_FAIL', 'BUILD_OK', 'GOOD_MSG', 'CHEER_ALL']) {
  const re = new RegExp(`export\\s+const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm');
  const mm = re.exec(cSrc);
  if (!mm) continue;
  [...mm[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].forEach((x, i) => {
    add('constants (mensajes ánimo)', name, String(i), x[1].replace(/\\'/g, "'"));
  });
}

// ── ExLee / ExRazona / ExQuienSoy / ExWriting ──
const lee = fs.readFileSync(path.join(ROOT, 'src/modules/ExLee.jsx'), 'utf8');
[...lee.matchAll(/\bfull:\s*'((?:[^'\\]|\\.)*)'/g)].forEach((x, i) => add('ExLee', `full${i}`, 'full', x[1].replace(/\\'/g, "'")));
[...lee.matchAll(/\bans:\s*'((?:[^'\\]|\\.)*)'/g)].forEach((x, i) => add('ExLee', `ans${i}`, 'ans', x[1].replace(/\\'/g, "'")));

const raz = fs.readFileSync(path.join(ROOT, 'src/modules/ExRazona.jsx'), 'utf8');
for (const key of ['text', 'prompt', 'question', 'answer', 'title', 'label', 'q', 'a']) {
  let i = 0;
  [...raz.matchAll(new RegExp(`\\b${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 'g'))].forEach(x => {
    add('ExRazona', `${key}${i++}`, key, x[1].replace(/\\'/g, "'"));
  });
}

const qs = fs.readFileSync(path.join(ROOT, 'src/modules/ExQuienSoy.jsx'), 'utf8');
[...qs.matchAll(/\btext:\s*'((?:[^'\\]|\\.)*)'/g)].forEach((x, i) => add('ExQuienSoy', `text${i}`, 'text', x[1].replace(/\\'/g, "'")));

const wr = fs.readFileSync(path.join(ROOT, 'src/modules/ExWriting.jsx'), 'utf8');
for (const name of ['WRITE_WORDS', 'WRITE_PHRASES']) {
  const re = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm');
  const mm = re.exec(wr);
  if (!mm) continue;
  [...mm[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].forEach((x, i) => {
    add('ExWriting', name, String(i), x[1].replace(/\\'/g, "'"));
  });
}

// ── Dedup ──
const seen = new Set();
const items = out.filter(e => { const k = e.source + '|' + e.text; if (seen.has(k)) return false; seen.add(k); return true; });

// ── Agrupar por fuente ──
const bySrc = {};
items.forEach(e => { (bySrc[e.source] ||= []).push(e); });

// ── Mapeo humano de nombres de campo → etiqueta legible ──
const FIELD_LABEL = {
  ph: 'Frase a decir', fu: 'Frase completa', su: 'Frase sugerida',
  si: 'Situación', q: 'Pregunta', blank: 'Palabra', text: 'Texto',
  full: 'Frase', ans: 'Respuesta',
};

// ── Construcción del DOCX ──
const SIZE_TITLE = 48;
const SIZE_H2 = 32;
const SIZE_NORMAL = 22;
const SIZE_SMALL = 18;

const border = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };

function headerRow() {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        borders,
        width: { size: 5200, type: WidthType.DXA },
        shading: { fill: 'E8E4F8', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: 'Frase original', bold: true, size: SIZE_NORMAL, font: 'Arial' })] })],
      }),
      new TableCell({
        borders,
        width: { size: 4160, type: WidthType.DXA },
        shading: { fill: 'FFF4D0', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: 'Corrección (si hay error)', bold: true, size: SIZE_NORMAL, font: 'Arial' })] })],
      }),
    ],
  });
}

function phraseRow(e) {
  const fieldLabel = FIELD_LABEL[e.field?.replace(/\[\d+\]$/, '')] || e.field || '';
  const meta = `${e.id}` + (fieldLabel ? `  ·  ${fieldLabel}` : '');
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 5200, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [
          new Paragraph({ children: [new TextRun({ text: meta, size: SIZE_SMALL, color: '666666', font: 'Arial' })] }),
          new Paragraph({ children: [new TextRun({ text: e.text, size: SIZE_NORMAL, font: 'Arial' })] }),
        ],
      }),
      new TableCell({
        borders,
        width: { size: 4160, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: '', size: SIZE_NORMAL, font: 'Arial' })] })],
      }),
    ],
  });
}

// ── Orden de secciones ──
const sectionOrder = ['exercises', 'ExLee', 'ExRazona', 'ExQuienSoy', 'ExWriting', 'constants (mensajes ánimo)'];
const sectionNice = {
  exercises: 'Ejercicios principales (Dilo, Forma la frase, Situaciones, etc.)',
  ExLee: 'Lectura',
  ExRazona: 'Razonamiento',
  ExQuienSoy: 'Quién soy (presentación)',
  ExWriting: 'Escritura (palabras y frases a copiar)',
  'constants (mensajes ánimo)': 'Mensajes de ánimo, cheers, feedback',
};

const docChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Toki · Revisión de frases', size: SIZE_TITLE, bold: true, font: 'Arial' })],
    spacing: { after: 200 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: `${items.length} frases en total  ·  Generado ${new Date().toLocaleDateString('es-ES')}`, size: SIZE_SMALL, color: '666666', font: 'Arial' })],
    spacing: { after: 400 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Cómo usar este documento', bold: true, size: SIZE_H2, font: 'Arial' })],
    spacing: { before: 200, after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Lee cada frase de la columna izquierda. Si ves un error (acento, mayúscula, palabra equivocada, etc.), escribe la versión correcta en la columna derecha. Las filas sin corrección se ignoran. Cuando termines, me pasas el .docx editado y aplico los cambios al código.',
      size: SIZE_NORMAL, font: 'Arial',
    })],
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Orden de secciones: ', size: SIZE_NORMAL, font: 'Arial' }),
      new TextRun({ text: 'ejercicios principales → lectura → razonamiento → Quién soy → escritura → mensajes.', size: SIZE_NORMAL, italics: true, font: 'Arial' })],
    spacing: { after: 300 },
  }),
];

for (const src of sectionOrder) {
  const list = bySrc[src];
  if (!list || !list.length) continue;
  docChildren.push(
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: `${sectionNice[src] || src}  (${list.length})`, bold: true, size: SIZE_H2, font: 'Arial' })],
      spacing: { before: 200, after: 200 },
    }),
  );

  // Subagrupar por tipo (ph / fu / su / si / q / op / blank / text) dentro de exercises
  if (src === 'exercises') {
    const byField = {};
    list.forEach(e => {
      const field = e.field.replace(/\[\d+\]$/, '');
      (byField[field] ||= []).push(e);
    });
    const fieldOrder = ['ph', 'fu', 'su', 'si', 'q', 'blank', 'text', 'op'];
    for (const f of fieldOrder) {
      const arr = byField[f];
      if (!arr) continue;
      const label = FIELD_LABEL[f] || f;
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: `${label}  (${arr.length})`, bold: true, size: SIZE_NORMAL, font: 'Arial' })],
          spacing: { before: 200, after: 100 },
        }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5200, 4160],
          rows: [headerRow(), ...arr.map(phraseRow)],
        }),
      );
    }
  } else {
    docChildren.push(
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [5200, 4160],
        rows: [headerRow(), ...list.map(phraseRow)],
      }),
    );
  }
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: SIZE_NORMAL } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: SIZE_H2, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: SIZE_NORMAL, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    children: docChildren,
  }],
});

const outPath = path.join(ROOT, 'frases-para-revisar.docx');
const buf = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buf);
console.log(`OK · ${items.length} frases → ${outPath}`);
console.log('Por fuente:');
for (const k of sectionOrder) if (bySrc[k]) console.log(`  ${k}: ${bySrc[k].length}`);
