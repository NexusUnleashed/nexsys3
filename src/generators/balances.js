/*global eventStream */

import { Balance, BalExtended } from '../base/balance.js'
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

export function getCurrentBals() {
    const bals = Bals
    const currentBals = []
    for (const bal in bals) {
        if (bals[bal].have) {
            currentBals.push(bals[bal].name)
        }
    }

    return currentBals
}

export function haveBal(bal) {
    const curBal = Bals[bal]
    if (bal === undefined || curBal === undefined) {
        // nexSys.sysLog('Called nexSys.haveBal with a balance that does not exist: ' + bal);
        return false
    } else {
        return curBal.have
    }
}

export function haveBals(bals) {
    if (bals === undefined) {
        return false
    }

    if (Array.isArray(bals)) {
        for (let i = 0; i < bals.length; i++) {
            if (!haveBal(bals[i])) {
                return false
            }
        }
        return true
    } else {
        return haveBal(bals)
    }
}

export function haveABal(bals) {
    if (bals === undefined) {
        return false
    }

    if (Array.isArray(bals)) {
        for (let i = 0; i < bals.length; i++) {
            if (haveBal(bals[i])) {
                return true
            }
        }
        return false
    } else {
        return haveBal(bals)
    }
}

const eventGmcpBalances = function (vitals) {
    if (vitals.bal === '1') {
        // CUSTOM event for recovering eqbal tracking
        if (!haveBal('balance') && haveBal('equilibrium')) {
            eventStream.raiseEvent('eqBalRecoveredEvent')
        }
        eventStream.raiseEvent('balanceGotBalEvent')
    } else {
        eventStream.raiseEvent('balanceLostBalEvent')
    }

    if (vitals.eq === '1') {
        // CUSTOM event for recovering eqbal tracking
        if (!haveBal('equilibrium') && haveBal('balance')) {
            eventStream.raiseEvent('eqBalRecoveredEvent')
        }
        eventStream.raiseEvent('equilibriumGotBalEvent')
    } else {
        eventStream.raiseEvent('equilibriumLostBalEvent')
    }
}

eventStream.registerEvent('Char.Vitals', eventGmcpBalances)
