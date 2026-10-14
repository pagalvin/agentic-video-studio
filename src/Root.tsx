import {Composition} from 'remotion';
import {AgenticDevelopment} from './video/AgenticDevelopment';
import {DURATION_IN_FRAMES, FPS} from './video/story';

export const VideoRoot = () => (
  <Composition
    id="AgenticDevelopment"
    component={AgenticDevelopment}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
