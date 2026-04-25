// Genera "como-se-integran-las-nuevas-areas.docx" con:
// 1) Explicación técnica de cómo entran las 60 frases nuevas al juego
// 2) Contenido del memo project_v19_session2 (plan original)
//
// Uso: node scripts/generate-info-docx.mjs

import fs from 'node:fs';
import path from 'node:path';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat, PageBreak,
} from 'docx';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname.replace(/^\//, ''), '..');

const FONT = 'Arial';
const S_TITLE = 44;
const S_H1 = 32;
const S_H2 = 26;
const S_BODY = 22;
const S_SMALL = 20;

const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: FONT, size: opts.size || S_BODY, bold: opts.bold, italics: opts.italics, color: opts.color })],
  spacing: { after: opts.after ?? 120 },
  alignment: opts.align,
});
const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, font: FONT, size: S_H1, bold: true })],
  spacing: { before: 240, after: 160 },
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, font: FONT, size: S_H2, bold: true })],
  spacing: { before: 200, after: 120 },
});
const bullet = (text, bold = false) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  children: [new TextRun({ text, font: FONT, size: S_BODY, bold })],
  spacing: { after: 80 },
});
const code = (text) => new Paragraph({
  children: [new TextRun({ text, font: 'Consolas', size: S_SMALL, color: '2C3E50' })],
  spacing: { after: 80 },
  shading: { fill: 'F4F4F4', type: ShadingType.CLEAR },
});

const border = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (content, opts = {}) => new TableCell({
  borders,
  width: { size: opts.width, type: WidthType.DXA },
  shading: opts.header ? { fill: 'E8E4F8', type: ShadingType.CLEAR } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  children: Array.isArray(content) ? content : [new Paragraph({ children: [new TextRun({ text: content, font: FONT, size: S_SMALL, bold: opts.header })] })],
});

// ── TABLA: resumen de áreas nuevas ──
const AREA_ROWS = [
  ['Área (a:)', 'Emoji', 'Prefijo ID', '# frases', 'Niveles'],
  ['autonomia',  '💪',   'au',          '8', 'lv2 (3) · lv3 (3) · lv4 (2)'],
  ['conflicto',  '⚖️',   'cf',          '9', 'lv2 (3) · lv3 (3) · lv4 (3)'],
  ['identidad',  '✨',   'id',          '6', 'lv1 (1) · lv2 (2) · lv3 (3)'],
  ['social',     '👥',   'so',          '11','lv2 (4) · lv3 (4) · lv4 (3)'],
  ['profesiones','🧑‍⚕️', 'pf',          '6', 'lv3 (6)'],
  ['cuerpo',     '🫀',   'cu',          '6', 'lv2 (2) · lv3 (3) · lv4 (1)'],
  ['tiempo',     '☀️',   'ti',          '5', 'lv3 (4) · lv4 (1)'],
  ['barrio',     '🏘️',   'ba',          '5', 'lv3 (3) · lv4 (2)'],
  ['seguridad (existente)', '🛡️', 'se (se0090+)', '4', 'lv4 (2) · lv5 (2)'],
  ['TOTAL',      '',     '',            '60',''],
];
const areaTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2200, 800, 1800, 1200, 3360],
  rows: AREA_ROWS.map((row, i) => new TableRow({
    tableHeader: i === 0,
    children: row.map((c, j) => cell(c, { width: [2200, 800, 1800, 1200, 3360][j], header: i === 0 })),
  })),
});

