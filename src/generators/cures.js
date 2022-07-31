/*global eventStream */

import { cureTable } from '../tables/cureTable.js'
import Cure from '../classes/Cure.js'


export const Cures = {}
for (const cure in cureTable) {
    const prio = cureTable[cure].prio

    const obj = {}
    obj.bals_used = cureTable[cure].bals_used
    obj.bals_req = cureTable[cure].bals_req
    obj.blocks = cureTable[cure].blocks
    obj.command = cureTable[cure].command
    obj.order = cureTable[cure].order

    Cures[cure] = new Cure(cure, prio, obj)
}

eventStream.raiseEvent('CuresCreatedEvent', Cures)
