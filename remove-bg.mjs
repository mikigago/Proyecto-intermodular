import { Jimp } from 'jimp';
import { readdirSync } from 'fs';
import { join } from 'path';

const spritesDir = './kapido-frontend/src/assets/sprites';
const THRESHOLD = 30; // tolerancia: cuanto más alto, más agresivo eliminando fondo

const files = readdirSync(spritesDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const filePath = join(spritesDir, file);
  const img = await Jimp.read(filePath);

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // Si el píxel es blanco o casi blanco, lo hace transparente
    if (r > 255 - THRESHOLD && g > 255 - THRESHOLD && b > 255 - THRESHOLD) {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  await img.write(filePath);
  console.log(`✓ ${file}`);
}

console.log('\nListo: fondo blanco eliminado de todos los frames.');
