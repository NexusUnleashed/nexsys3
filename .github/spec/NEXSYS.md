# NEXSYS Clean-Room Product Specification

## 1) Mission
Build a brand new, production-ready `nexSys` system for Achaea (Nexus client) from scratch.

This document is the sole specification contract for implementation.

Goals:
- Preserve required gameplay behavior and user outcomes from live `nexSys3`.
- Modernize architecture, testing, and maintainability.
- Avoid legacy design bias and avoid reusing old implementation structure.

## 1.1) Guiding Principles
- Primary design principles: efficiency, performance, functionality, clarity, elegance.
- Prefer solutions that maximize runtime performance and maintain long-term readability.
- Implement using modern best practices and current industry standards/trends for JavaScript and Vite ecosystems.

## 2) Clean-Room Rules (Mandatory)
- Do not copy or port code from `nexSys3`.
- Do not copy module names, class names, folder layout, or internal patterns unless explicitly required by this spec.
- Derive behavior from requirements only.
- Favor simple, testable, deterministic architecture.
- Architecture is implementation-defined as long as all requirements and acceptance criteria are met.
- Use `.github/spec/data/**` as authoritative source material for game/system table information.
- Incorporate that information into the new nexSys build (copy/clone/transform/restructure as needed).
- Do not require runtime dependency on `.github/spec/data/**` paths in the shipped build.
- Treat `.github/spec/references/nexSys3.JSON` and `.github/spec/references/nexSys3.nxs` as reference-only context for legacy Nexus usage patterns.
- Do not require direct reuse/import of legacy Nexus package exports in the new implementation.
- If a behavior is ambiguous, document the assumption and gate it behind configuration.

## 3) Product Scope
The system must provide:
- Real-time GMCP-driven state tracking.
- Affliction, defense, balance, and inventory/cache modeling.
- Serverside curing priority synchronization.
- Action queue orchestration with duplicate protection and queue exclusions.
- Prompt augmentation and user-visible notices.
- Persistence of user settings.
- Stable API surface for other packages/scripts.
- A client adapter architecture that allows nexSys core logic to be ported to non-Nexus MUD clients.

Out of scope:
- Porting experimental branches.
- Building combat strategy logic for every class beyond current curing/defense scope.
- Rewriting Nexus itself.

## 4) Runtime Environment
- Target: Achaea in Nexus web client.
- Integration points:
  - `eventStream` (required global peer dependency)
  - `nexAction` (required global peer dependency)
  - `nexusclient` (required global)
  - `GMCP` (required global state object)
  - GMCP payloads (`Char.Vitals`, `Char.Status`, `Char.Afflictions.*`, `Char.Defences.*`, `IRE.Rift.*`, `Char.Items.*`, `Room.Info`, target info)
- Must tolerate delayed/out-of-order GMCP bursts and recover safely at prompt boundaries.
- In production, `nexusclient`, `GMCP`, `eventStream`, and `nexAction` are always present without exception and may be used directly as globals.

Global runtime contract:
- `nexusclient`: global Nexus client API object.
- `GMCP`: global game-state payload object.
- `eventStream`: global event bus peer dependency.
- `nexAction`: global code-driven trigger/alias peer dependency.
- `nexSys`: global API object exposed by the new nexSys runtime.

## 4.1) Technology Constraints (Hard Requirements)
- Language: JavaScript only.
- Build/dev workflow: Vite.
- Do not require TypeScript for implementation.
- Do not require Webpack/Babel as primary build tooling for the new repo.
- Project deliverables should run with a standard Vite workflow (`dev`, `build`, `preview`, and test scripts).

## 4.2) Authoritative Seed Data Inputs
The following files are authoritative source inputs and define canonical table information:
- `.github/spec/data/src/base/affs/affTable.js`
- `.github/spec/data/src/base/balances/balanceTable.js`
- `.github/spec/data/src/base/cache/cacheTable.js`
- `.github/spec/data/src/base/cures/cureTable.js`
- `.github/spec/data/src/base/defs/defTable.js`
- `.github/spec/data/src/base/utilities/commonTable.js`

