import { EVENT_TYPES } from "../events/eventTypes";

const applyAffList = (state, list) => {
  const next = { ...state };
  const inList = new Map();
  list.forEach((item) => {
    if (item && item.id) {
      inList.set(item.id, item.count ?? true);
    }
  });

  Object.keys(next).forEach((id) => {
    const entry = next[id];
    if (!entry) {
      return;
    }
    if (inList.has(id)) {
      const count = inList.get(id);
      next[id] = {
        ...entry,
        have: true,
        count: typeof count === "number" ? count : entry.count,
      };
    } else if (entry.have) {
      next[id] = {
        ...entry,
        have: false,
        count: entry.min ?? 0,
      };
    }
  });

  return next;
};

export const affReducer = (affs, event) => {
  switch (event.type) {
    case EVENT_TYPES.AFF_LIST:
      return applyAffList(affs, event.payload || []);
    case EVENT_TYPES.AFF_GOT: {
      const aff = affs[event.payload];
      if (!aff) {
        return affs;
      }
      if (aff.have) {
        return affs;
      }
      return { ...affs, [aff.id]: { ...aff, have: true } };
    }
    case EVENT_TYPES.AFF_LOST: {
      const aff = affs[event.payload];
      if (!aff || !aff.have) {
        return affs;
      }
      return {
        ...affs,
        [aff.id]: { ...aff, have: false, count: aff.min ?? 0 },
      };
    }
    case EVENT_TYPES.AFF_COUNT_SET: {
      const { id, value } = event.payload;
      const aff = affs[id];
      if (!aff) {
        return affs;
      }
      const have = value > (aff.min ?? 0);
      return {
        ...affs,
        [id]: { ...aff, count: value, have },
      };
    }
    case EVENT_TYPES.AFF_COUNT_ADD: {
      const { id, value } = event.payload;
      const aff = affs[id];
      if (!aff) {
        return affs;
      }
      const nextCount = Math.min((aff.count ?? 0) + value, aff.max ?? value);
      const have = nextCount > (aff.min ?? 0);
      return {
        ...affs,
        [id]: { ...aff, count: nextCount, have },
      };
    }
    case EVENT_TYPES.AFF_COUNT_SUB: {
      const { id, value } = event.payload;
      const aff = affs[id];
      if (!aff) {
        return affs;
      }
      const nextCount = Math.max((aff.count ?? 0) - value, aff.min ?? 0);
      const have = nextCount > (aff.min ?? 0);
      return {
        ...affs,
        [id]: { ...aff, count: nextCount, have },
      };
    }
    case EVENT_TYPES.AFF_PRIO_SET: {
      const { id, prio, defaultPrio } = event.payload || {};
      const aff = affs[id];
      if (!aff || typeof prio !== "number") {
        return affs;
      }
      const nextDefault =
        typeof defaultPrio === "number" ? defaultPrio : aff.defaultPrio;
      return {
        ...affs,
        [id]: {
          ...aff,
          prio,
          defaultPrio: nextDefault,
          serverside: prio > 0 && prio <= 26,
        },
      };
    }
    default:
      return affs;
  }
};
