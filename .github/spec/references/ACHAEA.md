# Achaea Game Systems Reference

## Overview

Achaea is a text-based MUD (Multi-User Dungeon) with complex combat and game mechanics. This document explains the core systems that the nexBash, nexSys, and insight packages interact with.

## Core Combat Mechanics

### Combat Balances

Three types of balance govern the primary character actions **Balance**, **Equilibrium**, and **Class** are the primary resource constraints for actions in Achaea. Almost every actions uses one of the balances:

- **Balance**: Physical actions (attacks, movement, item usage) consume balance.
- **Equilibrium**: Mental/magical actions (spells, abilities) consume equilibrium.
- **Tertiary**: Class skill actions, or tertiary abilities consume class balance.
- **Recovery Time**: After using an action, you must wait for balance/equilibrium to recover (typically 0.5-4 seconds, modified by artifacts/afflictions)

### Cure Balances

There are a variety of cure types in Achaea and each type carries with it a balance. **Herb**, **Salve**, **Smoke**, **Tree**, **Class Cure**. These do not affect performing actions, and serverside has a built in curing system. The cure times for these are relatively static with only a few in game interactions modifying the times.
**Balance Types in nexSys:**

```javascript
bals = {
  balance: new Balance("balance", 2.0), // varies based on skill used
  equilibrium: new Balance("equilibrium", 2.0), // varies based on skill used
  class: new Balance("class", 2.0), // varies based on skill used
  sip: new Balance("sip", 4.5),
  herb: new Balance("herb", 1.5),
  salve: new Balance("salve", 1.0),
  smoke: new Balance("smoke", 1.5),
  // ... many more specialized balances
};
```

### Queue System

- **Required Balances** Most skills that use balance or equilibrium also require BOTH balance and equilibrium to be in place to be used
- **Queue System**: Achaea has server-side queues that execute commands when balance/equilibrium returns. You can queue a skill into the relevant queue and the server will execute the commands when the relevant balances have returned.
  Achaea's server-side queue system manages action execution:

**Queue Types:**

- `freeQueue`: General purpose queue (balance/eq/not paralyzed/not stunned/not bound)
- `classQueue`: Class-specific abilities queue (class balance/not paralyzed/not stunned/not bound)
- `battlerage`: Battlerage ability queue (battlerage balance/not paralyzed/not stunned/not bound)

**nexSys Queue Implementation:**
nexSys tracks the commands that have been sent to the Queue and will not requeue commands that are already queued. This offloads queue tracking from other code and packages. A package can send `nexSys.freeQueue.add("punch tiger")` on every prompt, and as long as it is in the queue, it is ignored by nexSys.

```javascript
// Queue structure from nexSys
{
  name: "freeQueue",
  type: "free",           // Server-side queue type
  pre: [],                // Commands before main queue
  post: [],               // Commands after main queue
  exclusions: [],         // Other queues to clear when this fires
  queue: [],              // Main command list
  prependQueue: []        // Priority commands
}
```

**Usage Pattern:**

```javascript
nexSys.freeQueue.add("cast erode at 123456");
// Sends: queue addclear free cast erode at 123456
```

## GMCP Protocol

**GMCP** (Generic Mud Communication Protocol) provides real-time game state via JSON packets.

### Key GMCP Packets

#### Character Information

```javascript
GMCP.Char.Status = {
  name: "Khaseem",
  class: "Magi", // Current class
  level: "126 (70%)",
  city: "Ashtan (1)",
  gold: "13503284",
};

GMCP.Char.Vitals = {
  hp: "5500", // Current health
  maxhp: "5500",
  mp: "4500", // Current mana
  maxmp: "4500",
  ep: "20000", // Endurance
  maxep: "20000",
  wp: "20000", // Willpower
  maxwp: "20000",
  bal: "1", // 1 = have balance, 0 = no balance
  eq: "1", // 1 = have equilibrium, 0 = no equilibrium
  charstats: ["Bleed: 0", "Rage: 120"], // Additional stats including battlerage
};
```

#### Room Information

