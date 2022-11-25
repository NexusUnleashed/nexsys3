/*global eventStream, globalThis */

import { sendCmd, sendInline } from '../system/sysService.js'
import { sys } from '../system/sys.js'

export const createQueue = ({ name, type, pre = false, exclusions = false }) => {
    const queueFired = function (queue) {
        queue.clear()
    }
    eventStream.registerEvent(name + 'QueueFired', queueFired)

    return ({
        name: name,
        type: type,
        pre: pre.split(sys.settings.sep),
        exclusions: exclusions,
        queue: [],
        prependQueue: [],
        add(cmd) {
            const newCommands = Array.isArray(cmd) ? cmd : cmd.split(sys.settings.sep);
            if (Array.equals(newCommands, this.queue)) { return; }

            this.queue = newCommands;
            this.send();
        },
        prepend(cmd) {
            const newCommands = Array.isArray(cmd) ? cmd : cmd.split(sys.settings.sep);
            if (newCommands.every(e => this.prependQueue.indexOf(e) > -1)) { return; }

            this.prependQueue.push(...newCommands);
            this.send();
        },
        isQueued(cmd) {
            if (this.queue.indexOf(cmd) > -1) { return true; }
            if (this.prependQueue.indexOf(cmd) > -1) { return true; }
            return false;
        },
        queued() {
            if (this.queue.length > 0) { return true; }
            if (this.prependQueue.length > 0) { return true; }
            return false;
        },
        send() {
            let cmds =  this.pre.concat(this.prependQueue, this.queue);
            let cmdString = `queue addclear ${this.type} ${cmds.join(sys.settings.sep)}`;
            let clears = []
            if (this.exclusions.length > 0) {
                this.exclusions.forEach(element => {
                    let q = globalThis.nexsys[element];
                    if (q.queued()) {
                        q.clear();
                        clears.push(`clearqueue ${q.type}`);
                    }
                });
            } 

            clears.push(cmdString);
            console.log(clears.join("|"))
            sendInline(clears);
        },
        clear() {
            this.queue.length = 0;
            this.prependQueue.length = 0;
        },
        clearQueue() {
            this.clear();
            console.log(`clearqueue ${type}`);
            sendCmd(`clearqueue ${type}`)
            eventStream.raiseEvent(this.name + 'QueueCleared', this)
        }
    })
}
//globalThis.classQ = createQueue({ name: 'class', type: 'c!p!t!w', pre: 'touch soul|stand', exclusions: ['fullQ'] })
//globalThis.freeQ = createQueue({ name: 'free', type: 'free', pre: 'touch soul|stand', exclusions: ['fullQ'] })
//globalThis.fullQ = createQueue({ name: 'full', type: 'full', pre: 'touch soul|stand', exclusions: ['freeQ', 'classQ']})
//globalThis.stunQ = createQueue({ name: 'stun', type: '!t', pre: 'touch soul' })

//nexSys.EqBalQueue = new nexSys.QueueClass({name: 'eqBal', prefix: 'queue addclear free ', pre: false, clear: 'clearqueue free'});
//nexSys.ClassQueue = new nexSys.QueueClass({name: 'class', prefix: 'queue addclear class ', pre: false, clear: 'clearqueue class'});