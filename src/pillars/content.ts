export const PILLARS_FPS = 30;
export const INTRO_FRAMES = 180;
export const PILLAR_FRAMES = 210;
export const OUTRO_FRAMES = 210;
export const PILLARS_DURATION = INTRO_FRAMES + 5 * PILLAR_FRAMES + OUTRO_FRAMES;

export const pillars = [
  {
    title: 'Educate',
    headline: 'Build shared understanding.',
    description: 'Common concepts and practical AI literacy',
    note: 'Ongoing effort as AI continues to evolve technically and in manufacturing.',
    cue: 'KNOWLEDGE',
    color: '#2ee9d3',
  },
  {
    title: 'Assess',
    headline: 'Know where you stand.',
    description: 'Maturity, readiness and capacity',
    note: 'Re-assess periodically as new team members and technology become available.',
    cue: 'READINESS',
    color: '#58bbff',
  },
  {
    title: 'Govern',
    headline: 'Make trust operational.',
    description: 'Proportionate controls and accountability',
    note: 'Refresh quarterly as maturity strengthens and new regulations appear.',
    cue: 'ACCOUNTABILITY',
    color: '#bca0ff',
  },
  {
    title: 'Decide',
    headline: 'Choose the right path.',
    description: 'Build, buy, partner or defer',
    note: 'Weigh cost to build vs. cost to maintain vs. cost of doing nothing.',
    cue: 'TRADE-OFFS',
    color: '#ffcf66',
  },
  {
    title: 'Deliver & evolve',
    headline: 'Turn capability into progress.',
    description: 'ADLC and continuous improvement',
    note: 'Enable teams of any size to leverage AI successfully within their governed parameters.',
    cue: 'CONTINUOUS IMPROVEMENT',
    color: '#ff87b7',
  },
] as const;

export const getPillarBeat = (frame: number) => {
  const outroStart = INTRO_FRAMES + pillars.length * PILLAR_FRAMES;
  if (frame < INTRO_FRAMES) {
    return {kind: 'intro' as const, index: -1, localFrame: frame, duration: INTRO_FRAMES};
  }
  if (frame >= outroStart) {
    return {kind: 'outro' as const, index: -1, localFrame: frame - outroStart, duration: OUTRO_FRAMES};
  }
  const index = Math.floor((frame - INTRO_FRAMES) / PILLAR_FRAMES);
  return {
    kind: 'pillar' as const,
    index,
    localFrame: (frame - INTRO_FRAMES) % PILLAR_FRAMES,
    duration: PILLAR_FRAMES,
  };
};
