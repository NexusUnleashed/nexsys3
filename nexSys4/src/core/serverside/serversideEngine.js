const normalizeStatusArg = (status, value) => {
  if (typeof value === "boolean") {
    return value ? "on" : "off";
  }
  if (status === "focusOverHerbs") {
    return value ? "first" : "second";
  }
  if (status === "curingMethod") {
    return value === "Concoctions" ? "off" : "on";
  }
  return value;
};

const buildAffCommands = (changes) => {
  const tokens = [];
  changes.forEach(({ id, prio }) => {
    const normalized = prio === 0 ? 26 : prio;
    tokens.push(id, String(normalized));
  });
  if (!tokens.length) {
    return [];
  }
  return [`curing priority ${tokens.join(" ")}`];
};

const buildDefCommands = (changes) => {
  const tokens = [];
  changes.forEach(({ id, prio, preempt }) => {
    if (prio === 0) {
      tokens.push(id, "reset");
      return;
    }
    tokens.push(id, String(prio));
    if (preempt) {
      tokens.push("preempt");
    }
  });
  if (!tokens.length) {
    return [];
  }
  return [`curing priority defence ${tokens.join(" ")}`];
};

export const createServersideEngine = (config) => {
  const statusMap = config.serversideStatusMap;

  const buildDesired = (state, patch) => {
    const desired = {
      status: { ...state.system.state },
      affs: {},
      defs: {},
    };

    Object.values(state.affs).forEach((aff) => {
      if (aff.serverside) {
        desired.affs[aff.id] = aff.prio;
      }
    });

    Object.values(state.defs).forEach((def) => {
      if (def.serverside) {
        desired.defs[def.id] = { prio: def.prio, preempt: def.preempt };
      }
    });

    Object.assign(desired.status, patch.status || {});
    Object.assign(desired.affs, patch.affs || {});
    Object.assign(desired.defs, patch.defs || {});

    return desired;
  };

  const compute = (state, patch = {}) => {
    const snapshot = state.serverside.snapshot;
    const desired = buildDesired(state, patch);
    const statusChanges = [];
    const affChanges = [];
    const defChanges = [];

    Object.keys(desired.status).forEach((key) => {
      if (snapshot.status[key] !== desired.status[key]) {
        statusChanges.push({ key, value: desired.status[key] });
      }
    });

    Object.keys(desired.affs).forEach((id) => {
      const prio = desired.affs[id];
      if (snapshot.affs[id] !== prio) {
        affChanges.push({ id, prio });
      }
    });

    Object.keys(desired.defs).forEach((id) => {
      const next = desired.defs[id];
      const nextPrio = typeof next === "object" ? next.prio : next;
      const nextPreempt = typeof next === "object" ? next.preempt : false;
      const baseDef = snapshot.defs[id];
      const basePrio = typeof baseDef === "object" ? baseDef.prio : baseDef;
      const basePreempt = typeof baseDef === "object" ? baseDef.preempt : false;
      if (basePrio !== nextPrio || basePreempt !== nextPreempt) {
        defChanges.push({ id, prio: nextPrio, preempt: nextPreempt });
      }
    });

    const commands = [];

    statusChanges.forEach(({ key, value }) => {
      const mapped = statusMap[key];
      if (mapped) {
        const arg = normalizeStatusArg(key, value);
        commands.push(`curing ${mapped} ${arg}`);
      }
    });

    if (affChanges.length) {
      commands.push(...buildAffCommands(affChanges));
    }

    if (defChanges.length) {
      commands.push(...buildDefCommands(defChanges));
    }

    return { commands, nextDesired: desired };
  };

  return { compute };
};
