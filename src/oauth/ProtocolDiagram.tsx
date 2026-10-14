import {interpolate, useCurrentFrame} from 'remotion';
import {azureLanes, genericLanes, oauthBeats, OAUTH_BEAT_FRAMES, protocolColors} from './story';
import type {Payload} from './story';

const centers = [165, 495, 825, 1155];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PayloadBadge = ({kind, label, x, y}: {kind: Payload; label: string; x: number; y: number}) => {
  const color = protocolColors[kind];
  const width = Math.max(104, label.length * 11 + 35);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-width / 2} y={-20} width={width} height={40}
        rx={kind === 'access' || kind === 'id' ? 20 : kind === 'code' ? 2 : 7}
        fill="#0e2133" stroke={color} strokeWidth={2}
        strokeDasharray={kind === 'code' ? '5 3' : undefined} />
      {kind === 'key' && <path d={`M ${-width / 2 + 11} -4 a 5 5 0 1 0 0 8 l 0 8 m 0 -4 l 4 0`} stroke={color} fill="none" strokeWidth={2} />}
      <text textAnchor="middle" y={6} fill={color} fontSize={17} fontWeight={700} letterSpacing={1}>{label}</text>
    </g>
  );
};

export const ProtocolDiagram = ({beat}: {beat: number}) => {
  const frame = useCurrentFrame();
  const local = frame % OAUTH_BEAT_FRAMES;
  const content = oauthBeats[beat];
  const azure = beat >= 10 && beat <= 16;
  const machine = beat === 8 || beat === 9 || beat === 16;
  const lanes = azure ? azureLanes : genericLanes;
  const mapping = beat === 10 ? interpolate(local, [25, 75], [0, 1], clamp) : 1;

  return (
    <svg width={1320} height={630} viewBox="0 0 1320 630">
      <defs>
        {Object.entries(protocolColors).map(([kind, color]) => (
          <marker key={kind} id={`oauth-arrow-${kind}`} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill={color} />
          </marker>
        ))}
      </defs>
      {lanes.map((lane, index) => {
        const x = centers[index];
        const color = index === 2 ? '#c6a2ff' : azure && index > 0 ? '#67d9ff' : '#8eafca';
        return (
          <g key={index} opacity={machine && index === 0 ? 0.18 : 1}>
            <rect x={x - 135} y={8} width={270} height={565} rx={18} fill="#102235" fillOpacity={0.55} stroke={color} strokeOpacity={0.35} strokeDasharray="5 7" />
            <rect x={x - 132} y={35} width={264} height={99} rx={10} fill="#152c42" stroke={color} strokeOpacity={0.8} />
            <text x={x} y={26} textAnchor="middle" fontSize={13} letterSpacing={2} fill={color}>{lane.boundary}</text>
            {beat === 10 ? (
              <>
                <text x={x} y={73} textAnchor="middle" fontSize={22} fontWeight={700} fill="#edf5ff" opacity={1 - mapping}>{genericLanes[index].title}</text>
                <text x={x} y={73} textAnchor="middle" fontSize={22} fontWeight={700} fill="#67d9ff" opacity={mapping}>{lane.title}</text>
              </>
            ) : (
              <text x={x} y={73} textAnchor="middle" fontSize={22} fontWeight={700} fill="#edf5ff">{machine && index === 1 ? azure ? 'Azure workload' : 'Background service' : lane.title}</text>
            )}
            <text x={x} y={108} textAnchor="middle" fontSize={15} fill="#a4bbd0">{machine && index === 1 ? 'Application identity / no user' : lane.subtitle}</text>
            <line x1={x} y1={151} x2={x} y2={556} stroke={color} strokeOpacity={0.35} strokeDasharray="4 8" />
          </g>
        );
      })}
      {content.messages.map((message, index) => {
        const start = 30 + index * 60;
        const travel = interpolate(local, [start, start + 43], [0, 1], clamp);
        const visible = interpolate(local, [start - 6, start], [0, 1], clamp);
        const from = centers[message.from];
        const to = centers[message.to];
        const y = 212 + index * 115;
        const color = protocolColors[message.payload];
        const badgeOpacity = interpolate(local, [start, start + 8, start + 43, start + 60], [0, 1, 1, 0], clamp);
        return (
          <g key={index} opacity={visible}>
            <text x={42} y={y - 32} fill={color} fontSize={16} fontWeight={700}>0{index + 1}</text>
            <text x={(from + to) / 2} y={y - 28} textAnchor="middle" fill="#dce9f7" fontSize={21} stroke="#0a1726" strokeWidth={5} paintOrder="stroke">{message.label}</text>
            <line x1={from} y1={y} x2={to} y2={y} stroke={color} strokeWidth={3} markerEnd={`url(#oauth-arrow-${message.payload})`}
              strokeDasharray={message.from === 0 || message.to === 0 ? '10 7' : undefined} />
            <circle cx={to} cy={y} r={12 + Math.sin(local / 6) * 3} fill={color} opacity={travel === 1 ? 0.12 : 0} />
            <g opacity={badgeOpacity}><PayloadBadge x={from + (to - from) * travel} y={y} kind={message.payload} label={message.badge} /></g>
          </g>
        );
      })}
      {(beat === 1 || beat === 5) && (
        <g>
          <PayloadBadge x={495} y={235} kind="key" label="VERIFIER" />
          <text x={495} y={277} textAnchor="middle" fill="#b7cce0" fontSize={18}>kept at the client</text>
          <line x1={495} y1={300} x2={495} y2={352} stroke="#c6a2ff" strokeWidth={3} markerEnd="url(#oauth-arrow-key)" />
          <rect x={350} y={367} width={290} height={66} rx={10} fill="#251e3c" stroke="#c6a2ff" />
          <text x={495} y={395} textAnchor="middle" fill="#c6a2ff" fontSize={19}>SHA-256</text>
          <text x={495} y={420} textAnchor="middle" fill="#b7cce0" fontSize={17}>then base64url encoding</text>
          <g opacity={interpolate(local, [50, 80], [0, 1], clamp)}>
            <PayloadBadge x={495} y={487} kind="key" label="CHALLENGE" />
            <text x={825} y={beat === 5 ? 415 : 400} textAnchor="middle" fill="#c6a2ff" fontSize={20}>{beat === 5 ? 'Derive again from verifier' : 'Challenge sent to /authorize'}</text>
            <text x={825} y={beat === 5 ? 447 : 435} textAnchor="middle" fill="#75edb0" fontSize={18}>{beat === 5 ? 'Compare with saved challenge' : 'Verifier stays with client'}</text>
            {beat === 5 && <text x={825} y={493} textAnchor="middle" fill="#75edb0" fontSize={28} fontWeight={700} opacity={interpolate(local, [100, 135], [0, 1], clamp)}>PROOF MATCHES</text>}
          </g>
        </g>
      )}
      {beat === 10 && (
        <g opacity={mapping}>
          <text x={495} y={300} textAnchor="middle" fill="#67d9ff" fontSize={25}>WEB APP / BFF</text>
          <text x={495} y={340} textAnchor="middle" fill="#a4bbd0" fontSize={18}>OAuth tokens stay server-side</text>
          <text x={825} y={300} textAnchor="middle" fill="#c6a2ff" fontSize={25}>ENTRA /authorize</text>
          <text x={825} y={340} textAnchor="middle" fill="#c6a2ff" fontSize={25}>ENTRA /token</text>
          <text x={165} y={435} textAnchor="middle" fill="#9db9ff" fontSize={22}>Session cookie</text>
          <text x={1155} y={435} textAnchor="middle" fill="#75edb0" fontSize={22}>Access token</text>
        </g>
      )}
      {machine && (
        <text x={165} y={310} textAnchor="middle" fill="#9ab0c6" fontSize={22}>NO USER</text>
      )}
      {beat === 16 && (
        <text x={825} y={558} textAnchor="middle" fill="#a4bbd0" fontSize={16}>Platform endpoint + Entra issuance collapsed</text>
      )}
      <text x={45} y={611} fill="#849eb6" fontSize={16}>Dashed: browser front channel. Solid: backend calls. HTTPS for external protocol exchanges; local identity endpoint abstracted.</text>
    </svg>
  );
};
