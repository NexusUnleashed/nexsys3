import { caches } from "./caches"
import { affs } from "../affs/affs"
import { defs } from "../defs/defs"

function getMissingCache() {
  const current_cache = []
  for (const cache in caches) {
      if (caches[cache].needToOutr) {
          current_cache.push(caches[cache])
      }
  }

  return current_cache
}

export function getCacheOutputs(affList) {
  if (affs.blindness.have || defs.mindseye.have) {
      const missingCache = getMissingCache() // return this as sorted by prio
      let cacheOutputs = []

      for (let i = 0; i < missingCache.length; i++) {
          const cache = missingCache[i]

          if (!Array.arraysIntersect(cache.blocks, affList)) {
              cacheOutputs = cacheOutputs.concat(cache.command)
          }
      }

      return cacheOutputs
  } else {
      return []
  }
}