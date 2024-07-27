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
      nexusclient.reflexes().disable_reflex(nexusclient.reflexes().find_by_name("group", "Aliases", false, false, "nexmap3"));
    set_current_target() > nexusclient.datahandler().set_current_target()
*/
/* global globalThis */
import { affs } from "./base/affs/affs";
import { Aff, AffCountable, AffTimed, AffDef } from "./base/affs/Aff";
import {
  affPrioSwap,
  getCurrentAffs,
  haveAff,
  haveAffs,
  haveAnAff,
  setPrioArrays,
} from "./base/affs/affService";
import { affTable } from "./base/affs/affTable";
import { Balance, BalExtended } from "./base/balances/Balance";
import { bals } from "./base/balances/balances";
import { balanceTable } from "./base/balances/balanceTable";
import {
  getCurrentBals,
  haveABal,
  haveBal,
  haveBals,
} from "./base/balances/balanceService";
import { Cache } from "./base/cache/Cache";
import { caches } from "./base/cache/caches";
import { getCacheOutputs } from "./base/cache/cacheService";
import {
  cacheTable,
  herb_name_to_herb,
  herb_to_mineral,
  mineral_to_herb,
} from "./base/cache/cacheTable";
import Countable from "./base/classes/Countable";
import Priority from "./base/classes/Priority";
import Priorityqueue from "./base/classes/Priorityqueue";
import Timer from "./base/classes/Timer";
import Trackable from "./base/classes/Trackable";
import { prompt } from "./base/clientOverrides/prompt";
import Cure from "./base/cures/Cure";
import { cures } from "./base/cures/cures";
import { cureTable } from "./base/cures/cureTable";
import { Def, DefServerside } from "./base/defs/Def";
import { defs } from "./base/defs/defs";
import { defTable } from "./base/defs/defTable";
import {
  defoff,
  defPrioSwap,
  defup,
  getCurrentDefs,
  getDefOutputs,
  getMissingDefs,
  haveDef,
  parry,
} from "./base/defs/defService";
import { defPrios } from "./base/defs/defTable";
import {
  Echo,
  EchoLine,
  EchoLinePrefix,
  EchoWithPrefix,
} from "./base/echo/Echo";
import { echo, echoInfoLine, echoLine } from "./base/echo/echos";
import { createQueue } from "./base/queues/Queue";
import { serversideSettings } from "./base/serverside/serverside";
import {
  loadCustomSettings,
  saveModel,
  updateAndSaveModel,
  updateList,
  updateModel,
  updatePriorities,
} from "./base/system/customsettings";
import {
  curArea,
  curRoom,
  curRoomArea,
  curRoomName,
} from "./base/system/gmcpEvents";
import { sys, sysLog, sysLogging, sysLoggingToggle } from "./base/system/sys";
import {
  psend,
  rsend,
  sendCmd,
  sendInline,
  timeDiffNow,
} from "./base/system/sysService";
import { systemOutputDebug } from "./base/system/systemOutput";
import {
  classList,
  dirMap,
  dirs,
  limbs,
  oppDirs,
  shortDirs,
} from "./base/utilities/commonTable";
import {
  checkLine,
  nextLine,
  prepend_notice,
  prevLine,
  replace,
  replaceHTML,
  replaceWord,
  say,
  tabCompletion,
  updateNxs,
} from "./base/utilities/general";
import { startup } from "./base/utilities/startup";
import NexDialog from "./components/NexDialog";

