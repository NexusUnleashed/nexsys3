/*global eventStream */
import Trackable from "../classes/Trackable.js";
import Priority from "../classes/Priority.js";
import Countable from "../classes/Countable.js";
import Timer from "../classes/Timer.js";

class Aff extends Trackable {
  constructor(name, prio = 0, uncurable = false) {
    super(name);
    this._prio = new Priority(this._name, prio);
    this._cures = [];
    this._serverside = false;
    if (prio >= 0 && prio <= 26) {
      this._serverside = true;
    }
    this._uncurable = uncurable;
    this.registerEvents();
  }

  registerEvents() {
    eventStream.registerEvent(this.name + "LostAffEvent", this.lost.bind(this));
    eventStream.registerEvent(this.name + "GotAffEvent", this.got.bind(this));
  }

  get isUncurable() {
    return this._uncurable;
  }

  get isIgnored() {
    return this._prio.prio === 0;
  }

  get isServerSide() {
    return this._serverside;
  }

  get cures() {
    return this._cures;
  }

  get prio() {
    return this._prio.prio;
  }

  raiseEventGot() {
    eventStream.raiseEvent("AffGot", this);
  }

  raiseEventLost() {
    eventStream.raiseEvent("AffLost", this);
  }

  raiseEventSet() {
    if (!this.isUncurable) {
      eventStream.raiseEvent("AffPrioritySetEvent", this);
    }
  }

  got() {
    if (!this.have) {
      super.got();
    }
  }

  lost() {
    if (this.have) {
      super.lost();
    }
  }

  addCure(cure) {
    this._cures.push(cure);
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
}

class AffCountable extends Aff {
  constructor(name, prio, min = 0, max = 0, uncurable = false) {
    super(name, prio, uncurable);
    this._count = new Countable(this._name, min, max);
  }

  registerEvents() {
    super.registerEvents();
    eventStream.registerEvent(
      this.name + "AffCountSubtractEvent",
      this.subtract.bind(this)
    );
    eventStream.registerEvent(
      this.name + "AffCountAddEvent",
      this.add.bind(this)
    );
    eventStream.registerEvent(
      this.name + "AffCountSetEvent",
      this.setCount.bind(this)
    );
  }

  get count() {
    return this._count.count;
  }
  get min() {
    return this._count.min;
  }
  get max() {
    return this._count.max;
  }

  setCount(num) {
    this._count.setCount(num);
  }

  lost() {
    this.setCount(this.min);
    super.lost();
  }

  add(num = 1) {
    const count = this._count.add(num);
    if (count > this.min && !this.have) {
      this.got();
    }
  }

  subtract(num = 1) {
    const count = this._count.subtract(num);
    if (count === this.min) {
      this.lost();
    }
  }
}

class AffTimed extends Aff {
  constructor(name, prio, length = 0, uncurable = false) {
    super(name, prio, uncurable);
    this._timer = new Timer(this._name, length);
    this._timer.addCallback(this.lost.bind(this));
  }

  got() {
    this._timer.start();
    super.got();
  }

  lost() {
    this._timer.stop();
    super.lost();
  }
}

class AffDef extends Aff {
  constructor(name, prio = 0, uncurable = false) {
    super(name, prio, uncurable);
  }

  registerEvents() {
    eventStream.registerEvent(this.name + "LostAffEvent", this.got.bind(this)); // CUSTOM 'this.name'
    eventStream.registerEvent(this.name + "GotAffEvent", this.lost.bind(this)); // CUSTOM 'this.name'
    eventStream.registerEvent(this.name + "LostDefEvent", this.got.bind(this)); // CUSTOM 'this.name'
    eventStream.registerEvent(this.name + "GotDefEvent", this.lost.bind(this)); // CUSTOM 'this.name'
  }

  raiseEventSet() {
    if (!this.isUncurable) {
      console.log(
        `AffDef ${this.name} eventStream.raiseEvent(DefPrioritySetEvent) ${this.prio}`
      );
      //eventStream.raiseEvent('DefPrioritySetEvent', this);
    }
  }
}

export { Aff, AffCountable, AffDef, AffTimed };
