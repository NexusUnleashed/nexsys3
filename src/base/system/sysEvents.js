/* global eventStream */

import { sys } from "./sys";
import { bals } from "../balances/balances";
import { systemOutputDebug } from "./systemOutput";

const valueRegex = /(\d+)/;
const classSpecific = /(\w+): (\w+)?/;
const setCharVitals = function (vitals) {
  const sysChar = sys.char;
  const oh = sysChar.h;
  const om = sysChar.m;
  const oe = sysChar.e;
  const ow = sysChar.w;
  const omaxh = sysChar.maxh;
  const omaxm = sysChar.maxm;
  const omaxe = sysChar.maxe;
  const omaxw = sysChar.maxw;
  const orage = sysChar.rage;

  const h = vitals.hp || oh;
  const m = vitals.mp || om;
  const e = vitals.ep || oe;
  const w = vitals.wp || ow;
  const maxh = vitals.maxhp || omaxh;
  const maxm = vitals.maxmp || omaxm;
  const maxe = vitals.maxep || omaxe;
  const maxw = vitals.maxwp || omaxw;
  const bleed = parseInt(vitals.charstats[0].match(valueRegex)[0]);
  const rage = parseInt(vitals.charstats[1].match(valueRegex)[0]);

  sysChar.h = parseInt(h);
  sysChar.m = parseInt(m);
  sysChar.e = parseInt(e);
  sysChar.w = parseInt(w);
  sysChar.maxh = parseInt(maxh);
  sysChar.maxm = parseInt(maxm);
  sysChar.maxe = parseInt(maxe);
  sysChar.maxw = parseInt(maxw);
  sysChar.rage = rage;
  sysChar.bleed = bleed;

  if (vitals.charstats.length > 2) {
    const class1 = vitals.charstats[2].match(classSpecific);
    const id = class1[1].toLowerCase();
    let val = "";
    if (["Yes", "No"].indexOf(class1[2]) > -1) {
      if (!bals[id]) {
        console.log(
          `${id} class balance is not in balances table but is provided in GMCP`
        );
      } else if (class1[2] === "Yes" && !bals[id].have) {
        eventStream.raiseEvent(`${id}GotBalEvent`);
      } else if (class1[2] === "No" && bals[id].have) {
        eventStream.raiseEvent(`${id}LostBalEvent`);
      }
    } else {
      if (typeof class1[2] === "undefined") {
        val = false;
      } else {
        val = parseInt(class1[2]) || class1[2];
      }
      sysChar[id] = val;
    }
  }

  if (vitals.charstats.length > 3) {
    const class1 = vitals.charstats[3].match(classSpecific);
    const id = class1[1].toLowerCase();
    let val = "";
    if (["Yes", "No"].indexOf(class1[2]) > -1) {
      if (!bals[id]) {
        console.log(
          `${id} class balance is not in balances table but is provided in GMCP`
        );
      } else if (class1[2] === "Yes" && !bals[id].have) {
        eventStream.raiseEvent(`${id}GotBalEvent`);
      } else if (class1[2] === "No" && bals[id].have) {
        eventStream.raiseEvent(`${id}LostBalEvent`);
      }
    } else {
      if (typeof class1[2] === "undefined") {
        val = false;
      } else {
        val = parseInt(class1[2]) || class1[2];
      }
      sysChar[id] = val;
    }
  }

  if (sysChar.h !== oh) {
    eventStream.raiseEvent("HealthUpdated", {
      max: sysChar.maxh,
      current: sysChar.h,
      diff: sysChar.h - oh,
    });
  }

  if (sysChar.m !== om) {
    eventStream.raiseEvent("ManaUpdated", {
      max: sysChar.maxm,
      current: sysChar.m,
      diff: sysChar.m - om,
    });
  }

  if (sysChar.maxh !== omaxh) {
    eventStream.raiseEvent("MaxHealthUpdated", {
      max: sysChar.maxh,
      current: sysChar.h,
      diff: sysChar.maxh - omaxh,
    });
  }

  if (sysChar.maxm !== omaxm) {
    eventStream.raiseEvent("MaxManaUpdated", {
      max: sysChar.maxm,
      current: sysChar.m,
      diff: sysChar.maxm - omaxm,
    });
  }

  if (sysChar.rage !== orage) {
    eventStream.raiseEvent("RageUpdated", {
      max: sysChar.rage,
      current: sysChar.rage,
      diff: sysChar.rage - orage,
    });
  }

  if (sysChar.h === 0) {
    if (oh > 0) {
      sys.pause();
      console.log("deathGotAffEvent DEBUG");
      systemOutputDebug();
      eventStream.raiseEvent("deathGotAffEvent");
      eventStream.raiseEvent("deathEvent");
    }
  } else {
    if (oh === 0 && sysChar.h > 0) {
      sys.unpause();
      console.log("deathLostAffEvent DEBUG");
      systemOutputDebug();
      eventStream.raiseEvent("deathLostAffEvent");
      eventStream.raiseEvent("aliveEvent");
    }
  }

  eventStream.raiseEvent("SystemCharVitalsUpdated", sysChar);
};

