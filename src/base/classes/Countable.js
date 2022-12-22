/*global eventStream */

class Countable {
    constructor(name, min = 0, max = 0) {
        this._name = name;
        this._min = min;
        this._max = max;
        this._count = this._min;
        this._prev = this._count;
    }

    get count() {
        return this._count;
    }
    get name() {
        return this._name;
    }
    get min() {
        return this._min;
    }
    get max() {
        return this._max;
    }

    raiseEventCountableUp() {
        eventStream.raiseEvent('CountableUpEvent', this);
    }

    raiseEventCountableDown() {
        eventStream.raiseEvent('CountableDownEvent', this);
    }

    raiseEventCountableSet() {
        eventStream.raiseEvent('CountableSetEvent', this);
    }

    raiseEventCountableReset() {
        eventStream.raiseEvent('CountableResetEvent', this);
    }

    checkLimits(num) {
        if (num > this._max) {
            return this._max;
        }

        if (num < this._min) {
            return this._min;
        }

        return num;
    }

    setCount(num) {
        this._prev = this._count;
        this._count = num;
        this.raiseEventCountableSet();
        return this._count;
    }

    reset() {
        this.setCount(this._min);
        this.raiseEventCountableReset();
        return this._count;
    }

    add(num = 1) {
        this.setCount(this.checkLimits(this._count + num));
        this.raiseEventCountableUp();
        return this._count;
    }

    subtract(num = 1) {
        this.setCount(this.checkLimits(this._count - num));
        this.raiseEventCountableDown();
        return this._count;
    }
}

export default Countable;
