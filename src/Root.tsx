import {Composition} from 'remotion';
import {AgenticDevelopment} from './video/AgenticDevelopment';
import {DURATION_IN_FRAMES, FPS} from './video/story';
import {ManufacturingPillars} from './pillars/ManufacturingPillars';
import {PILLARS_DURATION, PILLARS_FPS} from './pillars/content';
import {FrenchPressCoffee} from './coffee/FrenchPressCoffee';
import {COFFEE_DURATION, COFFEE_FPS} from './coffee/recipe';
import {RagFlow} from './rag/RagFlow';
import {RAG_DURATION, RAG_FPS} from './rag/story';
import {OAuthFlows} from './oauth/OAuthFlows';
import {OAUTH_DURATION, OAUTH_FPS} from './oauth/story';

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
    <Composition
      id="FrenchPressCoffee"
      component={FrenchPressCoffee}
      durationInFrames={COFFEE_DURATION}
      fps={COFFEE_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="RagFlow"
      component={RagFlow}
      durationInFrames={RAG_DURATION}
      fps={RAG_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="OAuthFlows"
      component={OAuthFlows}
      durationInFrames={OAUTH_DURATION}
      fps={OAUTH_FPS}
      width={1920}
      height={1080}
    />
  </>
);
