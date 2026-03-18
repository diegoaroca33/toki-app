const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');

const pdfs = [
  'Hola, soy Guillermo',
  'Este mes tiene un día importante',
  'El veintiuno es el día del síndrome de Down',
  'Igual que vosotros',
  'Por la tarde hago muchas actividades',
  'toco el piano',
  'Juego al bádminton',
  'Voy a natación',
  'Soy modelo de ropa',
  'Voy a ASSIDO',
  'Hacemos teatro y baile',
  'Yo hago mis tareas',
  'Me gusta hacer muchas cosas',
  'Me gusta cocinar',
  'Me gusta pintar',
  'Me gusta hacer muchos deportes',
  'A veces molesto sin querer',
  'Pero puede que esté nervioso',
  'Estoy aprendiendo a hacerlo mejor',
  'Yo solo quiero jugar',
  'Porque todos somos iguales',
  'Juntos es mejor',
  'Muchas gracias por como me tratais',
  'Os amo',
];

const srcDir = 'C:/Users/usuario/Downloads';
const outDir = 'C:/Users/usuario/Documents/TOKI/toki-app-v19/public/quiensoy/pictos';

async function convertAll() {
  for (let i = 0; i < pdfs.length; i++) {
    const name = pdfs[i];
    const pdfPath = path.join(srcDir, name + '.pdf');
    const outName = String(i + 1).padStart(2, '0');

    if (!fs.existsSync(pdfPath)) {
      console.log(`SKIP: ${pdfPath} not found`);
      continue;
    }

    try {
      const opts = {
        format: 'png',
        out_dir: outDir,
        out_prefix: outName,
        page: 1,
        scale: 4096,
      };
      await pdf.convert(pdfPath, opts);
      // Rename the output (pdf-poppler adds -1.png)
      const generated = path.join(outDir, outName + '-1.png');
      const final_name = path.join(outDir, outName + '.png');
      if (fs.existsSync(generated)) {
        fs.renameSync(generated, final_name);
      }
      console.log(`OK: ${outName}.png <- ${name}`);
    } catch (e) {
      console.log(`ERROR: ${name}: ${e.message}`);
    }
  }
  console.log('Done!');
}

convertAll();
