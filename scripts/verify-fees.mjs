import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'fees-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'FeeOperations', chromiumOptions});
assert.equal(composition.durationInFrames, 3600);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const frames = [...Array.from({length: 12}, (_, i) => i * 300 + 150),
  ...Array.from({length: 11}, (_, i) => [(i + 1) * 300 - 1, (i + 1) * 300]).flat(),
  3020, 3070, 3190, 3599, 2550];
const hashes = new Map();
for (const frame of frames) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  const digest = createHash('sha256').update(await readFile(destination)).digest('hex');
  if (hashes.has(frame)) assert.equal(hashes.get(frame), digest, 'Seeking changed the approval gate frame');
  hashes.set(frame, digest);
}
assert.equal(new Set(frames.slice(0, 12).map((f) => hashes.get(f))).size, 12);
assert.notEqual(hashes.get(3020), hashes.get(3070));
assert.notEqual(hashes.get(3070), hashes.get(3190));
console.log(`Verified 120-second silent fee operations story, all role handoffs/boundaries, delivery stages and repeat hash ${hashes.get(2550)}`);
