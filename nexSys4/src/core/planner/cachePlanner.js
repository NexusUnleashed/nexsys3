import { getCurrentAffs, haveAnAff, haveAff } from "../selectors";
import { arraysIntersect } from "../utils/arrays";

const needsOutr = (cache) =>
  cache.rift >= cache.amount && cache.count < cache.amount;

export const planCacheOutputs = (state) => {
  if (haveAff(state, "trueblind")) {
    return [];
  }

  if (state.defs.blindness?.have && !state.defs.mindseye?.have) {
    return [];
  }

  const leftArm = ["brokenleftarm", "damagedleftarm", "mangledleftarm"];
  const rightArm = ["brokenrightarm", "damagedrightarm", "mangledrightarm"];
  if (haveAnAff(state, leftArm) && haveAnAff(state, rightArm)) {
    return [];
  }

  const outputs = [];
  const currentAffs = getCurrentAffs(state);
  Object.values(state.caches).forEach((cache) => {
    if (!needsOutr(cache)) {
      return;
    }
    if (cache.blocks && cache.blocks.length) {
      if (arraysIntersect(cache.blocks, currentAffs)) {
        return;
      }
    }
    const amount = cache.amount - cache.count;
    if (amount > 0) {
      outputs.push(`outr ${amount} ${cache.id}`);
    }
  });

  return outputs;
};
