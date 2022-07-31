/*global eventStream */

import { sendCmd, sendInline } from '../services/utilities.js'
import { sys } from '../services/sys.js'

export class Queue {
    constructor(obj) {
        this._name = obj.name
        this._prefix = obj.prefix || ''
        this._pre = obj.pre || ''
        this._clear = obj.clear || ''
        this._queue = []
        this._prepend = []
        this._gagged = false

        const queueFired = function (queue) {
            queue.clear()
        }
        eventStream.registerEvent(this._name + 'QueueFired', queueFired)
    }

    get queue() {
        return this._queue
    }

    /*get prepend() {
        return this._prepend
    }*/

    isQueued(cmd) {
        if (this._queue.indexOf(cmd) !== -1) return true
        if (this._prepend.indexOf(cmd) !== -1) return true

        return false
    }

    add(cmd) {
        const tempQ = Array.isArray(cmd) ? cmd : cmd.split(sys.settings.sep)

        if (Array.equals(tempQ, this._queue)) {
            return
        }

        this._queue = tempQ

        this.send()
    }

    prepend(cmd) {
        const tempQ = Array.isArray(cmd) ? cmd : cmd.split(sys.settings.sep)

        if (Array.equals(tempQ, this._prepend)) {
            return
        }

        this._prepend = this._prepend.concat(tempQ)

        this.send()
    }

    send() {
        const tempQueue = this._prepend.concat(this._queue)

        if (tempQueue.length < 1) {
            return
        }

        if (this._pre) {
            tempQueue.unshift(this._pre)
        }

        tempQueue[0] = this._prefix + tempQueue[0]

        sendInline(tempQueue)
    }

    clearQueue() {
        this._queue = []
        this._prepend = []
        sendCmd(this._clear)
        eventStream.raiseEvent(this._name + 'QueueCleared', this)
    }

    clear() {
        this._queue = []
        this._prepend = []
    }
}
