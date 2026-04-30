import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = path.join(process.cwd(), 'images', 'timbertunes', 'Timbertunes.png');
const outputPath = path.join(process.cwd(), 'images', 'timbertunes', 'Timbertunes.webp');
const targetSizeKB = 800;

// Convert with different quality levels to find the right one for ~800KB
async function convertImage() {
  try {
    // Start with quality 60 and adjust
    for (let quality = 60; quality >= 10; quality -= 1) {
      const buffer = await sharp(inputPath)
        .webp({ quality })
        .toBuffer();
      
      const sizeKB = buffer.length / 1024;
      console.log(`Quality ${quality}: ${sizeKB.toFixed(2)} KB`);
      
      if (sizeKB <= targetSizeKB && sizeKB >= targetSizeKB * 0.95) {
        // Found a good match (within 5% of target)
        await fs.promises.writeFile(outputPath, buffer);
        console.log(`\n✓ Converted to WebP with quality ${quality}`);
        console.log(`✓ Final size: ${sizeKB.toFixed(2)} KB (target: ${targetSizeKB} KB)`);
        return;
      }
    }
    
    // If no exact match found, find the closest one
    let bestQuality = 60;
    let bestBuffer = await sharp(inputPath).webp({ quality: 60 }).toBuffer();
    let bestDiff = Math.abs(bestBuffer.length / 1024 - targetSizeKB);
    
    for (let quality = 59; quality >= 10; quality -= 1) {
      const buffer = await sharp(inputPath)
        .webp({ quality })
        .toBuffer();
      
      const sizeKB = buffer.length / 1024;
      const diff = Math.abs(sizeKB - targetSizeKB);
      
      if (diff < bestDiff) {
        bestDiff = diff;
        bestQuality = quality;
        bestBuffer = buffer;
      }
    }
    
    const sizeKB = bestBuffer.length / 1024;
    await fs.promises.writeFile(outputPath, bestBuffer);
    console.log(`\n✓ Converted to WebP with quality ${bestQuality}`);
    console.log(`✓ Final size: ${sizeKB.toFixed(2)} KB (target: ${targetSizeKB} KB)`);
    
  } catch (error) {
    console.error('Error converting image:', error);
    process.exit(1);
  }
}

convertImage();
