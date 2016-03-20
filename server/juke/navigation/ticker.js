'use strict';

class Ticker {

    constructor(duration, cb) {
        this.duration = duration * 1000;
        this.callback = cb;
        this.timer = null;
    }

    start() {
        this.timer = setTimeout(() => {
            this.onEnd();
        }, this.duration);
        return this;
    }

    abort() {
        clearTimeout(this.timer);
        return this;
    }

    onEnd() {
        this.callback();
    }
}

module.exports = Ticker;
