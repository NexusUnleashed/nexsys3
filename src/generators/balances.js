/*global */

import { Balance, BalExtended } from '../classes/Balance.js'
import { balanceTable as balances } from '../tables/balanceTable.js'

export const Bals = {}

for (const bal in balances) {
    const obj = {}
    const length = balances[bal].length

    if (balances[bal].aff_modifiers) {
        obj.aff_modifiers = balances[bal].aff_modifiers
        Bals[bal] = new BalExtended(bal, length, obj)
    } else {
        Bals[bal] = new Balance(bal, length)
    }
}