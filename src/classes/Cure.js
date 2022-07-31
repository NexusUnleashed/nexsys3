/*global eventStream */
import Priority from './Priority.js'

class Cure {
    constructor(name, prio = 0, obj) {
        this._name = name
        this._bals_req = obj.bals_req || []
        this._bals_used = obj.bals_used || []
        this._blocks = obj.blocks || []
        this._command = obj.command || ''
        this._time_used = 0
        this._order = obj.order || []

        this._prio = new Priority(this._name, prio)
        this.registerEvents()
    }

    registerEvents() {
        eventStream.registerEvent(
            this.name + 'UsedCureEvent',
            this.used.bind(this)
        )
    }

    raiseEventCureUsed() {
        eventStream.raiseEvent('CureUsed', this)
    }

    raiseEventSet() {
        eventStream.raiseEvent('CurePrioritySetEvent', this)
    }

    get name() {
        return this._name
    }

    get balsUsed() {
        return this._bals_used
    }

    get balsReq() {
        return this._bals_req
    }

    get blocks() {
        return this._blocks
    }

    get command() {
        return this._command
    }

    get order() {
        return this._order
    }

    get lastUsed() {
        return this._time_used
    }

    get isIgnored() {
        return this._prio.prio === 0
    }

    used() {
        this._time_used = performance.now()
        this.raiseEventCureUsed()
    }

    set_prio(prio) {
        this._prio.setPrio(prio)
        this.raiseEventSet()
    }

    set_default_prio(prio) {
        this._prio.setDefault(prio)
        this.set_prio(prio)
    }

    toggle_default_prio(prio) {
        if (this._prio.prio === prio) {
            this.set_default_prio(0)
        } else {
            this.set_default_prio(prio)
        }
    }

    reset_prio() {
        this._prio.reset()
        this.raiseEventSet()
    }
}

export default Cure
