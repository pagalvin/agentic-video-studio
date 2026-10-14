export const FPS = 30;
export const SCENE_FRAMES = 10 * FPS;

export const story = [
  {
    label: 'TASK',
    title: 'From prompt to pull request',
    detail: 'Agentic Software Development',
    caption: 'Start with an outcome, constraints, and a clear definition of done.',
    color: '#67e8f9',
  },
  {
    label: 'INSPECT + PLAN',
    title: 'Understand before acting',
    detail: 'Read the code. Trace the behavior. Make a bounded plan.',
    caption: 'An agent inspects the repository and proposes changes grounded in existing code.',
    color: '#a5b4fc',
  },
  {
    label: 'EDIT',
    title: 'Small changes, tight scope',
    detail: 'Implement the plan without expanding the task.',
    caption: 'Tools turn the plan into focused edits that preserve the surrounding behavior.',
    color: '#c4b5fd',
  },
  {
    label: 'TEST + ITERATE',
    title: 'Feedback closes the loop',
    detail: 'Edit -> test -> inspect failure -> revise',
    caption: 'Tests provide evidence. A failure sends the agent back to inspect and revise.',
    color: '#fcd34d',
  },
  {
    label: 'HUMAN GATE',
    title: 'Autonomy needs boundaries',
    detail: 'Permissions. Risk checks. Human decisions.',
    caption: 'Sensitive actions and uncertain requirements pause at an explicit human gate.',
    color: '#fda4af',
  },
  {
    label: 'REVIEWABLE PR',
    title: 'Evidence, not just output',
    detail: 'A focused diff, validation results, and known limitations.',
    caption: 'The result is a reviewable pull request. A human still owns the decision to merge.',
    color: '#86efac',
  },
] as const;

export const DURATION_IN_FRAMES = story.length * SCENE_FRAMES;
