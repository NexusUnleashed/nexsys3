import { Echo, EchoLine, EchoLinePrefix } from "./base/echo";
import { eventStream } from "./base/eventstream";
import {
  curArea,
  curRoom,
  curRoomArea,
  curRoomName,
  gmcpHandler
} from "./base/gmcp";
import { Queue } from "./base/queue";
import { sys, sysLog, sysLogging, sysLoggingToggle } from "./base/sys";
import {
  psend,
  rsend,
  sendCmd,
  sendInline,
  timeDiffNow
} from "./base/utilities";
import {
  affPrioSwap,
  Affs,
  getCurrentAffs,
  haveAff,
  haveAffs,
  haveAnAff
} from "./create/affs";
import { Bals, haveABal, haveBal, haveBals } from "./create/balances";
import { Caches, getCacheOutputs, getMissingCache } from "./create/caches";
import { Cures } from "./create/cures";
import {
  loadCustomSettings,
  saveCustomSettings,
  saveModel,
  updateAndSaveModel,
  updateList,
  updateModel
} from "./create/customsettings";
import {
  Defs,
  getCurrentDefs,
  getDefOutputs,
  getMissingDefs
} from "./create/defs";
import { getLustCommands, rejectList, whiteList } from "./create/lust";
import {
  serverside,
  serversideDefencePriorityListStart,
  serversideSettings
} from "./create/serverside";
import { dirMap, dirs, limbs, oppDirs, shortDirs } from "./tables/commontable";

window.eventStream = eventStream;
const nexSys = {
  sys: sys,
  sysLogging: sysLogging,
  sysLog: sysLog,
  sysLoggingToggle: sysLoggingToggle,

  Cures: Cures,
  Affs: Affs,
  getCurrentAffs: getCurrentAffs,
  haveAff: haveAff,
  haveAffs: haveAffs,
  haveAnAff: haveAnAff,
  affPrioSwap: affPrioSwap,

  Bals: Bals,
  haveABal: haveABal,
  haveBal: haveBal,
  haveBals: haveBals,

  Defs: Defs,
  getCurrentDefs: getCurrentDefs,
  getDefOutputs: getDefOutputs,
  getMissingDefs: getMissingDefs,

  Caches: Caches,
  getCacheOutputs: getCacheOutputs,
  getMissingCache: getMissingCache,

  echo: new Echo("white"),
  echoLine: new EchoLine("white"),
  echoInfoLine: new EchoLinePrefix({ text: "[Info]: ", fg: "yellow" }, "white"),

  gmcpHandler: gmcpHandler,
  curArea: curArea,
  curRoom: curRoom,
  curRoomArea: curRoomArea,
  curRoomName: curRoomName,

  limbs: limbs,
  dirs: dirs,
  dirMap: dirMap,
  oppdirs: oppDirs,
  shortDirs: shortDirs,

  whiteList: whiteList,
  rejectList: rejectList,
  getLustCommands: getLustCommands,

  sendCmd: sendCmd,
  psend: psend,
  rsend: rsend,
  timeDiffNow: timeDiffNow,
  sendInline: sendInline,

  serversideSettings: serversideSettings,
  serversideDefencePriorityListStart: serversideDefencePriorityListStart,

  EqBalQueue: new Queue({
    name: "eqBal",
    prefix: "queue addclear eqbal ",
    pre: false,
    clear: "clearqueue eqbal",
  }),
  ClassQueue: new Queue({
    name: "class",
    prefix: "queue addclear class ",
    pre: false,
    clear: "clearqueue class",
  }),

  updateModel: updateModel,
  updateList: updateList,
  saveModel: saveModel,
  updateAndSaveModel: updateAndSaveModel,
  loadCustomSettings: loadCustomSettings,
  saveCustomSettings: saveCustomSettings,
};
serverside();

export default nexSys;
