/* global nexusclient, eventStream */

import { affTable } from "../affs/affTable";
import { defPrios } from "../defs/defTable";
import { cacheTable } from "../cache/cacheTable";
import { whiteList } from "../utilities/lust";
import { sys } from "./sys";
import { affs } from "../affs/affs";
import { updatePrecache } from "../cache/cacheService";
import { repop } from "../defs/defService";
import { serversideSettings } from "../serverside/serverside";

// Khaseem: Removed the CustomCureTable, CustomBalanceTable, and CustomDefTable
// these should be static entries. I do not see the need to store these variables.

export const updateList = function (list, newList) {
  if (newList) {
    for (let i = 0; i < newList.length; i++) {
      if (!list.includes(newList[i])) {
        list.push(newList[i]);
      }
    }
  }
};

export const updateModel = function (name, newModel) {
  if (newModel) {
    switch (name) {
      case "cacheSettings":
        cacheTable = { ...newModel };
        break;
      case "systemSettings":
        sys.settings = { ...newModel };
        break;
      case "defSettings":
        defPrios.keepup = { ...newModel.keepup };
        defPrios.static = { ...newModel.static };
        break;
      case "affSettings":
        affTable.prios = { ...newModel.prios };
        break;
      default:
        break;
    }
  }
};
/* TODO I don't like this method
export const updateModel = function (model, newModel) {

  if (newModel) {
    for (const key in newModel) {
      model[key] = newModel[key];
    }
  } else {
    console.log(model + " model was null in updateModel");
  }
  
};*/

export const saveModel = function (name, model) {
  if (model) {
    let settings = nexusclient.variables().vars.nexSysSettings;
    settings[name] = { ...model };
    eventStream.raiseEvent(name + "ModelSavedEvent", model);
  } else {
    console.log(name + " model was null in saveModel");
  }
};

export const updateAndSaveModel = function (name, newModel) {
  updateModel(name, newModel);
  saveModel(name, newModel);
};

const loadSystemSettings = function () {
  if (typeof nexusclient.variables().get("nexSysSettings") === "undefined") {
    nexusclient.variables().set("nexSysSettings", {});
  }
  const model = nexusclient.variables().get("nexSysSettings").systemSettings; //nexusclient.variables().get('CustomSystemSettings')
  sys.settings = { ...model };
  //updateAndSaveModel("systemSettings", sys.settings, model);
  //updateModel(sys.settings, model);
};

const loadAffSettings = function () {
  const model = nexusclient.variables().get("nexSysSettings").affSettings; //nexusclient.variables().get('CustomAffSettings')
  if (model) {
    affTable.prios = { ...model.prios };
    affTable.prioArrays = { ...model.prioArrays };
  }

  //saveModel("affSettings", affTable);
};

const loadDefSettings = function () {
  const model = nexusclient.variables().get("nexSysSettings").defSettings; //nexusclient.variables().get('CustomDefSettings')
  if (model) {
    defPrios.keepup = { ...model.keepup };
    defPrios.static = { ...model.static };
    //saveModel("defSettings", defPrios);
    /*
      for (let def in defPrios.keepup) {
        defs[def]._prio._default = defPrios.keepup[def];
      }
    */
  }
};

const loadCacheSettings = function () {
  const model = nexusclient.variables().get("nexSysSettings").cacheSettings; //nexusclient.variables().get('CustomCacheSettings')
  if (model) {
    for (const cure in cacheTable) {
      cacheTable[cure] = model[cure];
    }
  }
  //saveModel("cacheSettings", cacheTable);
};

const loadLustList = function () {
  const model = nexusclient.variables().get("LustWhiteList");

  if (model) {
    whiteList.length = 0;
    model.forEach((element) => {
      whiteList.push(element);
    });
  }
  //saveModel("LustWhiteList", whiteList);
};

export const updatePriorities = () => {
  /*
  for (let def in defPrios.keepup) {
    defs[def].set_default_prio(defPrios.keepup[def]);
    nexSys.defs.deathsight._prio._default
  }
  */
  Object.assign(sys.state, { ...sys.settings });
  for (const status in serversideSettings.status) {
    const curStatus = serversideSettings.status[status];
    const systemStatus = sys.state[status];
    if (curStatus !== systemStatus) {
      sys.setSystemStatus(status, systemStatus);
    }
  }

  /* DEBUG
for (const status in nexSys.serversideSettings.status) {
    const curStatus = nexSys.serversideSettings.status[status];
    const systemStatus = nexSys.sys.state[status];
    if (curStatus !== systemStatus) {
      console.log(curStatus);
      console.log(`${status} ${systemStatus}`);
    }
  }
  */
  updatePrecache();

  for (let aff in affTable.prios) {
    affs[aff]?.set_default_prio(affTable.prios[aff]);
  }

  repop();
  //eventStream.raiseEvent("ForcePopulateEvent");

  globalThis.localStorage.setItem(
    "nexSysSettings",
    JSON.stringify({
      defSettings: { ...nexSys.defPrios },
      affSettings: { ...nexSys.affTable },
      cacheSettings: { ...nexSys.cacheTable },
      systemSettings: { ...nexSys.sys.settings },
    })
  );
};

export function loadCustomSettings() {
  loadSystemSettings();
  loadAffSettings();
  loadDefSettings();
  loadCacheSettings();
  loadLustList();
  updatePriorities();
}

function saveCustomSettings() {
  saveModel("CustomSystemSettings", sys.settings);
  saveModel("CustomAffSettings", affTable);
  saveModel("CustomDefSettings", defPrios);
  saveModel("CustomCacheSettings", cacheTable);
  saveModel("LustWhiteList", whiteList);
}
