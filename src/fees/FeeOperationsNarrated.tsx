import {Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FeeOperations} from './FeeOperations';
import {narration} from './narration';
import {feeScript} from './script';
import {FEE_FPS} from './story';

let cursor = 0;
export const narratedScenes = narration.map((clip, beat) => {
  if (clip.text !== feeScript[beat]) throw new Error('Fee narration is stale. Run npm run audio:fees.');
  const start = cursor;
  const audioFrames = Math.ceil(clip.seconds * FEE_FPS);
  const duration = 18 + audioFrames + 24;
  cursor += duration;
  return {beat, start, duration, audioFrames, clip};
});
export const NARRATED_FEE_DURATION = cursor;

export const FeeOperationsNarrated = () => {
  const frame = useCurrentFrame();
  const scene = narratedScenes.find((item) => frame >= item.start && frame < item.start + item.duration);
  if (!scene) throw new Error('Frame outside narrated fee timeline.');
  const local = frame - scene.start;
  const sentences = scene.clip.text.match(/[^.!?]+[.!?]+/g) ?? [scene.clip.text];
  const words = sentences.map((sentence) => sentence.trim().split(/\s+/).length);
  const total = words.reduce((sum, count) => sum + count, 0);
  const progress = Math.max(0, Math.min(0.999, (local - 18) / scene.audioFrames)) * total;
  let boundary = 0;
  const index = words.findIndex((count) => { boundary += count; return progress < boundary; });
  return <>
    <FeeOperations scene={{beat: scene.beat, local, duration: scene.duration}} subtitle={sentences[Math.max(0, index)].trim()} />
    {narratedScenes.map((item) => <Sequence key={item.start} from={item.start + 18} durationInFrames={item.audioFrames} layout="none">
      <Audio src={staticFile(item.clip.file)} />
    </Sequence>)}
  </>;
};
