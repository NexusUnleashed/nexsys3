/*global eventStream */

import { cureTable } from './cureTable.js'
import Cure from './Cure.js'


export const cures = {}
for (const cure in cureTable) {
    const prio = cureTable[cure].prio

    const obj = {}
    obj.bals_used = cureTable[cure].bals_used
    obj.bals_req = cureTable[cure].bals_req
    obj.blocks = cureTable[cure].blocks
    obj.command = cureTable[cure].command
    obj.order = cureTable[cure].order

    cures[cure] = new Cure(cure, prio, obj)
}

eventStream.raiseEvent('CuresCreatedEvent', cures)
