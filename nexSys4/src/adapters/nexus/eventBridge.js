const SOURCE = "nexSys4";

const hasEventStream = (evt) => typeof evt?.raiseEvent === "function";

const toPayload = (entry) => {
  if (!entry) {
    return entry;
  }
  if (typeof entry === "object") {
    return { ...entry, name: entry.id };
  }
  return { id: entry, name: entry };
};

const emitEvent = (evt, name, payload) => {
  if (!hasEventStream(evt)) {
    return;
  }
  evt.raiseEvent(name, payload);
};

const emitAffEvents = (evt, prevAffs, nextAffs) => {
  Object.keys(nextAffs).forEach((id) => {
    const prev = prevAffs[id];
    const next = nextAffs[id];
    if (!prev || !next) {
      return;
    }

    if (prev.have !== next.have) {
      const payload = toPayload(next);
      if (next.have) {
        emitEvent(evt, "AffGot", payload);
        emitEvent(evt, `${id}GotAffEvent`, id);
      } else {
        emitEvent(evt, "AffLost", payload);
        emitEvent(evt, `${id}LostAffEvent`, id);
      }
    }

    const prevCount = prev.count ?? 0;
    const nextCount = next.count ?? 0;
    if (prevCount !== nextCount) {
      const delta = nextCount - prevCount;
      emitEvent(evt, `${id}AffCountSetEvent`, nextCount);
      if (delta > 0) {
        emitEvent(evt, `${id}AffCountAddEvent`, delta);
      } else if (delta < 0) {
        emitEvent(evt, `${id}AffCountSubtractEvent`, Math.abs(delta));
      }
    }

    if (prev.prio !== next.prio) {
      const payload = { ...toPayload(next), __source: SOURCE };
      emitEvent(evt, "AffPrioritySetEvent", payload);
      emitEvent(evt, "PrioritySetEvent", { ...payload, category: "aff" });
    }
  });
};

const emitDefEvents = (evt, prevDefs, nextDefs) => {
  Object.keys(nextDefs).forEach((id) => {
    const prev = prevDefs[id];
    const next = nextDefs[id];
    if (!prev || !next) {
      return;
    }

    if (prev.have !== next.have) {
      const payload = toPayload(next);
      if (next.have) {
        emitEvent(evt, "DefGot", payload);
        emitEvent(evt, `${id}GotDefEvent`, id);
      } else {
        emitEvent(evt, "DefLost", payload);
        emitEvent(evt, `${id}LostDefEvent`, id);
      }
    }

    if (prev.prio !== next.prio) {
      const payload = { ...toPayload(next), __source: SOURCE };
      emitEvent(evt, "DefPrioritySetEvent", payload);
      emitEvent(evt, "PrioritySetEvent", { ...payload, category: "def" });
    }
  });
};

const emitBalEvents = (evt, prevBals, nextBals) => {
  let balanceRecovered = false;
  const prevBalance = prevBals.balance;
  const prevEquilibrium = prevBals.equilibrium;
  const nextBalance = nextBals.balance;
  const nextEquilibrium = nextBals.equilibrium;

  const prevHadBoth = Boolean(prevBalance?.have && prevEquilibrium?.have);
  const nextHasBoth = Boolean(nextBalance?.have && nextEquilibrium?.have);

  Object.keys(nextBals).forEach((id) => {
    const prev = prevBals[id];
    const next = nextBals[id];
    if (!prev || !next) {
      return;
    }

    if (prev.have !== next.have) {
      const payload = toPayload(next);
      if (next.have) {
        emitEvent(evt, "BalanceGot", payload);
        emitEvent(evt, `${id}GotBalEvent`, id);
      } else {
        emitEvent(evt, "BalanceLost", payload);
        emitEvent(evt, `${id}LostBalEvent`, id);
      }

      if (next.have && (id === "balance" || id === "equilibrium")) {
        balanceRecovered = true;
      }
    }
  });

  if (balanceRecovered && nextHasBoth && !prevHadBoth) {
    emitEvent(evt, "eqBalRecoveredEvent");
  }
};

const emitCacheEvents = (evt, prevCaches, nextCaches) => {
  Object.keys(nextCaches).forEach((id) => {
    const prev = prevCaches[id];
    const next = nextCaches[id];
    if (!prev || !next) {
      return;
    }

    const prevCount = prev.count ?? 0;
    const nextCount = next.count ?? 0;
    if (prevCount !== nextCount) {
      const delta = nextCount - prevCount;
      if (delta > 0) {
        emitEvent(evt, `${id}CacheCountAddEvent`, delta);
      } else if (delta < 0) {
        emitEvent(evt, `${id}CacheCountSubtractEvent`, Math.abs(delta));
      }
    }

    if (prev.rift !== next.rift) {
      emitEvent(evt, `${id}RiftSetEvent`, next.rift);
      emitEvent(evt, "RiftSetEvent", toPayload(next));
    }
  });
};

