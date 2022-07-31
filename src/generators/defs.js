/*global eventStream */

import { Def, DefServerside } from '../classes/Def.js'
import { defTable, defPrios } from '../tables/defTable.js'
import { limbs } from '../tables/commonTable.js'
import { sys, sysLog } from '../services/sys.js'
import { serversideSettings } from '../events/serverside.js'

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