Usage requirements:
- Treat these files as canonical baseline information for afflictions, balances, cache/precache, cures, defenses, and common utility tables.
- Preserve all IDs, keys, and semantic meanings unless an explicit spec change is requested.
- Incorporate these tables into the new codebase/build artifacts (copy, clone, transform, or restructure as needed), while retaining data parity.
- The final nexSys build must be self-contained and must not depend on reading `.github/spec/data/**` at runtime.
- User-configurable overrides must remain separate from immutable seed data.

## 4.3) Client Adapter and Portability Architecture
The new nexSys must be designed with a strict client adapter boundary so core logic is portable.

Required architectural outcomes:
- Core/domain logic must not directly depend on Nexus-only globals (`nexusclient`, `GMCP`) outside the Nexus adapter implementation.
- Create a dedicated Nexus adapter layer responsible for translating between nexSys core contracts and Nexus runtime APIs.
- Command dispatch to the game server must be routed through a nexSys-owned send interface, not direct calls from core logic to `nexusclient.send_commands()`.
- In the Nexus adapter implementation, the final transport for outbound commands must resolve to `nexusclient.send_commands()`.
- Define stable adapter contracts for:
  - command send and queue transport
  - inbound event subscription/unsubscription
  - GMCP/state packet ingestion
  - output/notice rendering
  - timing/scheduler hooks (if applicable)
- Core logic must be executable with alternate adapters (for future custom browser clients) without rewriting core planners/state engines.

Portability requirements:
- All Nexus-specific assumptions must be isolated in adapter modules.
- Adapter selection/initialization must be explicit and composable.
- Provide a mock/test adapter for automated tests and portability validation.

Nexus adapter integration requirements:
- Support normalized event generation from both GMCP packets and text-line/reflex signals where GMCP coverage is incomplete.
- Include compatibility coverage for legacy Nexus-dependent signal classes such as:
  - startup/bootstrap and package load signals
  - queue run/fired acknowledgements
  - serverside curing status/priority response parsing
  - text-derived balance/defence/trackable state transitions
- Event naming and internal architecture are implementation-defined, but behavioral outcomes must satisfy this specification.

## 4.4) Legacy Nexus Package Reference Context (Non-Binding)
The following files are provided for context about how nexSys3 historically integrated with Nexus package settings:
- `.github/spec/references/nexSys3.JSON`
- `.github/spec/references/nexSys3.nxs`

Reference usage guidance:
- Use these files to understand legacy trigger/alias/function coverage and initialization patterns.
- They are not authoritative inputs for new architecture decisions.
- They must not be treated as mandatory source code dependencies.
- Equivalent behavior may be implemented using different modern designs as long as specification outcomes are met.

## 4.5) Core Dependency Package Guidance (`eventStream` and `nexAction`)
The following dependency codebases must be reviewed and understood as part of new nexSys architecture work:
- `D:\Visual Studio Code\Nexus\eventstream3\src`
- `D:\Visual Studio Code\Nexus\nexaction3\src`

Dependency intent:
- `eventStream` is the backbone event handler and should be used where event-driven orchestration is appropriate.
- `nexAction` provides code-driven trigger/alias construction and should be used as needed to reduce dependence on static Nexus `.nxs` package files.

Usage direction:
- These dependencies should be utilized as needed in the new nexSys codebase based on design fit and maintainability.
- The paths above are provided for direct review access and convenience.
- Production assumption: both are peer dependencies and globally available as `eventStream` and `nexAction` without exception.
- Direct usage of these globals in the new nexSys codebase is permitted.
- Direct coupling of core domain logic to client-specific implementation details should still be avoided via the adapter boundary.
- If wrappers/facades are introduced, they must preserve behavior parity and testability.

## 4.6) External GMCP Reference (Recommended)
The following repository provides broader GMCP documentation and should be reviewed during implementation:
- `https://github.com/keneanung/GMCPAdditions`

Direction for implementation:
- Treat this repository as supplemental protocol reference material for module/message coverage and payload structure patterns.
- Use it to improve robustness for current and future GMCP tags beyond the minimum set listed in this specification.
- Maintain parser resilience for partially-known/unknown payloads and additive fields.
- Preserve core behavior required by this specification even when external references differ or evolve.

GMCP parsing notes:
- Module/message names should be treated case-insensitively where protocol behavior allows.
- JSON key names should be treated as case-sensitive.

