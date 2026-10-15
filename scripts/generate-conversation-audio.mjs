import {loadEnvFile} from 'node:process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const azureFees = process.argv.includes('--azure-fees');
const iassist = process.argv.includes('--iassist');
const fees = azureFees || iassist || process.argv.includes('--fees');
const kind = iassist ? 'iassist' : azureFees ? 'azureFees' : fees ? 'fees' : 'conversation';
try {
  loadEnvFile(path.join(root, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value || value.startsWith('replace-with-')) throw new Error(`Set ${name} in the local .env or process environment.`);
  return value;
};
const key = required('SPEECH_KEY');
const region = required('SPEECH_REGION');
if (!/^[a-z0-9-]+$/.test(region)) throw new Error('SPEECH_REGION must be an Azure region identifier.');
const endpoint = new URL(process.env.SPEECH_ENDPOINT || `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`);
if (endpoint.protocol !== 'https:' || !endpoint.hostname.endsWith('.cognitive.microsoft.com') &&
    !endpoint.hostname.endsWith('.cognitiveservices.azure.com') && !endpoint.hostname.endsWith('.tts.speech.microsoft.com')) {
  throw new Error('SPEECH_ENDPOINT must be an HTTPS Azure Speech endpoint.');
}
if (endpoint.pathname === '/') endpoint.pathname = '/cognitiveservices/v1';
const voices = fees ? {Narrator: required('SPEECH_VOICE')} : {Milo: required('SPEECH_VOICE_MILO'), June: required('SPEECH_VOICE_JUNE')};
const source = await readFile(path.join(root, 'src', kind, fees ? 'script.ts' : 'lines.ts'), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}});
const content = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
const conversationLines = fees ? (content.iassistScript ?? content.feeScript).map((text) => ({text, speaker: 'Narrator'})) : content.conversationLines;
const output = path.join(root, 'public', 'audio', kind);
await mkdir(output, {recursive: true});
const escapeXml = (text) => text.replace(/[<>&"']/g, (char) => ({'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;'}[char]));

const inspectWav = (audio) => {
  if (audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE') throw new Error('Expected a RIFF/WAVE audio response.');
  let pcm;
  let sampleRate;
  for (let offset = 12; offset + 8 <= audio.length;) {
    const size = audio.readUInt32LE(offset + 4);
    if (offset + 8 + size > audio.length) throw new Error('Truncated WAV file.');
    const tag = audio.toString('ascii', offset, offset + 4);
    if (tag === 'fmt ') {
      if (size < 16 || audio.readUInt16LE(offset + 8) !== 1 || audio.readUInt16LE(offset + 10) !== 1 ||
          audio.readUInt16LE(offset + 22) !== 16) throw new Error('Expected mono 16-bit PCM.');
      sampleRate = audio.readUInt32LE(offset + 12);
    }
    if (tag === 'data') pcm = audio.subarray(offset + 8, offset + 8 + size);
    offset += 8 + size + size % 2;
  }
  if (!pcm?.length || !sampleRate) throw new Error('Missing WAV audio data or format.');
  const seconds = pcm.length / 2 / sampleRate;
  const envelope = Array.from({length: Math.ceil(seconds * 30)}, (_, frame) => {
    const start = Math.floor(frame * sampleRate / 30);
    const end = Math.min(pcm.length / 2, Math.floor((frame + 1) * sampleRate / 30));
    let sum = 0;
    for (let i = start; i < end; i++) sum += (pcm.readInt16LE(i * 2) / 32768) ** 2;
    return Number(Math.min(1, Math.sqrt(sum / Math.max(1, end - start)) * 9).toFixed(3));
  });
  if (!envelope.some((value) => value > 0.03)) throw new Error('Synthesis returned silent audio.');
  return {seconds, envelope};
};

const clips = [];
for (const [index, line] of conversationLines.entries()) {
  if (!line.speaker) { clips.push(null); continue; }
  const voice = voices[line.speaker];
  const spoken = voice.includes(':Dragon') ? escapeXml(line.text) : `<prosody rate="-5%">${escapeXml(line.text)}</prosody>`;
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${escapeXml(voice)}">${spoken}</voice></speak>`;
  const digest = createHash('sha256').update(`${endpoint.href}\n${ssml}\nriff-24khz-16bit-mono-pcm`).digest('hex').slice(0, 20);
  const filename = `line-${index}-${digest}.wav`;
  const destination = path.join(output, filename);
  let audio;
  try { audio = await readFile(destination); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!audio) {
    console.log(`Generating line ${index} / ${line.speaker} / ${voice}`);
    const response = await fetch(endpoint, {method: 'POST', signal: AbortSignal.timeout(60000), headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
      'User-Agent': 'agentic-video-studio',
    }, body: ssml});
    if (!response.ok) throw new Error(`Azure Speech HTTP ${response.status} for line ${index}. Check resource region, voice, credentials, network rules and quota.`);
    audio = Buffer.from(await response.arrayBuffer());
    inspectWav(audio);
    await writeFile(destination, audio);
  } else console.log(`Reusing line ${index} / ${line.speaker}`);
  const inspected = inspectWav(audio);
  clips.push({file: `audio/${kind}/${filename}`, text: line.text, voice,
    ...(fees ? {seconds: inspected.seconds} : inspected)});
  if (fees) await new Promise((resolve) => setTimeout(resolve, 3200));
}
await writeFile(path.join(root, 'src', kind, 'narration.ts'),
  `// Generated by npm run audio:${kind}. No credentials are included.\nexport const narration = ${JSON.stringify(clips, null, 2)} as const;\n`);
console.log(`Saved ${clips.filter(Boolean).length} speech clips. No Azure calls are needed during rendering.`);
