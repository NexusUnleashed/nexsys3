/* global eventStream */
import { getCurrentAffs } from "../affs/affService";
import { affs } from "../affs/affs";
import { getCurrentBals } from "../balances/balanceService";
import { getCacheOutputs } from "../cache/cacheService";
import { getCureOutputs } from "../cures/cureService";
import { getDefOutputs } from "../defs/defService";
import { sys } from "./sys";
import { sendCmd } from "./sysService";

let outputInProgress = false;
let outputPending = false;
let output = [];
const outputFeedbackCommand = "echo SystemEvent SystemOutputCompleteEvent";
const outputChunkSize = 20; // Needs to account for preQueue commands
let eventOutput = [];
let affPrioOutput = [];
let defPrioOutput = [];

const addToOutput = function (command) {
  if (Array.isArray(command)) {
    output = output.concat(command);
  } else {
    output.push(command);
  }
};

// Debounce config for priority accumulation
const prioAccumulationDelay = 150; // ms (adjust 100-200 as desired)
let deferredPopulateTimer = null;

const scheduleDeferredPopulate = (delay = prioAccumulationDelay) => {
  if (deferredPopulateTimer) return;
  deferredPopulateTimer = setTimeout(() => {
    deferredPopulateTimer = null;
    forcePopulateOutput();
  }, delay);
};

const sendOutput = function () {
  if (output.length > 0) {
    // Clear any pending deferred populate (we're sending now)
    if (deferredPopulateTimer) {
      clearTimeout(deferredPopulateTimer);
      deferredPopulateTimer = null;
    }
    eventStream.raiseEvent("OutputSentEvent", output);

    addToOutput(outputFeedbackCommand);

    /*
    // CUSTOM: This is to break up the output into chunks to send to the server
    const chunks = parseInt((output.length - 1) / outputChunkSize) + 1; //CUSTOM

    for (let i = 0; i < chunks; i++) {
      const chunk = output.slice(
        i * outputChunkSize,
        i * outputChunkSize + outputChunkSize
      );
      const cmd = chunk.join(sys.settings.sep);
      sendCmd(cmd);
    }
    */

    // TODO Is this working to use the stunQueue instead of sendCmd(cmd)?
    nexSys.stunQueue.clear();
    nexSys.stunQueue.add(output);

    outputInProgress = true;
    eventOutput = [];
    affPrioOutput = [];
    defPrioOutput = [];

    eventStream.raiseEvent("systemOutputLostBalEvent");
  }
};

let populateOutputFlag = false;

const populateOutput = function () {
  if (populateOutputFlag) {
    if (
      outputInProgress ||
      sys.isPaused() ||
      sys.isSlowMode() ||
      affs.aeon.have
    ) {
      outputPending = true;
    } else {
      populateOutputFlag = false;
      output = [];
      outputPending = false;

      const affList = getCurrentAffs(); // make sure these return in prio order
      const balList = getCurrentBals();

      if (affPrioOutput.length > 0) {
        if (affPrioOutput.length <= 140) {
          addToOutput(`curing priority ${affPrioOutput.join(" ")}`);
        } else {
          addToOutput(
            `curing priority ${affPrioOutput.slice(0, 140).join(" ")}`
          );
          const prioSplit = affPrioOutput.slice(140);
          eventStream.registerEvent(
            "systemOutputLostBalEvent",
            () => {
              affPrioOutput = [...prioSplit];
              forcePopulateOutput();
            },
            true
          );
        }
      }
      if (defPrioOutput.length > 0) {
        addToOutput(`curing priority defence ${defPrioOutput.join(" ")}`);
      }

      // loop affs repeatedly until no for-sure cures happen, remove those affs, bals
      // loop affs repeatedly until no maybe cures happen, remove those affs, bals
      // TODO: This appears to be a relic from old curing logic. Not for serverside
      //addToOutput(getCureOutputs(affList, balList));

      // loop defs
      addToOutput(getDefOutputs(affList, balList));
      // loop precache
      addToOutput(getCacheOutputs(affList));

      // add commands that have been accumulated from other events
      addToOutput(eventOutput);

      // This is from the doCommands function in nexSys
      //addToOutput(getCommandsToDo(affList, balList))

      sendOutput();
    }
  }
};

