/* global eventStream, nexusclient */

/* This function is strictly for localhost simulations */
if (typeof nexusclient === "undefined") {
  window.nexusclient = {
    variables() {
      return {
        get() {
          return false;
        },
      };
    },
  };
}

export const sys = {
  settings: {
    sep: nexusclient.variables().get('nexSysSettings')?.commandSeparator ?? false,
    customPrompt: false,
    echoAffGot: false,
    echoAffLost: false,
    echoDefGot: true,
    echoDefLost: true,
    echoBalanceGot: true,
    echoBalanceLost: false,
    echoTrackableGot: true,
    echoTrackableLost: true,
    echoPrioritySet: true,
  },
  state: {
    paused: false,
    slowMode: false,
    sep: nexusclient.variables().get('nexSysSettings')?.commandSeparator ?? false,
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
};

export const system_loaded = false;

export const sysLogging = {
  locations: "console",
  logEvents: false,
};

export function sysLog(text) {
  if (sysLogging.locations === "console") {
    console.log(text);
  }
}

export function sysLoggingToggle(enable) {
  sysLogging.logEvents = enable === "on";
}
