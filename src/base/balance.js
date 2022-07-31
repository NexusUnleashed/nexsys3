/*global eventStream */
import Trackable from './trackable'
import Timer from './timer'

export class Balance extends Trackable {
    constructor(name, length = 60) {
        super(name)
        this._length = length
        this._timer = new Timer(this._name, this._length)
        this._status = true
        this.registerEvents()
    }

    get duration() {
        return this._timer.duration()
    }

    registerEvents() {
        eventStream.registerEvent(
            this.name + 'LostBalEvent',
            this.lost.bind(this)
        )
        eventStream.registerEvent(
            this.name + 'GotBalEvent',
            this.got.bind(this)
        )
    }

    raiseEventGot() {
        eventStream.raiseEvent('BalanceGot', this)
    }

    raiseEventLost() {
        eventStream.raiseEvent('BalanceLost', this)
    }

    got() {
        if (!this.have) {
            this.clearCallbacks()
            this._timer.stop()
            super.got()
        }
    }

    lost() {
        if (this.have) {
            this.addCallback(this.got.bind(this))
            this._timer.start()
            super.lost()
        }
    }

    on() {
        if (!this.have) {
            this.got()
        }
    }

    off() {
        if (this.have) {
            this.lost()
        }
    }

    setTimer(length) {
        this._timer.setLength(length)
    }

    resetTimer() {
        this._timer.reset()
    }

    addCallback(callback) {
        this._timer.addCallback(callback)
    }

    clearCallbacks() {
        this._timer.clearCallbacks()
    }
}

export class BalExtended extends Balance {
    constructor(name, length, obj) {
        super(name, length)
        this._aff_modifiers = obj.aff_modifiers
        this._mods = {}
        this.registerAffModifiers()
    }

    registerAffModifiers() {
        for (const name in this._aff_modifiers) {
            this._mods[name] = false
            eventStream.registerEvent(
                name + 'LostAffEvent',
                this.removeModifier.bind(this)
            )
            eventStream.registerEvent(
                name + 'GotAffEvent',
                this.addModifier.bind(this)
            )
        }
    }

    removeModifier(aff) {
        this._mods[aff] = false
    }

    addModifier(aff) {
        this._mods[aff] = true
    }

    got() {
        this.resetTimer()
        super.got()
    }

    lost() {
        let length = this._length
        for (let i = 0; i < this._mods; i++) {
            const affMod = this._aff_modifiers[this._mods[i]]
            length *= affMod.multiplier
            length += affMod.offset
        }
        this.setTimer(length)
        super.lost()
    }
}
