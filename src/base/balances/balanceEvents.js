/* global eventStream */
import { haveBal } from "./balanceService";

let eventGmcpBalances = function (vitals) {
  if (vitals.bal === "1" && !haveBal("balance")) {
    eventStream.raiseEvent("balanceGotBalEvent");
    // CUSTOM event for recovering eqbal tracking
    if (haveBal("equilibrium")) {
      eventStream.raiseEvent("eqBalRecoveredEvent");
    }
  } else if (vitals.bal === "0" && haveBal("balance")) {
    eventStream.raiseEvent("balanceLostBalEvent");
  }

  if (vitals.eq === "1" && !haveBal("equilibrium")) {
    eventStream.raiseEvent("equilibriumGotBalEvent");

    // CUSTOM event for recovering eqbal tracking
    if (haveBal("balance")) {
      eventStream.raiseEvent("eqBalRecoveredEvent");
    }
  } else if (vitals.eq === "0" && haveBal("equilibrium")) {
    eventStream.raiseEvent("equilibriumLostBalEvent");
  }
};

eventStream.registerEvent("Char.Vitals", eventGmcpBalances);
