export const feeScript = [
  'Quarter close brings together source data, approved fee terms, and investor provisions. Automation coordinates the work, while operations teams retain control.',
  'First, validate the inputs. Missing information returns to the analyst for investigation and resubmission, rather than silently becoming a default value.',
  'Next, load the approved rules and effective dates, including applicable side-letter provisions. Changes to those rules follow a separate authoring and approval process.',
  'Deterministic engines establish the fee basis and carry forward prior-period context. Current observations and relevant events provide the foundation for calculation.',
  'The fee engine applies approved rates, accrual logic, and investor provisions. A structured decision trace preserves how the result was determined.',
  'Quality checks flag an unusual change. The analyst investigates the source and calculation evidence. A flagged result is not automatically an error.',
  'Here, the evidence supports the change. The analyst records the resolution and checks run again. Corrections would require applicable controls and recalculation.',
  'Artificial intelligence drafts an explanation from the completed calculation and its evidence. It describes the result. It does not perform the fee arithmetic.',
  'The supervisor compares that explanation with the evidence. An unclear draft is returned for revision. The workflow waits; release is not yet authorized.',
  'After revision and review, the explanation is approved under release controls. The platform records the reviewer and version, then packages the approved outputs.',
  'Accounting receives the posting package and returns a response. Sent is not confirmed. Rejections require resolution; a confirmation is recorded back in operations.',
  'Every delivered result links back to sources, approved terms, calculation evidence, quality review, and approval. The goal: consistent processing, controlled exceptions, and traceable results.',
] as const;
