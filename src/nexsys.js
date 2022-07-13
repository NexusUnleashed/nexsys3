/* 
  Breaking changes from 2.0 to 3.0:
    GMCP > nexusclient.datahandler().GMCP
    get_variable() > nexusclient.variables().get()
    set_variable() > nexusclient.variables().set()
    run_function() > nexusclient.reflexes().run_function()
    display_notice() > nexusclient.display_notice()
    print() > nexusclient.add_html_line()
    $ > all jquery implementation
*/

import { Echo, EchoLine, EchoLinePrefix } from "./base/echo";
import { eventStream } from "./base/eventStream";
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
} from "./generators/affs";
import { Bals, haveABal, haveBal, haveBals } from "./generators/balances";
import { Caches, getCacheOutputs, getMissingCache } from "./generators/caches";
import { Cures } from "./generators/cures";
import {
  loadCustomSettings,
  saveCustomSettings,
  saveModel,
  updateAndSaveModel,
  updateList,
  updateModel
} from "./generators/customsettings";
import {
  Defs,
  getCurrentDefs,
  getDefOutputs,
  getMissingDefs
} from "./generators/defs";
import { getLustCommands, rejectList, whiteList } from "./generators/lust";
import {
  serverside,
  serversideDefencePriorityListStart,
  serversideSettings
} from "./generators/serverside";
import { affTable } from "./tables/affTable";
import { cacheTable } from "./tables/cacheTable";
import { dirMap, dirs, limbs, oppDirs, shortDirs } from "./tables/commonTable";
import { defPrios } from "./tables/defTable";

window.eventStream = eventStream;
const nexSys = {
  gmcpBackLog: [],
  
  sys: sys,
  sysLogging: sysLogging,
  sysLog: sysLog,
  sysLoggingToggle: sysLoggingToggle,

  Cures: Cures,
  Affs: Affs,
  affTable: affTable,
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
  defPrios: defPrios,
  getCurrentDefs: getCurrentDefs,
  getDefOutputs: getDefOutputs,
  getMissingDefs: getMissingDefs,

  Caches: Caches,
  cacheTable: cacheTable,
  getCacheOutputs: getCacheOutputs,
  getMissingCache: getMissingCache,

  echo: new Echo("white").echo,
  echoLine: new EchoLine("white").echo,
  echoInfoLine: new EchoLinePrefix({ text: "[Info]: ", fg: "yellow" }, "white").echo,

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

  eqbalQueue: new Queue({
    name: "eqBal",
    prefix: "queue addclear eqbal ",
    pre: false,
    clear: "clearqueue eqbal",
  }),
  classQueue: new Queue({
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
