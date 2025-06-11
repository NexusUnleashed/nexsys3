import createTimer from "../classes/Timer";

export class Limb {
  constructor({ id }) {
    this.id = id;
    this.percent = 0;
    this.hits = 0;
    this.timer = createTimer(`nexSysLimbTimer${id}`, 180);
    this.timer.addCallback(this.reset.bind(this));
  }

  hit(value) {
    this.percent += value;
    this.hits++;
    if (this.percent >= 100) {
      this.break();
    } else {
      this.timer.start();
    }
    eventStream.raiseEvent("nexSysLimbHit", this);
    eventStream.raiseEvent(`nexSysLimbHit${this.id}`, this);
  }

  // Affs for breaks are handled in events
  break() {
    this.percent = 0;
    this.hits = 0;
    eventStream.raiseEvent("nexSysLimbBreak", this);
    eventStream.raiseEvent(`nexSysLimbBreak${this.id}`, this);
    this.timer.stop();
  }

  reset() {
    this.percent = 0;
    this.hits = 0;
    this.timer.stop();
    eventStream.raiseEvent("nexSysLimbReset", this);
    eventStream.raiseEvent(`nexSysLimbReset${this.id}`, this);
  }

  set(value) {
    this.percent = value;
    if (this.percent >= 100) {
      this.break();
    } else {
      this.timer.start();
    }
  }
}
