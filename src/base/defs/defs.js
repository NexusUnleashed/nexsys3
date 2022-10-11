/*global */

import { Def, DefServerside } from "./Def.js";
import { defTable, defPrios } from "./defTable.js";

export const defs = {};

for (const def in defTable) {
  const curDef = defTable[def];
  const prio = defPrios.keepup[def] === undefined ? 0 : defPrios.keepup[def];
  const obj = {};
  obj.command = curDef.command;
  obj.bals_req = curDef.bals_req;
  obj.bals_used = curDef.bals_used;
  obj.blocks = curDef.blocks;
  obj.skills = curDef.skills;
  obj.preempt = curDef.preempt;
  obj.opps = curDef.opps;
  obj.serverside = curDef.serverside;

  if (obj.serverside) {
    defs[def] = new DefServerside(def, prio, obj);
  } else {
    defs[def] = new Def(def, prio, obj);
  }
}

/*export const defsCreate = () => {
  
  for (const def in defTable) {
    const curDef = defs[def];
    const prio = defPrios.keepup[def] === undefined ? 0 : defPrios.keepup[def];
    const obj = {};
    obj.command = curDef.command;
    obj.bals_req = curDef.bals_req;
    obj.bals_used = curDef.bals_used;
    obj.blocks = curDef.blocks;
    obj.skills = curDef.skills;
    obj.preempt = curDef.preempt;
    obj.opps = curDef.opps;
    obj.serverside = curDef.serverside;

    if (obj.serverside) {
      defs[def] = new DefServerside(def, prio, obj);
    } else {
      defs[def] = new Def(def, prio, obj);
    }
  }
};
*/