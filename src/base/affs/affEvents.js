/*global eventStream, nexSys */
import { affs } from "./affs";
import { getCurrentAffs } from "./affService";

let eventGmcpAffList = function (list) {
  let prev_list = getCurrentAffs();
  let new_list = {};

  for (let i in list) {
    let count = 0;
    let aff = list[i].name;
    let index = 0;

    if ((index = aff.search("(\\d+)")) >= 0) {
      count = parseInt(aff.substr(index, 1));
      aff = aff.substr(0, index - 2);
    }
    // maintain new list, to compare to old list when done
    new_list[aff] = true;

    eventStream.raiseEvent(aff + "GotAffEvent");

    // add counts here
    if (count > 0) {
      eventStream.raiseEvent(aff + "AffCountSetEvent", count);
    }
  }

  // compare new list to old list and remove affs that are no longer there
  for (let i = 0; i < prev_list.length; i++) {
    if (new_list[prev_list[i]] === undefined) {
      eventStream.raiseEvent(prev_list[i] + "LostAffEvent");
    }
  }
};

eventStream.registerEvent("Char.Afflictions.List", eventGmcpAffList);

let eventGmcpAffAdd = function (obj) {
  let aff = obj.name;
  let index = 0;
  let count = 0;
  if ((index = aff.search("(\\d+)")) >= 0) {
    count = parseInt(aff.substr(index, 1));
    aff = aff.substr(0, index - 2);
  }

  if (count > 0) {
    eventStream.raiseEvent(aff + "AffCountAddEvent", count);
  }

  eventStream.raiseEvent(aff + "GotAffEvent", aff);

  /*if(count > 0) {
      eventStream.raiseEvent(aff+'AffCountAddEvent', count);
  }*/
};

eventStream.registerEvent("Char.Afflictions.Add", eventGmcpAffAdd);

// CUSTOM
let eventGmcpAffRemove = function (obj) {
  let aff = obj[0];
  let index = 0;
  let count = 0;
  if ((index = aff.search("(\\d+)")) >= 0) {
    count = parseInt(aff.substr(index, 1));
    aff = aff.substr(0, index - 2);
  }

  eventStream.raiseEvent(aff + "LostAffEvent", aff);

  if (count > 0) {
    eventStream.raiseEvent(aff + "AffCountSubtractEvent", count);
  }
};

eventStream.registerEvent("Char.Afflictions.Remove", eventGmcpAffRemove);

let setAffPrios = function () {
  for (let aff in affs) {
    let curAff = affs[aff];
    curAff.set_prio(curAff.prio);
  }
};

eventStream.registerEvent("ServersideSettingsCaptured", setAffPrios);

/*
//Initial
10:42:25.426 [GMCP]: Char.Afflictions.Add {"name":"burning (1)","cure":"APPLY MENDING TO TORSO","desc":"When your body is completely wrapped in flames, you will unsuprisingly find it quite painful."}
//Additional
10:42:27.860 [GMCP]: Char.Afflictions.Remove ["burning (1)"]
10:42:27.860 [GMCP]: Char.Afflictions.Add {"name":"burning (2)","cure":"APPLY MENDING TO TORSO","desc":"When your body is completely wrapped in flames, you will unsuprisingly find it quite painful."}
//Cure
10:42:33.847 [GMCP]: Char.Afflictions.Remove ["burning (2)"]
10:42:33.847 [GMCP]: Char.Afflictions.Add {"name":"burning (1)","cure":"APPLY MENDING TO TORSO","desc":"When your body is completely wrapped in flames, you will unsuprisingly find it quite painful."}
//Cure
10:42:35.415 [GMCP]: Char.Afflictions.Remove ["burning (1)"]
*/
