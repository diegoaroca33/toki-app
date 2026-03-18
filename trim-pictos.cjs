const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/usuario/Documents/TOKI/toki-app-v19/public/quiensoy/pictos';

async function trimAll() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    const fp = path.join(dir, file);
    try {
      // Trim whitespace with gentle threshold, rotate to horizontal
      const trimmed = await sharp(fp)
        .trim({ threshold: 240 })
        .rotate(90)
        .toBuffer();

      const meta = await sharp(trimmed).metadata();

      // Keep height generous (200px) so pictos don't get cut
      await sharp(trimmed)
        .resize({ height: 200, fit: 'inside', withoutEnlargement: false })
        .png({ compressionLevel: 9 })
        .toFile(fp + '.tmp');

      fs.renameSync(fp + '.tmp', fp);
      const stat = fs.statSync(fp);
      const meta2 = await sharp(fp).metadata();
      console.log(`${file}: ${meta.width}x${meta.height} -> ${meta2.width}x${meta2.height}, ${Math.round(stat.size/1024)}KB`);
    } catch (e) {
      console.log(`ERROR ${file}: ${e.message}`);
    }
  }
  console.log('Done!');
}

trimAll();
