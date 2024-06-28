/* global eventStream */
import { haveBal } from "./balanceService";

let eventGmcpBalances = function (vitals) {
  if (vitals.bal === "1" && !haveBal("balance")) {
    // CUSTOM event for recovering eqbal tracking
    if (!haveBal("balance") && haveBal("equilibrium")) {
      eventStream.raiseEvent("eqBalRecoveredEvent");
    }

    eventStream.raiseEvent("balanceGotBalEvent");
  } else if (vitals.bal === "0" && haveBal("balance")) {
    eventStream.raiseEvent("balanceLostBalEvent");
  }

  if (vitals.eq === "1" && !haveBal("equilibrium")) {
    // CUSTOM event for recovering eqbal tracking
    if (!haveBal("equilibrium") && haveBal("balance")) {
      eventStream.raiseEvent("eqBalRecoveredEvent");
    }

    eventStream.raiseEvent("equilibriumGotBalEvent");
  } else if (vitals.eq === "0" && haveBal("equilibrium")) {
    eventStream.raiseEvent("equilibriumLostBalEvent");
  }
};

eventStream.registerEvent("Char.Vitals", eventGmcpBalances);
