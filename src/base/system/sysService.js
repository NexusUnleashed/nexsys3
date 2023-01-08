/*global eventStream */

import { sys } from "./sys";

export function sendCmd(cmd) {
  if (cmd) {
    // TODO Is this working to use the stunQueue instead of send?
    //globalThis.nexusclient.send_commands(cmd);
    nexSys.stunQueue.add(cmd);
  }
  eventStream.raiseEvent("SendCommandEvent", cmd);
}

export function psend(what) {
  if (!sys.isPaused()) {
    sendCmd(what);
  }
}

export function rsend(what) {
  if (!sys.isSlowMode()) {
    psend(what);
  }
}

// get diff from now with previous time, input ms get seconds
export function timeDiffNow(prev) {
  return (performance.now() - prev) / 1000;
}

export function sendInline(cmd) {
  if (Array.isArray(cmd)) sendCmd(cmd.join(sys.settings.sep));
  eventStream.raiseEvent("SendCommandEvent", cmd);
}
