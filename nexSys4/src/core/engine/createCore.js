import { createStore } from "../store/createStore";
import { createInitialState } from "../state/initialState";
import { rootReducer } from "../reducers";
import { createRuleEngine } from "../rules/createRuleEngine";
import { createServersideEngine } from "../serverside/serversideEngine";
import { createOutputPlanner } from "../planner/outputPlanner";
import { planAllQueues, planQueueSend } from "../queues/queuePlanner";
import { EVENT_TYPES } from "../events/eventTypes";

export const createCore = ({ config, tables, rules, time }) => {
  const initialState = createInitialState({ config, tables, time });
  const store = createStore(rootReducer, initialState);
  const ruleEngine = createRuleEngine(rules);
  const serversideEngine = createServersideEngine(config);
  const outputPlanner = createOutputPlanner(config);

  const getState = store.getState;

  const applyRulePatch = (patch, state) => {
    let changed = false;
    const statusPatch = patch?.status || {};
    Object.keys(statusPatch).forEach((key) => {
      const value = statusPatch[key];
      if (typeof value === "undefined") {
        return;
      }
      if (state.system.state[key] !== value) {
        store.dispatch({
          type: EVENT_TYPES.SYSTEM_STATUS_SET,
          payload: { status: key, arg: value },
        });
        changed = true;
      }
    });

    const affPatch = patch?.affs || {};
    Object.keys(affPatch).forEach((id) => {
      const prio = affPatch[id];
      const aff = state.affs[id];
      if (!aff || typeof prio !== "number") {
        return;
      }
      if (aff.prio !== prio) {
        store.dispatch({
          type: EVENT_TYPES.AFF_PRIO_SET,
          payload: { id, prio },
        });
        changed = true;
      }
    });

    const defPatch = patch?.defs || {};
    Object.keys(defPatch).forEach((id) => {
      const entry = defPatch[id];
      const def = state.defs[id];
      const prio = typeof entry === "object" ? entry.prio : entry;
      if (!def || typeof prio !== "number") {
        return;
      }
      const preempt =
        typeof entry === "object" ? entry.preempt : undefined;
      const changedPrio = def.prio !== prio;
      const changedPreempt =
        typeof preempt === "boolean" && def.preempt !== preempt;
      if (!changedPrio && !changedPreempt) {
        return;
      }
      const payload = { id, prio };
      if (typeof preempt === "boolean") {
        payload.preempt = preempt;
      }
      store.dispatch({ type: EVENT_TYPES.DEF_PRIO_SET, payload });
      changed = true;
    });

    return changed;
  };

  const applyRules = (reason) => {
    const state = getState();
    const patch = ruleEngine.evaluate(state);
    const changed = applyRulePatch(patch, state);
    return { patch, changed, reason };
  };

  const requestServersideOutput = (reason) => {
    const state = getState();
    if (!state.runtime.serversidePendingOutput && reason !== "force") {
      return { raw: [], commands: [] };
    }
    if (state.system.state.paused) {
      return { raw: [], commands: [] };
    }
    const serverside = serversideEngine.compute(state);
    const plan = outputPlanner.planServerside(state, serverside);
    if (plan.raw.length) {
      store.dispatch({
        type: EVENT_TYPES.SERVERSIDE_DESIRED_UPDATE,
        payload: serverside.nextDesired,
      });
      store.dispatch({ type: EVENT_TYPES.OUTPUT_CLEAR_PENDING_SERVERSIDE });
    } else {
      store.dispatch({ type: EVENT_TYPES.OUTPUT_CLEAR_PENDING_SERVERSIDE });
    }
    return plan;
  };

  const requestPrecacheOutput = (reason) => {
    const state = getState();
    if (
      !state.runtime.precachePendingOutput &&
      !state.runtime.precachePending &&
      reason !== "force"
    ) {
      return { raw: [], commands: [], planId: 0 };
    }
    if (
      state.system.state.paused ||
      state.system.state.slowMode ||
      state.affs.aeon?.have ||
      state.runtime.precacheInProgress
    ) {
      store.dispatch({
        type: EVENT_TYPES.OUTPUT_BLOCKED_PRECACHE,
        payload: reason,
      });
      return { raw: [], commands: [], planId: 0 };
    }

    const plan = outputPlanner.planPrecache(state);
    if (plan.raw.length) {
      store.dispatch({
        type: EVENT_TYPES.OUTPUT_SENT_PRECACHE,
        payload: { planId: plan.planId },
      });
    } else {
      store.dispatch({ type: EVENT_TYPES.OUTPUT_CLEAR_PENDING_PRECACHE });
    }
    return plan;
  };

  const requestNexSysOutput = (reason) => {
    const state = getState();
    if (
      !state.runtime.nexsysPendingOutput &&
      !state.runtime.nexsysPending &&
      reason !== "force"
    ) {
      return { raw: [], commands: [], planId: 0 };
    }
    if (
      state.system.state.paused ||
      state.system.state.slowMode ||
      state.affs.aeon?.have ||
      state.runtime.nexsysInProgress
    ) {
      store.dispatch({
        type: EVENT_TYPES.OUTPUT_BLOCKED_NEXSYS,
        payload: reason,
      });
      return { raw: [], commands: [], planId: 0 };
    }

    const plan = outputPlanner.planNexSys(state);
    if (plan.raw.length) {
      store.dispatch({
        type: EVENT_TYPES.OUTPUT_SENT_NEXSYS,
        payload: { planId: plan.planId },
      });
    } else {
      store.dispatch({ type: EVENT_TYPES.OUTPUT_CLEAR_PENDING_NEXSYS });
    }
    return plan;
  };

  const onPrecacheAck = () => {
    store.dispatch({ type: EVENT_TYPES.OUTPUT_ACK_PRECACHE });
    const state = getState();
    if (state.runtime.precachePending) {
      return requestPrecacheOutput("pending");
    }
    return { raw: [], commands: [], planId: 0 };
  };

  const onNexSysAck = () => {
    store.dispatch({ type: EVENT_TYPES.OUTPUT_ACK_NEXSYS });
    const state = getState();
    if (state.runtime.nexsysPending) {
      return requestNexSysOutput("pending");
    }
    return { raw: [], commands: [], planId: 0 };
  };

  const flushPending = (reason) => {
    requestServersideOutput(reason);
    const state = getState();
    if (state.runtime.precachePending) {
      requestPrecacheOutput(reason);
    }
    if (state.runtime.nexsysPending) {
      requestNexSysOutput(reason);
    }
  };

  return {
    dispatch: store.dispatch,
    getState,
    subscribe: store.subscribe,
    applyRules,
    addRule: ruleEngine.addRule,
    removeRule: ruleEngine.removeRule,
    hasRule: ruleEngine.hasRule,
    setRules: ruleEngine.setRules,
    clearRules: ruleEngine.clearRules,
    getRules: ruleEngine.getRules,
    enableRule: ruleEngine.enableRule,
    disableRule: ruleEngine.disableRule,
    requestServersideOutput,
    requestPrecacheOutput,
    requestNexSysOutput,
    onPrecacheAck,
    onNexSysAck,
    flushPending,
    planQueueSend: (queueId) => planQueueSend(getState(), config, queueId),
    planAllQueues: () => planAllQueues(getState(), config),
  };
};
