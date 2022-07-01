/* need a better implementation for the abort controller(s) */

export class EventStream extends EventTarget {
    constructor() {
        super()
        this.stream = {}
        //this.controller = new AbortController()
        this.gmcpBackLog = []
    }

    registerEvent(event, callback, once = false, /*signal = this.controller*/) {
        if (typeof this.stream[event] === 'undefined') {
            this.stream[event] = []
        }
        this.addEventListener(event, async ({detail})=>{callback(detail)}, {
            once: once,
            //signal: signal.signal,
        })
        this.stream[event].push(callback)
    }

    raiseEvent(event, data) {
        this.dispatchEvent(new CustomEvent(event, { detail: data }))
    }

    removeListener(event, listener) {
        let streamEvent = this.stream[event];
        if (typeof streamEvent === 'undefined') {
            return
        }

        if (typeof listener === 'string') {
            const listenerIndex = streamEvent.findIndex(
                (e) => e.name === listener
            )
            if (listenerIndex >= 0) {
                this.removeEventListener(event, streamEvent[listenerIndex])
                streamEvent.splice(listenerIndex, 1)
            }
        } else {
            streamEvent = streamEvent.filter(e => e !== listener);
            this.removeEventListener(event, listener)
        }
        this.stream[event] = streamEvent;
    }
}

export const eventStream = new EventStream();
