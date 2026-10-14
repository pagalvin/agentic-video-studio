import {gsap} from 'gsap';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SCENE_FRAMES, story} from './story';
import {WorkflowScene} from './WorkflowScene';

const easeOut = gsap.parseEase('power2.out');
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const AgenticDevelopment = () => {
  const frame = useCurrentFrame();
  const step = Math.min(Math.floor(frame / SCENE_FRAMES), story.length - 1);
  const localFrame = frame % SCENE_FRAMES;
  const scene = story[step];
  const reveal = easeOut(interpolate(localFrame, [0, 24], [0, 1], clamp));
  const opacity = interpolate(localFrame, [0, 16, 280, 299], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{background: '#0b1220', color: '#f8fafc', fontFamily: 'Arial, sans-serif'}}>
      <AbsoluteFill
        style={{background: `radial-gradient(ellipse at 78% 45%, ${scene.color}18, transparent 60%)`}}
      />
      <div style={{position: 'absolute', top: 72, left: 90, fontSize: 24, letterSpacing: 4, color: '#94a3b8'}}>
        AGENTIC SOFTWARE DEVELOPMENT
      </div>
      <div style={{position: 'absolute', left: 90, top: 245, width: 840, opacity, transform: `translateY(${(1 - reveal) * 35}px)`}}>
        <div style={{fontSize: 27, fontWeight: 700, letterSpacing: 3, color: scene.color, marginBottom: 26}}>
          {String(step + 1).padStart(2, '0')} / {scene.label}
        </div>
        <div style={{fontSize: 80, fontWeight: 700, lineHeight: 1.1, marginBottom: 35}}>
          {scene.title}
        </div>
        <div style={{fontSize: 34, lineHeight: 1.5, color: '#cbd5e1'}}>{scene.detail}</div>
      </div>
      <div style={{position: 'absolute', right: 50, top: 150}}>
        <WorkflowScene step={step} />
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 180, display: 'flex', gap: 18}}>
        {story.map((item, index) => (
          <div key={item.label} style={{flex: 1}}>
            <div style={{height: 6, background: index <= step ? item.color : '#334155', marginBottom: 14}} />
            <div style={{fontSize: 18, color: index === step ? '#ffffff' : '#94a3b8', letterSpacing: 1}}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 62, fontSize: 30, lineHeight: 1.4, color: '#e2e8f0', opacity}}>
        {scene.caption}
      </div>
    </AbsoluteFill>
  );
};
