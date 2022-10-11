/* 
  Breaking changes from 2.0 to 3.0:
    send_direct() > nexusclient.send_commands()
    GMCP > nexusclient.datahandler().GMCP
    current_block > nexusclient.current_block
    current_line > nexusclient.current_line
    send_GMCP() > nexusclient.datahandler().send_GMCP()
    get_variable() > nexusclient.variables().get()
    set_variable() > nexusclient.variables().set()
    run_function() > nexusclient.reflexes().run_function()
    display_notice() > nexusclient.display_notice()
    print() > nexusclient.add_html_line()
    $ > all jquery implementation
    gag_current_line() > nexusclient.current_line.gag = true
    reflex_disable() > nexusclient.reflexes().disable_reflex();
    reflex_find_by_name() > nexusclient.reflexes().find_by_name("group", "Aliases", false, false, "nexmap3")
*/

import { prompt } from "./base/clientOverrides/prompt";
import { getLustCommands, rejectList, whiteList } from "./base/utilities/lust";
import { Queue } from "./base/queues/Queue";
import { curArea, curRoom, curRoomArea, curRoomName } from "./base/system/gmcp";
import {
  affPrioSwap,
  getCurrentAffs,
  haveAff,
  haveAffs,
  haveAnAff
} from "./base/affs/affService";
import { haveABal, haveBal, haveBals } from "./base/balances/balanceService";
import { getCacheOutputs, getMissingCache } from "./base/cache/cacheService";
import {
  getCurrentDefs,
  getDefOutputs,
  getMissingDefs
} from "./base/defs/defService";
import { sys, sysLog, sysLogging, sysLoggingToggle } from "./base/system/sys";
import {
  psend,
  rsend,
  sendCmd,
  sendInline,
  timeDiffNow
} from "./base/system/sysService";
import { affs } from "./base/affs/affs";
import { bals } from "./base/balances/balances";
import { caches } from "./base/cache/caches";
import { cures } from "./base/cures/cures";
import {
  loadCustomSettings,
  saveCustomSettings,
  saveModel,
  updateAndSaveModel,
  updateList,
  updateModel
} from "./base/system/customsettings";
import { defs, defsCreate } from "./base/defs/defs";
import { echo, echoInfoLine, echoLine } from "./base/echo/echos";
import {
  serversideDefencePriorityListStart,
  serversideSettings
} from "./base/serverside/serverside";
import { affTable } from "./base/affs/affTable";
import { cacheTable } from "./base/cache/cacheTable";
import { dirMap, dirs, limbs, oppDirs, shortDirs } from "./base/utilities/commonTable";
import { defPrios } from "./base/defs/defTable";

const nexsys = {
  sys: sys,
  sysLogging: sysLogging,
  sysLog: sysLog,
  sysLoggingToggle: sysLoggingToggle,

  cures: cures,

  affs: affs,
  affTable: affTable,
  getCurrentAffs: getCurrentAffs,
  haveAff: haveAff,
  haveAffs: haveAffs,
  haveAnAff: haveAnAff,
  affPrioSwap: affPrioSwap,

  bals: bals,
  haveABal: haveABal,
  haveBal: haveBal,
  haveBals: haveBals,

  defs: defs,
  defPrios: defPrios,
  defsCreate: defsCreate,
  getCurrentDefs: getCurrentDefs,
  getDefOutputs: getDefOutputs,
  getMissingDefs: getMissingDefs,

  caches: caches,
  cacheTable: cacheTable,
  getCacheOutputs: getCacheOutputs,

  echo: echo,
  echoLine: echoLine,
  echoInfoLine: echoInfoLine,

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

  updateModel: updateModel,
  updateList: updateList,
  saveModel: saveModel,
  updateAndSaveModel: updateAndSaveModel,
  loadCustomSettings: loadCustomSettings,
  saveCustomSettings: saveCustomSettings,

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

  prompt: prompt,
};

export default nexsys;

//send_GMCP('IRE.Rift.Request')
//nexsys.loadCustomSettings();
//run_function('CustomSettingsFromPackage', {}, 'ALL');