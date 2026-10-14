import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'oauth-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'OAuthFlows', chromiumOptions});
assert.equal(composition.durationInFrames, 5400);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const beats = Array.from({length: 18}, (_, index) => index * 300 + 225);
const boundaries = Array.from({length: 17}, (_, index) => [(index + 1) * 300 - 1, (index + 1) * 300]).flat();
const frames = [1555, ...beats, ...boundaries, 3025, 3075, 4235, 4300, 0, 5399, 1565, 1555];
const hashes = [];
for (const [index, frame] of frames.entries()) {
  const destination = path.join(output, `frame-${frame}-${index}.png`);
  await renderStill({
    serveUrl, composition, chromiumOptions, frame,
    output: destination, imageFormat: 'png', scale: 0.5,
  });
  const image = await readFile(destination);
  assert.equal(image.readUInt32BE(16), 960);
  assert.equal(image.readUInt32BE(20), 540);
  hashes.push(createHash('sha256').update(image).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'PKCE exchange changed after out-of-order seeking');
assert.notEqual(hashes[0], hashes.at(-2), 'PKCE message should move during transit');
assert.equal(new Set(hashes.slice(1, 19)).size, 18, 'All eighteen protocol beats should differ');
console.log(`Verified 180-second OAuth composition, 18 beats/boundaries, Azure mapping/cookie phases, repeated PKCE frame: ${hashes[0]}`);
