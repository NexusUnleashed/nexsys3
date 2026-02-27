# NEXSYS Server-Side Curing Specification (Draft)

## 1) Purpose
Define the behavior contract for how new `nexSys` manages Achaea server-side curing (SS): priorities, settings, temporary overrides, and queue interactions.

This document is outcome-focused and intentionally avoids prescribing internal architecture patterns.

## 2) Relationship to Core Spec
- This document extends `.github/spec/NEXSYS.md`.
- If there is a conflict, `.github/spec/NEXSYS.md` defines global product constraints and this file defines SS-specific behavior.
- This file should be treated as the authoritative SS behavior contract for implementation and testing.
- No internal architectural style is mandated by this document.

## 3) Reference Inputs
- `.github/spec/references/Achaea Serverside Curing.txt` (authoritative command surface reference)
- `.github/spec/references/ACHAEA.md` (game-system context)
- `.github/spec/NEXSYS.md` (top-level implementation contract)

## 4) Scope
In scope:
- SS status synchronization and reconciliation.
- Affliction priority and defence priority synchronization.
- Temporary priority override behavior (`CURING PRIOAFF` lifecycle).
- Manual SS queue operations (`CURING QUEUE ...`) as first-class control.
- SS setting management (focus/tree/sipping/clot/batch/etc.).
- Churn/thrash prevention and deterministic reset behavior when conditions clear.
- Desync detection and bounded resynchronization.

Out of scope:
- Class-specific strategy tuning for every class matchup.
- UI design and visual presentation details.
- Nexus trigger implementation details (adapter-level choice).

## 5) Design Goals
- Correctness first: local desired SS state and actual SS state converge reliably.
- Determinism: identical event streams produce identical outbound SS command sequences.
- Low churn: avoid command spam, oscillation, and unnecessary rewrites.
- Reversibility: temporary rule-driven changes always unwind safely.
- Extensibility: support adding richer rule sets later without rewriting SS foundations.

## 6) State Semantics Requirements
The implementation must preserve the following distinct semantics. Naming, storage shape, and internal structure are implementation-defined.

Required semantic concepts (labels below are illustrative):
- `baseline`: user-intended persistent defaults (stable target configuration).
- `derived`: temporary runtime overlays from rules/context (non-persistent intent).
- `desired`: resolved effective SS target after applying baseline + derived + transient overrides.
- `observed`: latest known SS server state from snapshots/parsing.
- `pending`: outbound commands sent but not yet observed as reflected by server state.
- `transient`: temporary controls such as active `PRIOAFF` and manual queue injections.

Required invariants:
- Derived/transient state never mutates baseline implicitly.
- Desired state is always reproducible from baseline + overlays.
- Pending entries must expire or resolve; no unbounded pending growth.

## 7) Supported SS Command Surface
The system must support reconciliation and command emission for:
- `CURING ON|OFF`
- `CURING AFFLICTIONS ON|OFF`
- `CURING DEFENCES ON|OFF`
- `CURING SIPPING ON|OFF`
- `CURING TRANSMUTATION ON|OFF`
- `CURING SIPHEALTH|SIPMANA <percent>`
- `CURING MOSSHEALTH|MOSSMANA <percent>`
- `CURING PRIORITY HEALTH|MANA`
- `CURING FOCUS ON|OFF`
- `CURING FOCUS FIRST|SECOND`
- `CURING TREE ON|OFF [CUSTOM]`
- `CURING USEVAULT ON|OFF`
- `CURING USECLOT ON|OFF`
- `CURING CLOTAT <amount>`
- `CURING FALLBACK ON|OFF`
- `CURING KAIDOTRANSMUTE`
- `CURING BATCH ON|OFF`
- `CURING HEALTHAFFSABOVE <value>`
- `CURING PRIORITY <aff> <priority> ...`
- `CURING PRIORITY DEFENCE <defence> <priority|RESET>`
- `CURING PRIORITY RESET` (explicit full reset use cases only)
- `CURING PRIOAFF <affliction>`
- `CURING PRIOAFF NONE`
- `CURING QUEUE ADD <cure>`
- `CURING QUEUE INSERT <1-20> <cure>`
- `CURING QUEUE REMOVE <cure>`
- `CURING QUEUE RESET`
- `CURING PREDICT <affliction>`
- `CURING UNPREDICT <affliction>`
- `CURINGSET LIST`
- `CURINGSET NEW <name>`
- `CURINGSET SWITCH <name>`
- `CURINGSET CLONE <from>`
- `CURINGSET RENAME <oldname> <newname>`
- `CURINGSET DELETE <name>`

Snapshot/resync inputs to parse and normalize:
- `CURING STATUS`
- `CURING PRIORITY LIST`
- `CURING PRIORITY DEFENCE LIST`
- `CURING QUEUE LIST`
- `CURING PREDICTIONS`
- `CURINGSET LIST`

