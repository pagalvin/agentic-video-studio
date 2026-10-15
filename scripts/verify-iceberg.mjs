import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'out', 'iceberg-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'SprintDemoIceberg', chromiumOptions});
assert.equal(composition.durationInFrames, 2520);
assert.equal(composition.fps, 30);
assert.equal(composition.width, 1920);
assert.equal(composition.height, 1080);
const hash = (data) => createHash('sha256').update(data).digest('hex');
const frames = [...Array.from({length: 12}, (_, i) => i * 210 + 105),
  ...Array.from({length: 11}, (_, i) => [(i + 1) * 210 - 1, (i + 1) * 210]).flat(),
  1785, 1800, 2205, 2220, 2519, 1785];
const hashes = [];
for (const frame of frames) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  hashes.push(hash(await readFile(destination)));
}
assert.equal(new Set(hashes.slice(0, 12)).size, 12, 'Each beat should have distinct content');
assert.equal(hashes[8], hashes.at(-1), 'Seeking must preserve the same image');
// Exclude captions, progress bar and waterline: only moving underwater paths/packets remain.
const ffmpeg = process.platform === 'win32'
  ? path.join(root, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe')
  : 'ffmpeg';
const diagramHash = (frame) => {
  const result = spawnSync(ffmpeg, ['-v', 'error', '-i', path.join(output, `frame-${frame}.png`),
    '-vf', 'crop=540:155:25:255', '-frames:v', '1', '-c:v', 'png', '-f', 'image2pipe', '-'], {maxBuffer: 1024 * 1024});
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr?.toString());
  return hash(result.stdout);
};
assert.notEqual(diagramHash(1785), diagramHash(1800), 'Outbound evidence paths must animate');
assert.notEqual(diagramHash(2205), diagramHash(2220), 'Returning feedback paths must animate');
console.log(`Verified 84-second iceberg, 12 beats/boundaries, two-way path animation and repeat-frame hash ${hashes.at(-1)}`);
