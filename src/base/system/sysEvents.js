/* global eventStream */

import { affs } from '../affs/affs'
import { getCurrentAffs } from '../affs/affService'
import { getCurrentBals } from '../balances/balanceService'
import { getCacheOutputs } from '../cache/cacheService'
import { getCureOutputs } from '../cures/cureService'
import { getDefOutputs } from '../defs/defService'
import { Balance } from '../balances/Balance'
import { getLustCommands } from '../utilities/lust'
import { sendCmd } from './sysService'
import {sys} from './sys'
import { serversideSettings } from '../serverside/serverside'

//#region System Output
let outputInProgress = false
let outputPending = false
let output = []
const outputFeedbackCommand = 'echo SystemEvent SystemOutputCompleteEvent'
const outputChunkSize = 20
let eventOutput = []
const outputTrack = new Balance('SystemOutput', 1.0)

const addToOutput = function (command) {
    if (Array.isArray(command)) {
        output = output.concat(command)
    } else {
        output.push(command)
    }
}

const sendOutput = function () {
    if (output.length > 0) {
        eventStream.raiseEvent('OutputSentEvent', output)
        addToOutput(outputFeedbackCommand)
        const chunks = (output.length - 1) / outputChunkSize + 1
        for (let i = 0; i < chunks; i++) {
            const chunk = output.slice(
                i * outputChunkSize,
                i * outputChunkSize + outputChunkSize
            )
            const cmd = chunk.join(sys.settings.sep)
            sendCmd(cmd)
        }
        outputInProgress = true
        eventOutput = []
        eventStream.raiseEvent('SystemOutputLostBalEvent')
    }
}

let populateOutputFlag = false

const populateOutput = function () {
    if (populateOutputFlag) {
        if (
            outputInProgress ||
            sys.isPaused() ||
            sys.isSlowMode() ||
            affs.aeon.have
        ) {
            outputPending = true
        } else {
            populateOutputFlag = false
            output = []
            outputPending = false

            const affList = getCurrentAffs() // make sure these return in prio order
            const balList = getCurrentBals()

            // loop affs repeatedly until no for-sure cures happen, remove those affs, bals
            // loop affs repeatedly until no maybe cures happen, remove those affs, bals

            addToOutput(getCureOutputs(affList, balList))

            addToOutput(getLustCommands())
            // loop defs
            addToOutput(getDefOutputs(affList, balList))
            // loop precache
            addToOutput(getCacheOutputs(affList))

            // add commands that have been accumulated from other events
            addToOutput(eventOutput)

            // This is from the doCommands function in nexsys
            //addToOutput(getCommandsToDo(affList, balList))

            sendOutput()
        }
    }
}

const addToEventOutput = function (command) {
    if (Array.isArray(command)) {
        eventOutput = eventOutput.concat(command)
    } else {
        eventOutput.push(command)
    }
    forcePopulateOutput()
}

eventStream.registerEvent('SystemOutputAdd', addToEventOutput)

const forcePopulateOutput = function () {
    populateOutputFlag = true
    // outputInProgress = false; // CUSTOM
    populateOutput()
}

const flagPopulateOutput = function () {
    populateOutputFlag = true
}

/* CUSTOM: This will allow custom class queues to operate off of GMCP recovering balance instead of prompt.
   this is slightly faster. And will allow the System defenses to preempt the class moves. Most importantly
   shifting parry. */
eventStream.registerEvent('balanceRecoveredEvent', populateOutput)
eventStream.registerEvent('equilibriumRecoveredEvent', populateOutput)
/* ---------------------- */

eventStream.registerEvent('PromptEvent', populateOutput)

eventStream.registerEvent('ForcePopulateEvent', forcePopulateOutput)
eventStream.registerEvent('AffGot', flagPopulateOutput)
eventStream.registerEvent('AffLost', flagPopulateOutput)
eventStream.registerEvent('DefGot', flagPopulateOutput)
eventStream.registerEvent('DefLost', flagPopulateOutput)
eventStream.registerEvent('BalanceGot', flagPopulateOutput)
eventStream.registerEvent('BalanceLost', flagPopulateOutput)
eventStream.registerEvent('AffPrioritySetEvent', flagPopulateOutput)
eventStream.registerEvent('DefPrioritySetEvent', flagPopulateOutput)
eventStream.registerEvent('PrioritySetEvent', flagPopulateOutput)
eventStream.registerEvent('RealLustGotEvent', flagPopulateOutput)
eventStream.registerEvent('RiftListCompleteEvent', forcePopulateOutput)

