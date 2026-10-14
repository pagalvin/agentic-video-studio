import {useCurrentFrame} from 'remotion';
import {beatEdges, colors, edges, nodes} from './story';

const pointOnPath = (points: [number, number][], progress: number) => {
  const lengths = points.slice(1).map((point, index) => Math.hypot(point[0] - points[index][0], point[1] - points[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance = progress * total;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i]) {
      const fraction = distance / lengths[i];
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * fraction, points[i][1] + (points[i + 1][1] - points[i][1]) * fraction];
    }
    distance -= lengths[i];
  }
  return points[points.length - 1];
};

export const NetworkDiagram = ({beat}: {beat: number}) => {
  const frame = useCurrentFrame();
  const activeEdges = beatEdges[beat];
  const activeNodes = new Set(edges.filter((edge) => activeEdges.includes(edge.id)).flatMap((edge) => [edge.from, edge.to]));
  const overview = beat === 0 || beat === 8;

  return (
    <svg width={1680} height={790} viewBox="0 0 1680 790">
      <defs>
        {Object.entries(colors).map(([kind, color]) => (
          <marker key={kind} id={`arrow-${kind}`} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill={color} />
          </marker>
        ))}
      </defs>
      <rect x={35} y={25} width={1230} height={178} rx={24} fill="#102434" stroke="#294d60" opacity={beat >= 4 && beat < 8 ? 0.35 : 0.8} />
      <text x={58} y={18} fill={colors.content} fontSize={16} letterSpacing={3}>PREPARATION / INGESTION</text>
      <text x={58} y={337} fill={colors.tool} fontSize={16} letterSpacing={3}>{'RUNTIME / QUESTION -> TOOL -> RETRIEVAL -> GENERATION'}</text>
      {edges.map((edge, index) => {
        const active = activeEdges.includes(edge.id);
        const visible = overview || active;
        const color = colors[edge.kind];
        return (
          <g key={edge.id} opacity={visible ? 1 : 0.13}>
            <polyline points={edge.points.map((p) => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={active ? 3 : 1.5} markerEnd={`url(#arrow-${edge.kind})`} strokeLinejoin="round" />
            {edge.label && <text x={edge.lx} y={edge.ly} textAnchor="middle" fontSize={17} fill={color} stroke="#09131f" strokeWidth={5} paintOrder="stroke">{edge.label}</text>}
            {active && [0, 1, 2].map((packet) => {
              const period = Math.max(55, edge.points.length * 25);
              const progress = ((frame + packet * period / 3 + index * 13) % period) / period;
              const [x, y] = pointOnPath(edge.points, progress);
              return (
                <g key={packet}>
                  <circle cx={x} cy={y} r={9} fill={color} opacity={0.12} />
                  <circle cx={x} cy={y} r={4} fill={color} />
                </g>
              );
            })}
          </g>
        );
      })}
      {nodes.map((node) => {
        const active = activeNodes.has(node.id) || overview;
        const color = node.id === 'index' || node.id === 'embed' ? colors.vector : node.id === 'llm' ? colors.evidence : node.y < 300 ? colors.content : colors.tool;
        return (
          <g key={node.id} opacity={active || node.id === 'index' ? 1 : 0.3}>
            <rect x={node.x} y={node.y} width={250} height={120} rx={node.id === 'index' ? 28 : 14} fill="#122334" stroke={active ? color : '#385266'} strokeWidth={active ? 2 : 1} />
            <rect x={node.x + 17} y={node.y + 15} width={node.tag.length * 10 + 18} height={23} rx={5} fill={color} opacity={0.15} />
            <text x={node.x + 26} y={node.y + 32} fill={color} fontSize={14} fontWeight={700} letterSpacing={2}>{node.tag}</text>
            <text x={node.x + 17} y={node.y + 68} fill="#eef7ff" fontSize={23} fontWeight={700}>{node.title}</text>
            <text x={node.x + 17} y={node.y + 97} fill="#a4bdd1" fontSize={16}>{node.subtitle}</text>
          </g>
        );
      })}
      <text x={1495} y={610} textAnchor="middle" fill="#a99acb" fontSize={17}>SAME INDEX</text>
      <text x={1495} y={636} textAnchor="middle" fill="#8199ad" fontSize={16}>prepared earlier / queried now</text>
      <text x={30} y={776} fill="#718da3" fontSize={16}>Conceptual architecture. Each arrow represents a logical request or data handoff, not a separate deployed service.</text>
    </svg>
  );
};
