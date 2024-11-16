/* global eventStream, nexSys */

import { getCurrentDefs, haveDef } from "./defService";
import { repop } from "./defService";

let eventGmcpDefList = function (list) {
  let prev_list = getCurrentDefs();
  let new_list = {};

  for (let i in list) {
    let def = list[i].name;
    def = def.replace("(", "");
    def = def.replace(")", "");
    // maintain new list, to compare to old list when done
    new_list[def] = true;

    eventStream.raiseEvent(def + "GotDefEvent");
  }

  // compare new list to old list and remove defs that are no longer there
  for (let i in prev_list) {
    if (new_list[prev_list[i]] === undefined) {
      eventStream.raiseEvent(prev_list[i] + "LostDefEvent");
    }
  }
};

eventStream.registerEvent("Char.Defences.List", eventGmcpDefList);

let eventGmcpDefAdd = function (obj) {
  var def = obj.name;

  def = def.replace("(", "");
  def = def.replace(")", "");

  eventStream.raiseEvent(def + "GotDefEvent");
};

eventStream.registerEvent("Char.Defences.Add", eventGmcpDefAdd);

let eventGmcpDefRemove = function (def) {
  def = def[0];

  def = def.replace("(", "");
  def = def.replace(")", "");

  eventStream.raiseEvent(def + "LostDefEvent");
};

eventStream.registerEvent("Char.Defences.Remove", eventGmcpDefRemove);

//TODO reevaluate how this function handles defence up.
/*
function repop(args) {
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
*/

eventStream.registerEvent("ClassChanged", repop);
eventStream.registerEvent("ServersideSettingsCaptured", repop);

const nexSysFlying = (args) => {
  const flying = args.name.startsWith("Flying above ");
  const flyingDef = haveDef("flying");

  if (flying && !flyingDef) {
    eventStream.raiseEvent("flyingGotDefEvent");
  } else if (!flying && flyingDef) {
    eventStream.raiseEvent("flyingLostDefEvent");
  }
};
eventStream.registerEvent("Room.Info", nexSysFlying);

const nexSysMount = function (args) {
  if (args) {
    nexSys.defs.mounted.mount = args;
  }
};
eventStream.registerEvent("mountedGotDefEvent", nexSysMount);
const nexSysMount2 = function (args) {
  if (
    [
      "dragon",
      "fire elemental lord",
      "water elemental lord",
      "air elemental lord",
      "earth elemental lord",
    ].includes(args.new.toLowerCase())
  ) {
    nexSys.defs.mounted.lost();
  }
};
eventStream.registerEvent("ClassChanged", nexSysMount2);