```javascript
GMCP.Room.Info = {
  num: 19219, // Room ID
  name: "Before the gates",
  area: "Tuar",
  exits: { n: 19220, s: 19218 },
};

GMCP.Room.Players = [
  { name: "Proficy", fullname: "Proficy Azon" },
  // Other players in room
];
```

#### Items & NPCs

```javascript
GMCP.Items.room = [
  {
    id: "123456",
    name: "a Nelbennir elder",
    icon: "humanoid",
    attrib: "mx", // m = mobile, x = attackable
  },
  {
    id: "230322",
    name: "a sharp-toothed gremlin",
    attrib: "mx",
  },
];
```

#### Combat Target

```javascript
GMCP.Target = {
  id: "123456",
  Text: "elder",
  HP: "47%", // Target health percentage
  hpChange: "-3", // Recent change
  lastHP: "50%",
};
```

#### Location Tracking

```javascript
GMCP.Location = {
  areaid: 357, // Numeric area ID
  area: "the Island of Tuar", // Area name
  roomname: "A sandy path",
};
```

## Affliction System

**Afflictions** are negative status effects applied to characters during combat.

### Affliction Types

**Standard Afflictions:**

- Cured by specific cure types (herbs, salves, smoke, focus, etc.)
- Examples: `asthma`, `paralysis`, `clumsiness`, `stupidity`

**Countable Afflictions:**

- Stack multiple times (1-5 typically)
- Each stack increases severity
- Examples: `fractures`, `haemophilia` (bleeding)

**Timed Afflictions:**

- Automatically cure after a duration
- Examples: `aeon`, `retardation`

**Defensive Afflictions:**

- Actually beneficial "afflictions" tracked as defs
- Examples: `blindness`, `deafness` (defensive when maintained)

### Affliction Tracking (insight)

insight uses **probability-based tracking** for uncertain afflictions:

```javascript
// Timeline system with probabilistic forks
{
  currentAffs: ['asthma', 'paralysis', 'clumsiness'],
  present: [
    { probability: 0.5, affs: { asthma: 1, clumsiness: 1 } },
    { probability: 0.5, affs: { asthma: 1, paralysis: 1 } }
  ]
}
```

**API Examples:**

```javascript
insight.hasAff("asthma", 0.75); // Has asthma at 75%+ probability
insight.hasAffs(["asthma", "paralysis"], 1.0); // Has both at 100%
insight.confirmAff({ id: "asthma", state: true }); // Confirm affliction
insight.randomAffs(["asthma", "clumsiness"]); // Apply random affs
```

## Defense System

**Defenses** (defs) are positive status effects that provide protection or bonuses.

### Defense Categories

**Keepup Defenses:**

- Should always be active
- Auto-reapply if lost
- Examples: `deafness`, `blindness`, `insomnia`

**Situational Defenses:**

- Applied as needed
- Examples: `shield`, `prismatic`, `rebounding`

**Serverside Defenses:**

- Managed by server-side curing system
- Examples: Most class defenses, parry, focusing

### nexSys Defense Management

```javascript
defs = {
  shield: new Def("shield", 10, {
    command: "raise shield",
    bals_req: ["balance", "equilibrium"],
    bals_used: ["balance", "equilibrium"],
    blocks: ["attacks"],
    serverside: false,
  }),
};

// Defense priority system
defPrios.keepup = {
  deafness: 1,
  blindness: 2,
  insomnia: 3,
  // ... priority determines order of application
};
```

## Battlerage System

**Battlerage** is a resource-based ability system available to all classes usable in pve only. PVE is often also referred to as "bashing" or "hunting" and is combat that engages with npcs and not other players.

### Rage Resource

- **Generation**: Gain rage by dealing damage to denizens (NPCs)
- **Maximum**: 200 rage
- **Cost**: Abilities cost 10-70 rage each
- **Tracking**: `GMCP.Char.Vitals.charstats` includes "Rage: 120"

### Battlerage Abilities

**Types:**

