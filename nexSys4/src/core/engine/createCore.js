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

  const requestServersideOutput = (reason) => {
    const state = getState();
    if (!state.runtime.serversidePendingOutput && reason !== "force") {
      return { raw: [], commands: [] };
    }
    if (state.system.state.paused) {
      return { raw: [], commands: [] };
    }
    const patch = ruleEngine.evaluate(state);
    const serverside = serversideEngine.compute(state, patch);
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
