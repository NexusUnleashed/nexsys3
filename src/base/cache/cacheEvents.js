/* global eventStream */
import {herb_name_to_herb} from '../tables/cacheTable'

let filterHerbAndAmount = function(herb) {
  if(herb.location === "inv") {
      if(herb.item !== undefined && herb.item.icon === "curative"){
          let herbShort = "";
          let amount = 1;
          if(herb.item.name.startsWith("a group of")) {
              let regexp = /(\d+)\s+(.+)/i;
              let matches = herb.item.name.match(regexp);
              herbShort = herb_name_to_herb[matches[2]];
              amount = parseInt(matches[1]);
          }
          else {
              herbShort = herb_name_to_herb[herb.item.name];
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
      eventStream.raiseEvent(herbAmt.name+'CacheCountAddEvent', herbAmt.amount);
  }
};

eventStream.registerEvent('Char.Items.Add', eventGmcpInvAdd);

let eventGmcpInvRemove = function(herb) {
  let herbAmt = filterHerbAndAmount(herb);
  if(herbAmt){
      eventStream.raiseEvent(herbAmt.name+'CacheCountSubtractEvent', herbAmt.amount);
  }
};

eventStream.registerEvent('Char.Items.Remove', eventGmcpInvRemove);

let eventGmcpIreRiftChange = function(args) {
  let herb = args.name;
  let amount = parseInt(args.amount);
  
  eventStream.raiseEvent(herb+'RiftSetEvent', amount);
};

eventStream.registerEvent('IRE.Rift.Change', eventGmcpIreRiftChange);

let eventGmcpIreRiftList = function(args) {
  for(let i=0; i < args.length; i++) {
      eventStream.raiseEvent(args[i].name+'RiftSetEvent', args[i].amount);
  }
  
  eventStream.raiseEvent('RiftListCompleteEvent');
};

eventStream.registerEvent('IRE.Rift.List', eventGmcpIreRiftList);