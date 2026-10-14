import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'coffee-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'FrenchPressCoffee', chromiumOptions});
assert.equal(composition.durationInFrames, 2160);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const frames = [1215, 135, 405, 675, 945, 1485, 1755, 2025, 1095, 1310, 1920, 2120, 0, 269, 270, 539, 540, 809, 810, 1079, 1080, 1349, 1350, 1619, 1620, 1889, 1890, 2159, 1215];
const hashes = [];
for (const [index, frame] of frames.entries()) {
  const destination = path.join(output, `frame-${frame}-${index}.png`);
  await renderStill({
    serveUrl, composition, chromiumOptions, frame,
    output: destination, imageFormat: 'png', scale: 0.5,
  });
  hashes.push(createHash('sha256').update(await readFile(destination)).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'Water pouring changed after out-of-order seeking');
assert.equal(new Set(hashes.slice(0, 8)).size, 8, 'The eight coffee scenes should differ');
console.log(`Verified 72-second coffee composition, all scenes/boundaries and repeated pouring frame: ${hashes[0]}`);
