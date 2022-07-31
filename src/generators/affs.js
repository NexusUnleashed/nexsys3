/*global eventStream */

import { Aff, AffCountable, AffTimed, AffDef } from '../classes/Aff.js'
import { affTable } from '../tables/affTable.js'

export const Affs = {}

const affs = affTable
for (let i = 0; i < affs.list.length; i++) {
    const affname = affs.list[i]
    const count = affs.types.countable[affname]
    const timed = affs.types.timed[affname]
    const defs = affs.types.defs[affname]
    const prio = affs.prios[affname]
    const uncurable = affs.types.uncurable[affname]

    if (count) {
        Affs[affname] = new AffCountable(
            affname,
            prio,
            count.min,
            count.max,
            uncurable
        )
    } else if (timed) {
        Affs[affname] = new AffTimed(affname, prio, timed.length, uncurable)
    } else if (defs) {
        Affs[affname] = new AffDef(affname, prio, uncurable)
    } else {
        Affs[affname] = new Aff(affname, prio, uncurable)
    }
}

const addCuresToAffs = function (cures) {
    for (const cure in cures) {
        const order = cures[cure].order
        if (order !== undefined) {
            for (let i = 0; i < order.length; i++) {
                Affs[order[i]].addCure(cure)
            }
        }
    }
}
eventStream.registerEvent('CuresCreatedEvent', addCuresToAffs)