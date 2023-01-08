/* global eventStream */

import { sys } from "./sys";
import { bals } from "../balances/balances";

const rageRegex = /(\d+)/g;
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
  const rage = parseInt(vitals.charstats[1].match(rageRegex)[0]);

  sysChar.h = h;
  sysChar.m = m;
  sysChar.e = e;
  sysChar.w = w;
  sysChar.maxh = maxh;
  sysChar.maxm = maxm;
  sysChar.maxe = maxe;
  sysChar.maxw = maxw;
  sysChar.rage = rage;

  if (h !== oh) {
    eventStream.raiseEvent("HealthUpdated", {
      max: maxh,
      current: h,
      diff: h - oh,
    });
  }

  if (m !== om) {
    eventStream.raiseEvent("ManaUpdated", {
      max: maxm,
      current: m,
      diff: m - om,
    });
  }

  if (maxh !== omaxh) {
    eventStream.raiseEvent("MaxHealthUpdated", {
      max: maxh,
      current: h,
      diff: maxh - omaxh,
    });
  }

  if (maxm !== omaxm) {
    eventStream.raiseEvent("MaxManaUpdated", {
      max: maxm,
      current: m,
      diff: maxm - omaxm,
    });
  }

  if (rage !== orage) {
    eventStream.raiseEvent("RageUpdated", {
      max: rage,
      current: rage,
      diff: rage - orage,
    });
  }

  if (h === 0) {
    if (oh > 0) {
      sys.pause();
      eventStream.raiseEvent("DiedEvent");
    }
  } else {
    if (oh === 0 && h > 0) {
      sys.unpause();
      eventStream.raiseEvent("AliveEvent");
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
  } else {
    eventStream.raiseEvent("TargetSetEvent", curTarget);
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

const karmaRegex = /(\d+)/g;
const occultistStatsGmcpBalance = function (vitals) {
  if (!sys.isClass("Occultist")) {
    return;
  }

  if (
    vitals.charstats.length > 2 &&
    vitals.charstats[2].indexOf("Karma") > -1
  ) {
    sys.char.karma = parseInt(vitals.charstats[2].match(karmaRegex)[0]);
  }
  if (vitals.charstats.includes("Entity: Yes") && !bals["entity"].have) {
    eventStream.raiseEvent("entityGotBalEvent");
  } else if (vitals.charstats.includes("Entity: No") && bals["entity"].have) {
    eventStream.raiseEvent("entityLostBalEvent");
  }
};
eventStream.registerEvent("Char.Vitals", occultistStatsGmcpBalance);
