import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {CSSProperties, ReactNode} from 'react';
import {narration} from './narration';
import {iassistScript} from './script';

export const IASSIST_FPS = 30;
const LEAD = 18;
const TAIL = 24;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

let cursor = 0;
export const iassistScenes = narration.map((clip, beat) => {
  if (clip.text !== iassistScript[beat]) throw new Error('iAssist narration is stale. Run npm run audio:iassist.');
  const start = cursor;
  const audioFrames = Math.ceil(clip.seconds * IASSIST_FPS);
  const duration = LEAD + audioFrames + TAIL;
  cursor += duration;
  return {beat, start, duration, audioFrames, clip};
});
export const IASSIST_DURATION = cursor;

const C = {bg: '#071a2c', panel: '#0f2d47', line: '#2b5778', text: '#eef6fc', dim: '#9fbbd0', teal: '#3fd6c4', gold: '#f4c56a', violet: '#b9a2ff', red: '#ff8d8d', green: '#6fe39a', blue: '#68c3ff'};
const titles = [
  ['ISSG IASSIST', 'Partners ask. iAssist researches. People decide.'],
  ['THE OPPORTUNITY', 'The hidden cost of a simple email'],
  ['1 · READ', 'Understand what the partner is asking'],
  ['2 · RESEARCH', 'Gather the facts from business systems'],
  ['3 · RECOMMEND', 'Draft the reply with its evidence'],
  ['4 · APPROVE', 'One approval task, three familiar channels'],
  ['HUMAN DECISION', 'Only an approved response is sent'],
  ['WHERE IT HELPS', 'A pattern for research-heavy requests'],
  ['BUSINESS OUTCOMES', 'More capacity, better experiences'],
  ['RECOMMENDED NEXT STEP', 'Prove the value with a focused pilot'],
];

const Card = ({x, y, w, h, color = C.line, fill = C.panel, op = 1, children, style}: {x: number; y: number; w: number; h: number; color?: string; fill?: string; op?: number; children?: ReactNode; style?: CSSProperties}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: fill, border: `2px solid ${color}`, borderRadius: 18, padding: 22, boxSizing: 'border-box', opacity: op, transform: `translateY(${(1 - op) * 24}px)`, ...style}}>{children}</div>
);
const T = ({children, size = 26, color = C.text, weight = 500, style}: {children: ReactNode; size?: number; color?: string; weight?: number; style?: CSSProperties}) => (
  <div style={{fontSize: size, color, fontWeight: weight, lineHeight: 1.25, ...style}}>{children}</div>
);
const Arrow = ({x, y, w, color = C.dim, op = 1}: {x: number; y: number; w: number; color?: string; op?: number}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w * op, height: 4, background: color, borderRadius: 2, opacity: op}}>
    <div style={{position: 'absolute', right: -2, top: -9, borderLeft: `18px solid ${color}`, borderTop: '11px solid transparent', borderBottom: '11px solid transparent'}} />
  </div>
);
const Email = ({x, y, op, label = 'Incoming email'}: {x: number; y: number; op: number; label?: string}) => (
  <Card x={x} y={y} w={560} h={250} color={C.blue} op={op}>
    <T size={20} color={C.blue} weight={700}>{label.toUpperCase()}</T>
    <T size={22} color={C.dim} style={{marginTop: 12}}>From: Accounts payable team, Fictional Partner Co.</T>
    <T size={32} weight={700} style={{marginTop: 22}}>“Has invoice 78432 been paid?”</T>
    <T size={19} color={C.dim} style={{marginTop: 22}}>Fictional example for illustration</T>
  </Card>
);
const Chip = ({x, y, w, text, color, op = 1, active = false}: {x: number; y: number; w: number; text: string; color: string; op?: number; active?: boolean}) => (
  <Card x={x} y={y} w={w} h={74} color={color} fill={active ? color + '33' : C.panel} op={op} style={{padding: '0 24px', display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 700, color: active ? C.text : color}}>{text}</Card>
);
const reveal = (local: number, start: number, len = 22) => interpolate(local, [start, start + len], [0, 1], clamp);

