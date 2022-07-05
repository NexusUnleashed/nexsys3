/* global set_current_target */

import { Affs, getCurrentAffs } from '../create/affs'
import { getCurrentBals } from '../create/balances'
import { getCacheOutputs } from '../create/caches'
import { getCureOutputs } from '../create/cures'
import { getDefOutputs } from '../create/defs'
import { Balance } from './balance'
import { getLustCommands } from '../create/lust'
import { eventStream } from './eventStream.js'
import { sendCmd } from './utilities'

export const sys = {
    settings: {
        sep: '|',
        overrideTab: false,
        overrideUpDown: false,
        customPrompt: false,
        echoAffGot: false,
        echoAffLost: false,
        echoDefGot: true,
        echoDefLost: true,
        echoBalanceGot: true,
        echoBalanceLost: false,
        echoTrackableGot: true,
        echoTrackableLost: true,
        echoPrioritySet: true,
        curingMethod: 'Transmutation',
        sipHealthAt: 80,
        sipManaAt: 80,
        mossHealthAt: 80,
        mossManaAt: 80,
        focus: true,
        focusOverHerbs: true,
        tree: true,
        clot: true,
        clotAt: 5,
        insomnia: true,
        fracturesAbove: 30,
        manaAbilitiesAbove: 1,
        batch: true,
    },
    state: {
        paused: false,
        slowMode: false,
        sep: '|',
        overrideTab: false,
        overrideUpDown: false,
        customPrompt: false,
        echoAffGot: false,
        echoAffLost: false,
        echoDefGot: true,
        echoDefLost: true,
        echoBalanceGot: true,
        echoBalanceLost: false,
        echoTrackableGot: true,
        echoTrackableLost: true,
        echoPrioritySet: true,
        curingMethod: 'Transmutation',
        sipPriority: 'Health',
        sipHealthAt: 80,
        sipManaAt: 80,
        mossHealthAt: 80,
        mossManaAt: 80,
        focus: true,
        focusOverHerbs: true,
        tree: true,
        clot: true,
        clotAt: 5,
        insomnia: true,
        fracturesAbove: 30,
        manaAbilitiesAbove: 1,
        batch: true,
    },
    char: {
        class: '',
        race: '',
        color: '',
        h: 5000,
        m: 5000,
        e: 20000,
        w: 20000,
        xp: 0,

        maxh: 5000,
        maxm: 5000,
        maxw: 20000,
        maxe: 20000,

        bleed: 0,
        rage: 0,
        kai: 0,
        shin: 0,
        stance: '',
        target: '',
    },
    target: '',
    lifevision: false,

    isPaused() {
        return this.state.paused
    },

    isSlowMode() {
        return this.state.slowMode
    },

    getClass() {
        return this.char.class
    },

    isClass(className) {
        if (className === undefined) {
            return true
        }

        if (Array.isArray(className)) {
            for (let i = 0; i < className.length; i++) {
                if (this.checkClass(className[i])) {
                    return true
                }
            }
            return false
        } else {
            return this.checkClass(className)
        }
    },

    checkClass(className) {
        return this.getClass().toLowerCase() === className.toLowerCase()
    },

    setTarget(target) {
        target = target.toProperCase()
        eventStream.raiseEvent('TargetSetEvent', target)

        if (this.target !== target) {
            this.target = target
            eventStream.raiseEvent('TargetChanged', target)
        }
        eventStream.raiseEvent('SystemOutputAdd', 'settarget ' + target)
        set_current_target(target, true)
    },

    isTarget(person) {
        return person === undefined
            ? false
            : this.target.toLowerCase() === person.toLowerCase()
    },

    pause() {
        this.state.paused = true
        eventStream.raiseEvent('SystemPaused')
    },

    unpause() {
        this.state.paused = false
        eventStream.raiseEvent('SystemUnpaused')
    },

    pauseToggle() {
        if (this.isPaused()) {
            this.unpause()
        } else {
            this.pause()
        }
    },

    slowOn() {
        this.state.slowMode = true
        eventStream.raiseEvent('SystemSlowModeOn')
    },

    slowOff() {
        this.state.slowMode = false
        eventStream.raiseEvent('SystemSlowModeOff')
    },

    slowToggle() {
        if (this.isSlowMode()) {
            this.slowOff()
        } else {
            this.slowOn()
        }
    },

    setSystemStatus(status, arg) {
        this.state[status] = arg
        eventStream.raiseEvent('SystemStatusSetEvent', {
            status: status,
            arg: arg,
        })
    },

    toggleSystemStatus(status) {
        if (this.state[status] === 'Health') {
            this.setSystemStatus(status, 'Mana')
        } else if (this.state[status] === 'Mana') {
            this.setSystemStatus(status, 'Health')
        } else {
            this.setSystemStatus(status, !this.state[status])
        }
    },
}

export const system_loaded = false
export const sysLogging = {
    locations: 'console',
    logEvents: false,
}
export function sysLog(text) {
    if (sysLogging.locations === 'console') {
        console.log(text)
    }
}
export function sysLoggingToggle(enable) {
    sysLogging.logEvents = enable === 'on'
}

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
            Affs.aeon.have
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

            // This is from the doCommands function in nexSys
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