// ── Contenido del v19 session 2 ──
const S2_CONTENT = {
  title: 'Memo: v19 Session 2 — Plan mayor (17 marzo 2026)',
  bugs: [
    'Scoring demasiado permisivo: "pato"/"pata" da 4★. Exigir match exacto de terminaciones.',
    'Timing de recompensa: no esperar timeout — celebrar inmediatamente cuando acierta.',
    'Feedback sin TTS: "¿Lo intentamos?" y mensajes de error se muestran pero no se dicen.',
    'Niveles de Aprende a decirlo: todos muestran misma dificultad. Debe ser N1:1-2 palabras, N2:2-3, N3:3-4, N4:4-5, N5:5+.',
    'Cuenta Conmigo: audio del número previo se solapa con el nuevo. Problemas de mic.',
    'Aprendo a sumar: decir la operación en voz alta, contar con palitos sincronizado, arreglar visual de palitos.',
  ],
  modules: [
    ['Multiplicaciones (x2, x3, x5, x10)', 'Grupos visuales + arrastrar objetos. Si falla, descomponer a sumas.'],
    ['Monedas y Billetes (4 niveles)', 'Reconocer, sumar, pagar arrastrando, dar cambio. Euros.'],
    ['La Hora (3 niveles)', 'En punto, media, cuarto. Arrastrar las manecillas.'],
    ['Calendario/Temporalidad (4 niveles)', 'Días, meses, secuencias, antes/después. Clave para Guillermo (ayer/mañana, pasado/futuro).'],
    ['Reparte y Cuenta (3 niveles)', 'Arrastrar caramelos a bolsas, repartir en partes iguales. Usa nombres reales de amigos.'],
    ['Escritura / Caligrafía (4 niveles)', 'L1 mayúsculas con guía de puntos, L2 mayúsculas sin guía, L3 minúsculas con guía, L4 minúsculas sin guía. Fondo claro tipo cuaderno. Canvas con tolerancia. Para usar con lápiz stylus.'],
    ['Forma la Frase nivel 4', 'Frases de 6-7 palabras + modo fill-in-the-blank.'],
  ],
  philosophy: [
    'Método María Troncoso: limpio, mínimo, no distrae. Solo lo esencial.',
    'Guillermo aprendió a leer en 1 mes con Troncoso porque los materiales eran limpios vs libros comerciales abigarrados.',
    'Feedback proporcional: no decir siempre que todo está genial. Constructivo si falla, celebrar en proporción cuando acierta.',
    'Interacción táctil: no solo hablar/teclear — arrastrar, soltar, trazar, tocar. Usar la pantalla táctil.',
    'Mayúsculas ahora, preparar transición a minúsculas.',
    'Todos los módulos terminan con el niño DICIENDO algo — habla + comprensión.',
  ],
  vocab: [
    'Frases como "sigue adelante, no mires atrás" son FRASES PRÁCTICA para repetir, NO mensajes del sistema. Estaban mal ubicadas.',
    'Vocabulario inspirado en Troncoso (objetos cotidianos, familia, acciones, animales, comida, cuerpo, ropa, colores) pero ampliado.',
    'A Guillermo le gustan los juegos de palabras: "el que nada no se ahoga" — posible módulo futuro.',
  ],
  menu: [
    '🎤 Aprende a decirlo (5 niveles)',
    '🧱 Forma la frase (4 niveles)',
    '🔢 Cuenta conmigo (4 niveles)',
    '🧮 Sumas y Restas (4 niveles)',
    '✖️ Multiplicaciones (3 niveles)',
    '🍕 Fracciones (1 nivel)',
    '💶 Monedas y Billetes (4 niveles)',
    '🕐 La Hora (3 niveles)',
    '📅 Calendario (4 niveles)',
    '🍬 Reparte y Cuenta (3 niveles)',
    '✏️ Escritura (4 niveles)',
  ],
};