const setCharStatus = function (status) {
  const sysChar = sys.char;
  const otarget = sysChar.target;
  const oclass = sysChar.class;
  const orace = sysChar.race;
  const oxp = sysChar.xp;

  const curTarget = (status.target || otarget).split(" ")[0].toProperCase();
  let curClass = (status.class || oclass).toProperCase();
  const curRace = status.race || orace;
  let curColor = "";
  if (curRace.indexOf("Dragon") >= 0) {
    curClass = "Dragon";
    curColor = curRace.split(" ")[0];
  }
  const xp = status.xp || oxp;
  const gold = status.gold;

  sysChar.target = curTarget;
  sysChar.class = curClass;
  sysChar.race = curRace;
  sysChar.color = curColor;
  sysChar.xp = xp;
  sysChar.gold = gold;

  if (otarget !== curTarget) {
    sys.target = curTarget;
    eventStream.raiseEvent("TargetChanged", curTarget);
    eventStream.raiseEvent("GameTargetChanged", {
      old: otarget,
      new: curTarget,
    });
  }

  if (oclass !== curClass) {
    eventStream.raiseEvent("ClassChanged", {
      old: oclass,
      new: curClass,
    });
  }

  eventStream.raiseEvent("SystemCharStatusUpdated", sysChar);
};

eventStream.registerEvent("Char.Vitals", setCharVitals);
eventStream.registerEvent("Char.Status", setCharStatus);

const lifevisionCheck = function () {
  sys.lifevision = false;
};
eventStream.registerEvent("PromptEvent", lifevisionCheck);

const wieldedEvent = (args) => {
  if (args.item.id === sys.char.wielded.left.id) {
    sys.char.wielded.left = false;
  } else if (args.item.id === sys.char.wielded.right.id) {
    sys.char.wielded.right = false;
  }

  if (args.item?.attrib === "l") {
    sys.char.wielded.left = args.item;
  } else if (args.item?.attrib === "L") {
    sys.char.wielded.right = args.item;
  }
};
eventStream.registerEvent("Char.Items.Update", wieldedEvent);
const initialWielded = (args) => {
  sys.char.wielded.left = args.find((e) => e.attrib === "l") || false;
  sys.char.wielded.right = args.find((e) => e.attrib === "L") || false;
};
eventStream.registerEvent("ItemListForInv", initialWielded, true);
/*
const occultistStatsGmcpBalance = function (vitals) {
  if (!sys.isClass("Occultist")) {
    return;
  }

  if (
    vitals.charstats.length > 2 &&
    vitals.charstats[2].indexOf("Karma") > -1
  ) {
    sys.char.karma = parseInt(vitals.charstats[2].match(valueRegex)[0]);
  }
  if (vitals.charstats.includes("Entity: Yes") && !bals["entity"].have) {
    eventStream.raiseEvent("entityGotBalEvent");
  } else if (vitals.charstats.includes("Entity: No") && bals["entity"].have) {
    eventStream.raiseEvent("entityLostBalEvent");
  }
};
eventStream.registerEvent("Char.Vitals", occultistStatsGmcpBalance);
*/