const Scene = ({beat, local, duration}: {beat: number; local: number; duration: number}) => {
  const r = (start: number, len?: number) => reveal(local, start, len);
  const p = local / duration;
  switch (beat) {
    case 0: return <>
      {[['✉', 'Partners ask', 'A trading partner emails a question', C.blue], ['⌕', 'iAssist researches', 'Plans, searches and drafts with evidence', C.teal], ['✔', 'People decide', 'An accountable employee approves the response', C.gold]].map(([icon, head, sub, col], i) => <Card key={head} x={90 + i * 620} y={290} w={540} h={400} color={col} op={r(10 + i * 55, 30)}>
        <T size={96} color={col} style={{textAlign: 'center'}}>{icon}</T>
        <T size={42} weight={800} style={{textAlign: 'center', marginTop: 20}}>{head}</T>
        <T size={25} color={C.dim} style={{textAlign: 'center', marginTop: 20}}>{sub}</T>
      </Card>)}
      <Arrow x={630} y={485} w={80} op={r(60, 25)} />
      <Arrow x={1250} y={485} w={80} op={r(115, 25)} />
      <T size={24} color={C.dim} style={{position: 'absolute', left: 90, top: 760, opacity: r(160)}}>Intelligent email assistance for manufacturers and their trading partners. All people, companies and data in this story are fictional.</T>
    </>;
    case 1: return <>
      <Email x={90} y={290} op={r(5)} />
      <Arrow x={660} y={410} w={110} op={r(40)} />
      {[['01', 'Read & interpret', 'Understand the request and what is needed', C.blue], ['02', 'Find the facts', 'Search ERP, CRM, service records and documentation', C.gold], ['03', 'Compose & route', 'Draft a response, obtain approval, then send', C.violet]].map(([n, h, s, col], i) => <Card key={n} x={800} y={250 + i * 190} w={1030} h={160} color={col} op={r(50 + i * 45)}>
        <div style={{display: 'flex', gap: 30, alignItems: 'center'}}><T size={64} color={col} weight={800}>{n}</T><div><T size={36} weight={800}>{h}</T><T size={24} color={C.dim} style={{marginTop: 8}}>{s}</T></div></div>
      </Card>)}
      <T size={30} color={C.gold} weight={700} style={{position: 'absolute', left: 90, top: 640, width: 590, opacity: r(220)}}>The issue is not just email volume. It is the repeated effort to gather trustworthy answers.</T>
    </>;
    case 2: return <>
      <Email x={90} y={290} op={r(5)} />
      <Arrow x={660} y={410} w={110} op={r(35)} />
      <Card x={800} y={250} w={1030} h={520} color={C.teal} op={r(40)}>
        <T size={22} color={C.teal} weight={700}>iASSIST READS THE REQUEST</T>
        {[['No actionable request', C.dim], ['One intent', C.teal], ['Multiple intents', C.dim]].map(([t, col], i) => <div key={t} style={{display: 'inline-block', margin: '24px 18px 0 0', padding: '14px 24px', borderRadius: 40, border: `2px solid ${col}`, color: i === 1 && p > 0.45 ? C.text : col, background: i === 1 && p > 0.45 ? C.teal + '44' : 'transparent', fontSize: 25, fontWeight: 700}}>{t}</div>)}
        <div style={{opacity: r(130)}}>
          <T size={30} weight={800} style={{marginTop: 40}}>Intent identified: invoice payment status</T>
          <T size={25} color={C.dim} style={{marginTop: 24}}>Needs: invoice record · payment information · any dispute notes</T>
          <T size={25} color={C.dim} style={{marginTop: 14}}>Partner: Fictional Partner Co. · Invoice: 78432</T>
        </div>
      </Card>
    </>;
    case 3: {
      const sources = [['ERP', 'Invoice record', C.blue], ['CRM', 'Account context', C.violet], ['Service records', 'Related case history', C.gold], ['Documentation', 'Policy and process guidance', C.green]];
      return <>
        <Card x={720} y={330} w={480} h={300} color={C.teal} op={r(5)}>
          <T size={22} color={C.teal} weight={700} style={{textAlign: 'center'}}>APPROVED RESEARCH PLAN</T>
          <T size={46} weight={800} style={{textAlign: 'center', marginTop: 30}}>iAssist</T>
          <T size={24} color={C.dim} style={{textAlign: 'center', marginTop: 22}}>Invoice 78432 status inquiry</T>
        </Card>
        {sources.map(([n, d, col], i) => {
          const left = i % 2 === 0; const top = i < 2 ? 220 : 520; const x = left ? 90 : 1310; const st = 40 + i * 50;
          return <div key={n}>
            <Arrow x={left ? 625 : 1210} y={top + 70} w={85} color={col} op={r(st - 10, 20)} />
            <Card x={x} y={top} w={520} h={150} color={col} op={r(st, 20)}>
              <T size={34} weight={800} color={col}>{n}</T><T size={23} color={C.dim} style={{marginTop: 8}}>{d}</T>
              <T size={22} color={C.green} weight={700} style={{marginTop: 12, opacity: r(st + 30, 15)}}>✔ Checked · result retained as evidence</T>
            </Card>
          </div>;
        })}
        <T size={22} color={C.dim} style={{position: 'absolute', left: 90, top: 790, opacity: r(250)}}>Illustrative scenario. No real invoice or payment facts are shown.</T>
      </>;
    }
    case 4: return <>
      <Card x={90} y={230} w={900} h={560} color={C.gold} op={r(5)}>
        <T size={22} color={C.gold} weight={700}>DRAFT REPLY TO PARTNER</T>
        <T size={25} color={C.dim} style={{marginTop: 20}}>Re: Invoice 78432</T>
        <T size={28} style={{marginTop: 22, opacity: r(35)}}>Thank you for your question. We checked the invoice and payment records.</T>
        <T size={28} style={{marginTop: 18, opacity: r(60)}}>[Payment status stated from the retrieved evidence]</T>
        <T size={28} style={{marginTop: 18, opacity: r(85)}}>[Any dispute or next step, if applicable]</T>
        <div style={{position: 'absolute', right: 30, bottom: 26, border: `3px solid ${C.red}`, color: C.red, padding: '10px 22px', borderRadius: 10, fontSize: 28, fontWeight: 800, transform: 'rotate(-4deg)', opacity: r(110)}}>DRAFT · NOT SENT</div>
      </Card>
      <Card x={1040} y={230} w={790} h={250} color={C.teal} op={r(40)}>
        <T size={22} color={C.teal} weight={700}>EVIDENCE</T>
        {['Invoice record (ERP)', 'Payment record', 'Dispute information'].map((t, i) => <T key={t} size={27} style={{marginTop: 16, opacity: r(80 + i * 25, 15)}}>✔ {t}</T>)}
      </Card>
      <Card x={1040} y={510} w={790} h={280} color={C.violet} op={r(70)}>
        <T size={22} color={C.violet} weight={700}>RATIONALE</T>
        <T size={26} style={{marginTop: 16}}>Why this answer fits the request, which sources support it, and what the reviewer should confirm.</T>
      </Card>
    </>;
    case 5: return <>
      <Card x={610} y={230} w={700} h={170} color={C.gold} op={r(5)}>
        <T size={22} color={C.gold} weight={700} style={{textAlign: 'center'}}>ONE APPROVAL TASK</T>
        <T size={34} weight={800} style={{textAlign: 'center', marginTop: 18}}>Invoice 78432 reply · awaiting decision</T>
      </Card>
      {[['ISSG iApprove', 'Full case review', 'Original email, intents, research, proposed response and explanation', C.teal], ['Microsoft Teams', 'Act in the flow of work', 'Review the notification, take action or open the case', C.violet], ['Email', 'Respond from the inbox', 'Receive the case context and reply with a decision or requested changes', C.blue]].map(([n, h, s, col], i) => <div key={n}>
        <Card x={90 + i * 600} y={470} w={560} h={330} color={col} op={r(30 + i * 40)}>
          <T size={36} weight={800} color={col}>{n}</T><T size={27} weight={700} style={{marginTop: 14}}>{h}</T><T size={23} color={C.dim} style={{marginTop: 14}}>{s}</T>
        </Card>
        <div style={{position: 'absolute', left: 370 + i * 600, top: 400, width: 4, height: 70 * r(30 + i * 40, 20), background: col}} />
      </div>)}
    </>;
    case 6: {
      const active = Math.min(2, Math.floor(p * 3));
      const opts = [['Approve', C.green, 'Response returns to the original partner'], ['Approve with changes', C.gold, 'Changes requested, draft revised, reviewed again'], ['Deny', C.red, 'Response is stopped. Nothing is sent to the partner']];
      return <>
        {opts.map(([n, col, out], i) => <div key={n}>
          <Chip x={90} y={250 + i * 190} w={620} text={n} color={col} active={active === i} op={r(5 + i * 20)} />
          <Arrow x={720} y={285 + i * 190} w={150} color={col} op={active >= i ? r(30 + i * 20, 20) : 0} />
          <Card x={900} y={235 + i * 190} w={930} h={110} color={col} fill={active === i ? col + '33' : C.panel} op={r(40 + i * 20)} style={{display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 700}}>{out}</Card>
        </div>)}
        <T size={24} color={C.dim} style={{position: 'absolute', left: 90, top: 815}}>The employee decides. iAssist does not send on its own.</T>
      </>;
    }
    case 7: return <>
      {[['Accounts receivable', '“Has invoice 78432 been paid?”', 'Look up invoice, payment and dispute information', C.blue], ['Sales / credit', '“Can we increase our credit limit?”', 'Check account history and start an approval workflow. People make the credit decision.', C.gold], ['Service / support', '“How do I fix this machine?”', 'Retrieve product documentation and troubleshooting guidance', C.green]].map(([n, q, a, col], i) => <Card key={n} x={90 + i * 600} y={250} w={560} h={470} color={col} op={r(8 + i * 45)}>
        <T size={34} weight={800} color={col}>{n}</T>
        <T size={28} weight={700} style={{marginTop: 28}}>{q}</T>
        <T size={25} color={C.dim} style={{marginTop: 34}}>{a}</T>
      </Card>)}
      <T size={26} color={C.teal} weight={700} style={{position: 'absolute', left: 90, top: 770, opacity: r(190)}}>The same pattern can extend to suppliers, customers, distributors and other trading partners.</T>
    </>;
    case 8: return <>
      {[['Time returned', C.teal], ['Faster responses', C.blue], ['More productive teams', C.green], ['Better control', C.violet], ['Scalable expertise', C.gold]].map(([t, col], i) => <Chip key={t} x={90} y={240 + i * 110} w={540} text={t} color={col} op={r(5 + i * 18)} />)}
      <Card x={700} y={240} w={1130} h={540} color={C.gold} op={r(40)}>
        <T size={22} color={C.gold} weight={700}>ILLUSTRATIVE LABOR CAPACITY · NOT VERIFIED SAVINGS</T>
        <div style={{display: 'flex', gap: 24, marginTop: 28}}>
          {[['100', 'inquiries / month'], ['12 min', 'saved per inquiry'], ['$45/hr', 'labor rate']].map(([v, l], i) => <div key={l} style={{flex: 1, opacity: r(80 + i * 25), textAlign: 'center', background: C.bg, borderRadius: 14, padding: '22px 0'}}><T size={50} weight={800} style={{textAlign: 'center'}}>{v}</T><T size={21} color={C.dim} style={{textAlign: 'center'}}>{l}</T></div>)}
        </div>
        <T size={28} color={C.dim} style={{marginTop: 30, opacity: r(170)}}>100 × 12 minutes ÷ 60 = <b style={{color: C.teal}}>20 hours</b> per month</T>
        <T size={28} color={C.dim} style={{marginTop: 14, opacity: r(200)}}>20 hours × $45 = <b style={{color: C.gold}}>$900 / month · $10,800 / year</b></T>
        <T size={21} color={C.red} style={{marginTop: 30, opacity: r(230)}}>Excludes implementation, software and operating costs. Not net ROI or headcount reduction.</T>
      </Card>
    </>;
    default: return <>
      {[['1', 'Select', 'One team and 2–3 repeatable inquiry types', C.blue], ['2', 'Baseline', 'Volume, handling time, turnaround and rework', C.violet], ['3', 'Pilot', 'Run with human review and approved integrations', C.teal], ['4', 'Evaluate', 'Time returned, response speed, accuracy and satisfaction', C.gold]].map(([n, h, s, col], i) => <div key={h}>
        <Card x={90 + i * 450} y={270} w={410} h={380} color={col} op={r(8 + i * 50)}>
          <T size={72} weight={800} color={col}>{n}</T><T size={38} weight={800} style={{marginTop: 8}}>{h}</T><T size={24} color={C.dim} style={{marginTop: 18}}>{s}</T>
        </Card>
        {i < 3 && <Arrow x={500 + i * 450} y={455} w={40} op={r(30 + i * 50, 20)} />}
      </div>)}
      <T size={38} weight={800} color={C.teal} style={{position: 'absolute', left: 90, top: 720, opacity: r(220, 30)}}>Start small. Measure the results. Expand where the economics are strongest.</T>
    </>;
  }
};

