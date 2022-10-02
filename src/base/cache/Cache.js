/*global eventStream */
import Trackable from '../classes/Trackable'
import Countable from '../classes/Countable'

export class Cache extends Trackable {
    constructor(name, amount = 0, obj) {
        super(name)
        this._blocks = obj.blocks || []
        this._amount = amount
        this._count = new Countable(this._name, 0, 20000)
        this._rift = 0
        this.registerEvents()
    }

    get blocks() {
        return this._blocks
    }

    get amount() {
        return this._amount
    }

    get command() {
        return 'outr ' + (this.amount - this.count) + ' ' + this.name
    }

    get count() {
        return this._count.count
    }

    get rift() {
        return this._rift
    }

    get needToOutr() {
        return this.rift >= this.amount && this.count < this.amount
    }

    registerEvents() {
        eventStream.registerEvent(
            this.name + 'CacheCountSubtractEvent',
            this.subtract.bind(this)
        )
        eventStream.registerEvent(
            this.name + 'CacheCountAddEvent',
            this.add.bind(this)
        )
        eventStream.registerEvent(
            this.name + 'CacheCountResetEvent',
            this.reset.bind(this)
        )
        eventStream.registerEvent(
            this.name + 'RiftSetEvent',
            this.riftSet.bind(this)
        )
    }

    setCount(num) {
        return this._count.setCount(num)
    }

    add(num = 1) {
        return this._count.add(num)
    }

    subtract(num = 1) {
        return this._count.subtract(num)
    }

    reset() {
        return this.setCount(0)
    }

    riftSet(num) {
        this._rift = num
        eventStream.raiseEvent('RiftSetEvent', this)
    }
}
