/* global eventStream */
import {haveBal} from '../functions/bals'

let eventGmcpBalances = function(vitals) {
  if (vitals.bal === '1') {
      // CUSTOM event for recovering eqbal tracking
      if (!haveBal('balance') && haveBal('equilibrium')) {
          eventStream.raiseEvent('eqBalRecoveredEvent');
      }
      eventStream.raiseEvent('balanceGotBalEvent');
  }
  else {
      eventStream.raiseEvent('balanceLostBalEvent');
  }
  
  if(vitals.eq == '1') {
      // CUSTOM event for recovering eqbal tracking
      if (!haveBal('equilibrium') && haveBal('balance')) {
          eventStream.raiseEvent('eqBalRecoveredEvent');
      }
      eventStream.raiseEvent('equilibriumGotBalEvent');
  }
  else {
      eventStream.raiseEvent('equilibriumLostBalEvent');
  }
};

eventStream.registerEvent('Char.Vitals', eventGmcpBalances);