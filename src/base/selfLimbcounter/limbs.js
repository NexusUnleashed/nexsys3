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

const breakLimb = function ({ id }) {
  limbs[id].break();
};

const cureLimb = function (args) {
  console.log(args);
  limbs[id].reset();
};

limbLocations.forEach((limb) => {
  limbs[limb] = new Limb({ id: limb });
  // Damaged and Mangled afflictions GOT should be shown by GMCP under *most* situations.
  //eventStream.registerEvent(`damaged${limb}GotAffEvent`, breakLimb);
  //eventStream.registerEvent(`mangled${limb}GotAffEvent`, breakLimb);

  eventStream.registerEvent(`damaged${limb}LostAffEvent`, cureLimb);
  eventStream.registerEvent(`mangled${limb}LostAffEvent`, cureLimb);
});

limbs["torso"] = new Limb({ id: "torso" });

const nexSysBreakTorso = function (args) {
  if (nexSys.haveAff("mildtrauma")) {
    nexSys.affs.mildtrauma.lost();
    nexSys.affs.serioustrauma.got();
  } else if (!nexSys.haveAff(`serioustrauma`)) {
    nexSys.affs.mildtrauma.got();
  }
};
eventStream.registerEvent(`nexSysLimbBreaktorso`, nexSysBreakTorso);