/* CUSTOM
Changed to fire off of the SystemOutputGotBalEvent rather than every event with a check */
const outputComplete = function (balance) {
    eventStream.raiseEvent('OutputCompleteEvent', output)
    outputInProgress = false
    output = []

    if (outputPending) {
        forcePopulateOutput()
    }
}

eventStream.registerEvent('SystemOutputGotBalEvent', outputComplete) // CUSTOM

const systemOutputComplete = function () {
    eventStream.raiseEvent('SystemOutputGotBalEvent')
}

eventStream.registerEvent('SystemOutputCompleteEvent', systemOutputComplete)
eventStream.registerEvent('stunLostAffEvent', sendOutput)
//#endregion

const setCharVitals = function (vitals) {
    const sysChar = sys.char
    const oh = sysChar.h
    const om = sysChar.m
    const oe = sysChar.e
    const ow = sysChar.w
    const omaxh = sysChar.maxh
    const omaxm = sysChar.maxm
    const omaxe = sysChar.maxe
    const omaxw = sysChar.maxw
    const orage = sysChar.rage

    const h = vitals.hp || oh
    const m = vitals.mp || om
    const e = vitals.ep || oe
    const w = vitals.wp || ow
    const maxh = vitals.maxhp || omaxh
    const maxm = vitals.maxmp || omaxm
    const maxe = vitals.maxep || omaxe
    const maxw = vitals.maxwp || omaxw
    const regex = /(\d+)/g
    const rage = parseInt(vitals.charstats[1].match(regex)[0])

    sysChar.h = h
    sysChar.m = m
    sysChar.e = e
    sysChar.w = w
    sysChar.maxh = maxh
    sysChar.maxm = maxm
    sysChar.maxe = maxe
    sysChar.maxw = maxw
    sysChar.rage = rage

    if (h !== oh) {
        eventStream.raiseEvent('HealthUpdated', {
            max: maxh,
            current: h,
            diff: h - oh,
        })
    }

    if (m !== om) {
        eventStream.raiseEvent('ManaUpdated', {
            max: maxm,
            current: m,
            diff: m - om,
        })
    }

    if (maxh !== omaxh) {
        eventStream.raiseEvent('MaxHealthUpdated', {
            max: maxh,
            current: h,
            diff: maxh - omaxh,
        })
    }

    if (maxm !== omaxm) {
        eventStream.raiseEvent('MaxManaUpdated', {
            max: maxm,
            current: m,
            diff: maxm - omaxm,
        })
    }

    if (rage !== orage) {
        eventStream.raiseEvent('RageUpdated', {
            max: rage,
            current: rage,
            diff: rage - orage,
        })
    }

    if (h === 0) {
        if (oh > 0) {
            sys.pause()
            eventStream.raiseEvent('DiedEvent')
        }
    } else {
        if (oh === 0 && h > 0) {
            sys.unpause()
            eventStream.raiseEvent('AliveEvent')
        }
    }

    eventStream.raiseEvent('SystemCharVitalsUpdated', sysChar)
}

const setCharStatus = function (status) {
    const sysChar = sys.char
    const otarget = sysChar.target
    const oclass = sysChar.class
    const orace = sysChar.race
    const oxp = sysChar.xp

    const curTarget = (status.target || otarget).split(' ')[0].toProperCase()
    let curClass = (status.class || oclass).toProperCase()
    const curRace = status.race || orace
    let curColor = ''
    if (curRace.indexOf('Dragon') >= 0) {
        curClass = 'Dragon'
        curColor = curRace.split(' ')[0]
    }
    const xp = status.xp || oxp
    const gold = status.gold

    sysChar.target = curTarget
    sysChar.class = curClass
    sysChar.race = curRace
    sysChar.color = curColor
    sysChar.xp = xp
    sysChar.gold = gold

    if (otarget !== curTarget) {
        sys.target = curTarget
        eventStream.raiseEvent('TargetChanged', curTarget)
        eventStream.raiseEvent('GameTargetChanged', {
            old: otarget,
            new: curTarget,
        })
    } else {
        eventStream.raiseEvent('TargetSetEvent', curTarget)
    }

    if (oclass !== curClass) {
        eventStream.raiseEvent('ClassChanged', {
            old: oclass,
            new: curClass,
        })
    }

    eventStream.raiseEvent('SystemCharStatusUpdated', sysChar)
}

eventStream.registerEvent('Char.Vitals', setCharVitals)
eventStream.registerEvent('Char.Status', setCharStatus)

const lifevisionCheck = function () {
    sys.lifevision = false
}
eventStream.registerEvent('PromptEvent', lifevisionCheck)