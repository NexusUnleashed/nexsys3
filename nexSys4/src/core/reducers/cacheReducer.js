import { EVENT_TYPES } from "../events/eventTypes";

export const cacheReducer = (caches, event) => {
  switch (event.type) {
    case EVENT_TYPES.CACHE_COUNT_ADD: {
      const { id, value } = event.payload;
      const cache = caches[id];
      if (!cache) {
        return caches;
      }
      return {
        ...caches,
        [id]: { ...cache, count: cache.count + value },
      };
    }
    case EVENT_TYPES.CACHE_COUNT_SUB: {
      const { id, value } = event.payload;
      const cache = caches[id];
      if (!cache) {
        return caches;
      }
      return {
        ...caches,
        [id]: { ...cache, count: Math.max(0, cache.count - value) },
      };
    }
    case EVENT_TYPES.CACHE_RIFT_SET: {
      const { id, value } = event.payload;
      const cache = caches[id];
      if (!cache) {
        return caches;
      }
      return {
        ...caches,
        [id]: { ...cache, rift: value },
      };
    }
    default:
      return caches;
  }
};
