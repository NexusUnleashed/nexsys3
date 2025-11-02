/*global eventStream, globalThis */

import { sendCmd, sendInline } from "../system/sysService.js";
import { sys } from "../system/sys.js";

export class Queue {
  constructor({ name, type, pre = false, post = false, exclusions = false }) {
    this.name = name;
    this.type = type;
    this.pre = pre || [];
    this.post = post || [];
    this.exclusions = exclusions || [];
    this.queue = [];
    this.prependQueue = [];
    this.logging = false;
    this.queuedCmds = [];
    this.confirmMsg = `echo SystemEvent ${name}QueueFired`;

    const queueFired = () => {
      this.clear();
    };
    eventStream.registerEvent(`${name}QueueFired`, queueFired, {
      id: `${name}QueueFired`,
    });
  }

  add(cmd) {
    const newCommands = Array.isArray(cmd) ? cmd : cmd.split(sys.settings.sep);
    if (Array.equals(newCommands, this.queue)) {
      if (this.logging) {
        console.log(
          `${this.name}: Duplicate commands, not added ${newCommands}`
        );
      }
      return;
    }

    this.queue = newCommands;
    this.send();
  }

  prepend(cmd) {
    const newCommands = Array.isArray(cmd) ? cmd : cmd.split(sys.settings.sep);
    if (newCommands.every((e) => this.prependQueue.indexOf(e) > -1)) {
      return;
    }

    this.prependQueue.push(...newCommands);
    this.send();
  }

  isQueued(cmd) {
    if (this.queue.indexOf(cmd) > -1) {
      return true;
    }
    if (this.prependQueue.indexOf(cmd) > -1) {
      return true;
    }
    return false;
  }

  queued() {
    return this.queue.length > 0 || this.prependQueue.length > 0;
  }

  send() {
    if (sys.isPaused() && !sys.state.queueWhilePaused) {
      console.log(`[nexSys]: Queue held while system is paused.`);
      return;
    }
    //this.queuedCmds = this.pre.concat(this.prependQueue, this.queue, this.post);
    //this.queuedCmds.unshift(this.confirmMsg);
    this.queuedCmds = [
      this.confirmMsg,
      ...this.pre,
      ...this.prependQueue,
      ...this.queue,
      ...this.post,
    ];

    const output = [];

    if (this.exclusions.length > 0) {
      this.exclusions.forEach((element) => {
        const q = globalThis.nexSys[element];
        if (q.queued()) {
          q.clear();
          output.push(`clearqueue ${q.type}`);
        }
      });
    }

    const chunkSize = 20 - output.length;
    const chunks = Math.ceil(this.queuedCmds.length / chunkSize);

    if (chunks > 1) {
      for (let i = 0; i < chunks; i++) {
        const chunk = this.queuedCmds.slice(
          i * chunkSize,
          i * chunkSize + chunkSize
        );
        const cmdString = `queue ${i > 0 ? "add" : "addclear"} ${
          this.type
        } ${chunk.join(sys.settings.sep)}`;
        output.push(cmdString);
        sendInline(output);
        output.length = 0;
      }
    } else {
      const cmdString = `queue addclear ${this.type} ${this.queuedCmds.join(
        sys.settings.sep
      )}`;
      output.push(cmdString);
      sendInline(output);
    }
  }

  clear() {
    this.queue.length = 0;
    this.prependQueue.length = 0;
    this.queuedCmds.length = 0;
  }

  clearQueue() {
    this.clear();
    console.log(`clearqueue ${this.type}`);
    sendCmd(`clearqueue ${this.type}`);
    eventStream.raiseEvent(this.name + "QueueCleared", this);
  }
}
