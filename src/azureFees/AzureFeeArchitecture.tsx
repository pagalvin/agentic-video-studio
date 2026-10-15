import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AZURE_FEE_BEAT, AZURE_FEE_DURATION, azureFeeBeats} from './story';

const icons = {
  ui: '01007-icon-service-Static-Apps.svg', compute: '02884-icon-service-Worker-Container-App.svg',
  cosmos: '10121-icon-service-Azure-Cosmos-DB.svg', sql: '10130-icon-service-SQL-Database.svg',
  storage: '10086-icon-service-Storage-Accounts.svg', ai: '03438-icon-service-Azure-OpenAI.svg',
  vault: '10245-icon-service-Key-Vaults.svg', insights: '00012-icon-service-Application-Insights.svg',
  logs: '00009-icon-service-Log-Analytics-Workspaces.svg', identity: '10227-icon-service-Managed-Identities.svg',
  registry: '10105-icon-service-Container-Registries.svg', devops: '10261-icon-service-Azure-DevOps.svg',
};
const nodes = [
  {id: 'people', x: 10, y: 210, w: 185, name: 'People', sub: ['Analyst / approver', 'Review and act'], icon: null},
  {id: 'entra', x: 20, y: 20, w: 220, name: 'Microsoft Entra ID', sub: ['Identity / access', 'Logical sign-in flow'], icon: null},
  {id: 'ui', x: 280, y: 210, w: 260, name: 'Static Web Apps', sub: ['Angular admin UI', 'Intake / review / status'], icon: icons.ui},
  {id: 'orchestrator', x: 660, y: 160, w: 350, name: 'Container Apps', sub: ['TypeScript orchestration', 'Durable Functions runtime'], icon: icons.compute},
  {id: 'engines', x: 660, y: 360, w: 350, name: 'Container Apps', sub: ['Python fee / QC engines', 'Deterministic calculation'], icon: icons.compute},
  {id: 'ai', x: 660, y: 0, w: 350, name: 'Azure OpenAI / Foundry', sub: ['Selected evidence in', 'Narrative draft out'], icon: icons.ai},
  {id: 'cosmos', x: 1190, y: 20, w: 340, name: 'Cosmos DB', sub: ['Approved rules / triggers', 'Workflow records / decisions'], icon: icons.cosmos},
  {id: 'sql', x: 1190, y: 220, w: 340, name: 'Azure SQL', sub: ['Approvals / cases', 'Side-letter business records'], icon: icons.sql},
  {id: 'blob', x: 1190, y: 420, w: 340, name: 'Blob Storage', sub: ['Raw / processed files', 'Drafts / exports / evidence'], icon: icons.storage},
  {id: 'hub', x: 660, y: 555, w: 350, name: 'Storage / task hub', sub: ['History / queues / checkpoints', 'Dedicated orchestration backing'], icon: icons.storage},
  {id: 'accounting', x: 1190, y: 590, w: 340, name: 'Accounting system', sub: ['External destination', 'Confirm or reject posting'], icon: null},
];
const routes: Record<string, {d: string; kind: 'command' | 'artifact' | 'response' | 'support'}> = {
  login: {d: 'M100 210 V150 H130 V130', kind: 'command'},
  session: {d: 'M240 80 H410 V210', kind: 'response'},
  ui: {d: 'M540 255 H660', kind: 'command'},
  upload: {d: 'M835 290 H1080 V480 H1190', kind: 'artifact'},
  cosmosRead: {d: 'M1190 80 H1100 V190 H1010', kind: 'response'},
  sqlRead: {d: 'M1190 270 H1010', kind: 'response'},
  checkpoint: {d: 'M690 290 H620 V610 H660', kind: 'command'},
  resume: {d: 'M1010 610 H1050 V285 H1010', kind: 'response'},
  engine: {d: 'M780 290 V360', kind: 'command'},
  result: {d: 'M900 360 V290', kind: 'response'},
  artifact: {d: 'M1010 420 H1120 V470 H1190', kind: 'artifact'},
  state: {d: 'M1010 180 H1140 V100 H1190', kind: 'artifact'},
  case: {d: 'M1010 245 H1190', kind: 'command'},
  status: {d: 'M660 280 H540', kind: 'response'},
  ai: {d: 'M780 160 V130', kind: 'artifact'},
  aiReturn: {d: 'M900 130 V160', kind: 'response'},
  post: {d: 'M1010 275 H1160 V640 H1190', kind: 'artifact'},
  ack: {d: 'M1190 680 H1090 V285 H1010', kind: 'response'},
  identity: {d: 'M1130 760 H580 V245 H660', kind: 'support'},
  vault: {d: 'M80 760 H570 V200 H660', kind: 'support'},
  telemetry: {d: 'M1010 255 H1060 V715 H270 V760', kind: 'support'},
  logs: {d: 'M270 760 H465', kind: 'support'},
  deploy: {d: 'M670 760 H890', kind: 'support'},
  images: {d: 'M890 750 H1040 V320 H980 V360', kind: 'support'},
};
const colors = {command: '#62dce8', artifact: '#bba3ff', response: '#8ce8af', support: '#efca86'};
export const AzureFeeArchitecture = ({scene, subtitle}: {scene?: {beat: number; local: number; duration: number}; subtitle?: string} = {}) => {
  const frame = useCurrentFrame();
  const beat = scene?.beat ?? Math.min(Math.floor(frame / AZURE_FEE_BEAT), azureFeeBeats.length - 1);
  const local = scene?.local ?? frame % AZURE_FEE_BEAT;
  const duration = scene?.duration ?? AZURE_FEE_BEAT;
  const content = azureFeeBeats[beat];
  const active: readonly string[] = content.routes;
  const opacity = interpolate(local, [0, 12, duration - 16, duration - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#091725', color: '#edf8ff', fontFamily: 'Arial, sans-serif'}}>
    <div style={{position: 'absolute', left: 60, top: 32, right: 60, display: 'flex', justifyContent: 'space-between', color: '#75ddeb', fontSize: 18, letterSpacing: 3}}><span>{content.phase}</span><span>FEE PLATFORM / AZURE RESOURCE MAP</span></div>
    <div style={{position: 'absolute', left: 60, top: 82, fontSize: 46, fontWeight: 800, opacity}}>{content.title}</div>
    <div style={{position: 'absolute', left: 55, top: 185, width: 1530, height: 725, border: '1px solid #2f5269', borderRadius: 20, background: '#102436'}} />
    <svg width="1600" height="850" viewBox="0 0 1600 850" style={{position: 'absolute', left: 75, top: 180, transform: 'scale(0.88)', transformOrigin: 'top left'}}>
      <defs><marker id="az-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8" fill="#9bb9c9" /></marker></defs>
      {Object.entries(routes).map(([id, route]) => {
        const on = active.includes(id);
        return <g key={id} opacity={on ? 1 : 0.14}>
          <path d={route.d} fill="none" stroke={colors[route.kind]} strokeWidth={on ? 3 : 1.5} strokeDasharray={route.kind === 'support' ? '6 8' : undefined} markerEnd="url(#az-arrow)" />
          {on && <g style={{offsetPath: `path('${route.d}')`, offsetDistance: `${((local + id.length * 7) % 95) / 95 * 100}%`}}>
            {route.kind === 'artifact' ? <rect x="-6" y="-8" width="12" height="16" rx="2" fill={colors[route.kind]} /> :
              <circle r="6" fill={colors[route.kind]} />}
          </g>}
        </g>;
      })}
    </svg>
    {nodes.map((node) => <div key={node.id} style={{position: 'absolute', left: 75 + node.x * 0.88, top: 180 + node.y * 0.88, width: node.w * 0.88, height: 114, boxSizing: 'border-box', padding: 13, background: node.id === 'ai' ? '#282c48' : '#18364a', border: `1px solid ${node.id === 'engines' ? '#67e5cb' : '#557d99'}`, borderRadius: 12}}>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8}}>
        {node.icon && <Img src={staticFile(`azure-icons/${node.icon}`)} style={{width: 32, height: 32, objectFit: 'contain'}} />}
        <span style={{fontSize: 20, fontWeight: 700}}>{node.name}</span>
      </div>
      {node.sub.map((line) => <div key={line} style={{fontSize: 17, lineHeight: 1.4, color: '#bfd4e2'}}>{line}</div>)}
    </div>)}
    <div style={{position: 'absolute', left: 1505, right: 40, top: 235, padding: 20, borderRadius: 15, background: '#173147', border: '1px solid #486e85'}}>
      <div style={{color: '#77deeb', fontSize: 17, letterSpacing: 2}}>WHAT MOVES</div>
      {!scene && <div style={{fontSize: 23, lineHeight: 1.5, marginTop: 20, opacity}}>{content.payload}</div>}
      <div style={{marginTop: 25, fontSize: 18, lineHeight: 1.8}}>{Object.entries(colors).map(([kind, color]) => <div key={kind} style={{color}}>{kind === 'artifact' ? '▣ Artifact / payload' : kind === 'response' ? '● Response / result' : kind === 'support' ? '┄ Support / deployment' : '● Command / request'}</div>)}</div>
    </div>
    <div style={{position: 'absolute', left: 80, top: 840, display: 'flex', gap: 20}}>
      {[[icons.vault, 'Key Vault'], [icons.insights, 'App Insights'], [icons.logs, 'Log Analytics'], [icons.devops, 'Azure DevOps'], [icons.registry, 'Container Registry'], [icons.identity, 'Managed identity']].map(([icon, label]) => <div key={label} style={{display: 'flex', alignItems: 'center', gap: 8, background: '#152f43', padding: 10, borderRadius: 8, fontSize: 17}}><Img src={staticFile(`azure-icons/${icon}`)} style={{width: 27, height: 27, objectFit: 'contain'}} />{label}</div>)}
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 935, fontSize: 27, lineHeight: 1.4, opacity}}>{subtitle ?? content.caption}</div>
    <div style={{position: 'absolute', bottom: 25, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', color: '#8daec3', fontSize: 16, letterSpacing: 2}}><span>LOGICAL FLOWS / NOT A NETWORK SECURITY OR DEPLOYMENT TOPOLOGY</span><span>{beat + 1} / 10</span></div>
    <div style={{position: 'absolute', bottom: 0, height: 4, background: '#75ddeb', width: `${(scene ? (beat + local / duration) / azureFeeBeats.length : frame / (AZURE_FEE_DURATION - 1)) * 100}%`}} />
  </AbsoluteFill>;
};
