import {Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AzureFeeArchitecture} from './AzureFeeArchitecture';
import {narration} from './narration';
import {feeScript} from './script';
import {AZURE_FEE_FPS} from './story';

let cursor = 0;
export const azureNarratedScenes = narration.map((clip, beat) => {
  if (clip.text !== feeScript[beat]) throw new Error('Azure architecture narration is stale. Run npm run audio:azure-fees.');
  const start = cursor;
  const audioFrames = Math.ceil(clip.seconds * AZURE_FEE_FPS);
  const duration = 18 + audioFrames + 24;
  cursor += duration;
  return {beat, start, duration, audioFrames, clip};
});
export const AZURE_NARRATED_DURATION = cursor;

export const AzureFeeArchitectureNarrated = () => {
  const frame = useCurrentFrame();
  const scene = azureNarratedScenes.find((item) => frame >= item.start && frame < item.start + item.duration);
  if (!scene) throw new Error('Frame outside narrated Azure architecture timeline.');
  const local = frame - scene.start;
  const sentences = scene.clip.text.match(/[^.!?]+[.!?]+/g) ?? [scene.clip.text];
  const words = sentences.map((sentence) => sentence.trim().split(/\s+/).length);
  const total = words.reduce((sum, count) => sum + count, 0);
  const progress = Math.max(0, Math.min(0.999, (local - 18) / scene.audioFrames)) * total;
  let boundary = 0;
  const index = words.findIndex((count) => { boundary += count; return progress < boundary; });
  return <>
    <AzureFeeArchitecture scene={{beat: scene.beat, local, duration: scene.duration}} subtitle={sentences[Math.max(0, index)].trim()} />
    {azureNarratedScenes.map((item) => <Sequence key={item.start} from={item.start + 18} durationInFrames={item.audioFrames} layout="none">
      <Audio src={staticFile(item.clip.file)} />
    </Sequence>)}
  </>;
};
