import {conversationLines} from './lines';
import {narration} from './narration';

export const CONVERSATION_FPS = 30;
let cursor = 0;
export const dialogue = conversationLines.map((line, index) => {
  const clip = narration[index];
  if (line.speaker && (!clip || clip.text !== line.text)) {
    throw new Error('Conversation narration is stale. Run npm run audio:conversation before previewing or rendering.');
  }
  const start = cursor;
  const audioStart = start + 12;
  const audioEnd = audioStart + Math.ceil((clip?.seconds ?? 0) * CONVERSATION_FPS);
  cursor += clip ? audioEnd - start + (line.mood === 'punchline' ? 42 : 27) : 75;
  return {...line, start, end: cursor, clip, audioStart, audioEnd};
});
export const CONVERSATION_DURATION = cursor;

export const getDialogue = (frame: number) =>
  dialogue.find((beat) => frame >= beat.start && frame < beat.end) ?? dialogue[dialogue.length - 1];
