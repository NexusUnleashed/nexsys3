import { EVENT_TYPES } from "../events/eventTypes";

export const balReducer = (bals, event) => {
  switch (event.type) {
    case EVENT_TYPES.BAL_GOT: {
      const bal = bals[event.payload];
      if (!bal || bal.have) {
        return bals;
      }
      return { ...bals, [bal.id]: { ...bal, have: true } };
    }
    case EVENT_TYPES.BAL_LOST: {
      const bal = bals[event.payload];
      if (!bal || !bal.have) {
        return bals;
      }
      return { ...bals, [bal.id]: { ...bal, have: false } };
    }
    default:
      return bals;
  }
};
