export const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const dispatch = (event) => {
    state = reducer(state, event);
    listeners.forEach((listener) => listener(state, event));
    return event;
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, dispatch, subscribe };
};
