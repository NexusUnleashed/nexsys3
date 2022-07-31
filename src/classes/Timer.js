class Timer {
    constructor(name, length = 0) {
        this._name = name
        this._enabled = false
        this._t_started = 0
        this._t_ended = 0
        this._timerId = 0
        this._default_length = length
        this.setLength(length)
        this._callbacks = []
    }

    get length() {
        return this._t_length
    }

    setLength(length) {
        this._t_length = length
        this._t_length_ms = length * 1000
    }

    reset() {
        this.setLength(this._default_length)
    }

    start() {
        if (this._enabled) {
            clearTimeout(this._timerId)
        }
        this._timerId = setTimeout(this.stop.bind(this), this._t_length_ms)
        this._t_started = performance.now() / 1000
        this._enabled = true
    }

    stop() {
        if (this._enabled) {
            clearTimeout(this._timerId)
            this._t_ended = performance.now() / 1000
            this._enabled = false
            if (this._callbacks) {
                for (let i = 0; i < this._callbacks.length; i++) {
                    this._callbacks[i](this._t_ended - this._t_started)
                    // add clear callback method so can set one time callbacks and clear them
                }
            }
        }
    }

    duration() {
        if (this._enabled) {
            return this.elapsed()
        } else {
            return this._t_ended - this._t_started
        }
    }

    elapsed() {
        if (this._enabled) {
            return performance.now() / 1000 - this._t_started
        } else {
            return 0
        }
    }

    remaining() {
        if (this._enabled) {
            return this._t_length - performance.now() / 1000 - this._t_started
        } else {
            return 0
        }
    }

    addCallback(callback) {
        this._callbacks.push(callback)
    }

    clearCallbacks() {
        this._callbacks = []
    }
}

export default Timer
