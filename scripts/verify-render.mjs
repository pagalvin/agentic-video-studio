import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({
  serveUrl,
  id: 'AgenticDevelopment',
  chromiumOptions,
});
assert.equal(composition.durationInFrames, 1800);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);

// Seek out of order, across every story boundary, then repeat a 3D frame.
const frames = [450, 0, 299, 300, 600, 900, 1200, 1500, 1799, 450];
const hashes = [];
for (const [index, frame] of frames.entries()) {
  const destination = path.join(output, `frame-${index}-${frame}.png`);
  await renderStill({
    serveUrl,
    composition,
    frame,
    output: destination,
    imageFormat: 'png',
    scale: 0.5,
    chromiumOptions,
  });
  hashes.push(createHash('sha256').update(await readFile(destination)).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'Repeated frame changed after out-of-order seeking');
assert.notEqual(hashes[0], hashes[1], 'Different story frames should not be identical');

const video = path.join(output, 'sample.mp4');
await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  outputLocation: video,
  frameRange: [0, 29],
  scale: 0.5,
  concurrency: 1,
  chromiumOptions,
});
assert.ok((await stat(video)).size > 0, 'Sample video is empty');
console.log(`Verified 60-second composition, all scene boundaries, repeat-frame SHA-256 ${hashes[0]}, and 30-frame MP4: ${video}`);
