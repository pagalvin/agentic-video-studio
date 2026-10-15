import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import ts from 'typescript';

const source = await readFile(new URL('../src/batch/story.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}});
const {BATCH_DURATION, getBatchState} = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);

for (let frame = 0; frame < BATCH_DURATION; frame++) {
  const state = getBatchState(frame);
  assert.equal(Object.values(state.counts).reduce((a, b) => a + b, 0), 6);
  assert.ok(state.counts.processing <= 3, 'Worker capacity exceeded');
  assert.equal(state.batchStatus === 'Succeeded', state.counts.succeeded === 6);
}
assert.deepEqual(getBatchState(720).counts, {queued: 3, processing: 3, succeeded: 0, failed: 0});
assert.deepEqual(getBatchState(840).counts, {queued: 0, processing: 3, succeeded: 3, failed: 0});
assert.equal(getBatchState(1900).batchStatus, 'Completed with errors');
assert.equal(getBatchState(2050).counts.succeeded, 5, 'Retry must preserve successful files');
assert.equal(getBatchState(2150).counts.processing, 1);
assert.equal(getBatchState(2300).counts.succeeded, 6);

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'batch-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'BatchProcessing', chromiumOptions});
assert.equal(composition.durationInFrames, 2700);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const hash = (data) => createHash('sha256').update(data).digest('hex');
const frames = [...Array.from({length: 12}, (_, i) => i * 225 + 112),
  ...Array.from({length: 11}, (_, i) => [(i + 1) * 225 - 1, (i + 1) * 225]).flat(),
  720, 840, 2120, 2135, 2699, 1912];
const hashes = new Map();
for (const frame of frames) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  const digest = hash(await readFile(destination));
  if (hashes.has(frame)) assert.equal(hashes.get(frame), digest, 'Seeking changed the frame');
  hashes.set(frame, digest);
}
assert.equal(new Set(frames.slice(0, 12).map((f) => hashes.get(f))).size, 12);
const ffmpeg = process.platform === 'win32'
  ? path.join(root, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe') : 'ffmpeg';
const diagramHash = (frame) => {
  const result = spawnSync(ffmpeg, ['-v', 'error', '-i', path.join(output, `frame-${frame}.png`),
    '-vf', 'crop=570:195:25:117', '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', '-'], {maxBuffer: 1024 * 1024});
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr?.toString());
  return hash(result.stdout);
};
assert.notEqual(diagramHash(2120), diagramHash(2135), 'Retry packets must move independently of the progress bar');
console.log(`Verified 90-second batch video, every frame's counts/capacity, 12 beats/boundaries, retry movement and repeat hash ${hashes.get(1912)}`);