## 5) Core Domain Requirements
### 5.1 Balances
Implement a balance model with timer-backed got/lost states and elapsed duration.

Required balance set (36 baseline ids):
- `herb`, `focus`, `sip`, `moss`, `tree`
- `equilibrium`, `balance`, `salve`, `smoke`
- `immunity`, `rebounding`, `dragonbreath`, `deafness`, `deaf`, `blind`, `speed`, `wake`, `sileris`, `free`, `voice`, `tremolo`
- `homunculus`, `fitness`, `bloodboil`, `dragonheal`, `rage`, `salt`, `shrugging`, `slough`, `fool`, `writhe`, `impalewrithe`, `entity`, `word`, `anathema`, `systemOutput`

Capabilities:
- Affliction-based balance duration modifiers.
- `have`, `lost/got` events, elapsed timing, reset/start/stop callbacks.
- GMCP vitals mapping for `bal`/`eq` and class stat booleans (`Yes`/`No`).

### 5.2 Afflictions
Implement affliction modeling with priority, cure relationships, and event lifecycle.

Baseline data coverage:
- 216 named afflictions.
- Priority map with serverside and non-serverside ranges.
- Type maps:
  - countable (16)
  - timed (58)
  - unknown/random sets (8)
  - uncurable set (17)
  - def-like affs (`blindness`, `deafness`, `insomnia`)

Capabilities:
- Track `got/lost` with timestamps.
- Countable stacks with min/max and stack delta events.
- Timed affs that auto-expire.
- Def-aff inversion behavior (when modeled as defensive state).
- Priority changes emit sync events.
- Query API equivalents:
  - `haveAff`
  - `haveAffs`
  - `haveAnAff`
  - sorted current aff list by priority and order.

### 5.3 Cures
Implement cure catalog and cure output planning.

Baseline data coverage:
- 69 cure definitions.
- Each cure supports:
  - `bals_req`
  - `bals_used`
  - `blocks`
  - `command`
  - `order`
  - optional class constraints

Capabilities:
- Build cure choices against aff + balance availability.
- Respect block conditions (including compound block combinations).
- Respect order semantics where one cure may affect multiple affs.
- Support herb/mineral, smoke, salve, focus, tree, class cures, sip/moss cures.

### 5.4 Defenses
Implement defense tracking and defense output planning.

Baseline data coverage:
- 136 defense definitions.
- Per defense metadata:
  - command(s)
  - balances required/used
  - block conditions
  - optional class constraints
  - serverside flag
  - preempt flag
  - mutual exclusion/opposite defs

Required priority models:
- `keepup` priorities (routine maintenance).
- `static` priorities (defup target set).

Capabilities:
- Determine missing defenses and plan output by priority.
- Distinguish serverside-managed defenses from client-managed ones.
- Special handling for parry/guard families and limb-target changes.

### 5.5 Queue System
Implement queue abstractions for server queueing with dedupe and exclusions.

Queue architecture requirements:
- The queue subsystem is a critical server-interface control plane and must be treated as first-class infrastructure.
- Queue submission must flow through the same nexSys-owned command dispatch interface used for non-queued commands.
- Queue behavior must remain client-agnostic at core level, with client/server transport details isolated to adapters.

Required default queues:
- `classQueue` type `c!p!t!w` exclusions: `fullQueue`
- `freeQueue` type `free` exclusions: `fullQueue`, `shieldQueue`
- `fullQueue` type `ebc!w!p!t` exclusions: `freeQueue`, `shieldQueue`, `classQueue`
- `shieldQueue` type `eb!w!t` exclusions: `freeQueue`, `fullQueue`
- `shipQueue` type `s!w!t`
- `bloodcloakQueue` type `!teb` exclusions: `fullQueue`, `freeQueue`
- `battlerageQueue` type `!p!t!wu`
- `stunQueue` type `!t`

Shared queue requirements:
- Pre-commands and post-commands support.
- Confirm event command injection (`SystemEvent <queueName>QueueFired`).
- Command dedupe (do not requeue unchanged payload).
- Prepend high-priority queue items.
- Exclusion clearing (`clearqueue` on conflicting queues).
- Chunk commands to server queue limits (max 20 queue entries per submission block).
- Pause-aware behavior (`queueWhilePaused` respected).

