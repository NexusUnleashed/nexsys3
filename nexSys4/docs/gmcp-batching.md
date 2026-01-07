# GMCP Batching Notes

Goal: reduce nexSys4 overhead during large GMCP bursts while preserving correctness.

Key idea
- Batch only the GMCP tags that are safe to merge or replace.
- Leave stream/delta tags in-order, but apply them in a single reducer pass.
- Flush the batch on `PromptEvent` (and optionally on a short safety timer).

Tag categories
- Patch-style (safe to merge by key)
  - `Char.Status`
  - `Char.Vitals`
  - Strategy: merge payloads into a single object per block and dispatch once.
- List-style (safe to replace)
  - `Char.Afflictions.List`
  - `Char.Defences.List`
  - Strategy: keep the last list in the block and dispatch once.
- Delta/stream-style (order matters)
  - `Char.Afflictions.Add` / `Char.Afflictions.Remove`
  - `Char.Defences.Add` / `Char.Defences.Remove`
  - Strategy: buffer in-order and apply in one dispatch (batch event) or expand
    to multiple internal events inside a single flush.

Why it helps
- Fewer reducer passes (one batch instead of hundreds of individual actions).
- Single eventBridge diff per prompt instead of per GMCP message.
- Avoids intermediate state thrash when add/remove happen in the same block.

Constraints / risks
- Event timing changes: nexSys4 events become prompt-aligned for batched tags.
- Only safe for tags where the full final state can be reconstructed or merged.
- Stream tags still require per-entry application (order must be preserved).

Potential implementation sketch
- Add `batchGmcp` config in the adapter.
- Maintain an in-memory aggregator while `batchGmcp` is enabled.
- On `PromptEvent` (or debounce), dispatch:
  - `CHAR_STATUS` if a merged payload exists.
  - `CHAR_VITALS` if a merged payload exists.
  - `AFF_LIST`/`DEF_LIST` if last list exists.
  - A single `AFF_BATCH` / `DEF_BATCH` for buffered add/remove deltas.
- Keep current behavior when `batchGmcp` is disabled.

Open questions
- Should batch flush be tied strictly to `PromptEvent` or also the existing
  `outputDebounceMs` timer?
- Do we want a hard limit on buffered deltas to avoid unbounded memory?
- Should batches be emitted to eventStream as aggregated events or individual
  legacy events after state is updated?
