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

const isRule = (rule) =>
  rule && typeof rule.when === "function" && typeof rule.then === "function";

export const createRuleEngine = (initialRules = []) => {
  let idCounter = 0;
  const rules = [];

  const normalizeId = (rule) => {
    if (rule.id) {
      return String(rule.id);
    }
    if (rule.name) {
      return String(rule.name);
    }
    idCounter += 1;
    return `rule-${idCounter}`;
  };

  const addRule = (rule) => {
    if (!isRule(rule)) {
      return null;
    }
    const id = normalizeId(rule);
    const entry = { ...rule, id };
    const index = rules.findIndex((item) => item.id === id);
    if (index >= 0) {
      rules[index] = entry;
    } else {
      rules.push(entry);
    }
    return id;
  };

  const removeRule = (idOrRule) => {
    const id =
      typeof idOrRule === "string"
        ? idOrRule
        : idOrRule?.id ?? idOrRule?.name;
    if (!id) {
      return false;
    }
    const index = rules.findIndex((item) => item.id === id);
    if (index < 0) {
      return false;
    }
    rules.splice(index, 1);
    return true;
  };

  const hasRule = (idOrRule) => {
    const id =
      typeof idOrRule === "string"
        ? idOrRule
        : idOrRule?.id ?? idOrRule?.name;
    if (!id) {
      return false;
    }
    return rules.some((item) => item.id === id);
  };

  const setRules = (nextRules) => {
    rules.length = 0;
    (nextRules || []).forEach((rule) => addRule(rule));
  };

  const clearRules = () => {
    rules.length = 0;
  };

  const getRules = () => rules.slice();

  const enableRule = (idOrRule) => {
    const id =
      typeof idOrRule === "string"
        ? idOrRule
        : idOrRule?.id ?? idOrRule?.name;
    if (!id) {
      return false;
    }
    const target = rules.find((rule) => rule.id === id);
    if (!target) {
      return false;
    }
    target.enabled = true;
    return true;
  };

  const disableRule = (idOrRule) => {
    const id =
      typeof idOrRule === "string"
        ? idOrRule
        : idOrRule?.id ?? idOrRule?.name;
    if (!id) {
      return false;
    }
    const target = rules.find((rule) => rule.id === id);
    if (!target) {
      return false;
    }
    target.enabled = false;
    return true;
  };

  const evaluate = (state) => {
    const patch = createPriorityPatch();
    rules.forEach((rule) => {
      if (rule.enabled === false) {
        return;
      }
      if (rule.when(state)) {
        rule.then(patch, state);
      }
    });
    return patch;
  };

  setRules(initialRules);

  return {
    addRule,
    removeRule,
    hasRule,
    setRules,
    clearRules,
    getRules,
    enableRule,
    disableRule,
    evaluate,
  };
};
