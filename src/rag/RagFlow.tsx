import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {NetworkDiagram} from './NetworkDiagram';
import {colors, ragBeats, RAG_BEAT_FRAMES, RAG_DURATION} from './story';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const RagFlow = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = Math.min(Math.floor(frame / RAG_BEAT_FRAMES), ragBeats.length - 1);
  const local = frame % RAG_BEAT_FRAMES;
  const content = ragBeats[beat];
  const accent = beat >= 4 && beat < 8 ? colors.tool : colors.content;
  const reveal = spring({frame: local, fps, config: {damping: 200}});
  const opacity = interpolate(local, [0, 15, 281, 299], [0, 1, 1, 0], clamp);
  const answerText = 'Follow the approved Line 3 procedure [1], complete the inspection checklist [2], and use the workbook schedule to confirm timing [3].';
  const answerLength = Math.floor(interpolate(local, [20, 135], [0, answerText.length], clamp));

  return (
    <AbsoluteFill style={{background: '#09131f', fontFamily: 'Arial, sans-serif', color: '#eef7ff', overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(#38526755 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
      <div style={{position: 'absolute', top: 42, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: 3}}>
        <span style={{color: accent}}>{content.phase}</span><span style={{color: '#8daac0'}}>RAG WITH MCP-MEDIATED RETRIEVAL</span>
      </div>
      <div style={{position: 'absolute', top: 96, left: 70, opacity, transform: `translateY(${(1 - reveal) * 20}px)`}}>
        <div style={{fontSize: 54, fontWeight: 800, letterSpacing: -1}}>{content.title}</div>
        <div style={{fontSize: 19, letterSpacing: 3, color: accent, marginTop: 15}}>{content.detail}</div>
      </div>
      <div style={{position: 'absolute', left: 24, top: 218, transform: 'scale(0.83)', transformOrigin: 'top left'}}>
        <NetworkDiagram beat={beat} />
      </div>
      <div style={{position: 'absolute', right: 60, top: 250, width: 430, minHeight: 475, padding: 28, boxSizing: 'border-box', background: '#102333', border: `1px solid ${accent}55`, borderRadius: 18}}>
        <div style={{fontSize: 17, letterSpacing: 3, color: accent, marginBottom: 24}}>{beat < 4 ? 'KNOWLEDGE PREPARATION' : 'EXAMPLE CHAT / FICTIONAL'}</div>
        {beat < 4 ? (
          <>
            {[['PDF', 'Line 3 checklist', 'Text extraction / OCR as needed'], ['XLSX', 'Inspection schedule', 'Rows + column headers + sheet'], ['DOCX', 'Line 3 procedure', 'Paragraphs + section headings']].map(([type, title, subtitle], index) => (
              <div key={type} style={{padding: '17px 0', borderBottom: '1px solid #294659', opacity: interpolate(local, [index * 12, index * 12 + 20], [0.3, 1], clamp)}}>
                <div style={{display: 'inline-block', fontSize: 17, color: colors.content, letterSpacing: 2, border: '1px solid #56deed66', borderRadius: '4px 12px 4px 4px', padding: '5px 10px'}}>{type}</div>
                <div style={{fontSize: 25, marginTop: 8, marginBottom: 8}}>{title}</div>
                <div style={{fontSize: 18, lineHeight: 1.4, color: '#a4bdd1'}}>{subtitle}</div>
              </div>
            ))}
            <div style={{fontSize: 18, color: '#bba0ff', marginTop: 22, lineHeight: 1.5}}>{beat === 3 ? 'Stored: chunk text + vector + source ID + location + access metadata.' : 'Preserve provenance so answers can cite their evidence.'}</div>
          </>
        ) : (
          <>
            <div style={{borderRadius: 12, padding: 18, background: '#264351', fontSize: 24, lineHeight: 1.4}}>What is the inspection process for Line 3?</div>
            <div style={{fontSize: 18, color: colors.tool, marginTop: 24, marginBottom: 18, fontFamily: 'Consolas, monospace'}}>search_documents(query)</div>
            {beat <= 5 && <div style={{fontSize: 23, lineHeight: 1.5, color: '#a4bdd1'}}>{beat === 4 ? 'Assistant requests evidence through an MCP tool.' : 'Retrieval service embeds the question and searches the knowledge index.'}</div>}
            {beat === 6 && (
              <div style={{fontSize: 20, lineHeight: 1.5, color: colors.evidence}}>
                <div style={{marginBottom: 14}}>[1] Procedure / section 2<br /><span style={{color: '#a4bdd1'}}>&quot;Follow the approved inspection steps.&quot;</span></div>
                <div style={{marginBottom: 14}}>[2] Checklist / page 1<br /><span style={{color: '#a4bdd1'}}>&quot;Record the required checks.&quot;</span></div>
                <div>[3] Schedule / Line 3 row<br /><span style={{color: '#a4bdd1'}}>&quot;Use the listed inspection timing.&quot;</span></div>
                <div style={{fontSize: 17, color: '#a4bdd1', marginTop: 18}}>Selected chunks, not every document.</div>
              </div>
            )}
            {beat >= 7 && (
              <>
                <div style={{fontSize: 23, lineHeight: 1.5, color: colors.evidence}}>{beat === 8 ? answerText : answerText.slice(0, answerLength)}</div>
                <div style={{fontSize: 17, color: '#a4bdd1', lineHeight: 1.7, marginTop: 20}}>[1] Word procedure / section 2<br />[2] PDF checklist / page 1<br />[3] Excel schedule / Line 3 row</div>
              </>
            )}
          </>
        )}
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 72, opacity}}>
        <div style={{fontSize: 29, lineHeight: 1.45, marginBottom: 16}}>{content.caption}</div>
        <div style={{fontSize: 23, lineHeight: 1.4, color: '#a4bdd1', paddingLeft: 18, borderLeft: `3px solid ${accent}`}}>{content.callout}</div>
      </div>
      <div style={{position: 'absolute', left: 70, bottom: 23, display: 'flex', gap: 25, fontSize: 16, letterSpacing: 1}}>
        {Object.entries(colors).map(([kind, color]) => <span key={kind} style={{color}}>{kind === 'content' ? 'SOURCE CONTENT' : kind === 'vector' ? 'EMBEDDINGS / INDEX' : kind === 'tool' ? 'TOOL REQUESTS' : 'EVIDENCE / ANSWERS'}</span>)}
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 22, fontSize: 18, color: '#8daac0'}}>0{beat + 1} / 09</div>
      <div style={{position: 'absolute', bottom: 0, height: 4, width: `${frame / (RAG_DURATION - 1) * 100}%`, background: accent}} />
    </AbsoluteFill>
  );
};
