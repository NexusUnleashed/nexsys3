import { EVENT_TYPES } from "../../core/events/eventTypes";
import { chunkCommands } from "../../core/planner/chunking";
import { createEventBridge } from "./eventBridge";
import { herb_name_to_herb } from "../../tables/cacheTables";

const parseAffName = (raw) => {
  if (!raw) {
    return { id: "", count: null };
  }
  const match = raw.match(/^(.*?)\s*\((\d+)\)$/);
  if (match) {
    return { id: match[1].trim(), count: parseInt(match[2], 10) };
  }
  return { id: raw.trim(), count: null };
};

const normalizeDefName = (raw) => {
  if (!raw) {
    return "";
  }
  return raw.replace("(", "").replace(")", "").trim();
};

const parseAffList = (list) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((entry) => parseAffName(entry.name || entry))
    .filter((item) => item.id);
};

const parseDefList = (list) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((entry) => normalizeDefName(entry.name || entry))
    .filter((id) => id);
};

const parseCacheItemName = (rawName) => {
  const name = String(rawName || "").trim();
  if (!name) {
    return { name: "", amountFromName: null };
  }
  const match = name.match(/^(\d+)\s+(.+)/);
  if (match) {
    return { name: match[2].trim(), amountFromName: parseInt(match[1], 10) };
  }
  return { name, amountFromName: null };
};

