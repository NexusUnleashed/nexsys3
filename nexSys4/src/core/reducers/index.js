import { systemReducer } from "./systemReducer";
import { affReducer } from "./affReducer";
import { defReducer } from "./defReducer";
import { balReducer } from "./balReducer";
import { cacheReducer } from "./cacheReducer";
import { queueReducer } from "./queueReducer";
import { serversideReducer } from "./serversideReducer";
import { runtimeReducer } from "./runtimeReducer";

export const rootReducer = (state, event) => {
  return {
    ...state,
    system: systemReducer(state.system, event),
    affs: affReducer(state.affs, event),
    defs: defReducer(state.defs, event),
    bals: balReducer(state.bals, event),
    caches: cacheReducer(state.caches, event),
    queues: queueReducer(state.queues, event),
    serverside: serversideReducer(state.serverside, event),
    runtime: runtimeReducer(state.runtime, event),
  };
};
