export function createEventBus() {
  const handlers = new Map();

  const on = (name, fn) => {
    if (!handlers.has(name)) {
      handlers.set(name, new Set());
    }
    handlers.get(name).add(fn);
    return () => off(name, fn);
  };

  const off = (name, fn) => {
    if (!handlers.has(name)) {
      return;
    }
    handlers.get(name).delete(fn);
  };

  const emit = (name, payload) => {
    if (!handlers.has(name)) {
      return;
    }
    handlers.get(name).forEach((fn) => fn(payload));
  };

  return { on, off, emit };
}
