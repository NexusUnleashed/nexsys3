export const sampleTables = {
  affs: {
    list: ["aeon", "asthma"],
    prios: {
      aeon: 2,
      asthma: 5,
    },
    types: {
      countable: {},
      timed: {
        aeon: { length: 16 },
      },
      defs: {},
      uncurable: {},
    },
  },
  defPrios: {
    keepup: {},
    static: {},
  },
  defs: {
    rebounding: {
      command: "touch rebounding",
      bals_req: ["balance", "equilibrium"],
      bals_used: ["balance", "equilibrium"],
      blocks: [],
      skills: [],
      preempt: false,
      serverside: true,
    },
  },
  bals: {
    balance: { length: 2.5 },
    equilibrium: { length: 2.5 },
  },
  caches: {
    bloodroot: { amount: 0, blocks: [] },
  },
  queues: {
    free: {
      type: "free",
      pre: [],
      post: [],
      exclusions: [],
    },
  },
};
