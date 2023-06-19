import { caches } from "./caches";
import { cacheTable } from "./cacheTable";
import { affs } from "../affs/affs";
import { defs } from "../defs/defs";

function getMissingCache() {
  const current_cache = [];
  for (const cache in caches) {
    if (caches[cache].needToOutr) {
      current_cache.push(caches[cache]);
    }
  }

  return current_cache;
}

export function getCacheOutputs(affList) {
  if (affs.trueblind.have) {
    return [];
  }
  if (defs.blindness.have && !defs.mindseye.have) {
    return [];
  }

  const missingCache = getMissingCache(); // return this as sorted by prio
  let cacheOutputs = [];

  for (let i = 0; i < missingCache.length; i++) {
    const cache = missingCache[i];

    //if (!affList.some(aff => cache.blocks.flat().indexOf(aff) > -1)) {
    if (!Array.arraysIntersect(cache.blocks, affList)) {
      cacheOutputs = cacheOutputs.concat(cache.command);
    }
  }

  return cacheOutputs;
}

export const updatePrecache = () => {
  for (const herb in cacheTable) {
    caches[herb].amount = cacheTable[herb];
  }
};
