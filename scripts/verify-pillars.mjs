import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'pillars-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'ManufacturingPillars', chromiumOptions});
assert.equal(composition.durationInFrames, 1440);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const frames = [270, 90, 480, 690, 900, 1110, 1320, 0, 179, 180, 389, 390, 599, 600, 809, 810, 1019, 1020, 1229, 1230, 1439, 270];
const hashes = [];
for (const [index, frame] of frames.entries()) {
  const destination = path.join(output, `frame-${frame}-${index}.png`);
  await renderStill({
    serveUrl,
    composition,
    chromiumOptions,
    frame,
    output: destination,
    imageFormat: 'png',
    scale: 0.5,
  });
  hashes.push(createHash('sha256').update(await readFile(destination)).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'Pillar frame changed after out-of-order seeking');
assert.equal(new Set(hashes.slice(0, 7)).size, 7, 'The seven beats should have different output');
console.log(`Verified 48-second composition, all seven beats and boundaries, repeated-frame SHA-256 ${hashes[0]}`);
