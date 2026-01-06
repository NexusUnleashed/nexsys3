const getQueuedCommands = (queue) =>
  queue.prepend.length > 0 || queue.items.length > 0;

const buildQueuedCmds = (queue, confirmMsg) => [
  confirmMsg,
  ...queue.pre,
  ...queue.prepend,
  ...queue.items,
  ...queue.post,
];

const chunkArray = (items, size) => {
  if (size <= 0) {
    return [items];
  }
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const planQueueSend = (state, config, queueId) => {
  const queue = state.queues[queueId];
  if (!queue) {
    return { commands: [], queueId, queuesToClear: [] };
  }

  if (!getQueuedCommands(queue)) {
    return { commands: [], queueId, queuesToClear: [] };
  }

  const sep = state.system.settings.sep || config.commandSeparator;
  const confirmMsg = `echo SystemEvent ${queue.name}QueueFired`;
  const queuedCmds = buildQueuedCmds(queue, confirmMsg);

  const exclusionCommands = [];
  const queuesToClear = [];
  queue.exclusions.forEach((excludedId) => {
    const excluded = state.queues[excludedId];
    if (!excluded) {
      return;
    }
    if (excluded.items.length || excluded.prepend.length) {
      exclusionCommands.push(`clearqueue ${excluded.type}`);
      queuesToClear.push(excludedId);
    }
  });

  const chunkSize = Math.max(
    1,
    config.outputChunkSize - exclusionCommands.length
  );
  const chunks = chunkArray(queuedCmds, chunkSize);
  const sendCommands = [];

  chunks.forEach((chunk, index) => {
    const queueCmd = `queue ${index > 0 ? "add" : "addclear"} ${
      queue.type
    } ${chunk.join(sep)}`;
    const lineCommands = index === 0 ? [...exclusionCommands, queueCmd] : [queueCmd];
    sendCommands.push(lineCommands.join(sep));
  });

  return { commands: sendCommands, queueId, queuesToClear };
};

export const planAllQueues = (state, config) =>
  Object.keys(state.queues).map((queueId) => planQueueSend(state, config, queueId));