- **Raze**: Removes target's shield (important for shield-bypassing)
- **Affliction**: Applies afflictions to target
- **Damage**: Pure damage abilities
- **Utility**: Various effects (healing, movement, etc.)

**Properties:**

```javascript
{
  id: "disintegrate",
  raze: true,              // Can remove shields
  cost: 30,                // Rage cost
  balance: 2.0,            // Individual balance
  canExecute(ctx) {        // Guard function
    return nexSys.sys.char.rage >= 30 && nexBash.target.shield;
  }
}
```

### Battlerage Queue

Special queue for rage abilities:

```javascript
nexSys.battlerage.add("battlerage disintegrate");
// Uses dedicated battlerage balance, doesn't interfere with class abilities
```

## NPC (Denizen) Properties

NPCs in bashing have specific combat behaviors tracked in Area definitions.

### NPC Properties

```javascript
new Npc({
  aggro: false, // Attacks on sight
  canShield: true, // Can raise shield defense
  canHeal: false, // Heals itself
  canWeb: false, // Can web/entangle players
  canChase: true, // Follows fleeing players
  canRaze: true, // Can raze shields
  canFly: false, // Can fly/requires flying to engage
  canBlock: false, // Blocks exits
  shouldCC: false, // Should use crowd control on
  isStunnable: true, // Susceptible to stun
  damageType: "fire", // Weakness/resistance: fire, cold, magic, lightning
  resistances: ["poison"],
  totalHp: 5000, // Estimated max HP
});
```

### Shield Mechanics

**Shield Defense:**

- NPCs/players can `raise shield` for immunity to most attacks
- Must be **razed** (removed) before damage can resume
- Razing consumes balance OR battlerage

**Shield Detection:**

```javascript
// nexBash tracks shield state
nexBash.target.shield = true;  // Set when shield detected

// Actions check shield
canExecute(ctx) {
  return !nexBash.target.shield;  // Only execute if not shielded
}
```

## Cure System

**Cures** are items/actions that remove afflictions.

### Cure Types

**Herb Cures:** `eat <herb>`

- `kelp` (cures asthma, clumsiness, etc.)
- `ginseng` (cures various mental affs)
- Shared 1.5s balance

**Salve Cures:** `apply <salve> to <body>`

- `mending` (heals broken limbs)
- `restoration` (fixes mangled limbs, slower)
- Shared 1.0s balance

**Smoke Cures:** `smoke <mineral>`

- `elm` (cures confusion, etc.)
- Shared 1.5s balance

**Focus:** `focus mind`

- Cures mental afflictions
- Costs mana, shared balance

**Tree Tattoo:** `touch tree`

- Cures random affliction
- Long cooldown (~10s)

### Cure Priority

nexSys manages cure priorities to determine which affliction to cure first:

```javascript
// Affliction priorities
affTable.prios = {
  asthma: 5,
  paralysis: 10, // Higher = cure first
  anorexia: 15,
  slickness: 20, // Prevents salve curing
};
```

## Class-Specific Systems

### Magi (Example)

**Damage Types:**

- Magi can deal fire, cold, magic, or electric damage
- Switch based on target weakness/resistance

**Staff Attacks:**

```javascript
staffcast dissolution  // Magic damage
staffcast scintilla    // Fire damage
staffcast horripilation // Cold damage
staffcast lightning    // Electric damage
```

**Strategy Pattern:**

```javascript
// MagiStrategy dynamically switches damage type
switch (tempNpc.damageType) {
  case "fire":
    strategy.setActionPrios({ scintilla: currentPrio /* others: 0 */ });
    break;
  // ... other damage types
}
```

## Key Game Constraints

1. **Can't act while off-balance/eq**: Must wait for recovery
2. **Queue limit**: Max 20 commands per queue submission
3. **Command separator**: Multiple commands joined with `|`
4. **GMCP delay**: GMCP updates may lag 50-200ms behind reality
5. **Target changes**: Must update `GMCP.Target` when switching targets
6. **Area transitions**: Area change clears room tracking, requires reinitialization

## Event System (nexevent)

Achaea systems use event-driven architecture via the `eventStream` global.

