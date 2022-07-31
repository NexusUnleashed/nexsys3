/*global eventStream, nexusclient */

import { Echo, EchoLinePrefix } from "../classes/Echo.js";
import { sys } from "../services/sys.js";

const TrackableEchoGot = new EchoLinePrefix(
  { text: " + ", fg: "white" },
  "green",
  ""
);
const TrackableEchoLost = new EchoLinePrefix(
  { text: " - ", fg: "white" },
  "red",
  ""
);
const AffEchoGot = new EchoLinePrefix(
  { text: " +aff ", fg: "orange" },
  "green",
  ""
);
const AffEchoLost = new EchoLinePrefix(
  { text: " -aff ", fg: "orange" },
  "red",
  ""
);
const DefEchoGot = new EchoLinePrefix(
  { text: " +def ", fg: "purple" },
  "green",
  ""
);
const DefEchoLost = new EchoLinePrefix(
  { text: " -def ", fg: "purple" },
  "red",
  ""
);
const BalanceEchoGot = new EchoLinePrefix(
  { text: " onBal ", fg: "brown" },
  "green"
);
const BalanceEchoLost = new EchoLinePrefix(
  { text: " offBal ", fg: "brown" },
  "red"
);
const PrioritySetEcho = new EchoLinePrefix(
  { text: "priority change: ", fg: "yellow" },
  "red",
  ""
);

const gotTrackable = function (data) {
  if (sys.settings.echoTrackableGot) {
    TrackableEchoGot.echo(data.name);
  }
};

const lostTrackable = function (data) {
  if (sys.settings.echoTrackableLost) {
    TrackableEchoLost.echo(data.name);
  }
};

const gotAff = function (data) {
  if (sys.settings.echoAffGot) {
    AffEchoGot.echo(data.name);
  }
};

const lostAff = function (data) {
  if (sys.settings.echoAffLost) {
    AffEchoLost.echo(data.name);
  }
};

const gotDef = function (data) {
  if (sys.settings.echoDefGot) {
    DefEchoGot.echo(data.name);
  }
};

const lostDef = function (data) {
  if (sys.settings.echoDefLost) {
    DefEchoLost.echo(data.name);
  }
};

// CUSTOM to replace balance and equilibrium messages
const gotBalance = function (data) {
  if (["equilibrium", "balance"].includes(data.name)) {
    nexusclient.display_notice(
      "You have recovered " + data.name,
      "#00ccff",
      "black",
      " (" + data.duration.toFixed(2) + ")",
      "#33cc33",
      "black"
    );
    return;
  }

  if (sys.settings.echoBalanceGot && data.name !== "SystemOutput") {
    BalanceEchoGot.echo(data.name + "(" + data.duration.toFixed(2) + ")");
  }
};

const lostBalance = function (data) {
  if (sys.settings.echoBalanceLost) {
    BalanceEchoLost.echo(data.name);
  }
};

const prioritySet = function (data) {
  if (sys.settings.echoPrioritySet) {
    PrioritySetEcho.echo(data.name + " " + data.prio);
  }
};

eventStream.removeListener("TrackableGot", "gotTrackable");
eventStream.removeListener("TrackableLost", "lostTrackable");
eventStream.removeListener("AffGot", "gotAff");
eventStream.removeListener("AffLost", "lostAff");
eventStream.removeListener("DefGot", "gotDef");
eventStream.removeListener("DefLost", "lostDef");
eventStream.removeListener("BalanceGot", "gotBalance");
eventStream.removeListener("BalanceLost", "lostBalance");
eventStream.removeListener("PrioritySetEvent", "prioritySet");

eventStream.registerEvent("TrackableGot", gotTrackable);
eventStream.registerEvent("TrackableLost", lostTrackable);
eventStream.registerEvent("AffGot", gotAff);
eventStream.registerEvent("AffLost", lostAff);
eventStream.registerEvent("DefGot", gotDef);
eventStream.registerEvent("DefLost", lostDef);
eventStream.registerEvent("BalanceGot", gotBalance);
eventStream.registerEvent("BalanceLost", lostBalance);
eventStream.registerEvent("PrioritySetEvent", prioritySet);

const SystemOutputDisplay = new Echo("red");

const systemOutputSentDisplay = function (output) {
  SystemOutputDisplay.echo("(" + output.join("|") + ")");
};

eventStream.registerEvent("OutputSentEvent", systemOutputSentDisplay);
