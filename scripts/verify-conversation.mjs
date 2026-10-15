import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const compile = (source) => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
}).outputText).toString('base64')}`;
let story = await readFile(path.join(root, 'src', 'conversation', 'dialogue.ts'), 'utf8');
for (const name of ['lines', 'narration']) {
  const source = await readFile(path.join(root, 'src', 'conversation', `${name}.ts`), 'utf8');
  story = story.replace(`'./${name}'`, JSON.stringify(compile(source)));
}
const {dialogue, CONVERSATION_DURATION} = await import(compile(story));
assert.equal(dialogue.filter((line) => line.clip).length, 4);
for (const [i, line] of dialogue.entries()) {
  assert.equal(line.start, i === 0 ? 0 : dialogue[i - 1].end);
  if (!line.clip) continue;
  assert.ok(line.audioStart > line.start);
  assert.ok(line.audioEnd < line.end);
  assert.equal(line.audioEnd - line.audioStart, Math.ceil(line.clip.seconds * 30));
  assert.ok(line.clip.envelope.some((value) => value > 0.03));
  const audio = await readFile(path.join(root, 'public', line.clip.file));
  assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
}
const output = path.join(root, 'out', 'conversation-verification');
await mkdir(output, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts')});
const chromiumOptions = {gl: 'swiftshader'};
const composition = await selectComposition({serveUrl, id: 'CafeConversation', chromiumOptions});
assert.equal(composition.durationInFrames, CONVERSATION_DURATION);
assert.equal(composition.fps, 30);
const middle = dialogue.map((line) => Math.floor((line.start + line.end) / 2));
const frames = [...middle, middle[1] + 10, ...dialogue.slice(1).flatMap((line) => [line.start - 1, line.start]),
  CONVERSATION_DURATION - 1, middle[0]];
const hashes = [];
for (const frame of frames) {
  const destination = path.join(output, `frame-${frame}.png`);
  await renderStill({serveUrl, composition, chromiumOptions, frame, output: destination, imageFormat: 'png', scale: 0.5});
  hashes.push(createHash('sha256').update(await readFile(destination)).digest('hex'));
}
assert.equal(hashes[0], hashes.at(-1), 'Reaction frame changed after seeking');
assert.notEqual(hashes[1], hashes[6], 'Speaker gesture should animate');
assert.equal(new Set(hashes.slice(0, 6)).size, 6);
console.log(`Verified ${CONVERSATION_DURATION}-frame voiced conversation, audio timing, boundaries, movement and repeat-frame hash ${hashes[0]}`);
