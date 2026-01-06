import { EVENT_TYPES } from "../events/eventTypes";

const arraysEqual = (left, right) => {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, idx) => value === right[idx]);
};

export const queueReducer = (queues, event) => {
  switch (event.type) {
    case EVENT_TYPES.QUEUE_ADD: {
      const { id, commands } = event.payload || {};
      const queue = queues[id];
      if (!queue || !Array.isArray(commands)) {
        return queues;
      }
      if (arraysEqual(commands, queue.items)) {
        return queues;
      }
      return { ...queues, [id]: { ...queue, items: [...commands] } };
    }
    case EVENT_TYPES.QUEUE_PREPEND: {
      const { id, commands } = event.payload || {};
      const queue = queues[id];
      if (!queue || !Array.isArray(commands)) {
        return queues;
      }
      if (commands.every((cmd) => queue.prepend.includes(cmd))) {
        return queues;
      }
      return {
        ...queues,
        [id]: { ...queue, prepend: queue.prepend.concat(commands) },
      };
    }
    case EVENT_TYPES.QUEUE_CLEAR: {
      const { id } = event.payload || {};
      const queue = queues[id];
      if (!queue) {
        return queues;
      }
      return { ...queues, [id]: { ...queue, items: [], prepend: [] } };
    }
    case EVENT_TYPES.QUEUE_CLEAR_ALL: {
      const cleared = {};
      Object.keys(queues).forEach((id) => {
        cleared[id] = { ...queues[id], items: [], prepend: [] };
      });
      return cleared;
    }
    case EVENT_TYPES.QUEUE_FIRED: {
      const { id } = event.payload || {};
      const queue = queues[id];
      if (!queue) {
        return queues;
      }
      return { ...queues, [id]: { ...queue, items: [], prepend: [] } };
    }
    default:
      return queues;
  }
};
