import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '..', 'images', 'timbertunes', 'Timbertunes.png');
const outputPath = path.join(__dirname, '..', 'images', 'timbertunes', 'Timbertunes.webp');
const targetSize = 800 * 1024;

const metadata = await sharp(inputPath, { limitInputPixels: false }).metadata();
const widths = metadata.width ? [metadata.width, 2400, 2000, 1600, 1400, 1200, 1000] : [2400, 2000, 1600, 1400, 1200, 1000];
const qualities = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10];

let best = null;

for (const width of widths) {
  for (const quality of qualities) {
    const pipeline = sharp(inputPath, { limitInputPixels: false });
    if (metadata.width && width < metadata.width) {
      pipeline.resize({ width, withoutEnlargement: true });
    }

    const buffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();
    const diff = Math.abs(buffer.length - targetSize);

    console.log(`width=${width} quality=${quality} sizeKB=${(buffer.length / 1024).toFixed(2)}`);

    if (best === null || diff < best.diff) {
      best = { width, quality, buffer, diff };
    }

    if (buffer.length <= targetSize && buffer.length >= targetSize * 0.92) {
      best = { width, quality, buffer, diff };
      break;
    }
  }

  if (best && best.buffer.length <= targetSize && best.buffer.length >= targetSize * 0.92) {
    break;
  }
}

if (!best) {
  throw new Error('No WebP candidate produced');
}

await fs.writeFile(outputPath, best.buffer);
console.log(`BEST width=${best.width} quality=${best.quality} sizeKB=${(best.buffer.length / 1024).toFixed(2)}`);