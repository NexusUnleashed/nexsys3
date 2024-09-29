/*global eventStream */

import { Aff, AffCountable, AffTimed, AffDef } from "./Aff.js";
import { affTable } from "./affTable.js";

export const affs = {};

for (let i = 0; i < affTable.list.length; i++) {
  const affname = affTable.list[i];
  const count = affTable.types.countable[affname];
  const timed = affTable.types.timed[affname];
  const defs = affTable.types.defs[affname];
  const prio = affTable.prios[affname];
  const uncurable = affTable.types.uncurable[affname];

  if (count) {
    affs[affname] = new AffCountable(
      affname,
      prio,
      count.min,
      count.max,
      uncurable
    );

    //Snipped added to work with countable affs
    for (let i = 1; i < count.max + 1; i++) {
      affs[`${affname}${i}`] = new Aff(affname, prio, uncurable);
    }
  } else if (timed) {
    affs[affname] = new AffTimed(affname, prio, timed.length, uncurable);
  } else if (defs) {
    affs[affname] = new AffDef(affname, prio, uncurable);
  } else {
    affs[affname] = new Aff(affname, prio, uncurable);
  }
}

const addCuresToAffs = function (cures) {
  for (const cure in cures) {
    const order = cures[cure].order;
    if (order !== undefined) {
      for (let i = 0; i < order.length; i++) {
        affs[order[i]].addCure(cure);

        //Section added to work with countable affs individually
        if (affs[order[i]] instanceof AffCountable) {
          for (let index = 1; index < affs[order[i]].max + 1; index++) {
            affs[`${order[i]}${index}`].addCure(cure);
            //order.push(`${order[i]}${index}`);
          }
        }
      }
    }
  }
};
eventStream.registerEvent("CuresCreatedEvent", addCuresToAffs);