### 5.6 Cache/Precache and Rift
Implement consumable stock tracking for inventory + rift.

Baseline data coverage:
- 38 cache items (herbs and minerals).

Capabilities:
- Track inventory deltas from `Char.Items.Add/Remove/Update`.
- Track rift amounts from `IRE.Rift.Change/List`.
- Compute missing preload actions (`outr`) based on desired precache counts.
- Prevent precache actions under blocking conditions (eg both arms unusable, trueblind, blind without mindseye).

### 5.7 Limb Counter
Implement self limb state tracker:
- Limb ids: `head`, `torso`, `leftarm`, `rightarm`, `leftleg`, `rightleg`.
- Percent + hit counters.
- Break/reset transitions.
- Timed decay/reset behavior.
- Integration with damaged/mangled aff got/lost events.

### 5.8 System State
Implement global state domains:
- `settings`: persisted user config.
- `runtime/system state`: pause, slow mode, toggles.
- `char`: class/race/vitals/resources/target/wielded items.
- `target`: active target details.
- `baseline intent`: user-chosen baseline settings distinct from temporary derived/rule-driven runtime values.

Required character updates:
- Parse `Char.Vitals` and `Char.Status`.
- Update hp/mp/ep/wp and max values.
- Parse charstats into class resources and class balances.
- Death detection (`hp == 0`) with pause behavior and recovery flow.

State safety requirements:
- Derived/rule-driven runtime overrides must be reversible.
- Baseline user intent must not be silently mutated by temporary runtime logic.

### 5.9 Prompt and Client Output
Implement prompt-enhancement subsystem:
- Optional custom prompt replacement.
- Aff display sorted by prio/order with abbreviations and color coding.
- Real-time vitals, balance, and state indicators (`paused`, `aeon`, `slow`).
- Health/mana diff indicators.

Implement notice/echo subsystem with setting toggles:
- Aff got/lost
- Def got/lost
- Balance got/lost
- Trackable got/lost
- Priority set
- Output sent

### 5.10 Serverside Curing Sync
Implement bi-directional serverside sync:
- Startup snapshot requests:
  - `curing status`
  - `curing priority list`
  - `curing priority defence list`
  - relevant baseline requests (`def`, `score`, rift/time)
- Parse and store serverside status/priorities.
- Diff local desired status/priorities vs serverside snapshot.
- Emit only needed updates.

Status mapping requirements:
- `curingMethod`, `sipPriority`, sip/moss thresholds, `focus`, `focusOverHerbs`, `tree`, `clot`, `clotAt`, `insomnia`, `fracturesAbove`, `manaAbilitiesAbove`, `batch`.

Pause/slow behavior:
- Pause sends `curing off`; unpause sends `curing on`.
- Slow mode applies conservative temporary thresholds and disables batching.
- Restore configured values when slow mode exits.

### 5.11 Output Planner
Implement output planner that composes:
- priority updates (aff/def)
- defense commands
- precache commands
- event-injected commands

Planner behavior:
- Prompt-gated evaluation.
- If prompt timing is delayed/missing, use a short configurable safety flush/debounce so pending output does not starve.
- Treat prompt as the primary server-block completion boundary for outbound decisions; emit only final net-diff intent for that block.
- Respect pause, slow mode, aeon lock conditions.
- Use completion handshake (`SystemOutputCompleteEvent`) before next full cycle.
- Chunk sends by configured separator and command limits.

### 5.12 Priority Swaps / Dynamic Rules
Implement dynamic priority rule engine for context-sensitive swaps.

Must support:
- Rule conditions based on aff combinations, balances, class, timers, and other state.
- Runtime re-evaluation on aff/balance/class transitions and prompt.
- Safe reset to defaults when conditions clear.

### 5.13 Persistence
Persist and reload user models in Nexus variables (single root object):
- `systemSettings`
- `affSettings`
- `defSettings`
- `cacheSettings`
- optional whitelist models where applicable

Save semantics:
- Apply settings to runtime immediately after save.
- Reconcile with serverside state after save.

### 5.14 GMCP Ingestion and Burst Robustness
Implement GMCP ingestion to remain correct and efficient under high-volume bursts.

