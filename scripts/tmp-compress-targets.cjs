const sharp = require('sharp');
const fs = require('fs');

const targets = [
  'images/molenhof/gevels.png',
  'images/molenhof/fragment1.png',
  'images/molenhof/fragment2.png',
  'images/molenhof/begane.png',
  'images/molenhof/eerste.png',
  'images/molenhof/doorsnedes.png',
  'images/timbertunes/gevelfragment.png',
];

const MAX = 2 * 1024 * 1024;

(async () => {
  for (const input of targets) {
    const out = input.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const orig = fs.statSync(input).size;
    let quality = 95;
    let best = null;

    while (quality >= 80) {
      const buf = await sharp(input, { limitInputPixels: false })
        .webp({ quality, effort: 6 })
        .toBuffer();
      best = { quality, buf };
      if (buf.length <= MAX) break;
      quality -= 3;
    }

    fs.writeFileSync(out, best.buf);
    const finalSize = fs.statSync(out).size;
    console.log(`${input} -> ${out} | ${(orig / 1024 / 1024).toFixed(2)}MB -> ${(finalSize / 1024 / 1024).toFixed(2)}MB | q=${best.quality}`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
