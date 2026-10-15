import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {IcebergDiagram} from './IcebergDiagram';
import {ICEBERG_BEAT_FRAMES, ICEBERG_DURATION, icebergBeats, stakeholders} from './story';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const SprintDemoIceberg = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = Math.min(Math.floor(frame / ICEBERG_BEAT_FRAMES), icebergBeats.length - 1);
  const local = frame % ICEBERG_BEAT_FRAMES;
  const content = icebergBeats[beat];
  const stakeholder = beat >= 3 && beat <= 6 ? stakeholders[beat - 3] : null;
  const color = stakeholder?.color ?? '#7ae6ed';
  const reveal = spring({frame: local, fps, config: {damping: 200}});
  const opacity = interpolate(local, [0, 12, 194, 209], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#071525', color: '#f1faff', fontFamily: 'Arial, sans-serif'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 35% 30%, #1b4253 0%, transparent 65%)'}} />
      <div style={{position: 'absolute', left: 70, right: 70, top: 38, display: 'flex', justifyContent: 'space-between', fontSize: 19, letterSpacing: 3, color}}>
        <span>{content.phase}</span><span>SPRINT DEMOS / THE VISIBILITY ICEBERG</span>
      </div>
      <div style={{position: 'absolute', left: 70, top: 94, fontSize: 53, fontWeight: 800, opacity, transform: `translateY(${(1 - reveal) * 15}px)`}}>{content.title}</div>
      <div style={{position: 'absolute', left: 45, top: 205}}><IcebergDiagram beat={beat} /></div>
      <div style={{position: 'absolute', left: 1225, right: 65, top: 235, minHeight: 550, padding: 32, boxSizing: 'border-box', border: `1px solid ${color}66`, borderRadius: 22, background: '#11283b', opacity, transform: `translateX(${(1 - reveal) * 25}px)`}}>
        <div style={{fontSize: 17, letterSpacing: 3, color, marginBottom: 20}}>{stakeholder ? 'WHAT THEY NEED FROM THE DEMO' : 'ONE PROJECT / DIFFERENT PERSPECTIVES'}</div>
        <div style={{fontSize: 34, fontWeight: 700, lineHeight: 1.22, marginBottom: 28}}>{stakeholder?.question ?? content.heading}</div>
        {(stakeholder?.needs ?? content.lines).map((line, i) => <div key={line} style={{fontSize: 25, lineHeight: 1.4, marginBottom: 22, borderLeft: `3px solid ${color}`, paddingLeft: 18, opacity: interpolate(local, [15 + i * 14, 30 + i * 14], [0, 1], clamp)}}>{line}</div>)}
        {stakeholder && <div style={{color, fontSize: 23, lineHeight: 1.45, paddingTop: 16, borderTop: '1px solid #496174'}}>{stakeholder.takeaway}</div>}
        {beat === 0 && <div style={{marginTop: 26, color: '#f7cc7f', fontSize: 28, fontWeight: 700}}>“Look what we built!”</div>}
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 905, opacity}}>
        <div style={{fontSize: 29, lineHeight: 1.35, marginBottom: 18}}>{content.caption}</div>
        <div style={{fontSize: 23, color: '#a9c4d6', lineHeight: 1.4, borderLeft: `3px solid ${color}`, paddingLeft: 18}}>{content.note}</div>
      </div>
      <div style={{position: 'absolute', bottom: 22, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', color: '#87aabd', fontSize: 17, letterSpacing: 2}}>
        <span>VISIBILITY, NOT HIERARCHY / SILENT EXPLAINER</span><span>{String(beat + 1).padStart(2, '0')} / 12</span>
      </div>
      <div style={{position: 'absolute', bottom: 0, height: 4, background: color, width: `${frame / (ICEBERG_DURATION - 1) * 100}%`}} />
    </AbsoluteFill>
  );
};