// ── Construcción ──
const children = [
  p('Integración de las 8 áreas nuevas y 60 frases', { size: S_TITLE, bold: true, align: AlignmentType.CENTER, after: 180 }),
  p('Documento informativo · ' + new Date().toLocaleDateString('es-ES'), { size: S_SMALL, color: '666666', align: AlignmentType.CENTER, after: 280 }),

  h1('1. ¿Cómo se han integrado realmente?'),
  p('Las 60 frases se han añadido al final del array EX en src/exercises.js como objetos con ty:\'flu\' (tipo Dilo). Cada una tiene su a: (área) y su lv: (nivel sugerido).'),
  p('Ejemplo del formato real en el código:', { after: 60 }),
  code('{id:\'au0001\', a:\'autonomia\', ty:\'flu\', lv:2, ph:\'Voy solo\', em:\'💪\'},'),
  code('{id:\'pf0001\', a:\'profesiones\', ty:\'flu\', lv:3, ph:\'El médico me ayuda cuando estoy enfermo\', em:\'🏥\'},'),

  h2('1.1 · Cómo el juego las enseña al niño'),
  p('Actualmente el módulo Dilo (Aprende a decirlo) NO filtra por área. Filtra por longitud de palabras:', { after: 60 }),
  code('N1 → 1-2 palabras · N2 → 2-3 · N3 → 3-4 · N4 → 4-5 · N5 → 5+ palabras'),
  p('Por eso el valor lv: que tú marcaste en el docx es METADATA — actualmente no se usa para filtrar. Lo que decide en qué nivel aparece una frase es cuántas palabras tenga.', { after: 60 }),
  p('Ejemplo:', { bold: true, after: 40 }),
  bullet('au0001 "Voy solo" (marcaste lv2) → 2 palabras → aparece en N1 o N2.'),
  bullet('so0010 "Qué risa, ha sido muy gracioso" (marcaste lv4) → 6 palabras → aparece en N5.'),

  h2('1.2 · ¿Y las áreas (a:)?'),
  p('Las 12 áreas originales (seguridad, salud, necesidades, compras, etc.) y las 8 nuevas NO se muestran al niño en ninguna pantalla ni se usan como filtro. Solo son metadata organizativa para:', { after: 60 }),
  bullet('Que tú (supervisor) sepas de qué tema es cada frase al leer el código.'),
  bullet('Futuras funcionalidades que podrían usarlas (ej: "hoy solo quiero que practique frases de conflicto").'),
  p('Si quieres que se usen como filtro real (ej: un selector "Tema: autonomía, conflicto..." dentro de Dilo), es una funcionalidad nueva que habría que implementar.', { italics: true, after: 200 }),

  h2('1.3 · Resumen de las 8 áreas añadidas'),
  areaTable,
  p(''),
  p('Las frases nuevas se mezclan con las 1 254 frases originales de Dilo. Ahora hay un total de 1 314 frases tipo flu.', { italics: true }),

  new Paragraph({ children: [new PageBreak()] }),
  h1('2. Memo: plan completo de la v19 — Session 2 (17 marzo 2026)'),
  p('Contenido del fichero project_v19_session2.md en tu memoria. Es el plan que acordamos para esta versión. Muestra qué se decidió hacer; algunas cosas se hicieron y otras quedaron pendientes.', { italics: true, color: '666666' }),

  h2('2.1 · Bugs a arreglar'),
  ...S2_CONTENT.bugs.map(b => bullet(b)),

  h2('2.2 · Módulos nuevos acordados'),
  ...S2_CONTENT.modules.map(([name, desc]) => [
    p(name, { bold: true, after: 40 }),
    p('    ' + desc, { size: S_SMALL, color: '555555', after: 120 }),
  ]).flat(),

  h2('2.3 · Filosofía de diseño (pautas de Diego)'),
  ...S2_CONTENT.philosophy.map(b => bullet(b)),

  h2('2.4 · Vocabulario de los ejercicios'),
  ...S2_CONTENT.vocab.map(b => bullet(b)),

  h2('2.5 · Organización del menú acordada'),
  ...S2_CONTENT.menu.map(m => bullet(m)),

  new Paragraph({ children: [new PageBreak()] }),
  h1('3. Estado actual (abril 2026): qué se hizo y qué no'),

  h2('3.1 · Se hizo'),
  ...[
    'Los 6 bugs del scoring, timing, feedback TTS, niveles Dilo por longitud de palabras, Cuenta Conmigo y Sumas — todos resueltos.',
    'Todos los módulos planificados: Multiplicaciones, Monedas y Billetes, La Hora, Calendario, Reparte y Cuenta, Escritura.',
    'Forma la Frase nivel 4 con 6-7 palabras + blank.',
    'Quién Soy (presentación SD).',
    'Lectura (4 sub-módulos).',
    'Razonamiento (5 sub-módulos).',
    'Sistema de perfiles en la nube (Firebase).',
    'Troncoso-style UI: minimalista, sin ruido visual.',
    'Mascota Toki con voz, juego del escondite, comida por ejercicios.',
    'Las 60 frases nuevas que acabas de marcar en el docx (sesión actual).',
  ].map(b => bullet(b)),

  h2('3.2 · Pendiente del plan o nunca implementado'),
  ...[
    'El paso a MINÚSCULAS del contenido (el plan decía "preparar transición a minúsculas"). Actualmente casi todo sigue en mayúsculas para escritura.',
    'Módulo de juegos de palabras / refranes ("el que nada no se ahoga") — quedó como futuro.',
    'Filtro por área en Dilo (elegir tema: autonomía, conflicto…). Las áreas existen como metadata pero no hay UI para filtrar.',
    'Nivel de Dilo por SIGNIFICADO/TEMA en vez de longitud. Actualmente solo mide palabras.',
  ].map(b => bullet(b)),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: S_BODY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: S_H1, bold: true, font: FONT, color: '2C3E50' },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: S_H2, bold: true, font: FONT, color: '34495E' },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 600, hanging: 300 } } } }],
    }],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
    children,
  }],
});

const out = path.join(ROOT, 'como-se-integran-las-nuevas-areas.docx');
const buf = await Packer.toBuffer(doc);
fs.writeFileSync(out, buf);
console.log(`OK → ${out}`);
