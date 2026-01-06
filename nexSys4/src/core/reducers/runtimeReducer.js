import { EVENT_TYPES } from "../events/eventTypes";

const toArray = (payload) => {
  if (!payload) {
    return [];
  }
  return Array.isArray(payload) ? payload : [payload];
};

export const runtimeReducer = (runtime, event) => {
  switch (event.type) {
    case EVENT_TYPES.AFF_LIST:
    case EVENT_TYPES.AFF_GOT:
    case EVENT_TYPES.AFF_LOST:
    case EVENT_TYPES.AFF_COUNT_SET:
    case EVENT_TYPES.AFF_COUNT_ADD:
    case EVENT_TYPES.AFF_COUNT_SUB:
      return {
        ...runtime,
        nexsysPendingOutput: true,
        precachePendingOutput: true,
        serversidePendingOutput: true,
      };
    case EVENT_TYPES.DEF_LIST:
    case EVENT_TYPES.DEF_GOT:
    case EVENT_TYPES.DEF_LOST:
      return {
        ...runtime,
        nexsysPendingOutput: true,
        precachePendingOutput: true,
        serversidePendingOutput: true,
      };
    case EVENT_TYPES.BAL_GOT:
    case EVENT_TYPES.BAL_LOST:
      return {
        ...runtime,
        nexsysPendingOutput: true,
        serversidePendingOutput: true,
      };
    case EVENT_TYPES.AFF_PRIO_SET:
    case EVENT_TYPES.DEF_PRIO_SET:
      return {
        ...runtime,
        nexsysPendingOutput: true,
        serversidePendingOutput: true,
      };
    case EVENT_TYPES.CACHE_COUNT_ADD:
    case EVENT_TYPES.CACHE_COUNT_SUB:
    case EVENT_TYPES.CACHE_RIFT_SET:
      return { ...runtime, precachePendingOutput: true };
    case EVENT_TYPES.SYSTEM_STATUS_SET:
      return { ...runtime, serversidePendingOutput: true };
    case EVENT_TYPES.OUTPUT_ADD_NEXSYS_COMMANDS:
      return {
        ...runtime,
        pendingNexsysCommands: runtime.pendingNexsysCommands.concat(
          toArray(event.payload)
        ),
        nexsysPendingOutput: true,
      };
    case EVENT_TYPES.OUTPUT_SENT_NEXSYS:
      return {
        ...runtime,
        nexsysInProgress: true,
        nexsysPending: false,
        nexsysPendingOutput: false,
        pendingNexsysCommands: [],
        nexsysPlanId: event.payload?.planId ?? runtime.nexsysPlanId,
      };
    case EVENT_TYPES.OUTPUT_SENT_PRECACHE:
      return {
        ...runtime,
        precacheInProgress: true,
        precachePending: false,
        precachePendingOutput: false,
        precachePlanId: event.payload?.planId ?? runtime.precachePlanId,
      };
    case EVENT_TYPES.OUTPUT_BLOCKED_NEXSYS:
      return { ...runtime, nexsysPending: true };
    case EVENT_TYPES.OUTPUT_BLOCKED_PRECACHE:
      return { ...runtime, precachePending: true };
    case EVENT_TYPES.OUTPUT_ACK_NEXSYS:
      return { ...runtime, nexsysInProgress: false };
    case EVENT_TYPES.OUTPUT_ACK_PRECACHE:
      return { ...runtime, precacheInProgress: false };
    case EVENT_TYPES.OUTPUT_CLEAR_PENDING_NEXSYS:
      return { ...runtime, nexsysPendingOutput: false };
    case EVENT_TYPES.OUTPUT_CLEAR_PENDING_PRECACHE:
      return { ...runtime, precachePendingOutput: false };
    case EVENT_TYPES.OUTPUT_CLEAR_PENDING_SERVERSIDE:
      return { ...runtime, serversidePendingOutput: false };
    default:
      return runtime;
  }
};
