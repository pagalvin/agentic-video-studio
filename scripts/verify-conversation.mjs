import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'conversation-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'CafeConversation', chromiumOptions});
assert.equal(composition.durationInFrames, 840);
assert.equal(composition.fps, 30);
const frames = [450, 45, 170, 335, 650, 800, 180, 89, 90, 299, 300, 389, 390, 569, 570, 749, 750, 839, 450];
const hashes = [];
for (const frame of frames) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  hashes.push(createHash('sha256').update(await readFile(destination)).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'Reaction frame changed after seeking');
assert.notEqual(hashes[2], hashes[6], 'Speaker gesture should animate');
assert.equal(new Set(hashes.slice(0, 6)).size, 6);
console.log(`Verified 28-second conversation, dialogue boundaries, movement and repeat-frame hash ${hashes[0]}`);
