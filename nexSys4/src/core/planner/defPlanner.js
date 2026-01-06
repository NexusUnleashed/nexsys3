import { getCurrentAffs, getCurrentBals, getMissingDefs } from "../selectors";
import { arraysIntersect } from "../utils/arrays";

const appendCommand = (output, command) => {
  if (!command) {
    return;
  }
  if (Array.isArray(command)) {
    output.push(...command);
  } else {
    output.push(command);
  }
};

export const planDefOutputs = (state) => {
  const affList = getCurrentAffs(state);
  const balList = getCurrentBals(state).slice();
  const missingDefIds = getMissingDefs(state);
  const defOutputs = [];
  const remainingDefs = [];

  missingDefIds.forEach((id) => {
    const def = state.defs[id];
    if (!def) {
      return;
    }

    if (def.blocks && def.blocks.length && arraysIntersect(def.blocks, affList)) {
      return;
    }

    const balsReq = def.balsReq || [];
    const balsUsed = def.balsUsed || [];
    const isFree = balsUsed.length > 0 && balsUsed[0] === "free";

    if (isFree) {
      let canPerform = true;
      for (let i = 0; i < balsReq.length; i++) {
        if (!balList.includes(balsReq[i])) {
          canPerform = false;
          break;
        }
      }
      if (canPerform) {
        appendCommand(defOutputs, def.command);
      }
    } else {
      remainingDefs.push(def);
    }
  });

  remainingDefs.forEach((def) => {
    const balsReq = def.balsReq || [];
    const balsUsed = def.balsUsed || [];
    let canPerform = true;

    if (balsReq.length > 0 && balsReq[0] !== "free") {
      for (let i = 0; i < balsReq.length; i++) {
        if (!balList.includes(balsReq[i])) {
          canPerform = false;
          break;
        }
      }
    }

    if (canPerform) {
      appendCommand(defOutputs, def.command);
      balsUsed.forEach((bal) => {
        const idx = balList.indexOf(bal);
        if (idx >= 0) {
          balList.splice(idx, 1);
        }
      });
    }
  });

  return defOutputs;
};
