import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CoffeeScene} from './CoffeeScene';
import {coffeeScenes, COFFEE_DURATION, COFFEE_SCENE_FRAMES} from './recipe';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const FrenchPressCoffee = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const index = Math.min(Math.floor(frame / COFFEE_SCENE_FRAMES), coffeeScenes.length - 1);
  const localFrame = frame % COFFEE_SCENE_FRAMES;
  const scene = coffeeScenes[index];
  const entrance = spring({frame: localFrame, fps, config: {damping: 200}});
  const opacity = interpolate(localFrame, [0, 14, 252, 269], [0, 1, 1, 0], clamp);
  const timerSeconds = Math.floor(interpolate(localFrame, [0, 240], [0, 240], clamp));

  return (
    <AbsoluteFill style={{background: '#171c1b', color: '#faf1df', fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 40%, #59655755, transparent 65%)'}} />
      <div style={{position: 'absolute', top: 55, left: 85, right: 85, display: 'flex', justifyContent: 'space-between', fontSize: 23, letterSpacing: 4, color: '#b7c3b3'}}>
        <span>THE MORNING RITUAL</span><span>FRENCH PRESS / 1:16.7</span>
      </div>
      <div style={{position: 'absolute', left: 85, top: 245, width: 710, opacity, transform: `translateY(${(1 - entrance) * 35}px)`}}>
        <div style={{fontSize: 24, letterSpacing: 4, color: '#dbad6c', marginBottom: 28}}>{scene.kicker}</div>
        <div style={{fontSize: 94, fontWeight: 800, lineHeight: 1.05, marginBottom: 38}}>{scene.title}</div>
        <div style={{fontSize: 36, lineHeight: 1.5, color: '#ded9cb'}}>{scene.detail}</div>
        <div style={{fontSize: 28, lineHeight: 1.5, color: '#aebcad', marginTop: 32, paddingLeft: 22, borderLeft: '3px solid #dbad6c'}}>{scene.tip}</div>
        <div style={{fontSize: 28, letterSpacing: 2, color: '#dbad6c', marginTop: 34}}>{scene.metric}</div>
      </div>
      <div style={{position: 'absolute', right: -5, top: 130}}>
        <CoffeeScene scene={index} />
      </div>
      {index >= 3 && index <= 6 && (
        <div style={{position: 'absolute', top: 150, right: 95, padding: '10px 18px', border: '1px solid #789084', borderRadius: 6, fontSize: 20, color: '#bccdc2', letterSpacing: 2}}>ILLUSTRATIVE CUTAWAY</div>
      )}
      {index === 1 && (
        <div style={{position: 'absolute', top: 170, right: 100, fontSize: 22, color: '#bccdc2'}}>BURR MECHANISM / SIMPLIFIED CUTAWAY</div>
      )}
      {index === 5 && (
        <div style={{position: 'absolute', right: 115, bottom: 195, textAlign: 'right', background: '#171c1be8', borderRadius: 10, padding: '14px 24px'}}>
          <div style={{fontSize: 72, color: '#dbad6c', fontVariantNumeric: 'tabular-nums'}}>{Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}</div>
          <div style={{fontSize: 19, letterSpacing: 3, color: '#bccdc2'}}>TIME COMPRESSED</div>
        </div>
      )}
      {index === 2 && (
        <div style={{position: 'absolute', right: 115, bottom: 210, fontSize: 25, color: '#dbad6c', background: '#171c1be8', borderRadius: 8, padding: '12px 20px'}}>
          {localFrame < 130 ? 'HEAT TO BOIL' : 'LET COOL / 93–96°C'}
        </div>
      )}
      <div style={{position: 'absolute', bottom: 46, left: 65, right: 65, display: 'flex', gap: 15, padding: '18px 20px', borderRadius: 10, background: '#171c1bf0'}}>
        {['Recipe', 'Grind', 'Heat', 'Grounds', 'Pour', 'Steep', 'Plunge', 'Serve'].map((label, i) => (
          <div key={label} style={{flex: 1}}>
            <div style={{height: 3, background: i <= index ? '#dbad6c' : '#46534c', marginBottom: 13}} />
            <span style={{fontSize: 20, letterSpacing: 1, color: i === index ? '#faf1df' : '#8a9b90'}}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 0, height: 4, background: '#dbad6c', width: `${frame / (COFFEE_DURATION - 1) * 100}%`}} />
    </AbsoluteFill>
  );
};
