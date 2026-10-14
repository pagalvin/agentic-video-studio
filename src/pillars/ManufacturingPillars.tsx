import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {getPillarBeat, pillars, PILLARS_DURATION} from './content';
import {PillarNetwork} from './PillarNetwork';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ManufacturingPillars = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = getPillarBeat(frame);
  const pillar = pillars[Math.max(beat.index, 0)];
  const color = beat.kind === 'pillar' ? pillar.color : '#2ee9d3';
  const entrance = spring({frame: beat.localFrame, fps, config: {damping: 200}});
  const contentOpacity = interpolate(beat.localFrame, [0, 12, beat.duration - 12, beat.duration - 1], [0, 1, 1, 0], clamp);
  const scan = (frame * 9) % 2100;

  return (
    <AbsoluteFill style={{backgroundColor: '#050d18', fontFamily: 'Arial, sans-serif', color: '#f0f7ff', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 78% 48%, ${color}22 0%, transparent 60%)`}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#27405530 1px, transparent 1px), linear-gradient(90deg, #27405530 1px, transparent 1px)', backgroundSize: '80px 80px', transform: `translateY(${frame % 80}px)`, opacity: 0.4}} />
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: 0.5}}>
        {Array.from({length: 32}, (_, index) => (
          <circle key={index} cx={(index * 317 + frame * (index % 3 + 1)) % 1920} cy={(index * 173) % 1080} r={index % 4 === 0 ? 3 : 1.5} fill={color} />
        ))}
        <line x1={scan} y1={0} x2={scan - 260} y2={1080} stroke={color} strokeWidth={1} opacity={0.18} />
      </svg>
      <div style={{position: 'absolute', left: 80, right: 80, top: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, letterSpacing: 4}}>
        <span style={{color: '#8bb9cb'}}>MANUFACTURING AI CAPABILITY PROGRAM</span>
        <span style={{color}}>FIVE CONNECTED PILLARS</span>
      </div>
      <div style={{position: 'absolute', right: 30, top: beat.kind === 'outro' ? 60 : 160, opacity: interpolate(frame, [0, 25], [0, 1], clamp)}}>
        <PillarNetwork active={beat.index} />
      </div>
      <div style={{position: 'absolute', top: beat.kind === 'outro' ? 165 : 225, left: 90, width: 940, opacity: contentOpacity, transform: `translateY(${(1 - entrance) * 65}px)`}}>
        {beat.kind === 'intro' ? (
          <>
            <div style={{fontSize: 24, color, letterSpacing: 7, marginBottom: 20}}>CONNECTED BY DESIGN</div>
            <div style={{fontSize: 210, lineHeight: 0.95, fontWeight: 900, color, textShadow: `0 0 80px ${color}50`}}>5</div>
            <div style={{fontSize: 88, lineHeight: 1.08, fontWeight: 800, marginTop: 22}}>Connected pillars.<br />One AI capability.</div>
            <div style={{fontSize: 32, color: '#a9c4d6', marginTop: 30}}>An evolving system for manufacturing.</div>
          </>
        ) : beat.kind === 'pillar' ? (
          <>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 30}}>
              <span style={{fontSize: 78, fontWeight: 800, color, textShadow: `0 0 40px ${color}50`}}>0{beat.index + 1}</span>
              <span style={{fontSize: 24, color, letterSpacing: 5}}>{pillar.cue}</span>
            </div>
            <div style={{fontSize: pillar.title.length > 12 ? 88 : 112, lineHeight: 1.05, fontWeight: 800, marginBottom: 28}}>{pillar.title}</div>
            <div style={{fontSize: 40, lineHeight: 1.25, fontWeight: 700, color, marginBottom: 25}}>{pillar.headline}</div>
            <div style={{fontSize: 36, lineHeight: 1.4, maxWidth: 830, color: '#dbeaf6'}}>{pillar.description}</div>
            <div style={{marginTop: 36, borderLeft: `4px solid ${color}`, paddingLeft: 25, fontSize: 30, lineHeight: 1.45, color: '#a9c4d6', maxWidth: 810}}>{pillar.note}</div>
          </>
        ) : (
          <>
            <div style={{fontSize: 24, color, letterSpacing: 5, marginBottom: 25}}>NOT A ONE-TIME CHECKLIST</div>
            <div style={{fontSize: 88, lineHeight: 1.1, fontWeight: 800}}>Build capability.<br /><span style={{color}}>Keep evolving.</span></div>
            <div style={{fontSize: 34, color: '#a9c4d6', marginTop: 35, lineHeight: 1.5, width: 790}}>Knowledge, readiness, accountability, decisions and delivery reinforce one another.</div>
          </>
        )}
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, bottom: beat.kind === 'outro' ? 170 : 95, display: 'flex', gap: 20}}>
        {pillars.map((item, index) => {
          const reveal = spring({frame: frame - 25 - index * 8, fps, config: {damping: 200}});
          const selected = beat.index === index || beat.kind === 'outro';
          return (
            <div key={item.title} style={{flex: 1, opacity: reveal, transform: `translateY(${(1 - reveal) * 25}px)`, padding: '20px 18px', border: `1px solid ${selected ? item.color : '#254052'}`, background: selected ? `${item.color}12` : '#0a1725', borderRadius: 12, boxShadow: selected ? `0 0 28px ${item.color}15` : 'none'}}>
              <div style={{fontSize: 19, letterSpacing: 3, color: item.color, marginBottom: 12}}>0{index + 1}</div>
              <div style={{fontSize: 25, fontWeight: 700, color: selected ? '#ffffff' : '#8ba9bd'}}>{item.title}</div>
            </div>
          );
        })}
      </div>
      {beat.kind === 'outro' && (
        <div style={{position: 'absolute', bottom: 80, left: 90, right: 90, textAlign: 'center', fontSize: 28, letterSpacing: 3, color: '#b8d1e2', opacity: contentOpacity}}>ENABLE TEAMS OF ANY SIZE. EVOLVE WITHIN GOVERNED PARAMETERS.</div>
      )}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 5, width: `${(frame / (PILLARS_DURATION - 1)) * 100}%`, background: color, boxShadow: `0 0 25px ${color}`}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, width: 90, left: interpolate(beat.localFrame, [0, 16], [-120, 2040], clamp), background: `linear-gradient(90deg, transparent, ${color}60, transparent)`, transform: 'skewX(-15deg)', opacity: interpolate(beat.localFrame, [0, 5, 16], [0, 0.7, 0], clamp)}} />
    </AbsoluteFill>
  );
};