### Core Events

**GMCP Events:**

```javascript
eventStream.registerEvent("IRE.Rift.Change", handler); // Rift (inventory) changes
eventStream.registerEvent("IRE.Misc.Achievement", handler); // NPC deaths
eventStream.registerEvent("Char.Vitals", handler); // Health/mana updates
eventStream.registerEvent("Room.Players", handler); // Players enter/leave
```

**Balance Events:**

```javascript
eventStream.registerEvent("balanceGotBalEvent", handler);
eventStream.registerEvent("equilibriumGotBalEvent", handler);
eventStream.registerEvent("PromptEvent", handler); // Prompt received
```

**Custom Events:**

```javascript
eventStream.raiseEvent("nexBashTargetChanged", target);
eventStream.registerEvent("nexBashAreaCleared", handler, {
  id: "areaCleared",
  tags: ["nexBash"], // Tags for bulk removal
});
```

### Event Cleanup

Critical for preventing memory leaks:

```javascript
// Strategy deactivation
deactivate() {
  eventStream.removeListener("GameTargetChanged", "magiDamageSelect");
  // OR remove by tag
  eventStream.removeByTag(["nexBash", "strategyEvent"]);
}

// Area cleanup
onExit() {
  nexAction.triggers.remove(["nexBash", "areaTrigger"]);
  eventStream.removeByTag(["nexBash", "areaEvent"]);
}
```

## Limb Damage System

Some classes deal limb damage instead of health damage.

### Limb States

- **Healthy**: No damage
- **Broken**: Non-functional, can be cured with mending salve. This is a boolean condition broken or not broken. Application of mending is an instant cure.
- **Damaged**: A limb transitions to damaged after reading 100% or more limb damage. A damaged limb is only cured by restoration salve which is a delayed resolve cure - apply restoration and then approximately 4s later the cure resolves and cures the limb damaged state. A limb entering damaged state returns to 0% limb damage - even if the limb was at 99% damage and receives a hit for +30% limb damage, the trigger of entering the damaged state results in "damaged - 0%" NOT "damaged - 129%"
- **Mangled**: Mangled occurs when receiving 100% or more limb damage while in the "damaged" limb state. It follows the same curing and behavior as the damaged state. Restoration salve cure resolves moving a limb from managled to damaged.

### Limb Tracking (insight)

```javascript
// Player limbs
player.limbs = {
  head: new Limb("head", 0, 100),
  torso: new Limb("torso", 0, 100),
  leftarm: new Limb("leftarm", 0, 100),
  rightarm: new Limb("rightarm", 0, 100),
  leftleg: new Limb("leftleg", 0, 100),
  rightleg: new Limb("rightleg", 0, 100),
};

insight.hitLimb({ limb: "leftleg", damage: 15 });
insight.breakLimb({ limb: "leftleg" });
```

## State Management Patterns

### nexSys State

```javascript
nexSys.sys = {
  settings: {
    /* user configuration */
  },
  state: {
    paused: false, // System paused
    slowMode: false, // Delayed curing
    // ... other runtime state
  },
  char: {
    class: "Magi",
    h: 5500,
    maxh: 5500,
    m: 4500,
    maxm: 4500,
    rage: 120,
    // ... character stats
  },
};
```

### nexBash State

```javascript
nexBash = {
  enabled: false, // Bashing active
  area: Area, // Current area configuration
  target: {
    // Current target
    id: "123456",
    name: "a Nelbennir elder",
    shield: false,
    hp: 47,
  },
  targets: [], // Available targets in room
  currentStrategy: Strategy, // Active class strategy
};
```

## Development Notes

### Testing Considerations

- Mock GMCP data structure completely (see `localMockUp.js`)
- Stub `nexusclient`, `eventStream`, `nexSys` globals
- Balance/queue timing is critical - use fake timers
- Event cleanup must be tested to prevent leaks

### Performance Concerns

- GMCP updates are frequent (multiple prompts per second during combat)
- Event listeners can accumulate quickly
- Avoid blocking operations in event handlers
