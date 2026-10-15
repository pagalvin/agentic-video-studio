import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import ts from 'typescript';

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
const source = await readFile(path.join(root, 'src', 'fees', 'narration.ts'), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}});
const {narration} = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
assert.equal(narration.length, 12);
let cursor = 0;
const narratedFrames = [];
for (const clip of narration) {
  const duration = 42 + Math.ceil(clip.seconds * 30);
  const audio = await readFile(path.join(root, 'public', clip.file));
  assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
  assert.ok(clip.seconds > 0);
  narratedFrames.push(cursor, cursor + Math.floor(duration / 2), cursor + duration - 1);
  cursor += duration;
}
const voiced = await selectComposition({serveUrl, id: 'FeeOperationsNarrated', chromiumOptions});
assert.equal(voiced.durationInFrames, cursor);
for (const frame of [...narratedFrames, narratedFrames[1]]) {
  const destination = path.join(output, `narrated-${frame}.png`);
  await renderStill({serveUrl, composition: voiced, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  const digest = createHash('sha256').update(await readFile(destination)).digest('hex');
  const key = `voiced-${frame}`;
  if (hashes.has(key)) assert.equal(hashes.get(key), digest);
  hashes.set(key, digest);
}
console.log(`Verified 12 voiced scenes and assets, boundaries and deterministic seeking: ${cursor} frames / ${(cursor / 30).toFixed(2)} seconds.`);
