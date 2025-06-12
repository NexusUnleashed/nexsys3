/* global eventStream, nexusclient */

/* This function is strictly for localhost simulations */
if (typeof nexusclient === "undefined") {
  globalThis.nexusclient = {
    variables() {
      return {
        vars: {
          nexSysSettings: {},
        },
        get(txt) {
          if (globalThis.nexusclient.variables().vars[txt]) {
            return globalThis.nexusclient.variables().vars[txt];
          } else {
            return false;
          }
        },
        set(txt, data) {
          globalThis.nexusclient.variables().vars[txt] = data;
        },
      };
    },
  };
}

export const sys = {
  settings: {
    sep:
      nexusclient.variables().get("nexSysSettings")?.commandSeparator ?? false,
    customPrompt: false,
    overrideTab: false,
    loadOnLogin: false,
    queueWhilePaused: false,
    echoOutput: true,
    echoAffGot: false,
    echoAffLost: false,
    echoDefGot: false,
    echoDefLost: false,
    echoBalanceGot: false,
    echoBalanceLost: false,
    echoTrackableGot: false,
    echoTrackableLost: false,
    echoPrioritySet: false,
    curingMethod: "Transmutation",
    sipPriority: "Health",
    sipHealthAt: 80,
    sipManaAt: 80,
    mossHealthAt: 80,
    mossManaAt: 80,
    focus: true,
    focusOverHerbs: true,
    tree: true,
    clot: true,
    clotAt: 5,
    insomnia: true,
    fracturesAbove: 30,
    manaAbilitiesAbove: 1,
    clotAbove: 25,
    batch: true,
  },
  state: {
    paused: false,
    queueWhilePaused: false,
    slowMode: false,
    overrideTab: false,
    loadOnLogin: false,
    curingMethod: "Transmutation",
    sipPriority: "Health",
    sipHealthAt: 80,
    sipManaAt: 80,
    mossHealthAt: 80,
    mossManaAt: 80,
    focus: true,
    focusOverHerbs: true,
    tree: true,
    clot: true,
    clotAt: 5,
    insomnia: true,
    fracturesAbove: 30,
    manaAbilitiesAbove: 1,
    clotAbove: 25,
    batch: true,
  },
  char: {
    class: "",
    race: "",
    color: "",
    h: 5000,
    m: 5000,
    e: 20000,
    w: 20000,
    xp: 0,

    maxh: 5000,
    maxm: 5000,
    maxw: 20000,
    maxe: 20000,

    bleed: 0,
    rage: 0,
    kai: 0,
    karma: 0,
    shin: 0,
    stance: "",
    target: "",
    wielded: {
      left: false,
      right: false,
    },
  },
  target: "",
  lifevision: false,

  isPaused() {
    return sys.state.paused;
  },

  isSlowMode() {
    return sys.state.slowMode;
  },

  getClass() {
    return sys.char.class;
  },

  isClass(className) {
    if (className === undefined) {
      return true;
    }

    if (Array.isArray(className)) {
      for (let i = 0; i < className.length; i++) {
        if (sys.checkClass(className[i])) {
          return true;
        }
      }
      return false;
    } else {
      return sys.checkClass(className);
    }
  },

  checkClass(className) {
    return sys.getClass().toLowerCase() === className.toLowerCase();
  },

  setTarget(target) {
    target = target.toProperCase();
    eventStream.raiseEvent("TargetSetEvent", target);

    if (sys.target !== target) {
      sys.target = target;
      eventStream.raiseEvent("TargetChanged", target);
    }
    eventStream.raiseEvent("SystemOutputAdd", "settarget " + target);
    nexusclient.datahandler().set_current_target(target, true);
  },

  isTarget(person) {
    return person === undefined
      ? false
      : sys.target.toLowerCase() === person.toLowerCase();
  },

  pause() {
    sys.state.paused = true;
    eventStream.raiseEvent("SystemPaused");
  },

  unpause() {
    sys.state.paused = false;
    eventStream.raiseEvent("SystemUnpaused");
  },

  pauseToggle() {
    if (sys.isPaused()) {
      sys.unpause();
    } else {
      sys.pause();
    }
  },

  slowOn() {
    sys.state.slowMode = true;
    eventStream.raiseEvent("SystemSlowModeOn");
  },

  slowOff() {
    sys.state.slowMode = false;
    eventStream.raiseEvent("SystemSlowModeOff");
  },

  slowToggle() {
    if (sys.isSlowMode()) {
      sys.slowOff();
    } else {
      sys.slowOn();
    }
  },

  setSystemStatus(status, arg) {
    sys.state[status] = arg;
    eventStream.raiseEvent("SystemStatusSetEvent", {
      status: status,
      arg: arg,
    });
  },

  toggleSystemStatus(status) {
    if (sys.state[status] === "Health") {
      sys.setSystemStatus(status, "Mana");
    } else if (sys.state[status] === "Mana") {
      sys.setSystemStatus(status, "Health");
    } else {
      sys.setSystemStatus(status, !sys.state[status]);
    }
  },

  wielded(side) {
    let res = sys.char.wielded;
    if (side == "left") {
      res = sys.char.wielded.left;
    } else if (side == "right") {
      res = sys.char.wielded.right;
    }

    return res;
  },
};

export const system_loaded = false;

export const sysLogging = {
  locations: "console",
  logEvents: false,
};

export function sysLog(text) {
  if (!sysLogging) { return; }
  
  if (sysLogging.locations === "console") {
    console.log(text);
  }
}

export function sysLoggingToggle(enable) {
  sysLogging.logEvents = enable === "on";
}
