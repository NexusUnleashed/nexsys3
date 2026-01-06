const buildAffs = (affTable) => {
  const result = {};
  const list = affTable.list || [];
  const prios = affTable.prios || {};
  const types = affTable.types || {};
  const countable = types.countable || {};
  const timed = types.timed || {};
  const defs = types.defs || {};
  const uncurable = types.uncurable || {};

  list.forEach((id) => {
    const prio = prios[id] || 0;
    const count = countable[id];
    const time = timed[id];
    result[id] = {
      id,
      have: false,
      prio,
      defaultPrio: prio,
      min: count ? count.min : 0,
      max: count ? count.max : 0,
      count: count ? count.min : 0,
      timed: time ? time.length : 0,
      isDef: Boolean(defs[id]),
      uncurable: Boolean(uncurable[id]),
      serverside: prio > 0 && prio <= 26,
    };
  });

  return result;
};

const buildDefs = (defTable, defPrios) => {
  const result = {};
  Object.keys(defTable).forEach((id) => {
    const def = defTable[id];
    const prio = defPrios?.keepup?.[id] ?? 0;
    result[id] = {
      id,
      have: false,
      prio,
      defaultPrio: prio,
      command: def.command || "",
      balsReq: def.bals_req || [],
      balsUsed: def.bals_used || [],
      blocks: def.blocks || [],
      skills: def.skills || [],
      preempt: def.preempt || false,
      serverside: Boolean(def.serverside),
    };
  });
  return result;
};

const buildBals = (balTable) => {
  const result = {};
  Object.keys(balTable).forEach((id) => {
    const bal = balTable[id];
    result[id] = {
      id,
      have: true,
      length: bal.length || 0,
      lastChange: 0,
    };
  });
  return result;
};

const buildCaches = (cacheTable) => {
  const result = {};
  Object.keys(cacheTable).forEach((id) => {
    const cache = cacheTable[id];
    result[id] = {
      id,
      amount: cache.amount ?? cache,
      count: 0,
      rift: 0,
      blocks: cache.blocks || [],
    };
  });
  return result;
};

const buildQueues = (queueTable) => {
  const result = {};
  Object.keys(queueTable || {}).forEach((id) => {
    const queue = queueTable[id];
    result[id] = {
      id,
      name: queue.name || id,
      type: queue.type,
      pre: queue.pre || [],
      post: queue.post || [],
      exclusions: queue.exclusions || [],
      items: [],
      prepend: [],
    };
  });
  return result;
};

export const createInitialState = ({ config, tables, time }) => {
  const now = time?.now?.() ?? 0;
  const affTable = tables.affs || { list: [], prios: {}, types: {} };
  const defTable = tables.defs || {};
  const defPrios = tables.defPrios || { keepup: {}, static: {} };
  const balTable = tables.bals || {};
  const cacheTable = tables.caches || {};
  const queueTable = tables.queues || {};
  const systemDefaults = config.systemDefaults || {};

  return {
    system: {
      settings: {
        sep: config.commandSeparator,
        ...systemDefaults,
        queueWhilePaused: systemDefaults.queueWhilePaused ?? false,
      },
      state: {
        paused: false,
        slowMode: false,
        ...systemDefaults,
      },
      char: {
        class: "",
        race: "",
        h: 5000,
        m: 5000,
        e: 20000,
        w: 20000,
        maxh: 5000,
        maxm: 5000,
        maxe: 20000,
        maxw: 20000,
        target: "",
      },
      target: "",
      lifevision: false,
      time: now,
    },
    affs: buildAffs(affTable),
    defs: buildDefs(defTable, defPrios),
    bals: buildBals(balTable),
    caches: buildCaches(cacheTable),
    queues: buildQueues(queueTable),
    serverside: {
      loaded: false,
      snapshot: { status: {}, affs: {}, defs: {} },
      desired: { status: {}, affs: {}, defs: {} },
    },
    runtime: {
      nexsysInProgress: false,
      nexsysPending: false,
      nexsysPendingOutput: false,
      pendingNexsysCommands: [],
      nexsysPlanId: 0,
      precacheInProgress: false,
      precachePending: false,
      precachePendingOutput: false,
      precachePlanId: 0,
      serversidePendingOutput: false,
    },
  };
};
