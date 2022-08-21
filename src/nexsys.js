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

import { Queue } from "./classes/Queue";
import { curArea, curRoom, curRoomArea, curRoomName } from "./events/gmcp";
import { getLustCommands, rejectList, whiteList } from "./events/lust";
import {
  affPrioSwap,
  getCurrentAffs,
  haveAff,
  haveAffs,
  haveAnAff
} from "./functions/affs";
import { haveABal, haveBal, haveBals } from "./functions/bals";
import { getCacheOutputs, getMissingCache } from "./functions/cache";
import {
  getCurrentDefs,
  getDefOutputs,
  getMissingDefs
} from "./functions/defs";
import { getCustomPrompt, prompt } from "./functions/prompt";
import { sys, sysLog, sysLogging, sysLoggingToggle } from "./functions/sys";
import {
  psend,
  rsend,
  sendCmd,
  sendInline,
  timeDiffNow
} from "./functions/utilities";
import { Affs } from "./generators/affs";
import { Bals } from "./generators/balances";
import { Caches } from "./generators/caches";
import { Cures } from "./generators/cures";
import {
  loadCustomSettings,
  saveCustomSettings,
  saveModel,
  updateAndSaveModel,
  updateList,
  updateModel
} from "./generators/customsettings";
import { Defs, defsCreate } from "./generators/defs";
import { echo, echoInfoLine, echoLine } from "./generators/echos";
import {
  serversideDefencePriorityListStart,
  serversideSettings
} from "./generators/serverside";
import { affTable } from "./tables/affTable";
import { cacheTable } from "./tables/cacheTable";
import { dirMap, dirs, limbs, oppDirs, shortDirs } from "./tables/commonTable";
import { defPrios } from "./tables/defTable";

const nexsys = {
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
  defsCreate: defsCreate,
  getCurrentDefs: getCurrentDefs,
  getDefOutputs: getDefOutputs,
  getMissingDefs: getMissingDefs,

  Caches: Caches,
  cacheTable: cacheTable,
  getCacheOutputs: getCacheOutputs,
  getMissingCache: getMissingCache,

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