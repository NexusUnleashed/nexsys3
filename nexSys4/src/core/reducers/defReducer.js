import { EVENT_TYPES } from "../events/eventTypes";

const applyDefList = (state, list) => {
  const next = { ...state };
  const inList = new Set(list || []);
  Object.keys(next).forEach((id) => {
    const def = next[id];
    if (!def) {
      return;
    }
    if (inList.has(id)) {
      if (!def.have) {
        next[id] = {
          ...def,
          have: true,
          prio: def.defaultPrio ?? def.prio,
        };
      }
    } else if (def.have) {
      next[id] = { ...def, have: false };
    }
  });
  return next;
};

export const defReducer = (defs, event) => {
  switch (event.type) {
    case EVENT_TYPES.DEF_LIST:
      return applyDefList(defs, event.payload || []);
    case EVENT_TYPES.DEF_GOT: {
      const def = defs[event.payload];
      if (!def || def.have) {
        return defs;
      }
      return {
        ...defs,
        [def.id]: {
          ...def,
          have: true,
          prio: def.defaultPrio ?? def.prio,
        },
      };
    }
    case EVENT_TYPES.DEF_LOST: {
      const def = defs[event.payload];
      if (!def || !def.have) {
        return defs;
      }
      return { ...defs, [def.id]: { ...def, have: false } };
    }
    case EVENT_TYPES.DEF_PRIO_SET: {
      const { id, prio, defaultPrio, preempt } = event.payload || {};
      const def = defs[id];
      if (!def || typeof prio !== "number") {
        return defs;
      }
      const nextDefault =
        typeof defaultPrio === "number" ? defaultPrio : def.defaultPrio;
      const nextDef = { ...def, prio, defaultPrio: nextDefault };
      if (typeof preempt === "boolean") {
        nextDef.preempt = preempt;
      }
      return {
        ...defs,
        [id]: nextDef,
      };
    }
    default:
      return defs;
  }
};
