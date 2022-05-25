import { Def, DefServerside } from '../base/def.js'
import { defTable, defPrios } from '../tables/deftable.js'
import { limbs } from '../tables/commontable.js'
import { eventStream } from '../base/eventstream.js'
import { sys, sysLog } from '../base/sys.js'
import { serversideSettings } from './serverside.js'

export const Defs = {}

const defs = defTable

for (const def in defs) {
    const curDef = defs[def]
    const prio = defPrios.keepup[def] === undefined ? 0 : defPrios.keepup[def]
    const obj = {}
    obj.command = curDef.command
    obj.bals_req = curDef.bals_req
    obj.bals_used = curDef.bals_used
    obj.blocks = curDef.blocks
    obj.skills = curDef.skills
    obj.preempt = curDef.preempt
    obj.opps = curDef.opps
    obj.serverside = curDef.serverside

    if (obj.serverside) {
        Defs[def] = new DefServerside(def, prio, obj)
    } else {
        Defs[def] = new Def(def, prio, obj)
    }
}

export function getCurrentDefs() {
    const defs = Defs
    const current_defs = []
    for (const def in defs) {
        if (defs[def].have) {
            current_defs.push(defs[def].name)
        }
    }

    return current_defs
}

/** ORIGNAL Nexsys function **
getMissingDefs() {
    let defs = nexSys.Defs;
    let missing_defs = [];
    let queue = new nexSys.PriorityQueue();
    for(let def in defs) {
        let cur_def = defs[def];
        if(!cur_def.have && !cur_def.isIgnored && !cur_def.isServerSide) {
                //push on priority queue
                queue.push(defs[def].prio, defs[def]);
                //missing_defs.push(defs[def]);
        }
    }

    let i = 100;
    while(queue.nodes.length > 0 && i > 0) {
        missing_defs.push(queue.pop());
        i--;
        if(i == 1) {
            console.log('def service looped');
            console.log(queue.nodes);
        }
    }
    // pop from priority queue in order and fill array

    return missing_defs;
},
***************************/

export function getMissingDefs() {
    const defs = Defs

    return Object.keys(defs)
        .filter(
            (def) =>
                !defs[def].isServerSide &&
                !defs[def].have &&
                !defs[def].isIgnored
        )
        .sort((a, b) => {
            return defs[a].prio - defs[b].prio
        })
}

export function haveDef(def) {
    const curDef = Defs[def]
    if (def === undefined || curDef === undefined) {
        sysLog('Called nexSys.haveDef with a def that does not exist: ' + def)
        return false
    } else {
        return curDef.have
    }
}

export function defPrioSwap(def, prio) {
    const curDef = Defs[def]
    if (def === undefined || curDef === undefined) {
        sysLog(
            'Called nexSys.defPrioSwap with an def that does not exist: ' + def
        )
    } else {
        curDef.set_prio(prio)
    }
}

export function getDefOutputs(affList, balList) {
    let defOutputs = []
    const missingDefs = getMissingDefs() // return this as sorted by prio
    const remainingDefs = []

    for (let i = 0; i < missingDefs.length; i++) {
        const def = Defs[missingDefs[i]]
        let canPerform = true
        if (
            def.blocks === undefined ||
            def.blocks.length === 0 ||
            !Array.arraysIntersect(def.blocks, affList)
        ) {
            // isn't blocked by an aff

            // if it's free to use, but requires certain bals, get those here
            if (def.balsUsed.length !== 0 && def.balsUsed[0] === 'free') {
                for (let j = 0; j < def.balsReq.length && canPerform; j++) {
                    if (balList.indexOf(def.balsReq[j]) === -1) {
                        canPerform = false
                    }
                }
            } else {
                // not sure if we can perform these yet
                remainingDefs.push(def)
                canPerform = false
            }
        } else {
            canPerform = false
        }
        // add to defOutputs if it's free and can use it
        if (canPerform) {
            defOutputs = defOutputs.concat(def.command)
        }
    }

    for (let i = 0; i < remainingDefs.length; i++) {
        const def = remainingDefs[i]
        let canPerform = true

        // if required bals are satisfied or is 'free' add to defOutput
        if (def.balsReq.length !== 0 && def.balsReq[0] !== 'free') {
            for (let j = 0; j < def.balsReq.length && canPerform; j++) {
                if (balList.indexOf(def.balsReq[j]) === -1) {
                    canPerform = false
                }
            }
        }
        if (canPerform) {
            defOutputs = defOutputs.concat(def.command)
            for (let j = 0; j < def.balsUsed.length; j++) {
                balList.splice(balList.indexOf(def.balsUsed[j]), 1)
            }
        }
    }

    return defOutputs
}

export function defup() {
    const defs = Defs
    const staticPrios = defPrios.static
    for (const def in defs) {
        const cur_def = defs[def]
        if (!cur_def.have) {
            if (staticPrios[def]) {
                if (
                    sys.isClass(cur_def.skills) ||
                    cur_def.skills === undefined ||
                    cur_def.skills.length === 0
                ) {
                    cur_def.set_prio(staticPrios[def])
                }
                // else { // CUSTOM
                //    cur_def.set_default_prio(0);
                // }
            } else if (!sys.isClass(cur_def.skills)) {
                cur_def.set_default_prio(0)
            }
        }
    }
    eventStream.raiseEvent('ForcePopulateEvent')
}

export function defoff() {
    const defs = Defs
    for (const def in defs) {
        const cur_def = defs[def]
        cur_def.reset_prio()
    }
}

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

export function parry(arg) {
    for (const limb in limbs.long) {
        Defs['parrying ' + limb].set_default_prio(0)
        if (Defs['guarding ' + limb]) {
            Defs['guarding ' + limb].set_default_prio(0)
        }
    }

    const limb = limbs.short[arg] || arg

    if (sys.isClass(Defs['guarding ' + limb].skills)) {
        Defs['guarding ' + limb].set_default_prio(25)
    } else {
        Defs['parrying ' + limb].set_default_prio(25)
        if (sys.isClass('Dragon')) {
            Defs['parrying ' + limb].set_command('clawparry ' + limb)
        } else {
            Defs['parrying ' + limb].set_command('parry ' + limb)
        }
    }
}

eventStream.registerEvent('ClassChanged', repop)
eventStream.registerEvent('ServersideSettingsCaptured', repop)
