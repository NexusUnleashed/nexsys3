const setAff = (patch, state, id, prio) => {
  if (!state.affs[id]) {
    return;
  }
  patch.setAff(id, prio);
};

const resetAff = (patch, state, id) => {
  if (!state.affs[id]) {
    return;
  }
  patch.setAff(id, state.affs[id].defaultPrio ?? 0);
};

const setAffList = (patch, state, entries) => {
  entries.forEach(([id, prio]) => setAff(patch, state, id, prio));
};

const resetAffList = (patch, state, ids) => {
  ids.forEach((id) => resetAff(patch, state, id));
};

const aeonSwapRule = {
  id: "aeon-swap",
  when: () => true,
  then: (patch, state) => {
    const inAeon = Boolean(state.affs.aeon?.have);
    const settings = state.system.state;

    if (inAeon) {
      patch.setStatus("sipHealthAt", 30);
      patch.setStatus("sipManaAt", 10);
      patch.setStatus("mossHealthAt", 0);
      patch.setStatus("mossManaAt", 0);
      patch.setStatus("batch", false);
      patch.setStatus("clotAt", 5000);

      setAff(patch, state, "asthma", 3);
      setAff(patch, state, "weariness", 4);
      setAff(patch, state, "anorexia", 5);
      setAff(patch, state, "impatience", 7);
      setAff(patch, state, "paralysis", 8);
    } else {
      patch.setStatus("sipHealthAt", settings.sipHealthAt);
      patch.setStatus("sipManaAt", settings.sipManaAt);
      patch.setStatus("mossHealthAt", settings.mossHealthAt);
      patch.setStatus("mossManaAt", settings.mossManaAt);
      patch.setStatus("batch", settings.batch);
      patch.setStatus("clotAt", settings.clotAt);

      resetAff(patch, state, "asthma");
      resetAff(patch, state, "weariness");
      resetAff(patch, state, "anorexia");
      resetAff(patch, state, "impatience");
      resetAff(patch, state, "paralysis");
    }
  },
};

const focusBalLostRule = {
  id: "focus-bal-lost",
  when: (state) => state.bals.focus?.have === false,
  then: (patch, state) => {
    setAffList(patch, state, [
      ["stupidity", 9],
      ["recklessness", 12],
      ["dizziness", 14],
      ["shyness", 14],
    ]);
  },
};

const focusBalGotRule = {
  id: "focus-bal-got",
  when: (state) => state.bals.focus?.have === true,
  then: (patch, state) => {
    resetAffList(patch, state, [
      "stupidity",
      "recklessness",
      "dizziness",
      "shyness",
    ]);
  },
};

const cadmusFocusRule = {
  id: "cadmus-focus",
  when: () => true,
  then: (patch, state) => {
    if (state.affs.cadmuscurse?.have) {
      patch.setStatus("focus", false);
    } else {
      patch.setStatus("focus", state.system.state.focus);
    }
  },
};

export const defaultRules = [
  aeonSwapRule,
  focusBalLostRule,
  focusBalGotRule,
  cadmusFocusRule,
];
