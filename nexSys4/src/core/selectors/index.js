export const getCurrentAffs = (state) =>
  Object.values(state.affs)
    .filter((aff) => aff.have)
    .sort((a, b) => a.prio - b.prio)
    .map((aff) => aff.id);

export const getCurrentDefs = (state) =>
  Object.values(state.defs)
    .filter((def) => def.have)
    .map((def) => def.id);

export const getCurrentBals = (state) =>
  Object.values(state.bals)
    .filter((bal) => bal.have)
    .map((bal) => bal.id);

export const haveAff = (state, id) => Boolean(state.affs[id]?.have);
export const haveDef = (state, id) => Boolean(state.defs[id]?.have);
export const haveBal = (state, id) => Boolean(state.bals[id]?.have);

export const haveAffs = (state, ids) => {
  if (!Array.isArray(ids)) {
    return haveAff(state, ids);
  }
  return ids.every((id) => haveAff(state, id));
};

export const haveAnAff = (state, ids) => {
  if (!Array.isArray(ids)) {
    return haveAff(state, ids);
  }
  return ids.some((id) => haveAff(state, id));
};

export const getMissingDefs = (state) =>
  Object.values(state.defs)
    .filter((def) => !def.have && !def.serverside && def.prio > 0)
    .sort((a, b) => a.prio - b.prio)
    .map((def) => def.id);