const nexSys = {
  version: "1.9.1",
  evt: new EventTarget(),
  component: NexDialog,

  sys: sys,
  sysLogging: sysLogging,
  sysLog: sysLog,
  sysLoggingToggle: sysLoggingToggle,

  classes: {
    Countable,
    Cure,
    Priority,
    Priorityqueue,
    Timer,
    Trackable,
    Aff,
    AffCountable,
    AffTimed,
    AffDef,
    Balance,
    BalExtended,
    Cache,
    Def,
    DefServerside,
    Echo,
    EchoLine,
    EchoWithPrefix,
    EchoLinePrefix,
  },

  cures: cures,
  cureTable: cureTable,

  affs: affs,
  affTable: affTable,
  getCurrentAffs: getCurrentAffs,
  haveAff: haveAff,
  haveAffs: haveAffs,
  haveAnAff: haveAnAff,
  affPrioSwap: affPrioSwap,
  setPrioArrays: setPrioArrays,

  snapTrack: new Trackable("Snapped"),

  bals: bals,
  balanceTable: balanceTable,
  getCurrentBals: getCurrentBals,
  haveABal: haveABal,
  haveBal: haveBal,
  haveBals: haveBals,

  defs: defs,
  defTable: defTable,
  defPrios: defPrios,
  //defsCreate: defsCreate,
  getCurrentDefs: getCurrentDefs,
  getDefOutputs: getDefOutputs,
  getMissingDefs: getMissingDefs,
  haveDef: haveDef,
  defPrioSwap: defPrioSwap,
  defup: defup,
  defoff: defoff,
  parry: parry,

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
  tables: {
    limbs: limbs,
    dirs: dirs,
    dirMap: dirMap,
    oppdirs: oppDirs,
    shortDirs: shortDirs,
    classList: classList,
    herb_name_to_herb: herb_name_to_herb,
    mineral_to_herb: mineral_to_herb,
    herb_to_mineral: herb_to_mineral,
  },

  sendCmd: sendCmd,
  sendInline: sendInline,
  psend: psend,
  rsend: rsend,
  timeDiffNow: timeDiffNow,

  // General QoL functions
  replace: replace,
  replaceHTML: replaceHTML,
  replaceWord: replaceWord,
  say: say,
  nextLine: nextLine,
  prevLine: prevLine,
  checkLine: checkLine,
  prepend_notice: prepend_notice,
  tabCompletion: tabCompletion,

  serversideSettings: serversideSettings,

  updateModel: updateModel,
  updateList: updateList,
  updateNxs: updateNxs,
  saveModel: saveModel,
  updateAndSaveModel: updateAndSaveModel,
  loadCustomSettings: loadCustomSettings,
  updatePriorities: updatePriorities,
  //saveCustomSettings: saveCustomSettings,

  classQueue: createQueue({
    name: "class",
    type: "c!p!t!w",
    pre: ["touch soul", "stand"],
    exclusions: ["fullQueue"],
  }),
  freeQueue: createQueue({
    name: "free",
    type: "free",
    pre: ["touch soul", "stand"],
    exclusions: ["fullQueue", "shieldQueue"],
  }),
  fullQueue: createQueue({
    name: "full",
    type: "ebc!w!p!t",
    pre: ["touch soul", "stand"],
    exclusions: ["freeQueue", "shieldQueue", "classQueue"],
  }),
  shieldQueue: createQueue({
    name: "shield",
    type: "ebc!w!t",
    pre: ["touch soul", "stand"],
    exclusions: ["freeQueue", "fullQueue"],
  }),
  shipQueue: createQueue({
    name: "ship",
    type: "s!w!t",
    pre: ["touch soul", "stand"],
    exclusions: [],
  }),
  stunQueue: createQueue({ name: "stun", type: "!t", pre: ["touch soul"] }),

  prompt: prompt,
  sentCommands: [],

  // DEBUG Functions
  systemOutputDebug: systemOutputDebug,
  testRun() {
    const nexSysLoaded = () => {
      nexusclient
        .reflexes()
        .run_function("ServersidePrioritySwapping", {}, "nexSys3");
      //nexusclient.reflexes().run_function('PrioSwapTrackables', {}, 'nexSys3');
      nexusclient.reflexes().run_function("promptStyles", {}, "nexSys3");
      nexusclient.reflexes().run_function("promptString", {}, "nexSys3");
      nexusclient.reflexes().run_function("SystemLoaded", {}, "ALL");
      console.log("nexSys loaded: startup complete");
      nexSys.say(
        `Welcome back ${GMCP.Char.Status.name}. Nexus has been loaded to your specifications`
      );
    };

    nexusclient
      .packages()
      .get("nexSys3")
      .items.filter((item) => item.type === "group")
      .forEach((group) => (group.enabled = true));
    console.log("nexSys loaded: beginning startup");
    eventStream.registerEvent("ServersideSettingsCaptured", nexSysLoaded);
    nexSys.system_loaded = true;
    nexSys.loadCustomSettings();
    eventStream.raiseEvent("SystemLoaded");
  },
};

globalThis.nexSys = nexSys;
startup();
