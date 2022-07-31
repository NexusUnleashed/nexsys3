/* global nexusclient, eventStream */

import { affTable } from '../tables/affTable'
import { defTable, defPrios } from '../tables/defTable'
import { balanceTable } from '../tables/balanceTable'
import { cacheTable } from '../tables/cacheTable'
import { cureTable } from '../tables/cureTable'
import { whiteList } from './lust'
import { sys } from '../base/sys'

export const updateList = function (list, newList) {
    if (newList) {
        for (let i = 0; i < newList.length; i++) {
            if (!list.includes(newList[i])) {
                list.push(newList[i])
            }
        }
    }
}

export const updateModel = function (model, newModel) {
    if (newModel) {
        for (const key in newModel) {
            model[key] = newModel[key]
        }
    } else {
        console.log(model + ' model was null in updateModel')
    }
}

export const saveModel = function (name, model) {
    if (model) {
        nexusclient.variables().set(name, model)
        eventStream.raiseEvent(name + 'ModelSavedEvent', model)
    } else {
        console.log(name + ' model was null in saveModel')
    }
}

export const updateAndSaveModel = function (name, model, newModel) {
    updateModel(model, newModel)
    saveModel(name, model)
}

const loadSystemSettings = function () {
    const model = nexusclient.variables().get('CustomSystemSettings')
    updateAndSaveModel('CustomSystemSettings', sys.settings, model)
}

const loadAffSettings = function () {
    const model = nexusclient.variables().get('CustomAffSettings')
    if (model) {
        updateList(affTable.list, model.list)
        updateModel(affTable.prios, model.prios)
        if (model.types) {
            updateModel(affTable.types.defs, model.types.defs)
            updateModel(affTable.types.countable, model.types.countable)
            updateModel(affTable.types.timed, model.types.timed)
            updateModel(affTable.types.unknown, model.types.unknown)
            updateModel(affTable.types.uncurable, model.types.uncurable)
        }
    }

    saveModel('CustomAffSettings', affTable)
}

const loadDefTable = function () {
    const model = nexusclient.variables().get('CustomDefTable')
    updateAndSaveModel('CustomDefTable', defTable, model)
}

const loadDefSettings = function () {
    const model = nexusclient.variables().get('CustomDefSettings')
    if (model) {
        updateModel(defPrios.keepup, model.keepup)
        updateModel(defPrios.static, model.static)
    }

    saveModel('CustomDefSettings', defPrios)
}

const loadBalanceTable = function () {
    const model = nexusclient.variables().get('CustomBalanceTable')
    updateAndSaveModel('CustomBalanceTable', balanceTable, model)
}

const loadCacheSettings = function () {
    const model = nexusclient.variables().get('CustomCacheSettings')
    updateAndSaveModel('CustomCacheSettings', cacheTable, model)
}

const loadCureTable = function () {
    const model = nexusclient.variables().get('CustomCureTable')
    updateAndSaveModel('CustomCureTable', cureTable, model)
}

const loadLustList = function () {
    whiteList = nexusclient.variables().get('LustWhiteList') || whiteList
    saveModel('LustWhiteList', whiteList)
}

export function loadCustomSettings() {
    loadSystemSettings()
    loadAffSettings()
    loadDefTable()
    loadDefSettings()
    loadBalanceTable()
    loadCacheSettings()
    loadCureTable()
    loadLustList()
}

export function saveCustomSettings() {
    saveModel('CustomSystemSettings', sys.settings)
    saveModel('CustomAffSettings', affTable)
    saveModel('CustomDefTable', defTable)
    saveModel('CustomDefSettings', defPrios)
    saveModel('CustomBalanceTable', balanceTable)
    saveModel('CustomCacheSettings', cacheTable)
    saveModel('CustomCureTable', cureTable)
    saveModel('LustWhiteList', whiteList)
}

// loadCustomSettings()