Requirements:
- Preserve semantic correctness under burst load and avoid repeated intermediate state thrash.
- Support prompt-boundary/block-consistent flush behavior, with an optional short safety timer fallback.
- Support mixed text-line/reflex and GMCP updates within the same block, with final block-state reconciliation at prompt boundary.
- Patch/list-style tags may be coalesced per flush block when final state is equivalent (for example: `Char.Status`, `Char.Vitals`, `Char.Afflictions.List`, `Char.Defences.List`).
- Delta/stream-style tags must preserve in-order application within each flush block (for example: `Char.Afflictions.Add/Remove`, `Char.Defences.Add/Remove`).
- Batching/coalescing strategy must be configurable and safe to disable.
- Unknown GMCP tags or additive payload fields must not crash runtime and should degrade gracefully.

## 6) Public API Contract (Required Capabilities)
Expose a stable global API object for scripts/packages to:
- Query current aff/def/bal states.
- Toggle pause/slow/system statuses.
- Queue commands (`add`, `prepend`, `clearQueue`, inspection).
- Emit output commands and helper utilities.
- Update models and trigger persistence.
- Publish this API globally as `nexSys`.

## 7) Startup and Lifecycle
On load:
1. Initialize data models and event subscriptions.
2. Load saved settings.
3. Request serverside snapshots and bootstrap state.
4. Pause system until startup capture completes.
5. Reconcile statuses/priorities.
6. Unpause and enter normal prompt-gated runtime.

If command separator is not configured:
- Prompt user to configure separator before full startup.

Startup implementation note:
- The Nexus adapter should expose explicit bootstrap hooks equivalent to install/load/start phases used by legacy package workflows, but implementation details (including import strategy) are flexible.

## 8) Non-Functional Requirements
- Deterministic: same input events must produce same outputs.
- Low latency: no blocking operations in hot event handlers.
- Backpressure-safe: handle large GMCP bursts without lockups.
- Subscription discipline: avoid unnecessary high-volume GMCP subscriptions by default; optional channels should be explicitly gated/configurable.
- Idempotent output planning across repeated prompts.
- Memory-safe listener lifecycle.
- Observable: debug hooks for planner state and queue state.
- Backward-compatible user outcomes with live `nexSys3` behavior.

## 9) Testing Requirements
Minimum test suites:
- Unit tests for:
  - balance timers
  - aff state transitions (timed/countable/def-aff)
  - cure/def/cache planners
  - queue chunking/exclusions/dedupe
  - serverside diff engine
- Integration tests with mocked GMCP streams:
  - startup capture
  - prompt cycles
  - death/resurrection flow
  - slow mode transitions
- Integration tests with mocked line/reflex streams for Nexus adapter coverage:
  - queue run/fired acknowledgements
  - serverside status/priority response parsing
  - text-derived balance/defence state signals where applicable

Test harness must include mocks for:
- `eventStream`
- `nexAction`
- `nexusclient`
- `GMCP`
- `nexSys`
- timers/performance clock

## 10) Acceptance Criteria
Release is complete only if all are true:
- All required subsystems in Sections 5-8 are implemented.
- Behavior parity achieved for live curing/defense/queue workflows.
- Startup + serverside reconciliation is reliable.
- Portability architecture is implemented (core logic isolated from Nexus-specific runtime APIs via adapter boundary).
- Configuration state and persistence are functional.
- Authoritative seed data from `.github/spec/data/**` is consumed correctly with no silent schema/key drift.
- Final build artifacts are self-contained and do not require runtime reads from `.github/spec/data/**`.
- `eventStream` and `nexAction` dependencies are reviewed/understood, with utilization strategy documented and applied where appropriate.
- Runtime assumptions explicitly document and satisfy the global contract for `nexusclient`, `GMCP`, `eventStream`, `nexAction`, and `nexSys`.
- Automated tests cover critical logic and pass in CI.
- No dependency on legacy code internals.

## 11) Notes from Current Live Behavior
- Prompt-gated planning is central for stable action cadence.
- Queue confirmation events are used to clear local queue mirrors.
- Serverside priorities use reset semantics for ignored states.
- Some mechanics rely on class-specific resources in `Char.Vitals.charstats`.
- Limb and torso trauma tracking includes multi-stage transitions.

This specification intentionally captures required outcomes while leaving implementation freedom for a clean, modern design.