### 7.1 Curing Set Baseline Recovery Contract
The SS system must support a two-set safety strategy when the game account supports multiple curingsets:
- `default`: canonical baseline set for long-term priorities/settings.
- `working`: active operational set where runtime swaps and temporary overrides occur.

Required behavior:
- Runtime swap logic and combat-time overrides must apply only to `working`.
- `default` must not be mutated by runtime rule churn.
- Baseline edits are explicit user-initiated actions and then synchronized into `default`.
- The system must provide a deterministic restore operation that returns operational priorities/settings to baseline by restoring `working` from `default`.
- The system must never auto-issue `CURINGSET EXPAND` (credit-purchase action).

Fallback behavior when multi-set support is unavailable:
- Detect single-set limitation and enter explicit degraded mode.
- Preserve the same baseline-vs-working semantics logically, using non-curingset restore workflows.
- Surface diagnostics that degraded mode is active and full set-based restore is unavailable.

## 8) Reconciliation Contract
Reconciliation must be diff-based and minimal.

Rules:
- Emit commands only when desired and observed differ meaningfully.
- Coalesce duplicate writes in the same planning cycle.
- Prefer targeted updates over broad resets.
- Preserve stable ordering of outbound updates so behavior is reproducible.
- Treat command emission as idempotent intent; repeated identical desired state should emit nothing after convergence.
- Rule/scenario evaluation must collect net changes first and emit SS commands only after evaluation completes for that cycle.
- Mid-evaluation partial writes are not allowed when a later rule in the same cycle could override earlier intent.

Convergence requirement:
- After input state stabilizes, SS must converge to desired state within a bounded number of prompt cycles (configurable threshold) without repeated oscillation.

### 8.1 Prompt-Block Evaluation Contract
The SS system must treat prompt as the primary block boundary for evaluation and outbound decisioning.

Required behavior:
- Ingest text/reflex/GMCP updates as they arrive within a server block.
- Default outbound SS evaluation and command emission to prompt boundary (`PromptEvent`) so full block context is considered.
- If multiple in-block updates cancel or supersede each other, only net final intent for that block is eligible for emission.
- Avoid reaction churn caused by transient in-block states that no longer apply by prompt.
- Safety fallback for delayed/missing prompt is permitted, but fallback must still emit only net-diff intent.

Immediate-processing allowance:
- Some inputs may be processed immediately for state capture/timing/safety, but immediate outbound SS commands are exception cases and must not violate net-diff and anti-churn rules.

## 9) Priority Management Contract
### 9.1 Affliction Priorities
- Maintain canonical local state for all tracked affliction priorities.
- Support direct set operations and dynamic overlays.
- Ensure reset behavior returns to baseline values when overlay conditions no longer apply.

### 9.2 Defence Priorities
- Maintain defence priority state independently from affliction priorities.
- Support targeted set and reset semantics.
- Avoid collateral updates to unrelated defences.

### 9.3 Priority Churn Control
- Multi-aff conditional rules may alter multiple priorities simultaneously.
- When rule truth changes, rollback must be exact and deterministic.
- If multiple rules target the same affliction/defence, precedence is deterministic and top-to-bottom.
- Later rules in the evaluation order override earlier rules when they target the same key.
- General always-on rules are evaluated first; scenario/opponent-specific rule packs are evaluated after and may override earlier general outcomes.
- After precedence resolution, only the final net diff is eligible for emission.

### 9.4 Dynamic Rule Lifecycle Contract
The SS system must support robust runtime control of rule/scenario sets.

Required capabilities:
- Add and remove rules/scenarios at runtime.
- Enable and disable rules/scenarios at runtime.
- Load and unload scenario-specific rule packs (for example opponent/class packs).
- Inspect active rule/scenario status and evaluation order.
- Reorder rules/scenarios while preserving deterministic top-to-bottom precedence.

Required behavior:
- Any lifecycle change (add/remove/enable/disable/load/unload/reorder) triggers reevaluation in the next evaluation cycle.
- Reevaluation after lifecycle change must still emit only final net diff updates.
- Disabling or removing a rule/scenario must unwind only that source's active effects, without collateral resets of unrelated active outcomes.
- Enabling or loading a rule/scenario must apply its outcomes according to current precedence and current game state.
- Repeated no-op lifecycle requests (for example enabling an already-enabled rule) must not generate redundant outbound SS commands.

## 10) PRIOAFF Contract
`PRIOAFF` is a temporary, high-urgency override and must be treated as a dedicated transient state.

