import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CafeScene} from './CafeScene';
import {CONVERSATION_DURATION, getDialogue} from './dialogue';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const CafeConversation = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = getDialogue(frame);
  const local = frame - beat.start;
  const reveal = spring({frame: local, fps, config: {damping: 18}});
  const opacity = interpolate(local, [0, 9, beat.end - beat.start - 10, beat.end - beat.start - 1], [0, 1, 1, 0], clamp);
  const left = beat.speaker === 'Milo';
  const accent = left ? '#267a76' : '#a4573b';
  return (
    <AbsoluteFill style={{background: '#e5d6bb', fontFamily: 'Arial, sans-serif', color: '#273e3b'}}>
      <CafeScene />
      <div style={{position: 'absolute', top: 40, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 4}}>
        <span>THE COFFEE BREAK</span><span>A SMALL CONVERSATION</span>
      </div>
      <div style={{position: 'absolute', top: 80, left: beat.speaker ? left ? 145 : 965 : 410, width: beat.speaker ? 810 : 1100, boxSizing: 'border-box', padding: '18px 32px', background: '#fff9ed', border: `3px solid ${beat.speaker ? accent : '#718e7d'}`, borderRadius: 30, boxShadow: '0 12px 30px #263a3020', opacity, transform: `translateY(${(1 - reveal) * 20}px) scale(${0.97 + reveal * 0.03})`}}>
        {beat.speaker && <div style={{fontSize: 21, fontWeight: 700, letterSpacing: 4, marginBottom: 12, color: accent}}>{beat.speaker.toUpperCase()}</div>}
        <div style={{fontSize: 40, fontWeight: 700, lineHeight: 1.2, textAlign: beat.speaker ? 'left' : 'center'}}>{beat.text}</div>
        {beat.speaker && <div style={{position: 'absolute', bottom: -18, left: left ? 420 : 220, width: 30, height: 30, background: '#fff9ed', borderRight: `3px solid ${accent}`, borderBottom: `3px solid ${accent}`, transform: 'rotate(45deg)'}} />}
      </div>
      <div style={{position: 'absolute', bottom: 45, left: 170, right: 170, display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 700, letterSpacing: 3}}>
        <span style={{color: '#226662', background: '#fff9ede8', borderRadius: 20, padding: '12px 25px'}}>MILO / {beat.speaker === 'Milo' ? 'TELLING' : beat.mood === 'laugh' ? 'AMUSED' : 'LISTENING'}</span>
        <span style={{color: '#924b34', background: '#fff9ede8', borderRadius: 20, padding: '12px 25px'}}>JUNE / {beat.speaker === 'June' ? 'REPLYING' : beat.mood === 'laugh' ? 'AMUSED' : 'LISTENING'}</span>
      </div>
      <div style={{position: 'absolute', bottom: 0, height: 4, background: '#267a76', width: `${frame / (CONVERSATION_DURATION - 1) * 100}%`}} />
    </AbsoluteFill>
  );
};
