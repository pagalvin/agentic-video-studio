export const CONVERSATION_FPS = 30;
export const CONVERSATION_DURATION = 840;
export const dialogue = [
  {start: 0, end: 90, speaker: null, text: 'A perfectly ordinary coffee break.', mood: 'intro'},
  {start: 90, end: 300, speaker: 'Milo', text: 'Why did the scarecrow win an award?', mood: 'setup'},
  {start: 300, end: 390, speaker: 'June', text: 'Why?', mood: 'question'},
  {start: 390, end: 570, speaker: 'Milo', text: 'He was outstanding in his field.', mood: 'punchline'},
  {start: 570, end: 750, speaker: 'June', text: 'That joke needs to be put out to pasture.', mood: 'deadpan'},
  {start: 750, end: 840, speaker: null, text: 'Good coffee. Questionable jokes.', mood: 'laugh'},
] as const;

export const getDialogue = (frame: number) =>
  dialogue.find((beat) => frame >= beat.start && frame < beat.end) ?? dialogue[dialogue.length - 1];