Behavior requirements:
- At most one active `PRIOAFF` target at a time unless a future game change explicitly supports multiple.
- Setting the same active `PRIOAFF` repeatedly must not re-emit duplicate commands.
- Clearing conditions must be explicit and deterministic:
  - Affliction confirmed cured/lost.
  - Explicit `CURING PRIOAFF NONE`.
  - Rule/condition that requested it no longer holds.
  - Full local reset/desync recovery path.
- On clear, the system must return to normal priority behavior without stale override residue.

Safety:
- If local certainty is insufficient, prefer conservative clear and resync rather than indefinite stale override.

## 11) Manual Curing Queue Contract
Manual queue controls are first-class and higher precedence than normal SS selection.

Requirements:
- Local state must track intended manual queue operations and reconcile with observed queue state.
- Support add, insert, remove, and reset operations.
- Preserve ordering guarantees for insert positions.
- Enforce queue bounds and validate index constraints before send.
- Prevent duplicate queue churn when desired queue already matches observed queue.

Interaction rules:
- Manual queue operations must not silently rewrite aff/def priority state.
- If queue state cannot be confirmed, trigger bounded resync (`CURING QUEUE LIST`) before retry loops.

## 12) Prediction Contract
Predictions are explicit, user-driven uncertainty hints.

Requirements:
- Maintain predicted-aff state separate from confirmed afflictions.
- Support add/remove/list reconciliation with SS prediction state.
- Do not allow prediction updates to corrupt confirmed aff state.
- Prediction state must be reversible and resilient across startup/resync.

## 13) Settings and Toggle Contract
SS settings behavior must support:
- Core on/off and subsystem toggles (afflictions, defences, sipping, transmutation).
- Threshold parameters (sip/moss/clot/healthaffsabove).
- Mode choices (`PRIORITY HEALTH|MANA`, `FOCUS FIRST|SECOND`, `TREE ON|OFF|CUSTOM`).
- Utility toggles (`USEVAULT`, `USECLOT`, `FALLBACK`, `BATCH`, Kaido transmute support).

Behavior rules:
- Temporary combat-mode overlays (for example slow-mode safety changes) must restore previous effective user settings when conditions clear.
- Settings updates must be diffed and coalesced to avoid spam.
- Unknown or unavailable options must fail safely and surface diagnostics.

## 14) Startup, Resync, and Recovery
### 14.1 Startup Sequence
- Request snapshots for status, priorities, defence priorities, queue, and predictions.
- Detect curingset capabilities and enumerate available sets.
- If supported, ensure `default` and `working` set strategy is available and that operational runtime uses `working`.
- Establish observed state from parsed responses.
- Resolve desired state from baseline and runtime overlays.
- Reconcile with minimal command set.

### 14.2 Desync Detection
Desync indicators include:
- Repeated command emissions for same desired value without observed convergence.
- Missing/contradictory snapshot responses.
- Queue mirror divergence after repeated operations.

### 14.3 Recovery Policy
- Escalate from targeted requery to bounded full SS snapshot refresh.
- Preserve baseline and derived intent while rebuilding observed state.
- Avoid uncontrolled retry storms; use backoff and retry limits.

## 15) Performance and Anti-Churn Requirements
- Prompt-gated planning with optional short safety flush fallback.
- Hard dedupe for identical outbound SS commands in a planning window.
- Configurable rate-limit caps for SS command bursts.
- Prioritize correctness for delta-sensitive updates; preserve stable in-order command sequences.
- System must remain responsive during heavy GMCP/event bursts.

## 16) Observability and Debuggability
Expose debug/inspection capability for:
- Current baseline/derived/desired/observed SS state.
- Pending reconciliation operations with reason codes.
- Last emitted SS command list with source reason (user action, rule, startup sync, recovery).
- Desync and recovery counters.
- Rule/scenario registry visibility (active/inactive status and effective evaluation order).

Logging requirements:
- Debug output must be toggleable.
- Production-safe mode must avoid noisy spam while retaining actionable diagnostics.

## 17) Test Specification (Minimum)
Unit tests:
- Priority diff generation and rollback correctness.
- PRIOAFF lifecycle transitions and clear conditions.
- Settings overlay apply/revert behavior.
- Queue insert/remove/reset reconciliation and dedupe.
- Prediction state reconciliation.
- Curing-set safety rules (`default` protected from runtime overlays, `working` accepts runtime overlays).
- Rule precedence correctness (top-to-bottom ordering with later-rule override on key collisions).
- End-of-cycle diff emission only (no duplicate/contradictory interim sends from earlier rules).
- Rule lifecycle operations (`add/remove/enable/disable/load/unload/reorder`) and deterministic effect unwind/apply behavior.
- Prompt-block netting behavior (multiple contradictory in-block updates resolve to one final net decision).

