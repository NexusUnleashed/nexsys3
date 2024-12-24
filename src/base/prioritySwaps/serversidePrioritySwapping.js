/* global eventStream, nexSys */

let isClass = nexSys.sys.isClass;
let checkOnPrompt = false;

let aeonSwapGot = function () {
  let affs = nexSys.affs;
  nexSys.sendInline([
    "curing siphealth 30",
    "curing sipmana 10",
    "curing mosshealth 0",
    "curing mossmana 0",
    "curing batch off",
    "curing clotat 5000",
  ]);
  affs.asthma.set_prio(3);
  affs.weariness.set_prio(4);
  affs.anorexia.set_prio(5);
  affs.impatience.set_prio(7);
  affs.paralysis.set_prio(8);
};

let aeonSwapLost = function () {
  let affs = nexSys.affs;
  let settings = nexSys.sys.state;
  nexSys.sendInline([
    "curing siphealth " + settings.sipHealthAt,
    "curing sipmana " + settings.sipManaAt,
    "curing mosshealth " + settings.mossHealthAt,
    "curing mossmana " + settings.mossManaAt,
    "curing batch on",
    "curing clotat " + settings.clotAt,
  ]);
  affs.asthma.reset_prio();
  affs.weariness.reset_prio();
  affs.anorexia.reset_prio();
  affs.impatience.reset_prio();
  affs.paralysis.reset_prio();
};
// CUSTOM
//eventStream.registerEvent('AffGot', aeonSwapGot);
//eventStream.registerEvent('AffLost', aeonSwapLost);
eventStream.registerEvent("aeonGotAffEvent", aeonSwapGot);
eventStream.registerEvent("aeonLostAffEvent", aeonSwapLost);

let checkFocusSwapLost = function () {
  let affs = nexSys.affs;
  affs.stupidity.set_prio(9);
  affs.recklessness.set_prio(12);
  affs.dizziness.set_prio(14);
  affs.shyness.set_prio(14);
};

let checkFocusSwapGot = function () {
  let affs = nexSys.affs;
  affs.stupidity.reset_prio();
  affs.recklessness.reset_prio();
  affs.dizziness.reset_prio();
  affs.shyness.reset_prio();
};

// CUSTOM
//eventStream.registerEvent('BalanceLost', checkFocusSwapLost);
//eventStream.registerEvent('BalanceGot', checkFocusSwapGot);
eventStream.registerEvent("focusLostBalEvent", checkFocusSwapLost);
eventStream.registerEvent("focusGotBalEvent", checkFocusSwapGot);

