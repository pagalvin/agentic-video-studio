import {useCurrentFrame} from 'remotion';
import {getBatchState} from './story';

const nodes = [
  {x: 20, y: 175, w: 185, title: 'Batch Console', sub: 'Upload + manage', color: '#70d8ff'},
  {x: 260, y: 175, w: 185, title: 'Batch Service', sub: 'Register + dispatch', color: '#70d8ff'},
  {x: 500, y: 175, w: 185, title: 'Work Queue', sub: 'References only', color: '#b7a0ff'},
  {x: 760, y: 125, w: 255, title: 'Worker Pool', sub: '3 concurrent workers', color: '#58e1d6'},
  {x: 260, y: 10, w: 255, title: 'File Storage', sub: 'Originals + saved outputs', color: '#70d8ff'},
  {x: 660, y: 10, w: 300, title: 'Batch Database', sub: 'Master + file + step records', color: '#f5d185'},
];
const paths = [
  {d: 'M205 217 H260', active: [0, 1, 5], label: ''},
  {d: 'M352 175 V100', active: [1, 6], label: ''},
  {d: 'M445 217 H500', active: [2, 9], label: ''},
  {d: 'M685 217 H760', active: [2, 3, 6, 9], label: ''},
  {d: 'M887 125 V100', active: [3, 6, 7, 8, 9, 10], label: ''},
  {d: 'M810 10 V0 H1120 V330 H112 H112 V260', active: [3, 4, 6, 7, 8, 9, 10], label: ''},
  {d: 'M515 52 H600 V300 H887 V275', active: [3, 6, 9], label: ''},
  {d: 'M112 175 V52 H260', active: [0, 1, 5], label: ''},
  {d: 'M760 155 H555 V80 H515', active: [3, 4, 6, 7, 10], label: ''},
  {d: 'M1015 200 H1080 V342 H1015', active: [8, 9, 10], label: '', deliveryOnly: true},
  {d: 'M445 190 H620 V100 H735', active: [1, 5], label: ''},
];
export const BatchDiagram = () => {
  const frame = useCurrentFrame();
  const {beat, local, delivery} = getBatchState(frame);
  const retry = beat === 9;
  return <svg width="1140" height="390" viewBox="0 0 1140 390">
    <defs><marker id="batch-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#7398ad" /></marker></defs>
    {paths.map((p, i) => {
      if (p.deliveryOnly && !delivery) return null;
      const active = p.active.includes(beat);
      return <g key={i}>
        <path d={p.d} stroke={active ? i === 5 ? '#f5d185' : '#65dcd9' : '#345267'} strokeWidth={active ? 3 : 2} fill="none" markerEnd="url(#batch-arrow)" />
        {active && <rect width="12" height="12" x="-6" y="-6" rx="3" fill={i === 5 ? '#f5d185' : '#b9fff7'} style={{offsetPath: `path('${p.d}')`, offsetDistance: `${((local + i * 15) % 90) / 90 * 100}%`}} />}
      </g>;
    })}
    {nodes.map((n, i) => <g key={n.title}>
      <rect x={n.x} y={n.y} width={n.w} height={i === 3 ? 150 : 85} rx="14" fill="#112c42" stroke={n.color} strokeWidth="2" />
      <text x={n.x + 16} y={n.y + 34} fill={n.color} fontSize="23" fontWeight="700">{n.title}</text>
      <text x={n.x + 16} y={n.y + 62} fill="#bed4e1" fontSize="17">{n.sub}</text>
      {i === 3 && [0, 1, 2].map((worker) => <g key={worker}>
        <rect x={n.x + 18 + worker * 76} y={n.y + 85} width="66" height="42" rx="7" fill={beat === 3 || beat === 6 || beat === 7 || (retry && worker === 0) ? '#246c75' : '#1c4054'} />
        <text x={n.x + 51 + worker * 76} y={n.y + 112} textAnchor="middle" fontSize="18" fill="#e5fbff">W{worker + 1}</text>
      </g>)}
    </g>)}
    <text x="20" y="314" fill="#99b9cb" fontSize="17">STATUS UPDATES: worker → database → console</text>
    <text x="20" y="348" fill="#b7a0ff" fontSize="18">{retry ? 'RETRY JOB: file-01 / resume=post / saved-json-v1' : 'JOB: batch ID / file ID / workflow version'}</text>
    <text x="20" y="378" fill="#99b9cb" fontSize="17">Queue = references. Document contents stay in storage.</text>
    {delivery && <g>
      <rect x="805" y="312" width="210" height="72" rx="12" fill="#112c42" stroke={beat === 8 ? '#ffbd73' : '#58e1d6'} strokeWidth="2" />
      <text x="822" y="341" fill="#edf8ff" fontSize="21" fontWeight="700">Business API</text>
      <text x="822" y="368" fill={beat === 8 ? '#ffbd73' : '#58e1d6'} fontSize="17">{beat === 8 ? '503 / unavailable' : beat >= 10 ? '200 / acknowledged' : 'HTTP endpoint'}</text>
    </g>}
  </svg>;
};
