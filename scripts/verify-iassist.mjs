import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'iassist-verification');
await mkdir(output, {recursive: true});
const load = async (file) => {
  const compiled = ts.transpileModule(await readFile(path.join(root, file), 'utf8'), {compilerOptions: {module: ts.ModuleKind.ESNext}});
  return import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
};
const {narration} = await load('src/iassist/narration.ts');
const {iassistScript} = await load('src/iassist/script.ts');
assert.equal(narration.length, 10);
let cursor = 0;
const frames = [];
for (const [i, clip] of narration.entries()) {
  assert.equal(clip.text, iassistScript[i]);
  assert.ok(clip.seconds > 3);
  const audio = await readFile(path.join(root, 'public', clip.file));
  assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
  const duration = 42 + Math.ceil(clip.seconds * 30);
  frames.push(cursor + 10, cursor + Math.floor(duration * 0.55), cursor + duration - 1);
  cursor += duration;
}
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'IAssist', chromiumOptions});
assert.equal(composition.durationInFrames, cursor);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const hashes = new Map();
for (const frame of [...frames, frames[4]]) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  const digest = createHash('sha256').update(await readFile(destination)).digest('hex');
  if (hashes.has(frame)) assert.equal(hashes.get(frame), digest, 'Seeking changed a repeated frame');
  hashes.set(frame, digest);
}
assert.equal(new Set(frames.map((f) => hashes.get(f))).size, frames.length);
console.log(`Verified 10 narrated iAssist scenes, assets and deterministic seeking: ${cursor} frames / ${(cursor / 30).toFixed(2)} seconds.`);