export const IAssist = () => {
  const frame = useCurrentFrame();
  const scene = iassistScenes.find((item) => frame >= item.start && frame < item.start + item.duration);
  if (!scene) throw new Error('Frame outside iAssist timeline.');
  const local = frame - scene.start;
  const sentences = scene.clip.text.match(/[^.!?]+[.!?]+/g) ?? [scene.clip.text];
  const words = sentences.map((sentence) => sentence.trim().split(/\s+/).length);
  const total = words.reduce((sum, count) => sum + count, 0);
  const progress = Math.max(0, Math.min(0.999, (local - LEAD) / scene.audioFrames)) * total;
  let boundary = 0;
  const index = words.findIndex((count) => { boundary += count; return progress < boundary; });
  const fade = interpolate(local, [0, 12, scene.duration - 10, scene.duration - 1], [0, 1, 1, 0], clamp);
  const [label, title] = titles[scene.beat];
  return <AbsoluteFill style={{background: `linear-gradient(135deg, ${C.bg}, #0b2742)`, color: C.text, fontFamily: 'Segoe UI, Arial, sans-serif'}}>
    <div style={{position: 'absolute', left: 90, top: 55, fontSize: 22, letterSpacing: 4, color: C.teal, fontWeight: 700}}>{label}</div>
    <div style={{position: 'absolute', left: 90, top: 95, right: 90, fontSize: 56, fontWeight: 800, opacity: fade}}>{title}</div>
    <AbsoluteFill style={{opacity: fade}}><Scene beat={scene.beat} local={local} duration={scene.duration} /></AbsoluteFill>
    <div style={{position: 'absolute', left: 90, right: 90, bottom: 55, minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#000000aa', borderRadius: 16, padding: '14px 40px', fontSize: 34, lineHeight: 1.3}}>{sentences[Math.max(0, index)].trim()}</div>
    <div style={{position: 'absolute', right: 90, top: 62, fontSize: 18, color: C.dim}}>Illustrative business case · fictional example data</div>
    {iassistScenes.map((item) => <Sequence key={item.start} from={item.start + LEAD} durationInFrames={item.audioFrames} layout="none">
      <Audio src={staticFile(item.clip.file)} />
    </Sequence>)}
  </AbsoluteFill>;
};
