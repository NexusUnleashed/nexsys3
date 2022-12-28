/* global nexusclient, eventStream */

import { affTable } from "../affs/affTable";
import { defPrios } from "../defs/defTable";
import { cacheTable } from "../cache/cacheTable";
import { whiteList } from "../utilities/lust";
import { sys } from "./sys";
import { defs } from "../defs/defs";
import { affs } from "../affs/affs";

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
    let settings = nexusclient.variables().vars.nexSysSettings;
    settings[name] = { ...newModel };
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
  saveModel(name, model);
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
    nexSys.affTable = { ...model };
  }

  //saveModel("affSettings", affTable);
};

const loadDefSettings = function () {
  const model = nexusclient.variables().get("nexSysSettings").defSettings; //nexusclient.variables().get('CustomDefSettings')
  if (model) {
    nexSys.defPrios = { ...model };
    //saveModel("defSettings", defPrios);
  }
};

const loadCacheSettings = function () {
  const model = nexusclient.variables().get("nexSysSettings").cacheSettings; //nexusclient.variables().get('CustomCacheSettings')
  if (model) {
    nexSys.cacheTable = { ...model };
  }
  //saveModel("cacheSettings", cacheTable);
};

const loadLustList = function () {
  const model = nexusclient.variables().get("LustWhiteList");

  if (model) {
    nexSys.whiteList = [...model];
  }
  //saveModel("LustWhiteList", whiteList);
};

export const updatePriorities = () => {
  for (let def in defPrios.keepup) {
    defs[def].set_default_prio(defPrios.keepup[def]);
  }

  for (let aff in affTable.prios) {
    affs[aff]?.set_default_prio(affTable.prios[aff]);
  }

  eventStream.raiseEvent("ForcePopulateEvent");
};

export function loadCustomSettings() {
  loadSystemSettings();
  loadAffSettings();
  loadDefSettings();
  loadCacheSettings();
  loadLustList();
}

function saveCustomSettings() {
  saveModel("CustomSystemSettings", sys.settings);
  saveModel("CustomAffSettings", affTable);
  saveModel("CustomDefSettings", defPrios);
  saveModel("CustomCacheSettings", cacheTable);
  saveModel("LustWhiteList", whiteList);
}