let checkPrioritySwaps = function (arg) {
  if (checkOnPrompt) {
    checkOnPrompt = false;
    let affs = nexSys.affs;

    // Scytherus
    if (nexSys.haveAffs(["scytherus", "paralysis"])) {
      affs.scytherus.set_prio(2);
    } else {
      affs.scytherus.reset_prio();
    }

    // Confusion and Disrupt
    if (
      nexSys.haveAffs(["confusion", "disrupted"]) &&
      (nexSys.haveBal("focus") || nexSys.haveAff("impatience")) &&
      !nexSys.haveAff("whisperingmadness")
    ) {
      affs.confusion.set_prio(2);
    } else {
      affs.confusion.reset_prio();
    }

    if (
      nexSys.haveAff("impatience") &&
      nexSys.snapTrack.have &&
      nexSys.snapTrack.elapsed() < 8000
    ) {
      affs.impatience.set_prio(2);
    } else {
      affs.impatience.reset_prio();
    }

    if (nexSys.haveAffs(["impatience", "hypochondria"])) {
      affs.hypochondria.set_prio(1);
    } else if (
      nexSys.haveAff("hypochondria") &&
      nexSys.snapTrack.have &&
      nexSys.snapTrack.elapsed() < 8000
    ) {
      affs.hypochondria.set_prio(2);
    } else {
      affs.hypochondria.reset_prio();
    }

    if (
      nexSys.haveAffs(["slickness", "asthma"]) &&
      nexSys.haveAnAff([
        "sensitivity",
        "clumsiness",
        "weariness",
        "hypochondria",
      ]) &&
      !affs.anorexia.have
    ) {
      affs.slickness.set_prio(2);
    } else {
      affs.slickness.reset_prio();
    }

    if (
      nexSys.haveAffs(["slickness", "asthma"]) &&
      !nexSys.haveAnAff([
        "sensitivity",
        "clumsiness",
        "weariness",
        "hypochondria",
      ])
    ) {
      affs.asthma.set_prio(2);
    } else if (nexSys.haveAffs(["hellsight", "asthma"])) {
      affs.asthma.set_prio(2);
    } else {
      affs.asthma.reset_prio();
    }

    if (
      affs.darkshade.have &&
      affs.darkshade.elapsed() > 10000 &&
      nexSys.roomItems["a lightwall"]
    ) {
      affs.darkshade.set_prio(2);
    } else {
      affs.darkshade.reset_prio();
    }

    if (
      nexSys.haveAffs(["prone", "sensitivity"]) &&
      nexSys.haveAnAff(["damagedleftleg", "damagedrightleg"])
    ) {
      affs.sensitivity.set_prio(2);
    } else {
      affs.sensitivity.reset_prio();
    }

    if (
      nexSys.haveAff("conflagration") &&
      nexSys.haveAnAff([
        "brokenleftleg",
        "brokenrightleg",
        "damagedleftleg",
        "damagedrightleg",
        "mangledleftleg",
        "mangledrightleg",
      ])
    ) {
      if (
        nexSys.haveAff("prone") &&
        !nexSys.haveAnAff([
          "damagedleftleg",
          "damagedrightleg",
          "mangledleftleg",
          "mangledrightleg",
        ])
      ) {
        affs.burning.set_prio(7);
      } else {
        affs.burning.set_prio(4);
      }
    } else {
      affs.burning.reset_prio();
    }
    /* CUSTOM Insulation not an aff
        if (nexSys.haveAff('timeflux')) {
            if (nexSys.haveAff('prone') && !nexSys.haveAnAff(['damagedleftleg', 'damagedrightleg', 'mangledleftleg', 'mangledrightleg'])) {
                affs.insulation.set_prio(7);
            }
            else {
                affs.insulation.set_prio(4);
            }
        }
        else {
            affs.insulation.reset_prio();
        }
*/
    if (affs.cadmuscurse.have) {
      affs.vertigo.set_prio(4);
    } else {
      affs.vertigo.reset_prio();
    }

    // add vivi and heartseed curing here
    if (
      affs.prone.have &&
      (nexSys.haveAnAff([
        "damagedleftleg",
        "damagedrightleg",
        "mangledleftleg",
        "mangledrightleg",
      ]) ||
        nexSys.haveAffs(["brokenrightleg", "brokenleftleg"]))
    ) {
      /*affs.damagedleftleg.set_prio(6);
            affs.damagedrightleg.set_prio(6);
            affs.mangledleftleg.set_prio(6);
            affs.mangledrightleg.set_prio(6); CUSTOM*/
    } else {
      /*affs.damagedleftleg.reset_prio();
            affs.damagedrightleg.reset_prio();
            affs.mangledleftleg.reset_prio();
            affs.mangledrightleg.reset_prio(); CUSTOM*/
    }

    // Fitness
    if (
      isClass([
        "Runewarden",
        "Monk",
        "Blademaster",
        "Infernal",
        "Paladin",
        "Sentinel",
        "Druid",
      ])
    ) {
      if (nexSys.haveAff("asthma")) {
        if (
          nexSys.haveAnAff(["slickness", "hellsight"]) &&
          nexSys.haveAnAff(["paralysis", "clumsiness", "sensitivity"])
        ) {
          nexSys.cures.fitness.set_prio(100);
        } else if (
          nexSys.haveAnAff([
            "damagedhead",
            "mangledhead",
            "damagedleftleg",
            "damagedrightleg",
          ]) &&
          nexSys.haveAnAff([
            "paralysis",
            "clumsiness",
            "sensitivity",
            "slickness",
            "hellsight",
            "disloyalty",
          ])
        ) {
          nexSys.cures.fitness.set_prio(100);
        } else {
          nexSys.cures.fitness.reset_prio();
        }
      } else {
        nexSys.cures.fitness.reset_prio();
      }
    } else {
      nexSys.cures.fitness.reset_prio();
    }

    // Dragon
    if (isClass("Dragon")) {
      // Dragonheal

      if (
        nexSys.haveAffs(["asthma", "slickness", "anorexia"]) &&
        (!nexSys.haveBal("focus") || nexSys.haveAff("impatience"))
      ) {
        nexSys.cures.dragonheal.set_prio(100);
      } else {
        nexSys.cures.dragonheal.reset_prio();
      }

      // Dragonflex

      if (nexSys.haveAffs(["entangled", "webbed"])) {
        nexSys.cures.dragonflex.set_prio(100);
      } else if (nexSys.haveAnAff(["entangled", "webbed"])) {
        if (
          (nexSys.haveBal("balance") && !nexSys.haveBal("writhe")) ||
          nexSys.haveAff("transfixation")
        ) {
          nexSys.cures.dragonflex.set_prio(100);
        } else {
          nexSys.cures.dragonflex.reset_prio();
        }
      } else {
        nexSys.cures.dragonflex.reset_prio();
      }
    } else {
      nexSys.cures.dragonflex.reset_prio();
      nexSys.cures.dragonheal.reset_prio();
    }

    // Magi
    if (isClass("Magi")) {
      // Bloodboil
      if (nexSys.haveAffs(["asthma", "slickness"])) {
        if (
          nexSys.haveAnAff(["hypochondria", "paralysis"]) ||
          (nexSys.haveAff("anorexia") &&
            (!nexSys.haveBal("focus") || nexSys.haveAff("impatience")))
        ) {
          nexSys.cures.bloodboil.set_prio(100);
        } else {
          nexSys.cures.bloodboil.reset_prio();
        }
      } else {
        nexSys.cures.bloodboil.reset_prio();
      }
    } else {
      nexSys.cures.bloodboil.reset_prio();
    }

    // Bard
    if (isClass("Bard")) {
      // Dwinnu
      if (nexSys.haveAffs(["webbed", "entangled"])) {
        nexSys.cures.dwinnu.set_prio(100);
      } else if (
        nexSys.haveAnAff(["webbed", "entangled"]) &&
        nexSys.haveAff("transfixation")
      ) {
        nexSys.cures.dwinnu.set_prio(100);
      } else {
        nexSys.cures.dwinnu.reset_prio();
      }
    } else {
      nexSys.cures.dwinnu.reset_prio();
    }

    // Alchemist
    if (isClass("Alchemist")) {
      // Salt
      if (
        nexSys.haveAffs(["asthma", "slickness", "anorexia"]) &&
        (!nexSys.haveBal("focus") || nexSys.haveAff("impatience"))
      ) {
        nexSys.cures.salt.set_prio(100);
      } else if (
        nexSys.haveAffs(["asthma", "slickness", "hypochondria"]) ||
        nexSys.haveAffs(["asthma", "slickness", "paralysis"])
      ) {
        nexSys.cures.salt.set_prio(100);
      } else {
        nexSys.cures.salt.reset_prio();
      }
    } else {
      nexSys.cures.salt.reset_prio();
    }

    // Serpent
    if (isClass("Serpent")) {
      // Shrugging
      if (
        nexSys.haveAffs(["asthma", "slickness", "anorexia"]) &&
        (!nexSys.haveBal("focus") || nexSys.haveAff("impatience"))
      ) {
        nexSys.cures.shrugging.set_prio(100);
      } else if (
        nexSys.haveAffs(["asthma", "slickness", "hypochondria"]) ||
        nexSys.haveAffs(["asthma", "slickness", "paralysis"])
      ) {
        nexSys.cures.shrugging.set_prio(100);
      } else {
        nexSys.cures.shrugging.reset_prio();
      }
    } else {
      nexSys.cures.shrugging.reset_prio();
    }

    // Occultist
    if (isClass("Occultist")) {
      // Fool
      if (
        nexSys.haveAffs(["asthma", "slickness", "anorexia"]) &&
        (!nexSys.haveBal("focus") || nexSys.haveAff("impatience"))
      ) {
        nexSys.cures.fool.set_prio(100);
      } else if (
        nexSys.haveAffs(["asthma", "slickness", "hypochondria"]) ||
        nexSys.haveAffs(["asthma", "slickness", "impatience"])
      ) {
        nexSys.cures.fool.set_prio(100);
      } else {
        nexSys.cures.fool.reset_prio();
      }
    } else {
      nexSys.cures.fool.reset_prio();
    }

    // Blademaster
    if (isClass("Blademaster")) {
      // Alleviate
      if (
        nexSys.haveAffs(["asthma", "slickness", "anorexia"]) &&
        (!nexSys.haveBal("focus") || nexSys.haveAff("impatience"))
      ) {
        nexSys.cures.alleviate.set_prio(100);
      } else if (
        nexSys.haveAffs(["asthma", "slickness", "hypochondria"]) ||
        nexSys.haveAffs(["asthma", "slickness", "impatience"])
      ) {
        nexSys.cures.alleviate.set_prio(100);
      } else {
        nexSys.cures.alleviate.reset_prio();
      }
    } else {
      nexSys.cures.alleviate.reset_prio();
    }
  }
};

