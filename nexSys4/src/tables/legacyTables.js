import { affTable } from "../../../src/base/affs/affTable";
import { defTable, defPrios } from "../../../src/base/defs/defTable";
import { balanceTable } from "../../../src/base/balances/balanceTable";
import { cacheTable } from "../../../src/base/cache/cacheTable";
import { queueTable } from "./queueTable";

const normalizeCaches = (table) => {
  const result = {};
  Object.keys(table).forEach((id) => {
    const amount = table[id];
    result[id] = { amount, blocks: [] };
  });
  return result;
};

export const legacyTables = {
  affs: affTable,
  defs: defTable,
  defPrios,
  bals: balanceTable,
  caches: normalizeCaches(cacheTable),
  queues: queueTable,
};
