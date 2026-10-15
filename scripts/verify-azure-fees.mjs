import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

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
