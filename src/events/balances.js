let eventGmcpBalances = function(vitals) {
  if (vitals.bal == '1') {
      // CUSTOM event for recovering eqbal tracking
      if (!nexSys.haveBal('balance') && nexSys.haveBal('equilibrium')) {
          nexSys.eventStream.raiseEvent('eqBalRecoveredEvent');
      }
      nexSys.eventStream.raiseEvent('balanceGotBalEvent');
  }
  else {
      nexSys.eventStream.raiseEvent('balanceLostBalEvent');
  }
  
  if(vitals.eq == '1') {
      // CUSTOM event for recovering eqbal tracking
      if (!nexSys.haveBal('equilibrium') && nexSys.haveBal('balance')) {
          nexSys.eventStream.raiseEvent('eqBalRecoveredEvent');
      }
      nexSys.eventStream.raiseEvent('equilibriumGotBalEvent');
  }
  else {
      nexSys.eventStream.raiseEvent('equilibriumLostBalEvent');
  }
};

nexSys.eventStream.registerEvent('Char.Vitals', eventGmcpBalances);