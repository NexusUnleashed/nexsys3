# nexSys Spec Bundle

This folder is a portable specification package for generating a fresh, clean-room nexSys implementation.

## Primary Spec Files
- `.github/spec/NEXSYS.md` (top-level product/system specification)
- `.github/spec/NEXSYS-SS.md` (server-side curing deep specification)
- `.github/spec/CODEX_PROMPT.md` (copy/paste kickoff prompt for Codex)

## Included Reference Files
- `.github/spec/references/ACHAEA.md`
- `.github/spec/references/Achaea Serverside Curing.txt`
- `.github/spec/references/nexSys3.JSON`
- `.github/spec/references/nexSys3.nxs`

## Included Authoritative Data
- `.github/spec/data/src/base/affs/affTable.js`
- `.github/spec/data/src/base/balances/balanceTable.js`
- `.github/spec/data/src/base/cache/cacheTable.js`
- `.github/spec/data/src/base/cures/cureTable.js`
- `.github/spec/data/src/base/defs/defTable.js`
- `.github/spec/data/src/base/utilities/commonTable.js`

## Usage
1. Copy the entire `.github/spec` folder into the new repository.
2. Use `.github/spec/NEXSYS.md` and `.github/spec/NEXSYS-SS.md` as the implementation contract.
3. Treat `data` and `references` as source material only; final runtime must be self-contained and not depend on these paths at runtime.
