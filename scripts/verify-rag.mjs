import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'rag-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'RagFlow', chromiumOptions});
assert.equal(composition.durationInFrames, 2700);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const beats = Array.from({length: 9}, (_, index) => index * 300 + 150);
const boundaries = Array.from({length: 8}, (_, index) => [(index + 1) * 300 - 1, (index + 1) * 300]).flat();
const frames = [1650, ...beats, ...boundaries, 0, 2699, 1650];
const hashes = [];
for (const [index, frame] of frames.entries()) {
  const destination = path.join(output, `frame-${frame}-${index}.png`);
  await renderStill({
    serveUrl, composition, chromiumOptions, frame,
    output: destination, imageFormat: 'png', scale: 0.5,
  });
  hashes.push(createHash('sha256').update(await readFile(destination)).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'Runtime diagram changed after out-of-order seeking');
assert.equal(new Set(hashes.slice(1, 10)).size, 9, 'All nine story beats should differ');
console.log(`Verified 90-second RAG composition, nine beats/boundaries, repeated runtime frame: ${hashes[0]}`);
