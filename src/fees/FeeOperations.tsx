import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FEE_BEAT_FRAMES, FEE_DURATION, evidenceLabels, feeBeats, roles} from './story';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const FeeOperations = ({scene, subtitle}: {scene?: {beat: number; local: number; duration: number}; subtitle?: string} = {}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = scene?.beat ?? Math.min(Math.floor(frame / FEE_BEAT_FRAMES), feeBeats.length - 1);
  const local = scene?.local ?? frame % FEE_BEAT_FRAMES;
  const duration = scene?.duration ?? FEE_BEAT_FRAMES;
  const visualLocal = local / duration * FEE_BEAT_FRAMES;
  const content = feeBeats[beat];
  const color = roles[content.owner].color;
  const reveal = spring({frame: local, fps, config: {damping: 200}});
  const opacity = interpolate(local, [0, 14, duration - 16, duration - 1], [0, 1, 1, 0], clamp);
  const exception = [1, 5, 8].includes(beat);
  const confirmed = beat === 11 || beat === 10 && visualLocal >= 170;
  const evidence = beat === 10 && !confirmed ? 5 : content.evidence;
  const status = confirmed ? 'Confirmed / response recorded' : beat === 10 && visualLocal < 65 ? 'Approved / packaging' : content.status;
  const priorOwner = feeBeats[Math.max(0, beat - 1)].owner;
  const packetY = interpolate(local, [0, 65], [320 + priorOwner * 125, 320 + content.owner * 125], clamp);
  return <AbsoluteFill style={{background: '#091725', color: '#edf7ff', fontFamily: 'Arial, sans-serif'}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(#4d738540 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
    <div style={{position: 'absolute', left: 65, right: 65, top: 35, display: 'flex', justifyContent: 'space-between', fontSize: 19, letterSpacing: 3, color}}><span>{content.phase}</span><span>MANAGEMENT FEE OPERATIONS / {scene ? 'NARRATED' : 'SILENT FIRST PASS'}</span></div>
    <div style={{position: 'absolute', left: 65, top: 88, fontSize: 49, fontWeight: 800, opacity, transform: `translateY(${(1 - reveal) * 18}px)`}}>{content.title}</div>
    <div style={{position: 'absolute', left: 65, top: 178, right: 65, background: '#163044', borderRadius: 12, padding: '15px 22px', display: 'flex', justifyContent: 'space-between', fontSize: 21}}>
      <span style={{color: '#f2cc8a'}}>OPERATIONS LEADERSHIP / OVERSIGHT</span>
      <span>{beat < 5 ? 'Run in progress' : beat < 7 ? 'QC case under review' : beat < 9 ? 'Approval pending' : confirmed ? 'Posting response recorded' : 'Posting not yet confirmed'}</span>
      <span style={{color: '#a8c3d4'}}>Backlog · exceptions · readiness</span>
    </div>
    <svg width="1190" height="610" style={{position: 'absolute', left: 55, top: 260}}>
      <defs><marker id="fee-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#84aabd" /></marker></defs>
      {roles.map((role, i) => <g key={role.name}>
        <rect x="0" y={i * 125} width="1170" height="113" rx="14" fill={i === content.owner ? '#1a3a50' : '#102638'} stroke={i === content.owner ? role.color : '#284253'} strokeWidth={i === content.owner ? 2 : 1} />
        {i !== 1 ? <g transform={`translate(35 ${i * 125 + 42})`}><circle r="12" cy="-7" fill={role.color} /><path d="M-20 27 Q-20 5 0 6 Q20 5 20 27 Z" fill={role.color} /></g> :
          <rect x="18" y={i * 125 + 25} width="36" height="42" rx="6" fill={role.color} />}
        <text x="70" y={i * 125 + 40} fill={role.color} fontSize="22" fontWeight="700">{role.name}</text>
        <text x="70" y={i * 125 + 72} fill="#a6c1d1" fontSize="17">{role.responsibility}</text>
        <path d={`M390 ${i * 125 + 56} H1135`} fill="none" stroke={i === content.owner ? role.color : '#345164'} strokeWidth="2" strokeDasharray="8 10" strokeDashoffset={i === content.owner ? -frame / 2 : 0} markerEnd="url(#fee-arrow)" />
      </g>)}
      <g transform={`translate(${600 + Math.min(local, 65) / 65 * 100} ${packetY - 260})`}>
        <rect x="-170" y="-36" width="490" height="80" rx="12" fill={exception ? '#513d2b' : '#204656'} stroke={exception ? '#ffbd7a' : color} strokeWidth="2" />
        <text x="-150" y="-7" fontSize="17" fill="#bcd6e2">RUN 024 / FUND A / QUARTER CLOSE</text>
        <text x="-150" y="23" fontSize="22" fontWeight="700" fill="#ffffff">{content.step}</text>
      </g>
      {exception && <g>
        <path d={`M1090 ${content.owner * 125 + 56} V${content.owner * 125 + 96} H430 V${content.owner * 125 + 56}`} fill="none" stroke="#ffbd7a" strokeWidth="2" strokeDasharray="6 7" strokeDashoffset={frame / 2} markerEnd="url(#fee-arrow)" />
        <text x="440" y={content.owner * 125 + 88} fontSize="15" fill="#ffbd7a">{beat === 1 ? 'RESOLVE → RESUBMIT → VALIDATE' : beat === 5 ? 'INVESTIGATE → RESOLVE OR ESCALATE → RECHECK' : 'RETURN → REVISE → RESUBMIT → REVIEW'}</text>
      </g>}
      <text x="18" y="543" fill="#8eadc1" fontSize="18">TECHNICAL FOUNDATION / supporting the business workflow</text>
      <text x="18" y="574" fill="#bdd3df" fontSize="21">Azure-hosted UI → orchestration → deterministic Python engines</text>
      <text x="18" y="603" fill="#8eadc1" fontSize="17">Versioned contracts / rules and state / business records / artifact storage</text>
    </svg>
    <div style={{position: 'absolute', left: 1260, right: 60, top: 260, height: 595, boxSizing: 'border-box', background: '#112a3e', border: `1px solid ${color}88`, borderRadius: 18, padding: 27}}>
      <div style={{fontSize: 17, letterSpacing: 3, color}}>PERSISTENT CASE FILE</div>
      <div style={{fontSize: 31, fontWeight: 700, marginTop: 18}}>Fund A / Investor context</div>
      <div style={{fontSize: 23, color: exception ? '#ffbd7a' : confirmed ? '#82e6b1' : color, marginTop: 17, marginBottom: 18}}>{status}</div>
      <div style={{fontSize: 22, lineHeight: 1.4, color: '#bfd5e2', minHeight: 62}}>{content.detail}</div>
      <div style={{fontSize: 16, letterSpacing: 2, color: '#98b6c9', marginTop: 14, marginBottom: 10}}>EVIDENCE TRAIL / ACCUMULATES WITH THE RUN</div>
      {evidenceLabels.map((label, i) => <div key={label} style={{fontSize: 22, padding: '7px 0', color: i < evidence ? '#82e6b1' : '#829bab', borderBottom: '1px solid #294759'}}>{i < evidence ? '✓' : '○'} {label}{beat === 11 && i < evidence ? ' ← traceable' : ''}</div>)}
      <div style={{marginTop: 16, fontSize: 18, color: '#c3a7ff'}}>{beat === 8 ? 'RETURN → revise → resubmit → review' : beat === 10 ? 'REJECTION → resolve → controlled resubmission' : beat === 2 ? 'RULE CHANGE → separate author / approve gate' : 'Sources and evidence remain linked to the result.'}</div>
    </div>
    <div style={{position: 'absolute', left: 65, right: 65, top: 910, opacity}}>
      <div style={{fontSize: 28, lineHeight: 1.4}}>{subtitle ?? content.caption}</div>
      {!scene && <div style={{fontSize: 22, lineHeight: 1.4, color: '#a8c4d6', borderLeft: `3px solid ${color}`, paddingLeft: 17, marginTop: 16}}>{content.note}</div>}
    </div>
    <div style={{position: 'absolute', bottom: 23, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', fontSize: 16, letterSpacing: 2, color: '#89a8bb'}}><span>DETERMINISTIC FEES / HUMAN CONTROL / AUDITABLE EVIDENCE</span><span>{String(beat + 1).padStart(2, '0')} / 12</span></div>
    <div style={{position: 'absolute', bottom: 0, height: 4, background: color, width: `${(scene ? (beat + local / duration) / feeBeats.length : frame / (FEE_DURATION - 1)) * 100}%`}} />
  </AbsoluteFill>;
};
