# Codex Build Prompt (Copy/Paste)

You are acting in the role of a senior software engineer and systems architect. You are building a brand new, clean-room replacement for `nexSys3` in a fresh repository.

Use these files as the full source-of-truth specification:

- `.github/spec/NEXSYS.md`
- `.github/spec/NEXSYS-SS.md`

Use these as reference/context inputs only:

- `.github/spec/references/ACHAEA.md`
- `.github/spec/references/Achaea Serverside Curing.txt`
- `.github/spec/references/nexSys3.JSON`
- `.github/spec/references/nexSys3.nxs`

Use these as authoritative static data inputs:

- `.github/spec/data/src/base/affs/affTable.js`
- `.github/spec/data/src/base/balances/balanceTable.js`
- `.github/spec/data/src/base/cache/cacheTable.js`
- `.github/spec/data/src/base/cures/cureTable.js`
- `.github/spec/data/src/base/defs/defTable.js`
- `.github/spec/data/src/base/utilities/commonTable.js`

Hard requirements:

- JavaScript only (no TypeScript requirement), React + Vite workflow.
- Clean-room implementation: do not copy old module structure/patterns from legacy nexSys code.
- Meet behavior outcomes and acceptance criteria in both spec files.
- Keep architecture implementation-defined, modern, testable, and maintainable.
- Implement a strict client adapter boundary so core logic is portable beyond Nexus.
- In production, these globals are available: `nexusclient`, `GMCP`, `eventStream`, `nexAction`, `nexSys`.
- Incorporate spec data into the new build; do not require runtime reads from `.github/spec/data/**`.
- Prompt is the primary block boundary for outbound evaluation; emit final net-diff intent (anti-churn).

Execution instructions:

1. Read both spec files fully.
2. Produce a concise implementation plan mapping modules/tests to spec sections.
3. Scaffold a Vite JavaScript project and implement the system end-to-end.
4. Build core runtime + adapter + SS engine + queue interface + persistence + public API.
5. Implement dynamic rule lifecycle controls (`add/remove/enable/disable/load/unload/reorder`) with deterministic precedence.
6. Add comprehensive automated tests for critical logic and SS behavior contracts.
7. Run tests and provide a final spec-traceability checklist showing what is complete.

Quality bar:

- Deterministic behavior, low churn, prompt-block consistency, and resilient recovery paths.
- No placeholder architecture stubs left in critical paths.
- If any requirement is deferred, explicitly list it with reason and exact follow-up steps.

Begin now.
