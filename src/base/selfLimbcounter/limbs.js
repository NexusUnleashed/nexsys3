import { Limb } from "./Limb";

const limbLocations = [
  "head",
  //"torso",
  "leftarm",
  "rightarm",
  "leftleg",
  "rightleg",
];

export const limbs = {};

const breakLimb = function (id) {
  const limbId = id.replace(/^(?:damaged|mangled)/, "");
  limbs[limbId].break();
};

const cureLimb = function (id) {
  const limbId = id.replace(/^(?:damaged|mangled)/, "");
  limbs[limbId].reset();
};

limbLocations.forEach((limb) => {
  limbs[limb] = new Limb({ id: limb });
  // Damaged and Mangled afflictions GOT should be shown by GMCP under *most* situations.
  eventStream.registerEvent(`damaged${limb}GotAffEvent`, breakLimb);
  eventStream.registerEvent(`mangled${limb}GotAffEvent`, breakLimb);

  eventStream.registerEvent(`damaged${limb}LostAffEvent`, cureLimb);
  eventStream.registerEvent(`mangled${limb}LostAffEvent`, cureLimb);
});

const cureTorso = function () {
  limbs.torso.reset();
};
limbs["torso"] = new Limb({ id: "torso" });
eventStream.registerEvent(`mildtraumaLostAffEvent`, cureTorso);
eventStream.registerEvent(`serioustraumaLostAffEvent`, cureTorso);

const nexSysBreakTorso = function () {
  if (nexSys.haveAff("mildtrauma")) {
    eventStream.raiseEvent("mildtraumaLostAffEvent");
    eventStream.raiseEvent("serioustraumaGotAffEvent");
    nexusclient.send_commands(`curing predict serioustrauma`);
  } else if (!nexSys.haveAff(`serioustrauma`)) {
    eventStream.raiseEvent("mildtraumaGotAffEvent");
    nexusclient.send_commands(`curing predict mildtrauma`);
  }
};
eventStream.registerEvent(`nexSysLimbBreaktorso`, nexSysBreakTorso);
