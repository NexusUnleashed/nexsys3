import { EVENT_TYPES } from "../events/eventTypes";

export const serversideReducer = (serverside, event) => {
  switch (event.type) {
    case EVENT_TYPES.SERVERSIDE_STATUS_SNAPSHOT: {
      const status = { ...serverside.snapshot.status, ...event.payload };
      const desired =
        Object.keys(serverside.desired.status).length === 0
          ? { ...status }
          : serverside.desired.status;
      return {
        ...serverside,
        snapshot: { ...serverside.snapshot, status },
        desired: { ...serverside.desired, status: desired },
      };
    }
    case EVENT_TYPES.SERVERSIDE_AFF_SNAPSHOT: {
      const affs = { ...serverside.snapshot.affs, ...event.payload };
      const desired =
        Object.keys(serverside.desired.affs).length === 0
          ? { ...affs }
          : serverside.desired.affs;
      return {
        ...serverside,
        snapshot: { ...serverside.snapshot, affs },
        desired: { ...serverside.desired, affs: desired },
      };
    }
    case EVENT_TYPES.SERVERSIDE_DEF_SNAPSHOT: {
      const defs = { ...serverside.snapshot.defs, ...event.payload };
      const desired =
        Object.keys(serverside.desired.defs).length === 0
          ? { ...defs }
          : serverside.desired.defs;
      return {
        ...serverside,
        snapshot: { ...serverside.snapshot, defs },
        desired: { ...serverside.desired, defs: desired },
      };
    }
    case EVENT_TYPES.SERVERSIDE_DESIRED_UPDATE:
      return {
        ...serverside,
        desired: {
          status: { ...serverside.desired.status, ...event.payload.status },
          affs: { ...serverside.desired.affs, ...event.payload.affs },
          defs: { ...serverside.desired.defs, ...event.payload.defs },
        },
      };
    case EVENT_TYPES.SERVERSIDE_LOADED:
      return { ...serverside, loaded: true };
    default:
      return serverside;
  }
};
