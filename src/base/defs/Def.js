/*global eventStream */
import Priority from "../classes/Priority.js";
import Trackable from "../classes/Trackable.js";

export class Def extends Trackable {
  constructor(name, prio = 0, obj) {
    super(name);
    this._prio = new Priority(this._name, prio);
    this._command = obj.command || "";
    this._bals_req = obj.bals_req || [];
    this._bals_used = obj.bals_used || [];
    this._blocks = obj.blocks || [];
    this._skills = obj.skills || [];
    this._preempt = obj.preempt || false;
    this._opps = obj.opps;
    this.registerEvents();
  }

  get isServerSide() {
    return false;
  }

  get prio() {
    return this._prio.prio;
  }

  get isIgnored() {
    return this._prio.prio === 0;
  }

  get balsUsed() {
    return this._bals_used;
  }

  get balsReq() {
    return this._bals_req;
  }

  get blocks() {
    return this._blocks;
  }

  get command() {
    return this._command;
  }

  get skills() {
    return this._skills;
  }

  get preempt() {
    return this._preempt;
  }

  registerEvents() {
    eventStream.registerEvent(this.name + "LostDefEvent", this.lost.bind(this));
    eventStream.registerEvent(this.name + "GotDefEvent", this.got.bind(this));
    if (this._opps !== undefined) {
      for (let i = 0; i < this._opps.length; i++) {
        eventStream.registerEvent(
          this._opps[i] + "GotDefEvent",
          this.lost.bind(this)
        );
      }
    }
  }

  raiseEventGot() {
    eventStream.raiseEvent("DefGot", this);
  }

  raiseEventLost() {
    eventStream.raiseEvent("DefLost", this);
  }

  raiseEventSet() {
    eventStream.raiseEvent("DefPrioritySetEvent", this);
  }

  got() {
    // reset prio to default when got.  Assumes we were deffing up
    if (!this.have) {
      this.reset_prio();
      super.got();
    }
  }

  lost() {
    if (this.have) {
      super.lost();
    }
  }

  set_prio(prio) {
    this._prio.setPrio(prio);
    this.raiseEventSet();
  }

  set_default_prio(prio) {
    this._prio.setDefault(prio);
    this.set_prio(prio);
  }

  toggle_default_prio(prio) {
    if (this._prio.prio === prio) {
      this.set_default_prio(0);
    } else {
      this.set_default_prio(prio);
    }
    eventStream.raiseEvent("ForcePopulateEvent");
  }

  reset_prio() {
    this._prio.reset();
    this.raiseEventSet();
  }

  set_command(cmd) {
    this._command = cmd;
  }
}

export class DefServerside extends Def {
  get isServerSide() {
    return true;
  }
}
