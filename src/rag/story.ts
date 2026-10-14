export const RAG_FPS = 30;
export const RAG_BEAT_FRAMES = 300;
export const ragBeats = [
  {phase: 'THE BIG PICTURE', title: 'From documents to grounded answers.', caption: 'Two connected flows: prepare the knowledge, then retrieve evidence when a question arrives.', callout: 'RAG = retrieval-augmented generation. MCP is an optional tool-access layer.', detail: 'PREPARE ONCE. RETRIEVE AT RUNTIME.'},
  {phase: '01 / DATA PREPARATION', title: 'Different files. One ingestion API.', caption: 'PDFs, Excel workbooks and Word documents enter a controlled ingestion pipeline.', callout: 'Fictional example sources: a checklist, an inspection schedule and a procedure.', detail: 'PDF + XLSX + DOCX'},
  {phase: '01 / DATA PREPARATION', title: 'Extract. Normalize. Chunk.', caption: 'Recover useful content, then create searchable chunks while keeping their source context.', callout: 'PDF: OCR if needed. Excel: preserve headers and tables. Word: retain headings.', detail: 'TEXT + SOURCE + PAGE / SHEET / SECTION'},
  {phase: '01 / DATA PREPARATION', title: 'Embed and index the knowledge.', caption: 'The ingestion API calls an embeddings API, then stores vectors alongside chunk text and metadata.', callout: 'An embedding represents meaning for search. It is not a summary or a generated answer.', detail: 'VECTOR + ORIGINAL CHUNK + METADATA'},
  {phase: '02 / RUNTIME', title: 'A question starts the request.', caption: 'The chat sends a question to the assistant. The assistant requests a search tool through MCP.', callout: 'Example question: What is the inspection process for Line 3?', detail: 'USER QUESTION -> ASSISTANT -> TOOL CALL'},
  {phase: '02 / RUNTIME', title: 'MCP connects the retrieval tool.', caption: 'The MCP server invokes the retrieval API. That service embeds the query and searches the index.', callout: 'MCP carries tool requests and results; the retrieval service performs the search.', detail: 'QUERY EMBEDDING -> VECTOR SEARCH'},
  {phase: '02 / RUNTIME', title: 'Return the relevant evidence.', caption: 'Search results carry original chunks and source identifiers back through MCP to the assistant.', callout: 'Enforce document access permissions before evidence enters the model context.', detail: 'TOP MATCHES + SOURCE REFERENCES'},
  {phase: '02 / RUNTIME', title: 'Generate from the evidence.', caption: 'The assistant passes the question and selected chunks to the LLM, then returns a cited response.', callout: 'Retrieved text is untrusted input. Grounding improves answers; it does not guarantee correctness.', detail: 'QUESTION + EVIDENCE -> LLM -> ANSWER'},
  {phase: 'THE COMPLETE FLOW', title: 'Prepare knowledge. Retrieve context.', caption: 'The index connects preparation to runtime. Only selected evidence accompanies each question.', callout: 'No evidence? Say so. Keep citations, access controls and human judgment in the loop.', detail: 'RAG WITH MCP-MEDIATED RETRIEVAL'},
] as const;
export const RAG_DURATION = ragBeats.length * RAG_BEAT_FRAMES;

export type NodeId = 'docs' | 'ingest' | 'extract' | 'embed' | 'index' | 'chat' | 'assistant' | 'mcp' | 'retrieval' | 'llm';
export const nodes: {id: NodeId; x: number; y: number; title: string; subtitle: string; tag: string}[] = [
  {id: 'docs', x: 60, y: 55, title: 'Source documents', subtitle: 'PDF / Excel / Word', tag: 'FILES'},
  {id: 'ingest', x: 370, y: 55, title: 'Ingestion API', subtitle: 'Validate + orchestrate', tag: 'API'},
  {id: 'extract', x: 680, y: 55, title: 'Extract + chunk', subtitle: 'Content + source metadata', tag: 'PREP'},
  {id: 'embed', x: 990, y: 55, title: 'Embeddings API', subtitle: 'Text -> semantic vectors', tag: 'MODEL'},
  {id: 'index', x: 1370, y: 255, title: 'Knowledge index', subtitle: 'Vectors + text + sources', tag: 'STORE'},
  {id: 'chat', x: 60, y: 360, title: 'Chat UI', subtitle: 'Question / cited answer', tag: 'USER'},
  {id: 'assistant', x: 370, y: 360, title: 'Assistant', subtitle: 'Tool + context orchestration', tag: 'AGENT'},
  {id: 'mcp', x: 680, y: 360, title: 'MCP server', subtitle: 'search_documents tool', tag: 'TOOLS'},
  {id: 'retrieval', x: 990, y: 360, title: 'Retrieval API', subtitle: 'Embed query + search', tag: 'SEARCH'},
  {id: 'llm', x: 370, y: 625, title: 'Generation LLM', subtitle: 'Question + retrieved context', tag: 'MODEL'},
];

