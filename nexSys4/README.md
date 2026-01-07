# nexSys4 Core

This folder contains a ground-up core engine for nexSys. The design splits game state, rule evaluation, serverside curing diffs, and command output planning from the Nexus adapter.

Goals
- Deterministic state updates
- Diff-based serverside curing updates
- Predictable output planning
- Minimal coupling to Nexus UI and triggers

Structure
- src/core: state, reducers, rules, serverside diffing, output planner
- src/adapters/nexus: bridge to global eventStream and nexusclient
- src/adapters/echo: toggleable visual feedback via display_notice
- src/facade: global API for other packages
- src/tables: data tables (affs, defs, bals, caches, queues)

Usage (in Nexus)
- Load the JS bundle built from this package.
- Use the adapter to bind to global eventStream.
- Use the facade to expose a stable global API.

Notes
- `legacyTables` currently sources tables from nexSys3 for parity. Replace with static nexSys4 tables as you fully decouple.
- `defaultRules` includes a small starter set of priority swap rules; extend for class-specific logic.
- Rules can be managed at runtime via `nexSys4.rules.add/remove/enable/disable/list` (and root helpers like `nexSys4.addRule()`); use this for class- or target-specific priority swaps.
- Output streams are split into serverside (curing/prios/status), precache, and nexSys commands. Pause blocks all streams; slow mode only blocks precache and nexSys streams.
- Queues are immediate and independent of output streams, but still respect pause/slow mode. When paused or slowed, queued items are cached and flushed on resume.
- The Nexus adapter includes an event bridge that emits legacy eventStream events as nexSys4 state changes (aff/def/bal got/lost, count changes, priorities, vitals/status updates, pause/slow toggles).
- The facade exposes `api` convenience helpers (hasAff/hasDef/hasBal, prio setters, pause/slow toggles, output helpers, and `send`) to avoid manual eventStream calls, and those helpers are also mirrored at the root (`nexSys4.hasDef()`). `send` accepts arrays and will join/chunk using the command separator.
- Default priorities are stored on aff/def entries as `defaultPrio`. Helpers like `resetAffPrio`/`resetDefPrio` and `setAffDefaultPrio`/`setDefDefaultPrio` manage them.
- Output evaluation is prompt-gated, with a 150ms debounce fallback (`outputDebounceMs`) to send pending output when no prompt arrives.
- Echo output is handled by the echo adapter and controlled via `system.settings.echo*` flags.
- TODO: Explore GMCP batching in the adapter. Proposal is to buffer safe patch/list tags during a block (Char.Status/Vitals, Aff/Def Lists), batch Add/Remove deltas into a single dispatch, and flush on PromptEvent (or debounce). Avoid subscribing to high-volume tags not used by nexSys4.
