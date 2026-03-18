const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = "C:/Users/usuario/Downloads/euro_banknotes/euro_banknotes_specimen_72dpi/Banknotes ES2 Specimen 72dpi/ES2 Specimen with Lagarde's Signature";
const dst = "C:/Users/usuario/Documents/TOKI/toki-app-v19/public/img/money";

const bills = [5, 10, 20, 50];

(async () => {
  for (const v of bills) {
    const f = path.join(src, `ECB ${v} Euro Specimen Front with Lagarde signature.jpg`);
    const out = path.join(dst, `bill_${v}.jpg`);
    await sharp(f).resize({width:400, fit:'inside'}).jpeg({quality:75}).toFile(out);
    const s = fs.statSync(out);
    console.log(`bill_${v}.jpg: ${Math.round(s.size/1024)}KB`);
  }
  console.log('Done');
})();