Integration tests:
- Startup snapshot and convergence.
- Prompt-driven churn scenario with rapidly changing aff combinations.
- Rule-triggered priority swaps with deterministic restore on condition clear.
- Manual queue override priority over default SS behavior.
- Desync detection and bounded recovery path.
- Two-set startup path (`default` + `working`) and deterministic restore of `working` from `default`.
- Single-set degraded path with preserved behavior and explicit diagnostics.
- General-rule plus scenario-pack layering where scenario pack loads last and overrides shared keys predictably.
- Runtime scenario-pack switching (for example opponent/class context changes) with correct override and rollback behavior.
- Mixed text+GMCP same-block scenario where got/lost events cancel before prompt and no redundant SS command is emitted.
- Prompt-miss safety-flush scenario that preserves net-diff-only emission.

Mandatory scenario tests:
- Real-case scenarios must be derived from live nexSys3 swap behavior in `src/base/prioritySwaps/serversidePrioritySwapping.js` and package function variants in `.github/spec/references/nexSys3.JSON` (`ServersidePrioritySwapping`).
- `aeonGotAffEvent` applies temporary SS thresholds (`siphealth`, `sipmana`, `mosshealth`, `mossmana`, `batch`, `clotat`) and aff prios (`asthma`, `weariness`, `anorexia`, `impatience`, `paralysis`), and `aeonLostAffEvent` restores baseline values and resets those prios.
- `focusLostBalEvent` sets `stupidity=9`, `recklessness=12`, `dizziness=14`, `shyness=14`; `focusGotBalEvent` resets all four.
- `scytherus + paralysis` sets `scytherus` prio `2`; when the condition clears, `scytherus` resets.
- `confusion + disrupted` with `(focus balance OR impatience)` and without `whisperingmadness` sets `confusion` prio `2`; otherwise resets.
- `impatience` with active `snapTrack` under 8s sets `impatience` prio `2`; otherwise resets.
- `impatience + hypochondria` sets `hypochondria` prio `1`; fallback case `hypochondria` with `snapTrack` under 8s sets prio `2`; otherwise resets.
- `slickness + asthma` plus any of `sensitivity|clumsiness|weariness|hypochondria` and not `anorexia` sets `slickness` prio `2`; otherwise resets.
- `slickness + asthma` with none of `sensitivity|clumsiness|weariness|hypochondria`, or `hellsight + asthma`, sets `asthma` prio `2`; otherwise resets.
- `darkshade` older than 10s with room item `a lightwall` sets `darkshade` prio `2`; otherwise resets.
- `prone + sensitivity` plus `damagedleftleg|damagedrightleg` sets `sensitivity` prio `2`; otherwise resets.
- `conflagration` with leg break/damage states sets `burning` prio `4`, or `7` when additionally `prone` and not currently damaged/mangled legs; otherwise resets.
- `cadmuscurse` gain sends `curing focus off`; `cadmuscurse` loss sends `curing focus on`.
- `scalded`-driven defence swap (package variant): when `scalded` is present, set `blindness` defence prio `0`; when `scalded` clears, reset `blindness` prio.
- Class-gated emergency cures are validated for set/reset behavior (`fitness`, `dragonheal`, `dragonflex`, `bloodboil`, `dwinnu`, `salt`, `shrugging`, `fool`, `alleviate`) including reset on class mismatch or condition clear.
- Curing-set restore scenario: after multiple runtime prio swaps, restoring `working` from `default` returns all SS priorities/settings to baseline without residual overrides.

## 18) Acceptance Criteria
Implementation is SS-ready only if all are true:
- Full command surface in Section 7 is supported or explicitly marked unsupported with safe fallback behavior.
- Convergence and anti-churn behavior in Sections 8 and 15 are test-verified.
- PRIOAFF, manual queue, and prediction contracts are implemented with deterministic reset behavior.
- Startup and recovery paths converge without manual intervention in normal conditions.
- Baseline user intent is preserved across overlays, restarts, and resync cycles.
- When multiple curingsets are available, `default`/`working` behavior is enforced and deterministic baseline restore is verified.
- When multiple curingsets are unavailable, degraded-mode behavior is explicit, safe, and test-verified.
- Dynamic rule lifecycle controls are implemented and verified (`add/remove/enable/disable/load/unload/reorder`) with deterministic precedence and net-diff-only emission.
- Prompt-block evaluation behavior is verified: prompt as primary execution boundary with net final intent emission and anti-churn guarantees.

## 19) Open Decisions for Refinement
These should be resolved during Q/A iteration:
- Exact convergence budget (for example: max prompt cycles/time before forced full resync).
- Strict policy for when PRIOAFF auto-clears under uncertainty.
- Which SS options are mandatory in v1 versus optional/feature-gated.
- Exact policy for first-run curingset provisioning (for example naming conflicts and migration from existing user set names).
