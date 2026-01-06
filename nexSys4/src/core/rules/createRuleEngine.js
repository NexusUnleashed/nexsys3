const createPriorityPatch = () => {
  const patch = {
    status: {},
    affs: {},
    defs: {},
    setStatus(key, value) {
      patch.status[key] = value;
    },
    setAff(id, prio) {
      patch.affs[id] = prio;
    },
    setDef(id, prio, options = {}) {
      patch.defs[id] = { prio, ...options };
    },
  };
  return patch;
};

export const createRuleEngine = (rules = []) => {
  const evaluate = (state) => {
    const patch = createPriorityPatch();
    rules.forEach((rule) => {
      if (rule.when(state)) {
        rule.then(patch, state);
      }
    });
    return patch;
  };

  return { evaluate };
};
