import { Aff, AffCountable, AffTimed, AffDef } from '../base/aff.js'
import { affTable } from '../tables/affTable'
import { eventStream } from '../base/eventStream.js'

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

export function getCurrentAffs() {
    const affs = Affs

    return Object.keys(affs)
        .filter((aff) => affs[aff].have === true)
        .sort((a, b) => {
            return affs[a].prio - affs[b].prio
        })
}

export function haveAff(aff) {
    const curAff = Affs[aff]
    if (aff === undefined || curAff === undefined) {
        /* nexSys.sysLog(
            'Called nexSys.haveAff with an aff that does not exist: ' + aff
        )*/
        return false
    } else {
        return curAff.have
    }
}

export function haveAffs(affs) {
    if (affs === undefined) {
        return false
    }

    if (Array.isArray(affs)) {
        for (let i = 0; i < affs.length; i++) {
            if (!haveAff(affs[i])) {
                return false
            }
        }
        return true
    } else {
        return haveAff(affs)
    }
}

export function haveAnAff(affs) {
    if (affs === undefined) {
        return false
    }

    if (Array.isArray(affs)) {
        for (let i = 0; i < affs.length; i++) {
            if (haveAff(affs[i])) {
                return true
            }
        }
        return false
    } else {
        return haveAff(affs)
    }
}

export function affPrioSwap(aff, prio) {
    const curAff = Affs[aff]
    if (aff === undefined || curAff === undefined) {
        /* nexSys.sysLog(
            'Called nexSys.affPrioSwap with an aff that does not exist: ' + aff
        )*/
    } else {
        curAff.set_prio(prio)
    }
}