export type EdgeId = 'upload' | 'extract' | 'embedChunks' | 'save' | 'storeText' | 'question' | 'tool' | 'invoke' | 'embedQuery' | 'queryVector' | 'search' | 'matches' | 'toolResult' | 'evidence' | 'prompt' | 'completion' | 'answer';
export const edges: {id: EdgeId; from: NodeId; to: NodeId; points: [number, number][]; label: string; lx: number; ly: number; kind: 'content' | 'vector' | 'tool' | 'evidence'}[] = [
  {id: 'upload', from: 'docs', to: 'ingest', points: [[310, 115], [370, 115]], label: '', lx: 0, ly: 0, kind: 'content'},
  {id: 'extract', from: 'ingest', to: 'extract', points: [[620, 115], [680, 115]], label: '', lx: 0, ly: 0, kind: 'content'},
  {id: 'embedChunks', from: 'extract', to: 'embed', points: [[930, 115], [990, 115]], label: '', lx: 0, ly: 0, kind: 'content'},
  {id: 'save', from: 'embed', to: 'index', points: [[1240, 115], [1495, 115], [1495, 255]], label: 'Embedding vectors', lx: 1370, ly: 90, kind: 'vector'},
  {id: 'storeText', from: 'extract', to: 'index', points: [[805, 175], [805, 218], [1425, 218], [1425, 255]], label: 'Chunk text + metadata', lx: 880, ly: 205, kind: 'content'},
  {id: 'question', from: 'chat', to: 'assistant', points: [[310, 420], [370, 420]], label: '', lx: 0, ly: 0, kind: 'tool'},
  {id: 'tool', from: 'assistant', to: 'mcp', points: [[620, 420], [680, 420]], label: '', lx: 0, ly: 0, kind: 'tool'},
  {id: 'invoke', from: 'mcp', to: 'retrieval', points: [[930, 420], [990, 420]], label: '', lx: 0, ly: 0, kind: 'tool'},
  {id: 'embedQuery', from: 'retrieval', to: 'embed', points: [[1080, 360], [1080, 175]], label: 'Query text', lx: 1022, ly: 248, kind: 'vector'},
  {id: 'queryVector', from: 'embed', to: 'retrieval', points: [[1190, 175], [1190, 360]], label: 'Vector', lx: 1234, ly: 287, kind: 'vector'},
  {id: 'search', from: 'retrieval', to: 'index', points: [[1240, 397], [1300, 397], [1300, 295], [1370, 295]], label: 'Search', lx: 1313, ly: 270, kind: 'vector'},
  {id: 'matches', from: 'index', to: 'retrieval', points: [[1495, 375], [1495, 510], [1115, 510], [1115, 480]], label: 'Relevant chunks + sources', lx: 1330, ly: 544, kind: 'evidence'},
  {id: 'toolResult', from: 'retrieval', to: 'mcp', points: [[1040, 480], [1040, 567], [805, 567], [805, 480]], label: 'Tool result', lx: 928, ly: 601, kind: 'evidence'},
  {id: 'evidence', from: 'mcp', to: 'assistant', points: [[740, 480], [740, 550], [560, 550], [560, 480]], label: 'Evidence', lx: 650, ly: 582, kind: 'evidence'},
  {id: 'prompt', from: 'assistant', to: 'llm', points: [[445, 480], [445, 625]], label: 'Context', lx: 402, ly: 568, kind: 'evidence'},
  {id: 'completion', from: 'llm', to: 'assistant', points: [[535, 625], [535, 480]], label: 'Answer', lx: 576, ly: 610, kind: 'evidence'},
  {id: 'answer', from: 'assistant', to: 'chat', points: [[400, 480], [400, 520], [185, 520], [185, 480]], label: 'Cited response', lx: 270, ly: 553, kind: 'evidence'},
];

export const beatEdges: EdgeId[][] = [
  [], ['upload'], ['extract'], ['embedChunks', 'save', 'storeText'],
  ['question', 'tool'], ['invoke', 'embedQuery', 'queryVector', 'search'],
  ['matches', 'toolResult', 'evidence'], ['prompt', 'completion', 'answer'],
  ['upload', 'extract', 'embedChunks', 'save', 'storeText', 'question', 'tool', 'invoke', 'embedQuery', 'queryVector', 'search', 'matches', 'toolResult', 'evidence', 'prompt', 'completion', 'answer'],
];

export const colors = {content: '#56deed', vector: '#bba0ff', tool: '#ffca70', evidence: '#88edb3'};
