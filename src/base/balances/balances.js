/*global */

import { Balance, BalExtended } from './Balance.js'
import { balanceTable as balances } from './balanceTable.js'

export const bals = {}

for (const bal in balances) {
    const obj = {}
    const length = balances[bal].length

    if (balances[bal].aff_modifiers) {
        obj.aff_modifiers = balances[bal].aff_modifiers
        bals[bal] = new BalExtended(bal, length, obj)
    } else {
        bals[bal] = new Balance(bal, length)
    }
}