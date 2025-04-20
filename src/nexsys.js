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
import { Queue } from "./base/queues/Queue";
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
  speech,
  tabCompletion,
  updateNxs,
} from "./base/utilities/general";
import { startup } from "./base/utilities/startup";
import NexDialog from "./components/NexDialog";

const nexSys = {
  version: "2.1.4",
  evt: new EventTarget(),
  component: NexDialog,

  sys,
  sysLogging,
  sysLog,
  sysLoggingToggle,

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
    Queue,
  },

  cures,
  cureTable,

  affs,
  affTable,
  getCurrentAffs,
  haveAff,
  haveAffs,
  haveAnAff,
  affPrioSwap,
  setPrioArrays,

  snapTrack: new Trackable("Snapped"),

  bals,
  balanceTable,
  getCurrentBals,
  haveABal,
  haveBal,
  haveBals,

  defs,
  defTable,
  defPrios,
  //defsCreate: defsCreate,
  getCurrentDefs,
  getDefOutputs,
  getMissingDefs,
  haveDef,
  defPrioSwap,
  defup,
  defoff,
  parry,

  caches,
  cacheTable,
  getCacheOutputs,

  echo,
  echoLine,
  echoInfoLine,

  curArea,
  curRoom,
  curRoomArea,
  curRoomName,
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

  sendCmd,
  sendInline,
  psend,
  rsend,
  timeDiffNow,

  // General QoL functions
  replace,
  replaceHTML,
  replaceWord,
  speech,
  say,
  nextLine,
  prevLine,
  checkLine,
  prepend_notice,
  tabCompletion,

  serversideSettings,

  updateModel,
  updateList,
  updateNxs,
  saveModel,
  updateAndSaveModel,
  loadCustomSettings,
  updatePriorities,
  //saveCustomSettings: saveCustomSettings,

  classQueue: new Queue({
    name: "class",
    type: "c!p!t!w",
    pre: ["touch soul", "stand"],
    exclusions: ["fullQueue"],
  }),
  freeQueue: new Queue({
    name: "free",
    type: "free",
    pre: ["touch soul", "stand"],
    exclusions: ["fullQueue", "shieldQueue"],
  }),
  fullQueue: new Queue({
    name: "full",
    type: "ebc!w!p!t",
    pre: ["touch soul", "stand"],
    exclusions: ["freeQueue", "shieldQueue", "classQueue"],
  }),
  shieldQueue: new Queue({
    name: "shield",
    type: "eb!w!t",
    pre: ["touch soul", "stand"],
    exclusions: ["freeQueue", "fullQueue"],
  }),
  shipQueue: new Queue({
    name: "ship",
    type: "s!w!t",
    pre: ["touch soul", "stand"],
    exclusions: [],
  }),
  stunQueue: new Queue({ name: "stun", type: "!t", pre: ["touch soul"] }),

  prompt,
  sentCommands: [],

  // DEBUG Functions
  systemOutputDebug,
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

/**Starup sequences and initialization */
startup();

/**These functions are required because consecutive queuing
 * does not refresh the GMCP balance feedback
 * do we need one for every queue that uses balance?
 */
const queueFiredBalance = function () {
  if (
    nexSys.bals.balance.duration > 0.25 &&
    nexSys.haveBal("balance") == false
  ) {
    eventStream.raiseEvent("balanceGotBalEvent");
    eventStream.raiseEvent("balanceLostBalEvent");
  }
  if (
    nexSys.bals.equilibrium.duration > 0.25 &&
    nexSys.haveBal("equilibrium") == false
  ) {
    eventStream.raiseEvent("equilibriumGotBalEvent");
    eventStream.raiseEvent("equilibriumLostBalEvent");
  }
};
eventStream.registerEvent("freeQueueFired", queueFiredBalance);
eventStream.registerEvent("fullQueueFired", queueFiredBalance);
eventStream.registerEvent("shieldQueueFired", queueFiredBalance);
eventStream.registerEvent("bloodcloakQueueFired", queueFiredBalance);

const entityQueueBalance = function () {
  if (nexSys.bals.entity.duration > 0.5 && nexSys.haveBal("entity") == false) {
    eventStream.raiseEvent("entityGotBalEvent");
    eventStream.raiseEvent("entityLostBalEvent");
  }
};
eventStream.registerEvent("classQueueFired", entityQueueBalance);
