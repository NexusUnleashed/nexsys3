import { eventStream } from "../base/eventstream"

export const whiteList = []

export let rejectList = []

const lustLost = function (who) {
    rejectList.splice(rejectList.indexOf(who), 1)
}
eventStream.registerEvent('LustLostEvent', lustLost)

const lustGot = function (who) {
    // add if not already in there and if not in whitelist
    if (rejectList.indexOf(who) === -1 && whiteList.indexOf(who) === -1) {
        rejectList.push(who)
        eventStream.raiseEvent('RealLustGotEvent', who)
    }
}

export function getLustCommands() {
    const cmd = []
    for (let i = 0; i < rejectList.length; i++) {
        cmd.push('reject ' + rejectList[i])
    }
    return cmd
}

eventStream.registerEvent('LustGotEvent', lustGot)

const lustLostAll = function () {
    rejectList = []
}
eventStream.registerEvent('LustNoneEvent', lustLostAll)
