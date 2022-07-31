
let eventGmcpDefList = function(list) {
  let prev_list = nexSys.getCurrentDefs();
  let new_list = {};

  for (i in list) {
      let def = list[i].name;
      def = def.replace('\(', '');
      def = def.replace('\)', '');
      // maintain new list, to compare to old list when done
      new_list[def] = true;

      nexSys.eventStream.raiseEvent(def+'GotDefEvent');
  }

  // compare new list to old list and remove defs that are no longer there
  for (let i in prev_list) {
      if(new_list[prev_list[i]] === undefined) {
          nexSys.eventStream.raiseEvent(prev_list[i]+'LostDefEvent');
      }
  }
};

nexSys.eventStream.registerEvent('Char.Defences.List', eventGmcpDefList);


let eventGmcpDefAdd = function(obj) {
  var def = obj.name;

  def = def.replace('\(', '');
  def = def.replace('\)', '');

  nexSys.eventStream.raiseEvent(def+'GotDefEvent');
};

nexSys.eventStream.registerEvent('Char.Defences.Add', eventGmcpDefAdd);

let eventGmcpDefRemove = function(def) {
  def = def[0];

  def = def.replace('\(', '');
  def = def.replace('\)', '');

  nexSys.eventStream.raiseEvent(def+'LostDefEvent');
};

nexSys.eventStream.registerEvent('Char.Defences.Remove', eventGmcpDefRemove);

export function repop(args) {
  if (serversideSettings.loaded) {
      const defs = Defs
      // console.log(defs)
      const keepupPrios = defPrios.keepup
      // console.log(keepupPrios);
      for (const def in defs) {
          const cur_def = defs[def]
          if (
              sys.isClass(cur_def.skills) ||
              cur_def.skills === undefined ||
              cur_def.skills.length === 0
          ) {
              if (keepupPrios[def]) {
                  cur_def.set_default_prio(keepupPrios[def])
              } else {
                  cur_def.set_default_prio(0)
              }
          } else {
              cur_def.set_default_prio(0)
          }
      }
      for (const limb in limbs.long) {
          if (!Defs['parrying ' + limb].isIgnored) {
              parry(limb)
          }
          if (Defs['guarding ' + limb]) {
              if (!Defs['guarding ' + limb].isIgnored) {
                  parry(limb)
              }
          }
      }
      eventStream.raiseEvent('ForcePopulateEvent')
  }
}

eventStream.registerEvent('ClassChanged', repop)
eventStream.registerEvent('ServersideSettingsCaptured', repop)