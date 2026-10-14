import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProtocolDiagram} from './ProtocolDiagram';
import {oauthBeats, OAUTH_BEAT_FRAMES, OAUTH_DURATION, protocolColors} from './story';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const chapters = ['Roles', 'Code + PKCE', 'Client credentials', 'Azure replay', 'Managed identity', 'Takeaways'];
const chapterAtBeat = [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 4, 5];

export const OAuthFlows = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = Math.min(Math.floor(frame / OAUTH_BEAT_FRAMES), oauthBeats.length - 1);
  const local = frame % OAUTH_BEAT_FRAMES;
  const content = oauthBeats[beat];
  const azure = beat >= 10 && beat <= 16;
  const accent = azure ? '#67d9ff' : '#c6a2ff';
  const entrance = spring({frame: local, fps, config: {damping: 200}});
  const opacity = interpolate(local, [0, 12, 282, 299], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{background: '#091524', color: '#edf5ff', fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 80% 35%, ${accent}12, transparent 65%)`}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(#4f6c8c35 1px, transparent 1px)', backgroundSize: '36px 36px'}} />
      <div style={{position: 'absolute', top: 40, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', letterSpacing: 3, fontSize: 20}}>
        <span style={{color: accent}}>{content.chapter}</span>
        <span style={{color: '#93acc5'}}>OAUTH 2.0 / PROTOCOL CHOREOGRAPHY</span>
      </div>
      <div style={{position: 'absolute', top: 105, left: 65, right: 65, opacity, transform: `translateY(${(1 - entrance) * 25}px)`, fontSize: content.title.length > 45 ? 52 : 60, fontWeight: 800, letterSpacing: -1}}>{content.title}</div>
      <div style={{position: 'absolute', left: 30, top: 223}}>
        <ProtocolDiagram beat={beat} />
      </div>
      <div style={{position: 'absolute', top: 247, right: 65, width: 440, boxSizing: 'border-box', padding: '26px 28px', borderRadius: 18, border: `1px solid ${accent}60`, background: '#11273af5', opacity}}>
        <div style={{fontSize: 20, letterSpacing: 2, color: accent, marginBottom: 26}}>{content.panelTitle}</div>
        {content.points.map((point, index) => (
          <div key={point} style={{fontSize: 24, lineHeight: 1.45, overflowWrap: 'anywhere', padding: '17px 0', borderTop: '1px solid #2b465e', opacity: interpolate(local, [10 + index * 12, 28 + index * 12], [0.15, 1], clamp)}}>
            <span style={{color: accent, fontSize: 16, marginRight: 12}}>0{index + 1}</span>{point}
          </div>
        ))}
        {beat === 14 && (
          <div style={{marginTop: 18, display: 'flex', gap: 12, fontSize: 16}}>
            <span style={{color: '#9db9ff', border: '1px solid #9db9ff', padding: 10, borderRadius: 6}}>BROWSER: COOKIE</span>
            <span style={{color: '#75edb0', border: '1px solid #75edb0', padding: 10, borderRadius: 6}}>SERVER: TOKENS</span>
          </div>
        )}
      </div>
      <div style={{position: 'absolute', top: 871, left: 65, right: 65, opacity}}>
        <div style={{fontSize: 28, lineHeight: 1.4, marginBottom: 15}}>{content.caption}</div>
        <div style={{fontSize: 22, lineHeight: 1.4, paddingLeft: 18, borderLeft: `3px solid ${accent}`, color: '#a8bed3'}}>{content.caution}</div>
      </div>
      <div style={{position: 'absolute', bottom: 26, left: 65, display: 'flex', gap: 24}}>
        {chapters.map((chapter, index) => <span key={chapter} style={{fontSize: 17, color: chapterAtBeat[beat] === index ? accent : '#6d8ba7'}}>{chapter}</span>)}
      </div>
      <div style={{position: 'absolute', bottom: 27, right: 65, fontSize: 18, letterSpacing: 2, color: '#a8bed3'}}>{String(beat + 1).padStart(2, '0')} / 18</div>
      <div style={{position: 'absolute', left: 65, top: 197, display: 'flex', gap: 22, fontSize: 14, letterSpacing: 1}}>
        {(['redirect', 'code', 'key', 'access', 'id', 'cookie'] as const).map((kind) => (
          <span key={kind} style={{color: protocolColors[kind]}}>{kind === 'key' ? 'PKCE / PROOF' : kind === 'id' ? 'ID TOKEN' : kind === 'access' ? 'ACCESS TOKEN' : kind.toUpperCase()}</span>
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 0, height: 4, width: `${frame / (OAUTH_DURATION - 1) * 100}%`, background: accent}} />
    </AbsoluteFill>
  );
};
