import { createCore } from "../core/engine/createCore";
import { createNexusAdapter } from "../adapters/nexus/nexusAdapter";
import { createEchoAdapter } from "../adapters/echo/echoAdapter";
import { defaultConfig } from "../core/config/defaults";
import { defaultRules } from "../core/rules/defaultRules";
import { legacyTables } from "../tables/legacyTables";
import { EVENT_TYPES } from "../core/events/eventTypes";

export const createNexSys4 = (options = {}) => {
  const client =
    options.nexusclient ||
    (typeof globalThis !== "undefined" ? globalThis.nexusclient : null);

  const loadStoredSettings = () => {
    if (!client?.variables) {
      return null;
    }
    const vars = client.variables();
    if (!vars?.get) {
      return null;
    }
    let stored = vars.get("nexSysSettings");
    if (!stored || typeof stored !== "object") {
      stored = {};
      if (vars.set) {
        vars.set("nexSysSettings", stored);
      }
    }
    return stored;
  };

  const persistSettings = (patch) => {
    if (!patch || typeof patch !== "object") {
      return;
    }
    if (!client?.variables) {
      return;
    }
    const vars = client.variables();
    if (!vars?.get || !vars?.set) {
      return;
    }
    const stored = loadStoredSettings() || {};
    stored.systemSettings = { ...(stored.systemSettings || {}), ...patch };
    if (patch.sep) {
      stored.commandSeparator = patch.sep;
    }
    vars.set("nexSysSettings", stored);
  };

  const storedSettings = loadStoredSettings();
  const storedSystemSettings =
    storedSettings?.systemSettings && typeof storedSettings.systemSettings === "object"
      ? storedSettings.systemSettings
      : {};

  const config = { ...defaultConfig, ...(options.config || {}) };
  const storedSep =
    storedSystemSettings.sep ?? storedSettings?.commandSeparator;
  if (storedSep) {
    config.commandSeparator = storedSep;
  }
  const systemDefaults = {
    ...config.systemDefaults,
    ...storedSystemSettings,
  };
  if ("sep" in systemDefaults) {
    delete systemDefaults.sep;
  }
  config.systemDefaults = systemDefaults;
  const tables = options.tables || legacyTables;
  const initialRules = options.rules || defaultRules;
  const evt = options.eventStream || (typeof globalThis !== "undefined"
    ? globalThis.eventStream
    : null);

  const core = createCore({
    config,
    tables,
    rules: initialRules,
    time: options.time,
  });

  const adapter = createNexusAdapter({
    core,
    config,
    eventStream: options.eventStream,
    nexusclient: options.nexusclient,
    onSettingsUpdate: persistSettings,
  });
  const echoAdapter = createEchoAdapter({
    core,
    eventStream: options.eventStream,
    nexusclient: options.nexusclient,
    displayNotice: options.displayNotice,
  });

  const updateSettings = (patch = {}) => {
    if (!patch || typeof patch !== "object") {
      return;
    }
    core.dispatch({ type: EVENT_TYPES.SYSTEM_SETTINGS_UPDATE, payload: patch });
    const state = core.getState();
    Object.keys(patch).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(state.system.state, key)) {
        core.dispatch({
          type: EVENT_TYPES.SYSTEM_STATUS_SET,
          payload: { status: key, arg: patch[key] },
        });
      }
    });
    if (patch.sep) {
      config.commandSeparator = patch.sep;
    }
    persistSettings(patch);
  };

  const normalizeCommands = (commands) => {
    const currentSep =
      core.getState().system.settings.sep || config.commandSeparator;
    if (!commands) {
      return [];
    }
    if (Array.isArray(commands)) {
      return commands.flatMap((cmd) =>
        typeof cmd === "string" ? cmd.split(currentSep) : cmd
      );
    }
    if (typeof commands === "string") {
      return commands.split(currentSep);
    }
    return [String(commands)];
  };

  const canSendQueue = () => {
    const state = core.getState();
    const allowQueueWhilePaused =
      state.system.settings.queueWhilePaused ??
      state.system.state.queueWhilePaused;
    if (state.system.state.slowMode) {
      return false;
    }
    if (state.system.state.paused && !allowQueueWhilePaused) {
      return false;
    }
    return true;
  };

  const sendQueuePlan = (plan) => {
    if (!plan?.commands?.length) {
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
    adapter.sendImmediate(plan.commands);
    core.dispatch({ type: EVENT_TYPES.QUEUE_SENT, payload: { id: plan.queueId } });
  };

  const queueApi = {
    add(queueId, commands) {
      const normalized = normalizeCommands(commands);
      if (!normalized.length) {
        return;
      }
      core.dispatch({
        type: EVENT_TYPES.QUEUE_ADD,
        payload: { id: queueId, commands: normalized },
      });
      if (canSendQueue()) {
        sendQueuePlan(core.planQueueSend(queueId));
      }
    },
    prepend(queueId, commands) {
      const normalized = normalizeCommands(commands);
      if (!normalized.length) {
        return;
      }
      core.dispatch({
        type: EVENT_TYPES.QUEUE_PREPEND,
        payload: { id: queueId, commands: normalized },
      });
      if (canSendQueue()) {
        sendQueuePlan(core.planQueueSend(queueId));
      }
    },
    send(queueId) {
      if (!canSendQueue()) {
        return;
      }
      sendQueuePlan(core.planQueueSend(queueId));
    },
    clear(queueId) {
      core.dispatch({ type: EVENT_TYPES.QUEUE_CLEAR, payload: { id: queueId } });
    },
    clearAll() {
      core.dispatch({ type: EVENT_TYPES.QUEUE_CLEAR_ALL });
    },
    flush() {
      if (!canSendQueue()) {
        return;
      }
      core.planAllQueues().forEach((plan) => sendQueuePlan(plan));
    },
    isQueued(queueId, command) {
      const queue = core.getState().queues[queueId];
      if (!queue) {
        return false;
      }
      return (
        queue.items.includes(command) || queue.prepend.includes(command)
      );
    },
    hasAny(queueId) {
      const queue = core.getState().queues[queueId];
      if (!queue) {
        return false;
      }
      return queue.items.length > 0 || queue.prepend.length > 0;
    },
  };

  const emitEvent = (name, payload) => {
    if (!evt?.raiseEvent) {
      return false;
    }
    evt.raiseEvent(name, payload);
    return true;
  };

  const api = {
    state: () => core.getState(),
    getAff: (id) => core.getState().affs[id],
    getDef: (id) => core.getState().defs[id],
    getBal: (id) => core.getState().bals[id],
    getCache: (id) => core.getState().caches[id],
    getQueue: (id) => core.getState().queues[id],
    hasAff: (id) => Boolean(core.getState().affs[id]?.have),
    hasDef: (id) => Boolean(core.getState().defs[id]?.have),
    hasBal: (id) => Boolean(core.getState().bals[id]?.have),
    affCount: (id) => core.getState().affs[id]?.count ?? 0,
    cacheCount: (id) => core.getState().caches[id]?.count ?? 0,
    cacheRift: (id) => core.getState().caches[id]?.rift ?? 0,
    affPrio: (id) => core.getState().affs[id]?.prio ?? 0,
    defPrio: (id) => core.getState().defs[id]?.prio ?? 0,
    affDefaultPrio: (id) => core.getState().affs[id]?.defaultPrio ?? 0,
    defDefaultPrio: (id) => core.getState().defs[id]?.defaultPrio ?? 0,
    isClass: (name) => {
      if (name === undefined || name === null) {
        return true;
      }
      const current = core.getState().system.char.class || "";
      const normalized = current.toLowerCase();
      if (Array.isArray(name)) {
        return name.some(
          (entry) => String(entry).toLowerCase() === normalized
        );
      }
      return String(name).toLowerCase() === normalized;
    },
    setAffPrio: (id, prio) => {
      const payload = { name: id, prio };
      if (!emitEvent("AffPrioritySetEvent", payload)) {
        core.dispatch({ type: EVENT_TYPES.AFF_PRIO_SET, payload: { id, prio } });
        adapter.sendPlan(core.requestServersideOutput("api-aff-prio"));
      }
    },
    setAffDefaultPrio: (id, prio) => {
      const payload = { id, prio, defaultPrio: prio };
      core.dispatch({ type: EVENT_TYPES.AFF_PRIO_SET, payload });
      adapter.sendPlan(core.requestServersideOutput("api-aff-default"));
    },
    resetAffPrio: (id) => {
      const prio = core.getState().affs[id]?.defaultPrio ?? 0;
      api.setAffPrio(id, prio);
    },
    toggleAffDefaultPrio: (id, prio) => {
      const current = core.getState().affs[id]?.prio ?? 0;
      api.setAffDefaultPrio(id, current === prio ? 0 : prio);
    },
    setDefPrio: (id, prio) => {
      const payload = { name: id, prio };
      if (!emitEvent("DefPrioritySetEvent", payload)) {
        core.dispatch({ type: EVENT_TYPES.DEF_PRIO_SET, payload: { id, prio } });
        adapter.sendPlan(core.requestServersideOutput("api-def-prio"));
      }
    },
    setDefDefaultPrio: (id, prio) => {
      const payload = { id, prio, defaultPrio: prio };
      core.dispatch({ type: EVENT_TYPES.DEF_PRIO_SET, payload });
      adapter.sendPlan(core.requestServersideOutput("api-def-default"));
    },
    resetDefPrio: (id) => {
      const prio = core.getState().defs[id]?.defaultPrio ?? 0;
      api.setDefPrio(id, prio);
    },
    toggleDefDefaultPrio: (id, prio) => {
      const current = core.getState().defs[id]?.prio ?? 0;
      api.setDefDefaultPrio(id, current === prio ? 0 : prio);
    },
    setSystemStatus: (status, arg) => {
      const payload = { status, arg };
      if (!emitEvent("SystemStatusSetEvent", payload)) {
        core.dispatch({ type: EVENT_TYPES.SYSTEM_STATUS_SET, payload });
        adapter.sendPlan(core.requestServersideOutput("api-status"));
      }
    },
    pause: () => {
      if (!emitEvent("SystemPaused")) {
        core.dispatch({ type: EVENT_TYPES.SYSTEM_PAUSE });
      }
    },
    unpause: () => {
      if (!emitEvent("SystemUnpaused")) {
        core.dispatch({ type: EVENT_TYPES.SYSTEM_UNPAUSE });
        core.flushPending("api-unpause");
        queueApi.flush();
      }
    },
    slowOn: () => {
      if (!emitEvent("SystemSlowModeOn")) {
        core.dispatch({
          type: EVENT_TYPES.SYSTEM_STATUS_SET,
          payload: { status: "slowMode", arg: true },
        });
      }
    },
    slowOff: () => {
      if (!emitEvent("SystemSlowModeOff")) {
        core.dispatch({
          type: EVENT_TYPES.SYSTEM_STATUS_SET,
          payload: { status: "slowMode", arg: false },
        });
        core.flushPending("api-slow-off");
        queueApi.flush();
      }
    },
    slowToggle: () => {
      const state = core.getState();
      if (state.system.state.slowMode) {
        api.slowOff();
      } else {
        api.slowOn();
      }
    },
    addOutput: (commands) => {
      if (!emitEvent("SystemOutputAdd", commands)) {
        core.dispatch({
          type: EVENT_TYPES.OUTPUT_ADD_NEXSYS_COMMANDS,
          payload: commands,
        });
        adapter.sendPlan(core.requestNexSysOutput("api-output"));
      }
    },
    send: (commands, options) => adapter.send(commands, options),
    emit: (name, payload) => emitEvent(name, payload),
  };

  const ruleApi = {
    add: (rule, options = {}) => {
      const id = core.addRule(rule);
      if (options.apply) {
        core.applyRules("rule-add");
      }
      return id;
    },
    remove: (id) => core.removeRule(id),
    has: (id) => core.hasRule(id),
    list: () => core.getRules(),
    setAll: (rules) => core.setRules(rules),
    clear: () => core.clearRules(),
    enable: (id) => core.enableRule(id),
    disable: (id) => core.disableRule(id),
    apply: () => core.applyRules("rules-apply"),
  };

  return {
    core,
    adapter,
    config,
    tables,
    rules: ruleApi,
    start: () => {
      adapter.start();
      echoAdapter.start();
    },
    stop: () => {
      adapter.stop();
      echoAdapter.stop();
    },
    dispatch: core.dispatch,
    getState: core.getState,
    updateSettings,
    requestServersideOutput: core.requestServersideOutput,
    requestPrecacheOutput: core.requestPrecacheOutput,
    requestNexSysOutput: core.requestNexSysOutput,
    queue: queueApi,
    addRule: ruleApi.add,
    removeRule: ruleApi.remove,
    listRules: ruleApi.list,
    applyRules: ruleApi.apply,
    ...api,
    api,
    echoAdapter,
  };
};