let checkPrioritySwapsOnPrompt = function () {
  checkOnPrompt = true;
};

eventStream.registerEvent("PromptEvent", checkPrioritySwaps);
eventStream.registerEvent("AffGot", checkPrioritySwapsOnPrompt);
eventStream.registerEvent("AffLost", checkPrioritySwapsOnPrompt);
eventStream.registerEvent("BalanceLost", checkPrioritySwapsOnPrompt);
eventStream.registerEvent("BalanceGot", checkPrioritySwapsOnPrompt);
eventStream.registerEvent("ClassChanged", checkPrioritySwapsOnPrompt);

let cadmusGained = function (aff) {
  if (aff.name === "cadmuscurse") {
    nexSys.sendCmd("curing focus off");
  }
};

let cadmusLost = function (aff) {
  if (aff.name === "cadmuscurse") {
    nexSys.sendCmd("curing focus on");
  }
};
eventStream.registerEvent("cadmusGotAffEvent", cadmusGained);
eventStream.registerEvent("cadmusLostAffEvent", cadmusLost);

let gotSnapped = function (person) {
  if (nexSys.sys.isTarget(person)) {
    eventStream.raiseEvent("SnappedGotTrackableEvent");
  }
};
eventStream.registerEvent("GotSnappedEvent", gotSnapped);
