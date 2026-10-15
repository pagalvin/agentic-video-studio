import {interpolate, useCurrentFrame} from 'remotion';
import {ICEBERG_BEAT_FRAMES, stakeholders} from './story';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const routes = [
  'M560 258 Q260 300 190 365',
  'M560 258 Q860 300 930 365',
  'M560 258 Q240 440 190 525',
  'M560 258 Q880 440 930 525',
];

export const IcebergDiagram = ({beat}: {beat: number}) => {
  const frame = useCurrentFrame();
  const local = frame % ICEBERG_BEAT_FRAMES;
  const pullback = interpolate(frame, [180, 260], [0, 1], clamp);
  const focus = beat >= 3 && beat <= 6 ? beat - 3 : -1;
  const transmitting = beat >= 8;
  const returning = beat === 10;
  const cycle = (local % 75) / 75;
  return (
    <svg width="1120" height="650" viewBox="0 0 1120 650" style={{overflow: 'hidden'}}>
      <defs>
        <linearGradient id="ocean" x2="0" y2="1"><stop stopColor="#123e59" /><stop offset="1" stopColor="#071a31" /></linearGradient>
        <linearGradient id="ice" x2="1" y2="1"><stop stopColor="#a2ecf3" stopOpacity=".55" /><stop offset="1" stopColor="#246eae" stopOpacity=".18" /></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <g transform={`translate(${(1 - pullback) * -280} ${(1 - pullback) * -10}) scale(${1 + (1 - pullback) * 0.5})`}>
        <rect x="0" y="242" width="1120" height="410" fill="url(#ocean)" opacity={pullback} />
        <g opacity={pullback}>
          <path d="M395 242 L735 242 L825 380 L715 535 L565 620 L390 518 L310 375 Z" fill="url(#ice)" stroke="#85deed" strokeWidth="2" />
          <path d="M395 242 L560 320 L310 375 L390 518 Z" fill="#70d8ee" opacity=".19" />
          <path d="M735 242 L560 320 L715 535 L825 380 Z" fill="#277caf" opacity=".6" />
          <path d="M560 320 L390 518 L565 620 L715 535 Z" fill="#6cc5e7" opacity=".2" />
          <path d="M395 242 L560 320 L735 242 M310 375 L560 320 L825 380 M390 518 L560 320 L715 535 L565 620" fill="none" stroke="#90def0" strokeOpacity=".3" />
        </g>
        <path d="M395 242 L465 142 L514 158 L575 43 L642 148 L677 133 L735 242 Z" fill="#dbf8f5" />
        <path d="M575 43 L553 189 L395 242 L514 158 Z" fill="#a2dadf" />
        <path d="M575 43 L642 148 L735 242 L553 189 Z" fill="#75b7d0" />
        <path d="M553 189 L735 242 L395 242 Z" fill="#bde9e9" />
        <g stroke="#ffdb99" strokeWidth="2" strokeDasharray="5 7" strokeDashoffset={-frame / 2}>
          <path d="M455 217 Q550 150 650 217" fill="none" />
        </g>
        {[470, 560, 650].map((x, i) => <g key={x} transform={`translate(${x} ${177 + Math.sin(frame / 25 + i) * 2})`}>
          <circle cy="-12" r="8" fill="#ffda9a" /><path d="M-12 14 L-10 2 Q0 -5 10 2 L12 14 Z" fill="#ffda9a" />
        </g>)}
        <rect x="315" y="0" width="490" height="36" rx="18" fill="#f9d79a" />
        <text x="560" y="25" textAnchor="middle" fontSize="20" fontWeight="700" fill="#172b3a">IMPLEMENTATION + BUSINESS PARTNERS</text>
        <g opacity={pullback}>
          {routes.map((route, i) => {
            const active = focus === i || transmitting || beat === 1 || beat === 2 || beat === 7;
            const color = stakeholders[i].color;
            return <g key={route}>
              <path d={route} fill="none" stroke={color} strokeWidth={active ? 3 : 1.5} strokeOpacity={active ? 0.7 : 0.15} strokeDasharray={transmitting ? '8 10' : '3 8'} strokeDashoffset={transmitting ? (returning ? frame : -frame) : 0} />
              {(transmitting || focus === i) && <>
                <circle r="12" fill={color} opacity=".35" filter="url(#glow)" style={{offsetPath: `path('${route}')`, offsetDistance: `${(returning ? 1 - cycle : cycle) * 100}%`}} />
                <circle r="5" fill={color} style={{offsetPath: `path('${route}')`, offsetDistance: `${(returning ? 1 - cycle : cycle) * 100}%`}} />
              </>}
            </g>;
          })}
          {stakeholders.map((person, i) => {
            const x = i % 2 === 0 ? 30 : 780;
            const y = i < 2 ? 330 : 490;
            const active = focus === i || focus === -1;
            return <g key={person.name} opacity={active ? 1 : 0.35}>
              <rect x={x} y={y} width="310" height="110" rx="16" fill="#102b44" stroke={person.color} strokeWidth={focus === i ? 3 : 1} />
              <circle cx={x + 26} cy={y + 29} r="7" fill={person.color} />
              <text x={x + 44} y={y + 36} fill={person.color} fontSize="18" fontWeight="700">{person.name}</text>
              <text x={x + 20} y={y + 66} fill="#bacfdc" fontSize="15">{person.role}</text>
              <text x={x + 20} y={y + 93} fill="#f5fbff" fontSize="13">{returning ? 'FEEDBACK / DECISIONS / SUPPORT' : transmitting ? 'PURPOSE / EVIDENCE / GAPS / ASKS' : 'STRONG INTEREST / LESS DAILY CONTEXT'}</text>
            </g>;
          })}
        </g>
        <path d={`M0 242 ${Array.from({length: 15}, (_, i) => `Q${i * 80 + 20} ${236 + Math.sin(frame / 22 + i) * 4} ${i * 80 + 80} 242`).join(' ')}`} fill="none" stroke="#6de7f6" strokeWidth="3" />
        {beat >= 7 && <g>
          <rect x="420" y="215" width="280" height="85" rx="12" fill="#f3fbff" stroke="#7be4ea" strokeWidth="3" />
          <text x="560" y="243" textAnchor="middle" fontSize="16" fontWeight="700" fill="#17637b">SPRINT DEMO</text>
          <text x="560" y="277" textAnchor="middle" fontSize="22" fontWeight="700" fill="#173c51">{beat === 7 ? 'A feature ... but why?' : returning ? 'A shared conversation' : 'A shared window'}</text>
        </g>}
      </g>
      <g transform={`translate(20 ${253 + (1 - pullback) * 111})`}>
        <rect width="260" height="30" rx="8" fill="#082335" />
        <text x="12" y="21" fontSize="18" fill="#83e9f2">WATERLINE / DAILY VISIBILITY</text>
      </g>
    </svg>
  );
};
