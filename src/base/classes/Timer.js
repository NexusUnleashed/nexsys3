class Timer {
  constructor(id, length = 0) {
    this._id = id;
    this._enabled = false;
    this._startTime = 0;
    this._endTime = 0;
    this._timerId = 0;
    this._defaultLength = length;
    this.setLength(length);
    this._callbacks = [];
  }

  get length() {
    return this._length;
  }

  get id() {
    return this._id;
  }

  get enabled() {
    return this._enabled;
  }

  setLength(length) {
    if (length < 0) {
      throw new Error("Timer length cannot be negative");
    }
    this._length = length;
  }

  //Reset properties to default state.
  reset() {
    clearTimeout(this._timerId);
    this._enabled = false;
    this.setLength(this._defaultLength);
    this._endTime = performance.now() / 1000;
    eventStream.raiseEvent(`timerReset${this._id}`);
  }

  start() {
    clearTimeout(this._timerId);
    this._startTimer();
    eventStream.raiseEvent(`timerStarted${this._id}`);
  }

  _startTimer() {
    this._timerId = setTimeout(this.stop.bind(this), this._length * 1000);
    this._enabled = true;
    this._startTime = performance.now() / 1000;
  }

  stop() {
    if (this._enabled) {
      clearTimeout(this._timerId);
      this._endTime = performance.now() / 1000;
      this._enabled = false;
      eventStream.raiseEvent(`timerStopped${this._id}`);
    }
  }

  duration() {
    return this._enabled ? this.elapsed() : this._endTime - this._startTime;
  }

  elapsed() {
    return this._enabled ? performance.now() / 1000 - this._startTime : 0;
  }

  remaining() {
    return this._enabled ? this._length - this.elapsed() : this._length;
  }

  static createTimer(name, length = 0) {
    return new Timer(name, length);
  }
}

export default Timer.createTimer;