const emitSystemEvents = (evt, prevSystem, nextSystem) => {
  const prevState = prevSystem.state;
  const nextState = nextSystem.state;

  if (prevState.paused !== nextState.paused) {
    emitEvent(
      evt,
      nextState.paused ? "SystemPaused" : "SystemUnpaused",
      { __source: SOURCE }
    );
  }

  if (prevState.slowMode !== nextState.slowMode) {
    emitEvent(
      evt,
      nextState.slowMode ? "SystemSlowModeOn" : "SystemSlowModeOff",
      { __source: SOURCE }
    );
  }

  Object.keys(nextState).forEach((key) => {
    if (key === "paused" || key === "slowMode") {
      return;
    }
    if (prevState[key] !== nextState[key]) {
      emitEvent(evt, "SystemStatusSetEvent", {
        status: key,
        arg: nextState[key],
        __source: SOURCE,
      });
    }
  });

  if (prevSystem.target !== nextSystem.target) {
    emitEvent(evt, "TargetSetEvent", nextSystem.target);
    emitEvent(evt, "TargetChanged", nextSystem.target);
  }

  const prevChar = prevSystem.char;
  const nextChar = nextSystem.char;
  const vitalsChanged =
    prevChar.h !== nextChar.h ||
    prevChar.m !== nextChar.m ||
    prevChar.e !== nextChar.e ||
    prevChar.w !== nextChar.w ||
    prevChar.maxh !== nextChar.maxh ||
    prevChar.maxm !== nextChar.maxm ||
    prevChar.maxe !== nextChar.maxe ||
    prevChar.maxw !== nextChar.maxw ||
    prevChar.xp !== nextChar.xp ||
    prevChar.bleed !== nextChar.bleed ||
    prevChar.rage !== nextChar.rage;

  if (prevChar.h !== nextChar.h) {
    emitEvent(evt, "HealthUpdated", {
      max: nextChar.maxh,
      current: nextChar.h,
      diff: nextChar.h - prevChar.h,
    });
  }

  if (prevChar.m !== nextChar.m) {
    emitEvent(evt, "ManaUpdated", {
      max: nextChar.maxm,
      current: nextChar.m,
      diff: nextChar.m - prevChar.m,
    });
  }

  if (prevChar.maxh !== nextChar.maxh) {
    emitEvent(evt, "MaxHealthUpdated", {
      max: nextChar.maxh,
      current: nextChar.h,
      diff: nextChar.maxh - prevChar.maxh,
    });
  }

  if (prevChar.maxm !== nextChar.maxm) {
    emitEvent(evt, "MaxManaUpdated", {
      max: nextChar.maxm,
      current: nextChar.m,
      diff: nextChar.maxm - prevChar.maxm,
    });
  }

  if (prevChar.rage !== nextChar.rage) {
    emitEvent(evt, "RageUpdated", {
      max: nextChar.rage,
      current: nextChar.rage,
      diff: nextChar.rage - prevChar.rage,
    });
  }

  if (prevChar.h > 0 && nextChar.h === 0) {
    emitEvent(evt, "deathGotAffEvent");
    emitEvent(evt, "deathEvent");
  } else if (prevChar.h === 0 && nextChar.h > 0) {
    emitEvent(evt, "deathLostAffEvent");
    emitEvent(evt, "aliveEvent");
  }

  if (vitalsChanged) {
    emitEvent(evt, "SystemCharVitalsUpdated", nextChar);
  }

  const statusChanged =
    prevChar.class !== nextChar.class ||
    prevChar.race !== nextChar.race ||
    prevChar.target !== nextChar.target ||
    prevChar.xp !== nextChar.xp ||
    prevChar.gold !== nextChar.gold;

  if (prevChar.target !== nextChar.target) {
    emitEvent(evt, "TargetChanged", nextChar.target);
    emitEvent(evt, "GameTargetChanged", {
      old: prevChar.target,
      new: nextChar.target,
    });
  }

  if (prevChar.class !== nextChar.class) {
    emitEvent(evt, "ClassChanged", {
      old: prevChar.class,
      new: nextChar.class,
    });
  }

  if (statusChanged) {
    emitEvent(evt, "SystemCharStatusUpdated", nextChar);
  }
};

export const createEventBridge = ({ core, eventStream }) => {
  const evt = eventStream || globalThis.eventStream;
  if (!hasEventStream(evt)) {
    return { stop: () => {} };
  }

  let prevState = core.getState();

  const handleChange = (nextState) => {
    emitAffEvents(evt, prevState.affs, nextState.affs);
    emitDefEvents(evt, prevState.defs, nextState.defs);
    emitBalEvents(evt, prevState.bals, nextState.bals);
    emitCacheEvents(evt, prevState.caches, nextState.caches);
    emitSystemEvents(evt, prevState.system, nextState.system);
    prevState = nextState;
  };

  const unsubscribe = core.subscribe(handleChange);

  return { stop: unsubscribe };
};
