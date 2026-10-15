import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'azure-fees-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'AzureFeeArchitecture', chromiumOptions});
assert.equal(composition.durationInFrames, 3000);
assert.equal(composition.fps, 30);
const frames = [...Array.from({length: 10}, (_, i) => i * 300 + 150),
  ...Array.from({length: 9}, (_, i) => [(i + 1) * 300 - 1, (i + 1) * 300]).flat(), 1365, 2999, 1350];
const hash = (data) => createHash('sha256').update(data).digest('hex');
const hashes = new Map();
for (const frame of frames) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  const digest = hash(await readFile(destination));
  if (hashes.has(frame)) assert.equal(hashes.get(frame), digest);
  hashes.set(frame, digest);
}
assert.equal(new Set(frames.slice(0, 10).map((f) => hashes.get(f))).size, 10);
const ffmpeg = process.platform === 'win32' ? path.join(root, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe') : 'ffmpeg';
const crop = (frame) => {
  const result = spawnSync(ffmpeg, ['-v', 'error', '-i', path.join(output, `frame-${frame}.png`),
    '-vf', 'crop=700:340:30:90', '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', '-'], {maxBuffer: 1024 * 1024});
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr?.toString());
  return hash(result.stdout);
};
assert.notEqual(crop(1350), crop(1365), 'Resource-to-resource packets must move independently of captions/progress');
console.log(`Verified 100-second Azure resource map, ten beats/boundaries, diagram motion and repeated hash ${hashes.get(1350)}`);
const source = await readFile(path.join(root, 'src', 'azureFees', 'narration.ts'), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}});
const {narration} = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
assert.equal(narration.length, 10);
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
const voiced = await selectComposition({serveUrl, id: 'AzureFeeArchitectureNarrated', chromiumOptions});
assert.equal(voiced.durationInFrames, cursor);
for (const frame of [...narratedFrames, narratedFrames[1]]) {
  const destination = path.join(output, `narrated-${frame}.png`);
  await renderStill({serveUrl, composition: voiced, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  const digest = hash(await readFile(destination));
  const key = `voiced-${frame}`;
  if (hashes.has(key)) assert.equal(hashes.get(key), digest);
  hashes.set(key, digest);
}
console.log(`Verified ten narrated scenes, audio assets, boundaries and repeated frame: ${cursor} frames / ${(cursor / 30).toFixed(2)} seconds.`);
