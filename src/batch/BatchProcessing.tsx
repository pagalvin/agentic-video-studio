import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BatchDiagram} from './BatchDiagram';
import {BATCH_DURATION, batchBeats, batchFiles, classifications, getBatchState} from './story';

const colors = {Queued: '#b7a0ff', Processing: '#58e1d6', Succeeded: '#81e5ae', Failed: '#ffbd73'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const BatchProcessing = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {beat, local, delivery, statuses, counts, batchStatus} = getBatchState(frame);
  const content = batchBeats[beat];
  const reveal = spring({frame: local, fps, config: {damping: 200}});
  const opacity = interpolate(local, [0, 12, 212, 224], [0, 1, 1, 0], clamp);
  const steps = delivery ? ['Extract text', 'Transform JSON', 'Validate JSON', 'Post to API'] : ['Extract text', 'Classify type', 'Save results'];
  const currentStep = beat === 3 ? local < 100 ? 0 : 1 : beat === 4 ? 3 : beat === 6 ? local < 100 ? 0 : 1 : beat === 7 ? 2 : beat >= 8 ? 3 : -1;
  const accent = beat === 8 ? '#ffbd73' : '#58e1d6';
  return <AbsoluteFill style={{background: '#081725', color: '#edf8ff', fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(#44697b40 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
    <div style={{position: 'absolute', left: 65, top: 36, right: 65, display: 'flex', justifyContent: 'space-between', color: accent, fontSize: 19, letterSpacing: 3}}><span>{content.phase}</span><span>BATCH OPERATIONS / ILLUSTRATIVE SYSTEM</span></div>
    <div style={{position: 'absolute', left: 65, top: 90, opacity, transform: `translateY(${(1 - reveal) * 16}px)`, fontSize: 51, fontWeight: 800}}>{content.title}</div>
    <div style={{position: 'absolute', left: 65, top: 190, color: '#9dbdce', fontSize: 18, letterSpacing: 2}}>CONTROL PLANE / FILES, JOBS AND STATUS</div>
    <div style={{position: 'absolute', left: 50, top: 235}}><BatchDiagram /></div>
    <div style={{position: 'absolute', left: 65, top: 650, width: 1100}}>
      <div style={{fontSize: 18, color: '#9dbdce', letterSpacing: 2, marginBottom: 17}}>WORKFLOW {delivery ? 'B / DELIVER STRUCTURED DATA' : 'A / ORGANIZE DOCUMENTS'}</div>
      <div style={{display: 'flex', gap: 16}}>{steps.map((step, i) => {
        const completed = currentStep > i || delivery && beat >= 8 && i < 3 || beat >= 10;
        const active = currentStep === i;
        return <div key={step} style={{flex: 1, padding: '15px 13px', borderRadius: 12, border: `2px solid ${completed ? colors.Succeeded : active ? accent : '#345267'}`, background: active ? '#1c424f' : '#112b40'}}>
          <div style={{color: completed ? colors.Succeeded : active ? accent : '#8eafc3', fontSize: 15, marginBottom: 9}}>{completed ? beat === 9 && i < 3 ? 'SAVED / REUSED' : 'SUCCEEDED' : active ? beat === 8 ? 'FAILED / 503' : beat === 9 ? 'RETRY / ATTEMPT 2' : 'PROCESSING' : 'WAITING'}</div>
          <div style={{fontSize: 22, fontWeight: 700}}>{step}</div>
        </div>;
      })}</div>
      <div style={{marginTop: 22, padding: '15px 20px', minHeight: 54, background: '#102537', borderRadius: 10, fontSize: 22, color: beat === 8 ? '#ffbd73' : '#bad7e6', fontFamily: delivery ? 'Consolas, monospace' : 'Arial, sans-serif'}}>
        {!delivery ? beat >= 4 ? 'invoice-01.pdf → extracted text + type: Invoice' : 'PDF + DOCX → text extraction → document classification' :
          beat === 5 ? 'workflow-v2: extract → transform → validate → post' :
          beat === 6 ? local < 100 ? 'Extracted: Invoice 01 / Amount due: $1,250.00' : '{"documentId":"file-01","type":"invoice","total":1250}' :
          beat === 7 ? 'Schema: required documentId, type, total ✓' :
          beat === 8 ? 'POST Business API → 503 / saved JSON preserved' :
          beat === 9 ? 'POST retry / Idempotency-Key: batch-002:file-01:v1' :
          beat === 11 ? 'Metadata edit ≠ replace original ≠ correct extracted output' :
          '200 OK / receipt: R-2041 / delivery acknowledged'}
      </div>
    </div>
    <div style={{position: 'absolute', left: 1230, right: 60, top: 195, bottom: 180, padding: 22, background: '#11283b', border: `1px solid ${accent}88`, borderRadius: 20}}>
      <div style={{fontSize: 18, letterSpacing: 3, color: '#70d8ff'}}>BATCH CONSOLE / STATUS VIEW</div>
      <div style={{fontSize: 29, fontWeight: 700, marginTop: 14}}>{delivery ? '002 / Deliver structured data' : '001 / Organize documents'}</div>
      <div style={{marginTop: 12, fontSize: 18, color: '#a6c2d2'}}>Owner: Alex / Submitted 09:{delivery ? '15' : '00'} / 6 files</div>
      <div style={{marginTop: 14, fontSize: 23, fontWeight: 700, color: counts.failed ? colors.Failed : counts.succeeded === 6 ? colors.Succeeded : colors.Processing}}>{batchStatus}</div>
      <div style={{display: 'flex', gap: 15, marginTop: 14, fontSize: 18}}>
        {Object.entries(counts).map(([name, value]) => <div key={name}><strong style={{fontSize: 26}}>{value}</strong><div style={{color: '#a6c2d2', fontSize: 15}}>{name}</div></div>)}
      </div>
      <div style={{height: 7, background: '#284358', borderRadius: 5, marginTop: 17}}><div style={{height: 7, background: counts.failed ? colors.Failed : colors.Succeeded, width: `${counts.succeeded / 6 * 100}%`, borderRadius: 5}} /></div>
      <div style={{marginTop: 18, display: 'flex', justifyContent: 'space-between', color: '#9bb7cb', fontSize: 16}}><span>FILE / RESULT</span><span>STATUS / ATTEMPT</span></div>
      {batchFiles.map((file, i) => <div key={file} style={{padding: '7px 0', borderBottom: '1px solid #2d475c', display: 'flex', justifyContent: 'space-between', fontSize: 18}}>
        <div>{file}<div style={{fontSize: 15, color: '#9bb7cb', marginTop: 2}}>{!delivery && statuses[i] === 'Succeeded' ? `${classifications[i]} / text available` : delivery && i === 0 && beat >= 8 ? beat >= 10 ? 'Receipt R-2041 / inspect output' : beat === 9 ? 'Resume: post / saved JSON' : '503: temporarily unavailable' : statuses[i] === 'Succeeded' ? 'Receipt saved / inspect output' : 'Step history available'}</div></div>
        <div style={{textAlign: 'right', color: colors[statuses[i]]}}>{statuses[i]}<div style={{fontSize: 15, marginTop: 4}}>{i === 0 && beat >= 9 ? '2' : statuses[i] === 'Queued' ? '0' : '1'}</div></div>
      </div>)}
      <div style={{display: 'flex', gap: 10, marginTop: 12, fontSize: 16}}>
        {[beat === 8 ? 'Retry failed' : beat === 9 ? 'Retry submitted' : 'Inspect output', 'Download results', 'Batch settings'].map((action, i) => <div key={action} style={{padding: '10px 9px', background: beat === 8 && i === 0 ? '#79542e' : '#25485c', borderRadius: 7, outline: beat === 9 && i === 0 ? '2px solid #58e1d6' : undefined}}>{action}</div>)}
      </div>
      <div style={{fontSize: 16, color: '#9bb7cb', marginTop: 5}}>{beat === 11 ? 'Settings: edit metadata / request cancellation' : delivery ? 'Originals, JSON and receipts are separate artifacts.' : 'Classification is an output, not a replacement file.'}</div>
    </div>
    <div style={{position: 'absolute', left: 65, right: 65, top: 920, opacity}}>
      <div style={{fontSize: 28, lineHeight: 1.35}}>{content.caption}</div>
      <div style={{fontSize: 22, lineHeight: 1.4, color: '#a6c3d4', marginTop: 14, borderLeft: `3px solid ${accent}`, paddingLeft: 16}}>{content.note}</div>
    </div>
    <div style={{position: 'absolute', bottom: 22, left: 65, right: 65, display: 'flex', justifyContent: 'space-between', color: '#7c9fb5', fontSize: 16, letterSpacing: 2}}><span>ONE PLATFORM / DIFFERENT WORKFLOWS / VISIBLE PROGRESS</span><span>{String(beat + 1).padStart(2, '0')} / 12</span></div>
    <div style={{position: 'absolute', bottom: 0, height: 4, width: `${frame / (BATCH_DURATION - 1) * 100}%`, background: accent}} />
  </AbsoluteFill>;
};
