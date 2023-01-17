/* global eventStream */
import { sys } from "./sys";
import { sendCmd } from "./sysService";
import { affs } from "../affs/affs";
import { getCurrentAffs } from "../affs/affService";
import { getCurrentBals } from "../balances/balanceService";
import { getCacheOutputs } from "../cache/cacheService";
import { getCureOutputs } from "../cures/cureService";
import { getDefOutputs } from "../defs/defService";
import { Balance } from "../balances/Balance";
import { getLustCommands } from "../utilities/lust";

let outputInProgress = false;
let outputPending = false;
let output = [];
const outputFeedbackCommand = "echo SystemEvent SystemOutputCompleteEvent";
const outputChunkSize = 20;
let eventOutput = [];
let affPrioOutput = [];
let defPrioOutput = [];
const outputTrack = new Balance("SystemOutput", 1.0);

const addToOutput = function (command) {
  if (Array.isArray(command)) {
    output = output.concat(command);
  } else {
    output.push(command);
  }
};

const sendOutput = function () {
  if (output.length > 0) {
    eventStream.raiseEvent("OutputSentEvent", output);
    addToOutput(outputFeedbackCommand);
    const chunks = parseInt((output.length - 1) / outputChunkSize + 1); //CUSTOM

    for (let i = 0; i < chunks; i++) {
      const chunk = output.slice(
        i * outputChunkSize,
        i * outputChunkSize + outputChunkSize
      );
      const cmd = chunk.join(sys.settings.sep);
      // TODO Is this working to use the stunQueue instead of send?
      nexSys.stunQueue.add(cmd);
      //sendCmd(cmd);
    }
    outputInProgress = true;
    eventOutput = [];
    affPrioOutput = [];
    defPrioOutput = [];
    eventStream.raiseEvent("SystemOutputLostBalEvent");
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
        addToOutput(`curing priority ${affPrioOutput.join(" ")}`);
      }
      if (defPrioOutput.length > 0) {
        addToOutput(`curing priority defence ${defPrioOutput.join(" ")}`);
      }

      // loop affs repeatedly until no for-sure cures happen, remove those affs, bals
      // loop affs repeatedly until no maybe cures happen, remove those affs, bals

      addToOutput(getCureOutputs(affList, balList));

      addToOutput(getLustCommands());
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

export const systemOutputDebug = () => {
  console.log(outputInProgress);
  console.log(outputPending);
  console.log(output);
  console.log(eventOutput);
  console.log(affPrioOutput);
  console.log(defPrioOutput);
  console.log(getCureOutputs(getCurrentAffs(), getCurrentBals()));
  console.log(getLustCommands());
  console.log(getDefOutputs(getCurrentAffs(), getCurrentBals()));
  console.log(getCacheOutputs(getCurrentAffs()));
  console.log(populateOutputFlag);
};

let addDefPrioEventOutput = function (command) {
  defPrioOutput.push(command);
  //forcePopulateOutput();
};
eventStream.registerEvent("PriorityDefOutputAdd", addDefPrioEventOutput);

let addAffPrioEventOutput = function (command) {
  affPrioOutput.push(command);
  //forcePopulateOutput();
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

const forcePopulateOutput = function () {
  populateOutputFlag = true;
  // outputInProgress = false; // CUSTOM
  populateOutput();
};

const flagPopulateOutput = function () {
  populateOutputFlag = true;
};

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
eventStream.registerEvent("RealLustGotEvent", flagPopulateOutput);
eventStream.registerEvent("RiftListCompleteEvent", forcePopulateOutput);

/* CUSTOM
Changed to fire off of the SystemOutputGotBalEvent rather than every event with a check */
const outputComplete = function (balance) {
  eventStream.raiseEvent("OutputCompleteEvent", output);
  outputInProgress = false;
  output = [];

  if (outputPending) {
    forcePopulateOutput();
  }
};

eventStream.registerEvent("SystemOutputGotBalEvent", outputComplete); // CUSTOM

const systemOutputComplete = function () {
  eventStream.raiseEvent("SystemOutputGotBalEvent");
};

eventStream.registerEvent("SystemOutputCompleteEvent", systemOutputComplete);

const stunOutput = () => {
  if (outputInProgress) {
    console.log(`nexSys stunOutput sendOutput`);
    sendOutput();
  }
};
eventStream.registerEvent("stunLostAffEvent", stunOutput);
