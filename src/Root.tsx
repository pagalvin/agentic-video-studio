import {Composition} from 'remotion';
import {AgenticDevelopment} from './video/AgenticDevelopment';
import {DURATION_IN_FRAMES, FPS} from './video/story';
import {ManufacturingPillars} from './pillars/ManufacturingPillars';
import {PILLARS_DURATION, PILLARS_FPS} from './pillars/content';

export const VideoRoot = () => (
  <>
    <Composition
      id="AgenticDevelopment"
      component={AgenticDevelopment}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="ManufacturingPillars"
      component={ManufacturingPillars}
      durationInFrames={PILLARS_DURATION}
      fps={PILLARS_FPS}
      width={1920}
      height={1080}
    />
  </>
);
