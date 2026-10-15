export const BATCH_FPS = 30;
export const BATCH_BEAT_FRAMES = 225;
export const BATCH_DURATION = BATCH_BEAT_FRAMES * 12;
export const batchBeats = [
  {phase: 'CREATE / ORGANIZE DOCUMENTS', title: 'One batch. A workflow for every file.', caption: 'Choose a workflow, name the batch and upload mixed documents through a generic Batch Console.', note: 'Illustrative six-file batch. The same pattern scales to hundreds of files.'},
  {phase: 'STORE / REGISTER', title: 'Store the files. Track the work.', caption: 'File Storage holds originals. The Batch Service registers a master record and one record per file.', note: 'The Batch Database tracks configuration, step status, errors and output references.'},
  {phase: 'QUEUE / DISPATCH', title: 'Queue references, not file contents.', caption: 'The service enqueues file IDs and a workflow version. A bounded worker pool pulls available work.', note: 'Uploading finishes before processing does. The browser does not hold a long-running request.'},
  {phase: 'WORKFLOW A / PROCESS', title: 'Extract text. Classify the document.', caption: 'Three workers process different files concurrently, recording progress for each processing step.', note: 'File status and batch progress are different views of the same tracked work.'},
  {phase: 'WORKFLOW A / RESULTS', title: 'Turn a stack of files into useful results.', caption: 'Each successful file has extracted text and a document classification ready to inspect or download.', note: 'A batch is succeeded only when every file in this example has succeeded.'},
  {phase: 'WORKFLOW B / CONFIGURE', title: 'Same platform. A different workflow.', caption: 'Create a second batch: extract text, transform to JSON, validate it and post it to a Business API.', note: 'The workflow is selected for the batch; the first batch and its results remain intact.'},
  {phase: 'WORKFLOW B / TRANSFORM', title: 'From document text to structured data.', caption: 'A worker retrieves the original, extracts text and transforms it into a structured JSON object.', note: 'Persist intermediate outputs so a later delivery retry does not repeat successful extraction.'},
  {phase: 'WORKFLOW B / VALIDATE', title: 'Valid JSON is not enough.', caption: 'Validate the object against the receiving API schema and required business rules before posting.', note: 'Invalid data stays out of delivery and requires correction or review; it is not silently accepted.'},
  {phase: 'WORKFLOW B / EXCEPTION', title: 'One delivery fails. Other files finish.', caption: 'The Business API returns a temporary 503 for one file. Its extraction and validation remain successful.', note: 'Completed with errors is an honest terminal batch state, not a green success banner.'},
  {phase: 'WORKFLOW B / RETRY', title: 'Retry delivery, not the whole workflow.', caption: 'An operator retries the failed file. A delivery job references the already validated, saved JSON.', note: 'Reuse a stable idempotency key. Duplicate prevention requires support from the receiving API.'},
  {phase: 'WORKFLOW B / CONFIRM', title: 'Record the acknowledgement. Close the loop.', caption: 'The retry receives a 200 acknowledgement. Save the receipt, update file status and recalculate progress.', note: 'Here, 200 means accepted delivery under the example API contract, not downstream business completion.'},
  {phase: 'MANAGE / OPERATE', title: 'Visible progress. Actionable exceptions.', caption: 'Inspect outputs, review step history, retry failures, download results and manage batch metadata.', note: 'Cancellation is a request: stop new work where possible; already posted data is not rolled back.'},
] as const;
export const batchFiles = ['invoice-01.pdf', 'contract.docx', 'letter.pdf', 'invoice-02.pdf', 'agreement.docx', 'memo.pdf'] as const;
export const classifications = ['Invoice', 'Contract', 'Correspondence', 'Invoice', 'Contract', 'Correspondence'];
export type FileStatus = 'Queued' | 'Processing' | 'Succeeded' | 'Failed';
export const getBatchState = (frame: number) => {
  const beat = Math.min(Math.floor(frame / BATCH_BEAT_FRAMES), 11);
  const local = frame % BATCH_BEAT_FRAMES;
  const delivery = beat >= 5;
  const statuses: FileStatus[] = batchFiles.map((_, i) => {
    if (beat <= 2 || beat === 5) return 'Queued';
    if (beat === 3) return i < 3 ? local >= 120 ? 'Succeeded' : 'Processing' : local >= 120 ? 'Processing' : 'Queued';
    if (beat === 4 || beat >= 10) return 'Succeeded';
    if (beat === 6 || beat === 7) return i < 3 ? 'Processing' : 'Queued';
    if (beat === 8) return i === 0 ? 'Failed' : 'Succeeded';
    return i === 0 ? local < 65 ? 'Queued' : 'Processing' : 'Succeeded';
  });
  const counts = {
    queued: statuses.filter((s) => s === 'Queued').length,
    processing: statuses.filter((s) => s === 'Processing').length,
    succeeded: statuses.filter((s) => s === 'Succeeded').length,
    failed: statuses.filter((s) => s === 'Failed').length,
  };
  const batchStatus = counts.failed ? 'Completed with errors' : counts.succeeded === 6 ? 'Succeeded' : counts.processing ? 'Processing' : 'Queued';
  return {beat, local, delivery, statuses, counts, batchStatus};
};
