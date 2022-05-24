import { eventStream } from './eventStream.js'

class Trackable {
    constructor(name) {
        this._name = name
        this._status = false
        this._got_time = 0
        this._lost_time = 0
        eventStream.registerEvent(
            name + 'LostTrackableEvent',
            this.lost.bind(this)
        )
        eventStream.registerEvent(
            name + 'GotTrackableEvent',
            this.got.bind(this)
        )
    }

    get have() {
        return this._status
    }
    get name() {
        return this._name
    }

    raiseEventGot() {
        eventStream.raiseEvent('TrackableGot', this)
    }

    raiseEventLost() {
        eventStream.raiseEvent('TrackableLost', this)
    }

    got() {
        this._status = true
        this._got_time = performance.now()
        this.raiseEventGot()
    }

    lost() {
        this._status = false
        this._lost_time = performance.now()
        this.raiseEventLost()
    }

    elapsed() {
        return this._status ? (performance.now() - this._got_time) / 1000.0 : 0
    }
}

export default Trackable
