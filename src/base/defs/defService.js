/* global eventStream */

import { defs } from "./defs";
import { sysLog } from "../system/sys";
import { limbs } from "../utilities/commonTable";
import { sys } from "../system/sys";
import { defPrios } from "./defTable.js";
import { serversideSettings } from "../serverside/serverside";

export function getCurrentDefs() {
  const current_defs = [];
  for (const def in defs) {
    if (defs[def].have) {
      current_defs.push(defs[def].name);
    }
  }

  return current_defs;
}

/** ORIGNAL Nexsys function **
getMissingDefs() {
  let defs = nexSys.Defs;
  let missing_defs = [];
  let queue = new nexSys.PriorityQueue();
  for(let def in defs) {
      let cur_def = defs[def];
      if(!cur_def.have && !cur_def.isIgnored && !cur_def.isServerSide) {
              //push on priority queue
              queue.push(defs[def].prio, defs[def]);
              //missing_defs.push(defs[def]);
      }
  }

  let i = 100;
  while(queue.nodes.length > 0 && i > 0) {
      missing_defs.push(queue.pop());
      i--;
      if(i == 1) {
          console.log('def service looped');
          console.log(queue.nodes);
      }
  }
  // pop from priority queue in order and fill array

  return missing_defs;
},
***************************/

export function getMissingDefs() {
  return Object.keys(defs)
    .filter(
      (def) =>
        !defs[def].isServerSide && !defs[def].have && !defs[def].isIgnored
    )
    .sort((a, b) => {
      return defs[a].prio - defs[b].prio;
    });
}

//TODO This seems overly complex. Deeper analysis on this function.
export function getDefOutputs(affList, balList) {
  let defOutputs = [];
  const missingDefs = getMissingDefs(); // return this as sorted by prio
  const remainingDefs = [];

  for (let i = 0; i < missingDefs.length; i++) {
    const def = defs[missingDefs[i]];
    let canPerform = true;
    if (
      def.blocks === undefined ||
      def.blocks.length === 0 ||
      !Array.arraysIntersect(def.blocks, affList)
    ) {
      // isn't blocked by an aff

      // if it's free to use, but requires certain bals, get those here
      if (def.balsUsed.length !== 0 && def.balsUsed[0] === "free") {
        for (let j = 0; j < def.balsReq.length && canPerform; j++) {
          if (balList.indexOf(def.balsReq[j]) === -1) {
            canPerform = false;
          }
        }
      } else {
        // not sure if we can perform these yet
        remainingDefs.push(def);
        canPerform = false;
      }
    } else {
      canPerform = false;
    }
    // add to defOutputs if it's free and can use it
    if (canPerform) {
      defOutputs = defOutputs.concat(def.command);
    }
  }

  for (let i = 0; i < remainingDefs.length; i++) {
    const def = remainingDefs[i];
    let canPerform = true;

    // if required bals are satisfied or is 'free' add to defOutput
    if (def.balsReq.length !== 0 && def.balsReq[0] !== "free") {
      for (let j = 0; j < def.balsReq.length && canPerform; j++) {
        if (balList.indexOf(def.balsReq[j]) === -1) {
          canPerform = false;
        }
      }
    }
    if (canPerform) {
      defOutputs = defOutputs.concat(def.command);
      for (let j = 0; j < def.balsUsed.length; j++) {
        balList.splice(balList.indexOf(def.balsUsed[j]), 1);
      }
    }
  }

  return defOutputs;
}

export function haveDef(def) {
  const curDef = defs[def];
  if (def === undefined || curDef === undefined) {
    sysLog("Called nexSys.haveDef with a def that does not exist: " + def);
    return false;
  } else {
    return curDef.have;
  }
}

export function defPrioSwap(def, prio) {
  const curDef = defs[def];
  if (def === undefined || curDef === undefined) {
    sysLog("Called nexSys.defPrioSwap with an def that does not exist: " + def);
  } else {
    curDef.set_prio(prio);
    eventStream.raiseEvent("ForcePopulateEvent");
  }
}

//TODO "cur_def.skills?.length > 0 &&"
// We added that snip because we shifted from static object containing only static defs
// to containing all defs, defined by 0 or prio.
export function defup() {
  const staticPrios = defPrios.static;
  for (const def in defs) {
    const cur_def = defs[def];
    if (!cur_def.have) {
      if (staticPrios[def]) {
        if (
          sys.isClass(cur_def.skills) ||
          cur_def.skills === undefined ||
          cur_def.skills.length === 0
        ) {
          cur_def.set_prio(staticPrios[def]);
        } else {
          cur_def.set_default_prio(0);
        }
      } else if (cur_def.skills?.length > 0 && !sys.isClass(cur_def.skills)) {
        cur_def.set_default_prio(0);
      }
    }
  }
  eventStream.raiseEvent("ForcePopulateEvent");
}

export function defoff() {
  for (const def in defs) {
    const cur_def = defs[def];
    cur_def.reset_prio();
  }
}

export function parry(arg) {
  for (const limb in limbs.long) {
    defs["parrying " + limb].set_default_prio(0);
    if (defs["guarding " + limb]) {
      defs["guarding " + limb].set_default_prio(0);
    }
  }

  const limb = limbs.short[arg] || arg;

  if (sys.isClass(defs["guarding " + limb].skills)) {
    defs["guarding " + limb].set_default_prio(25);
  } else {
    defs["parrying " + limb].set_default_prio(25);
    if (sys.isClass("Dragon")) {
      defs["parrying " + limb].set_command("clawparry " + limb);
    } else {
      defs["parrying " + limb].set_command("parry " + limb);
    }
  }
  eventStream.raiseEvent("ForcePopulateEvent");
}

export function repop() {
  if (serversideSettings.loaded) {
    const keepupPrios = defPrios.keepup;

    for (const def in defs) {
      const cur_def = defs[def];
      if (
        sys.isClass(cur_def.skills) ||
        cur_def.skills === undefined ||
        cur_def.skills.length === 0
      ) {
        if (keepupPrios[def]) {
          console.log("1 + " + def);
          cur_def.set_default_prio(keepupPrios[def]);
        } else {
          cur_def.set_default_prio(0);
        }
      } else {
        cur_def.set_default_prio(0);
      }
    }

    for (const limb in limbs.long) {
      if (!defs["parrying " + limb].isIgnored) {
        parry(limb);
      }
      if (defs["guarding " + limb]) {
        if (!defs["guarding " + limb].isIgnored) {
          parry(limb);
        }
      }
    }

    eventStream.raiseEvent("ForcePopulateEvent");
  }
}
