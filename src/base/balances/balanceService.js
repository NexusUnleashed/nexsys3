import { bals } from "./balances";

export function getCurrentBals() {
  const currentBals = [];
  for (const bal in bals) {
      if (bals[bal].have) {
          currentBals.push(bals[bal].name);
      }
  }

  return currentBals;
}

export function haveBal(bal) {
  const curBal = bals[bal];
  if (bal === undefined || curBal === undefined) {
      // nexSys.sysLog('Called nexSys.haveBal with a balance that does not exist: ' + bal);
      return false;
  } else {
      return curBal.have;
  }
}

export function haveBals(bals) {
  if (bals === undefined) {
      return false;
  }

  if (Array.isArray(bals)) {
      for (let i = 0; i < bals.length; i++) {
          if (!haveBal(bals[i])) {
              return false;
          }
      }
      return true;
  } else {
      return haveBal(bals);
  }
}

export function haveABal(bals) {
  if (bals === undefined) {
      return false;
  }

  if (Array.isArray(bals)) {
      for (let i = 0; i < bals.length; i++) {
          if (haveBal(bals[i])) {
              return true;
          }
      }
      return false;
  } else {
      return haveBal(bals);
  }
}