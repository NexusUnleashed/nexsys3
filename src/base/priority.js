import { eventStream } from './eventstream.js'

class Priority {
    constructor(name, prio = 0) {
        this._name = name
        this._default = prio
        this._current = prio
        this._prev = prio
    }

    get name() {
        return this._name
    }
    get prio() {
        return this._current
    }
    get defaultPrio() {
        return this._default
    }

    raiseEventPrioSet() {
        eventStream.raiseEvent('PrioritySetEvent', this)
    }
    raiseEventPrioReset() {
        eventStream.raiseEvent('PriorityResetEvent', this)
    }
    raiseEventPrioSetDefault() {
        eventStream.raiseEvent('PrioritySetDefaultEvent', this)
    }

    setPrio(prio) {
        this._prev = this.prio
        this._current = prio
        if (this._current !== this._prev) {
            this.raiseEventPrioSet()
        }
    }

    reset() {
        this.setPrio(this.defaultPrio)
        if (this._current !== this._prev) {
            this.raiseEventPrioReset()
        }
    }

    setDefault(prio) {
        this._default = prio
        this.setPrio(prio)
        this.raiseEventPrioSetDefault()
    }
}

export default Priority