const forcePopulateOutput = function () {
  if (deferredPopulateTimer) {
    clearTimeout(deferredPopulateTimer);
    deferredPopulateTimer = null;
  }
  populateOutputFlag = true;
  // outputInProgress = false; // CUSTOM
  populateOutput();
};

const flagPopulateOutput = function () {
  populateOutputFlag = true;
};

export const systemOutputDebug = () => {
  console.log(`outputInProgress: ${outputInProgress}`);
  console.log(`sys.isPaused(): ${sys.isPaused()}`);
  console.log(`sys.isSlowMode(): ${sys.isSlowMode()}`);
  console.log(`outputPending: ${outputPending}`);
  console.log(`output: ${output}`);
  console.log(`eventOutput: ${eventOutput}`);
  console.log(`affPrioOutput: ${affPrioOutput}`);
  console.log(`defPrioOutput: ${defPrioOutput}`);
  console.log(
    `getCureOutputs: ${getCureOutputs(getCurrentAffs(), getCurrentBals())}`
  );
  console.log(
    `getDefOutputs: ${getDefOutputs(getCurrentAffs(), getCurrentBals())}`
  );
  console.log(`getCacheOutputs: ${getCacheOutputs(getCurrentAffs())}`);
  console.log(`populateOutputFlag: ${populateOutputFlag}`);
};

let addDefPrioEventOutput = function (command) {
  defPrioOutput.push(command);
  scheduleDeferredPopulate();
};
eventStream.registerEvent("PriorityDefOutputAdd", addDefPrioEventOutput);

let addAffPrioEventOutput = function (command) {
  affPrioOutput.push(command);
  scheduleDeferredPopulate();
};
eventStream.registerEvent("PriorityAffOutputAdd", addAffPrioEventOutput);

const addToEventOutput = function (command) {
  if (Array.isArray(command)) {
    eventOutput = eventOutput.concat(command);
  } else {
    eventOutput.push(command);
  }
  forcePopulateOutput();
};

eventStream.registerEvent("SystemOutputAdd", addToEventOutput);

/* CUSTOM: This will allow custom class queues to operate off of GMCP recovering balance instead of prompt.
   this is slightly faster. And will allow the System defenses to preempt the class moves. Most importantly
   shifting parry. */
eventStream.registerEvent("balanceRecoveredEvent", populateOutput);
eventStream.registerEvent("equilibriumRecoveredEvent", populateOutput);
/* ---------------------- */

eventStream.registerEvent("PromptEvent", populateOutput);

eventStream.registerEvent("ForcePopulateEvent", forcePopulateOutput);
eventStream.registerEvent("AffGot", flagPopulateOutput);
eventStream.registerEvent("AffLost", flagPopulateOutput);
eventStream.registerEvent("DefGot", flagPopulateOutput);
eventStream.registerEvent("DefLost", flagPopulateOutput);
eventStream.registerEvent("BalanceGot", flagPopulateOutput);
eventStream.registerEvent("BalanceLost", flagPopulateOutput);
eventStream.registerEvent("AffPrioritySetEvent", flagPopulateOutput);
eventStream.registerEvent("DefPrioritySetEvent", flagPopulateOutput);
eventStream.registerEvent("PrioritySetEvent", flagPopulateOutput);
eventStream.registerEvent("RiftListCompleteEvent", forcePopulateOutput);

const outputComplete = function () {
  eventStream.raiseEvent("OutputCompleteEvent", output);
  outputInProgress = false;
  output = [];

  if (outputPending) {
    forcePopulateOutput();
  }
};

const systemOutputComplete = function () {
  outputComplete();
  eventStream.raiseEvent("systemOutputGotBalEvent");
};
eventStream.registerEvent("SystemOutputCompleteEvent", systemOutputComplete);

const systemOutputBalanceCheck = () => {
  if (outputInProgress) {
    outputComplete();
  }
};
eventStream.registerEvent("systemOutputGotBalEvent", systemOutputBalanceCheck);

// TODO Hack because nexSys was getting "stuck" in output pending after dying and returning to life.
// This could be caused by the output attempting to send JUST before the alive sequence completes ?
const aliveUnstuckHack = () => {
  nexusclient.send_commands("echo SystemEvent SystemOutputCompleteEvent");
};
//eventStream.registerEvent("aliveEvent", sendOutput);
eventStream.registerEvent("aliveEvent", aliveUnstuckHack);
