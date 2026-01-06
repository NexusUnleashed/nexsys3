import { EVENT_TYPES } from "../events/eventTypes";

const updateCharVitals = (char, vitals) => {
  return {
    ...char,
    h: vitals.h ?? vitals.hp ?? char.h,
    m: vitals.m ?? vitals.mp ?? char.m,
    e: vitals.e ?? vitals.ep ?? char.e,
    w: vitals.w ?? vitals.wp ?? char.w,
    maxh: vitals.maxh ?? vitals.maxhp ?? char.maxh,
    maxm: vitals.maxm ?? vitals.maxmp ?? char.maxm,
    maxe: vitals.maxe ?? vitals.maxep ?? char.maxe,
    maxw: vitals.maxw ?? vitals.maxwp ?? char.maxw,
    xp: vitals.xp ?? char.xp,
    bleed: vitals.bleed ?? char.bleed,
    rage: vitals.rage ?? char.rage,
  };
};

const updateCharStatus = (char, status) => {
  return {
    ...char,
    class: status.class ?? char.class,
    race: status.race ?? char.race,
    target: status.target ?? char.target,
    xp: status.xp ?? char.xp,
    gold: status.gold ?? char.gold,
  };
};

export const systemReducer = (system, event) => {
  switch (event.type) {
    case EVENT_TYPES.SYSTEM_SETTINGS_UPDATE:
      return {
        ...system,
        settings: { ...system.settings, ...event.payload },
      };
    case EVENT_TYPES.SYSTEM_STATUS_SET:
      return {
        ...system,
        state: { ...system.state, [event.payload.status]: event.payload.arg },
      };
    case EVENT_TYPES.SYSTEM_PAUSE:
      return { ...system, state: { ...system.state, paused: true } };
    case EVENT_TYPES.SYSTEM_UNPAUSE:
      return { ...system, state: { ...system.state, paused: false } };
    case EVENT_TYPES.SYSTEM_TARGET_SET:
      return { ...system, target: event.payload };
    case EVENT_TYPES.CHAR_VITALS:
      return { ...system, char: updateCharVitals(system.char, event.payload) };
    case EVENT_TYPES.CHAR_STATUS:
      return { ...system, char: updateCharStatus(system.char, event.payload) };
    default:
      return system;
  }
};
