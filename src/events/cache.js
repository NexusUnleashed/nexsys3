let filterHerbAndAmount = function(herb) {
  if(herb.location == "inv") {
      if(herb.item != undefined && herb.item.icon == "curative"){
          let herbShort = "";
          let amount = 1;
          if(herb.item.name.startsWith("a group of")) {
              let regexp = /(\d+)\s+(.+)/i;
              let matches = herb.item.name.match(regexp);
              herbShort = nexSys.herb_name_to_herb[matches[2]];
              amount = parseInt(matches[1]);
          }
          else {
              herbShort = nexSys.herb_name_to_herb[herb.item.name];
              amount = 1;
          }

          if(herbShort != undefined) {
              return {name: herbShort, amount: amount};
          }
      }
  }
  return false;
};

let eventGmcpInvAdd = function(herb) {
  let herbAmt = filterHerbAndAmount(herb);
  if(herbAmt){
      nexSys.eventStream.raiseEvent(herbAmt.name+'CacheCountAddEvent', herbAmt.amount);
  }
};

nexSys.eventStream.registerEvent('Char.Items.Add', eventGmcpInvAdd);

let eventGmcpInvRemove = function(herb) {
  let herbAmt = filterHerbAndAmount(herb);
  if(herbAmt){
      nexSys.eventStream.raiseEvent(herbAmt.name+'CacheCountSubtractEvent', herbAmt.amount);
  }
};

nexSys.eventStream.registerEvent('Char.Items.Remove', eventGmcpInvRemove);

let eventGmcpIreRiftChange = function(args) {
  let herb = args.name;
  let amount = parseInt(args.amount);
  
  nexSys.eventStream.raiseEvent(herb+'RiftSetEvent', amount);
};

nexSys.eventStream.registerEvent('IRE.Rift.Change', eventGmcpIreRiftChange);

let eventGmcpIreRiftList = function(args) {
  for(let i=0; i < args.length; i++) {
      nexSys.eventStream.raiseEvent(args[i].name+'RiftSetEvent', args[i].amount);
  }
  
  nexSys.eventStream.raiseEvent('RiftListCompleteEvent');
};

nexSys.eventStream.registerEvent('IRE.Rift.List', eventGmcpIreRiftList);

send_GMCP('IRE.Rift.Request')