const parseCacheItemAmount = (item, amountFromName) => {
  const amount =
    item?.amount ?? item?.qty ?? item?.count ?? item?.stack ?? item?.quantity;
  const parsed = parseInt(amount, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  if (typeof amountFromName === "number" && amountFromName > 0) {
    return amountFromName;
  }
  return 1;
};

const parseCacheItem = (item, location) => {
  if (location && location !== "inv") {
    return null;
  }
  if (!item || typeof item !== "object") {
    return null;
  }
  if (item.icon !== "notes-medical") {
    return null;
  }
  const { name, amountFromName } = parseCacheItemName(item.name);
  if (!name) {
    return null;
  }
  const id = herb_name_to_herb[name];
  if (!id) {
    return null;
  }
  const amount = parseCacheItemAmount(item, amountFromName);
  return { id, amount };
};

export const createNexusAdapter = ({ core, config, eventStream, nexusclient }) => {
  const evt = eventStream || globalThis.eventStream;
  const client = nexusclient || globalThis.nexusclient;
  const handlers = [];
  let bridgeStop = null;
  let pendingTimerId = null;
  let pendingUnsubscribe = null;

  const isBridgeEvent = (payload) => payload?.__source === "nexSys4";

  const on = (name, fn) => {
    if (!evt?.registerEvent) {
      return;
    }
    const id = `nexSys4:${name}`;
    evt.registerEvent(name, fn, { id });
    handlers.push({ name, id, fn });
  };

  const offAll = () => {
    if (!evt?.removeListener) {
      return;
    }
    handlers.forEach((handler) => evt.removeListener(handler.name, handler.id));
  };

  const sendPlan = (plan) => {
    send(plan?.commands, {
      allowWhilePaused: true,
      allowWhileSlow: true,
      prechunked: true,
    });
  };

  const sendImmediate = (commands) => {
    send(commands, {
      allowWhilePaused: true,
      allowWhileSlow: true,
      prechunked: true,
    });
  };

  const normalizeCommands = (input) => {
    if (!input) {
      return [];
    }
    if (Array.isArray(input)) {
      return input.filter(Boolean).map((cmd) => String(cmd));
    }
    if (typeof input === "string") {
      return [input];
    }
    return [String(input)];
  };

  const send = (commands, options = {}) => {
    const list = normalizeCommands(commands);
    if (!list.length) {
      return;
    }
    const state = core.getState();
    if (state.system.state.paused && !options.allowWhilePaused) {
      return;
    }
    if (state.system.state.slowMode && !options.allowWhileSlow) {
      return;
    }
    const shouldChunk = Array.isArray(commands) && !options.prechunked;
    const sep = state.system.settings.sep || config.commandSeparator;
    const toSend = shouldChunk
      ? chunkCommands(list, sep, config.outputChunkSize)
      : list;
    if (!client?.send_commands) {
      toSend.forEach((cmd) => console.log(cmd));
      return;
    }
    toSend.forEach((cmd) => client.send_commands(cmd));
    if (evt?.raiseEvent) {
      toSend.forEach((cmd) => evt.raiseEvent("SendCommandEvent", cmd));
    }
  };

  const sendQueuePlan = (plan) => {
    if (!plan?.commands?.length) {
      return;
    }
    const state = core.getState();
    if (state.system.state.paused || state.system.state.slowMode) {
      return;
    }
    if (plan.queuesToClear?.length) {
      plan.queuesToClear.forEach((queueId) => {
        core.dispatch({
          type: EVENT_TYPES.QUEUE_CLEAR,
          payload: { id: queueId },
        });
      });
    }
    sendImmediate(plan.commands);
    core.dispatch({ type: EVENT_TYPES.QUEUE_SENT, payload: { id: plan.queueId } });
  };

  const start = () => {
    if (!bridgeStop) {
      bridgeStop = createEventBridge({ core, eventStream: evt }).stop;
    }
    const stripAck = (raw, ackEvent) => {
      if (!ackEvent) {
        return raw || [];
      }
      const ackCmd = `echo SystemEvent ${ackEvent}`;
      return (raw || []).filter((cmd) => cmd !== ackCmd);
    };
    const emitOutputSent = (output) => {
      if (evt?.raiseEvent && output?.length) {
        evt.raiseEvent("OutputSentEvent", output);
      }
    };
    const triggerServerside = (reason) => core.requestServersideOutput(reason);
    const triggerPrecache = (reason) => core.requestPrecacheOutput(reason);
    const triggerNexSys = (reason) => core.requestNexSysOutput(reason);
    const flushOutput = (reason) => {
      if (reason === "prompt" || reason === "force") {
        core.applyRules(reason);
      }
      const serversidePlan = triggerServerside(reason);
      const precachePlan = triggerPrecache(reason);
      const nexsysPlan = triggerNexSys(reason);
      const output = [];
      if (serversidePlan?.raw?.length) {
        output.push(...serversidePlan.raw);
      }
      if (precachePlan?.raw?.length) {
        output.push(...stripAck(precachePlan.raw, config.precacheAckEvent));
      }
      if (nexsysPlan?.raw?.length) {
        output.push(...stripAck(nexsysPlan.raw, config.nexsysAckEvent));
      }
      emitOutputSent(output);
      sendPlan(serversidePlan);
      sendPlan(precachePlan);
      sendPlan(nexsysPlan);
    };
    const clearPendingTimer = () => {
      if (pendingTimerId) {
        clearTimeout(pendingTimerId);
        pendingTimerId = null;
      }
    };
    const schedulePendingTimer = () => {
      if (pendingTimerId) {
        return;
      }
      const delay = config.outputDebounceMs ?? 150;
      pendingTimerId = setTimeout(() => {
        pendingTimerId = null;
        const state = core.getState();
        if (
          state.runtime.serversidePendingOutput ||
          state.runtime.precachePendingOutput ||
          state.runtime.nexsysPendingOutput
        ) {
          flushOutput("timer");
        }
      }, delay);
    };
    const updatePendingTimer = (state) => {
      const runtime = state.runtime;
      const hasPending =
        runtime.serversidePendingOutput ||
        runtime.precachePendingOutput ||
        runtime.nexsysPendingOutput;
      if (!hasPending) {
        clearPendingTimer();
        return;
      }
      schedulePendingTimer();
    };

    if (!pendingUnsubscribe) {
      pendingUnsubscribe = core.subscribe((state) => updatePendingTimer(state));
      updatePendingTimer(core.getState());
    }

    on("PromptEvent", () => {
      clearPendingTimer();
      flushOutput("prompt");
    });
    on(config.nexsysAckEvent, () => {
      const plan = core.onNexSysAck();
      emitOutputSent(stripAck(plan?.raw, config.nexsysAckEvent));
      sendPlan(plan);
    });
    on(config.precacheAckEvent, () => {
      const plan = core.onPrecacheAck();
      emitOutputSent(stripAck(plan?.raw, config.precacheAckEvent));
      sendPlan(plan);
    });

    on("ForcePopulateEvent", () => {
      clearPendingTimer();
      flushOutput("force");
    });

    on("Char.Vitals", (payload) =>
      core.dispatch({ type: EVENT_TYPES.CHAR_VITALS, payload })
    );
    on("Char.Status", (payload) =>
      core.dispatch({ type: EVENT_TYPES.CHAR_STATUS, payload })
    );

    on("Char.Afflictions.List", (payload) =>
      core.dispatch({
        type: EVENT_TYPES.AFF_LIST,
        payload: parseAffList(payload),
      })
    );
    on("Char.Afflictions.Add", (payload) => {
      const { id, count } = parseAffName(payload.name || payload);
      if (!id) {
        return;
      }
      core.dispatch({ type: EVENT_TYPES.AFF_GOT, payload: id });
      if (typeof count === "number") {
        core.dispatch({
          type: EVENT_TYPES.AFF_COUNT_SET,
          payload: { id, value: count },
        });
      }
    });
    on("Char.Afflictions.Remove", (payload) => {
      const raw = Array.isArray(payload) ? payload[0] : payload;
      const { id, count } = parseAffName(raw);
      if (!id) {
        return;
      }
      core.dispatch({ type: EVENT_TYPES.AFF_LOST, payload: id });
      if (typeof count === "number") {
        core.dispatch({
          type: EVENT_TYPES.AFF_COUNT_SUB,
          payload: { id, value: count },
        });
      }
    });

    on("Char.Defences.List", (payload) =>
      core.dispatch({
        type: EVENT_TYPES.DEF_LIST,
        payload: parseDefList(payload),
      })
    );
    on("Char.Defences.Add", (payload) => {
      const id = normalizeDefName(payload.name || payload);
      if (id) {
        core.dispatch({ type: EVENT_TYPES.DEF_GOT, payload: id });
      }
    });
    on("Char.Defences.Remove", (payload) => {
      const raw = Array.isArray(payload) ? payload[0] : payload;
      const id = normalizeDefName(raw);
      if (id) {
        core.dispatch({ type: EVENT_TYPES.DEF_LOST, payload: id });
      }
    });

    const applyCacheCountDelta = (id, delta) => {
      if (!id || delta === 0) {
        return;
      }
      if (delta > 0) {
        core.dispatch({
          type: EVENT_TYPES.CACHE_COUNT_ADD,
          payload: { id, value: delta },
        });
      } else {
        core.dispatch({
          type: EVENT_TYPES.CACHE_COUNT_SUB,
          payload: { id, value: Math.abs(delta) },
        });
      }
    };

    on("Char.Items.Add", (payload) => {
      const entry = parseCacheItem(payload?.item, payload?.location);
      if (!entry) {
        return;
      }
      core.dispatch({
        type: EVENT_TYPES.CACHE_COUNT_ADD,
        payload: { id: entry.id, value: entry.amount },
      });
    });

    on("Char.Items.Remove", (payload) => {
      const entry = parseCacheItem(payload?.item, payload?.location);
      if (!entry) {
        return;
      }
      core.dispatch({
        type: EVENT_TYPES.CACHE_COUNT_SUB,
        payload: { id: entry.id, value: entry.amount },
      });
    });

    on("Char.Items.Update", (payload) => {
      const entry = parseCacheItem(payload?.item, payload?.location);
      if (!entry) {
        return;
      }
      const current = core.getState().caches[entry.id]?.count ?? 0;
      const delta = entry.amount - current;
      applyCacheCountDelta(entry.id, delta);
    });

    on("Char.Items.List", (payload) => {
      if (payload?.location !== "inv" || !Array.isArray(payload.items)) {
        return;
      }
      const counts = {};
      payload.items.forEach((item) => {
        const entry = parseCacheItem(item, payload.location);
        if (!entry) {
          return;
        }
        counts[entry.id] = (counts[entry.id] || 0) + entry.amount;
      });
      const caches = core.getState().caches;
      Object.keys(caches).forEach((id) => {
        const current = caches[id]?.count ?? 0;
        const next = counts[id] || 0;
        applyCacheCountDelta(id, next - current);
      });
    });

    on("IRE.Rift.Change", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.CACHE_RIFT_SET,
        payload: { id: payload.name, value: parseInt(payload.amount, 10) },
      });
    });

    on("IRE.Rift.List", (payload) => {
      payload.forEach((entry) => {
        core.dispatch({
          type: EVENT_TYPES.CACHE_RIFT_SET,
          payload: { id: entry.name, value: parseInt(entry.amount, 10) },
        });
      });
    });

    on("CuringStatusEvent", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.SERVERSIDE_STATUS_SNAPSHOT,
        payload: { [payload.status]: payload.arg },
      });
    });

    on("CuringPriorityAffsEvent", (payload) => {
      const prio = payload.prio;
      const affs = (payload.affs || "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .split(", ")
        .filter(Boolean);
      const snapshot = {};
      affs.forEach((id) => {
        snapshot[id] = prio;
      });
      core.dispatch({
        type: EVENT_TYPES.SERVERSIDE_AFF_SNAPSHOT,
        payload: snapshot,
      });
    });

    on("CuringPriorityDefsEvent", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.SERVERSIDE_DEF_SNAPSHOT,
        payload: { [payload.def]: payload.prio },
      });
    });

    on("ServersideCuringStatusSetEvent", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.SERVERSIDE_STATUS_SNAPSHOT,
        payload: { [payload.status]: payload.arg },
      });
    });

    on("ServersideAffPrioritySetEvent", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.SERVERSIDE_AFF_SNAPSHOT,
        payload: { [payload.aff]: payload.prio },
      });
    });

    on("ServersideDefPrioritySetEvent", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.SERVERSIDE_DEF_SNAPSHOT,
        payload: { [payload.def]: payload.prio },
      });
    });

    on("CuringStartupCompleteEvent", () => {
      core.dispatch({ type: EVENT_TYPES.SERVERSIDE_LOADED });
    });

    on("SystemPaused", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      core.dispatch({ type: EVENT_TYPES.SYSTEM_PAUSE });
    });
    on("SystemUnpaused", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      core.dispatch({ type: EVENT_TYPES.SYSTEM_UNPAUSE });
      core.flushPending("unpause");
      const queuePlans = core.planAllQueues();
      queuePlans.forEach((plan) => sendQueuePlan(plan));
    });
    on("SystemSlowModeOn", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      core.dispatch({
        type: EVENT_TYPES.SYSTEM_STATUS_SET,
        payload: { status: "slowMode", arg: true },
      });
    });
    on("SystemSlowModeOff", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      core.dispatch({
        type: EVENT_TYPES.SYSTEM_STATUS_SET,
        payload: { status: "slowMode", arg: false },
      });
      core.flushPending("slow-off");
      const queuePlans = core.planAllQueues();
      queuePlans.forEach((plan) => sendQueuePlan(plan));
    });
    on("SystemStatusSetEvent", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      core.dispatch({ type: EVENT_TYPES.SYSTEM_STATUS_SET, payload });
    });

    on("SystemOutputAdd", (payload) => {
      core.dispatch({ type: EVENT_TYPES.OUTPUT_ADD_NEXSYS_COMMANDS, payload });
    });

    on("AffPrioritySetEvent", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      const id = payload?.name ?? payload?.id;
      const prio = payload?.prio;
      if (id != null && prio != null) {
        core.dispatch({
          type: EVENT_TYPES.AFF_PRIO_SET,
          payload: { id, prio },
        });
      }
    });

    on("DefPrioritySetEvent", (payload) => {
      if (isBridgeEvent(payload)) {
        return;
      }
      const id = payload?.name ?? payload?.id;
      const prio = payload?.prio;
      if (id != null && prio != null) {
        core.dispatch({
          type: EVENT_TYPES.DEF_PRIO_SET,
          payload: { id, prio },
        });
      }
    });

    on("ServersideSettingsCaptured", () => {
      flushOutput("force");
    });

    Object.values(core.getState().queues).forEach((queue) => {
      const eventName = `${queue.name}QueueFired`;
      on(eventName, () => {
        core.dispatch({
          type: EVENT_TYPES.QUEUE_FIRED,
          payload: { id: queue.id },
        });
      });
    });

    on("CommandSeparatorSetOnStartup", (payload) => {
      core.dispatch({
        type: EVENT_TYPES.SYSTEM_SETTINGS_UPDATE,
        payload: { sep: payload },
      });
    });
  };

  const stop = () => {
    offAll();
    if (pendingUnsubscribe) {
      pendingUnsubscribe();
      pendingUnsubscribe = null;
    }
    if (pendingTimerId) {
      clearTimeout(pendingTimerId);
      pendingTimerId = null;
    }
    if (bridgeStop) {
      bridgeStop();
      bridgeStop = null;
    }
  };

  return { start, stop, sendPlan, sendImmediate, send };
};
