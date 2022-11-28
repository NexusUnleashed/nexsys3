/* global nexusclient, eventStream */

import { affTable } from "../affs/affTable";
import { defPrios } from "../defs/defTable";
import { cacheTable } from "../cache/cacheTable";
import { whiteList } from "../utilities/lust";
import { sys } from "./sys";
import { defs } from "../defs/defs";
import { affs } from "../affs/affs";
import { caches } from "../cache/caches";

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

export const updateModel = function (model, newModel) {
  if (newModel) {
    for (const key in newModel) {
      model[key] = newModel[key];
    }
  } else {
    console.log(model + " model was null in updateModel");
  }
};

export const saveModel = function (name, model) {
  if (model) {
    let settings = nexusclient.variables().get("nexsysSettings");
    settings[name] = model;
    nexusclient.variables().set("nexsysSettings", settings);
    eventStream.raiseEvent(name + "ModelSavedEvent", model);
  } else {
    console.log(name + " model was null in saveModel");
  }
};

export const updateAndSaveModel = function (name, model, newModel) {
  updateModel(model, newModel);
  saveModel(name, model);
};

const loadSystemSettings = function () {
  if (typeof nexusclient.variables().get("nexsysSettings") === "undefined") {
    nexusclient.variables().set("nexsysSettings", {});
  }
  const model = nexusclient.variables().get("nexsysSettings").systemSettings; //nexusclient.variables().get('CustomSystemSettings')
  //updateAndSaveModel("systemSettings", sys.settings, model);
  updateModel(sys.settings, model);
};

const loadAffSettings = function () {
  const model = nexusclient.variables().get("nexsysSettings").affSettings; //nexusclient.variables().get('CustomAffSettings')
  if (model) {
    updateList(affTable.list, model.list);
    updateModel(affTable.prios, model.prios);
    for (let aff in affTable.prios) {
      affs[aff]?._prio.initialize(affTable.prios[aff]);
    }
    if (model.types) {
      updateModel(affTable.types.defs, model.types.defs);
      updateModel(affTable.types.countable, model.types.countable);
      updateModel(affTable.types.timed, model.types.timed);
      updateModel(affTable.types.unknown, model.types.unknown);
      updateModel(affTable.types.uncurable, model.types.uncurable);
    }
  }

  //saveModel("affSettings", affTable);
};

const loadDefSettings = function () {
  const model = nexusclient.variables().get("nexsysSettings").defSettings; //nexusclient.variables().get('CustomDefSettings')
  if (model) {
    updateModel(defPrios.keepup, model.keepup);
    updateModel(defPrios.static, model.static);
    for (let def in defPrios.keepup) {
      defs[def]._prio.initialize(defPrios.keepup[def]);
    }
  }

  //saveModel("defSettings", defPrios);
};

const loadCacheSettings = function () {
  const model = nexusclient.variables().get("nexsysSettings").cacheSettings; //nexusclient.variables().get('CustomCacheSettings')
  if (model) {
    updateModel(cacheTable, model);
    for (const curative in cacheTable) {
      caches[curative]._amount = cacheTable[curative];
    }
  }
  //saveModel("cacheSettings", cacheTable);
};

const loadLustList = function () {
  whiteList = nexusclient.variables().get("LustWhiteList") || whiteList;
  //saveModel("LustWhiteList", whiteList);
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
