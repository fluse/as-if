var five = require('johnny-five'),
    extend = require('extend');

var Button = function (settings, cb) {

    var button = new five.Button(settings.pin);

    this.state = extend(settings, {
        isPressed: false
    });

    button.on('hold', () => {
        //cb();
    }).on('press', () => {
        this.state.isPressed = true;
        cb();
    }).on('release', () => {
        this.state.isPressed = false;
        //cb();
        cb();
    });
};

Button.prototype = {
    getState () {
        return this.state;
    }
};

module.exports = Button;
