var five = require('johnny-five');

var Button = function (pin, cb) {

    var button = new five.Button(pin);

    this.state = {
        pin: pin,
        isPressed: false
    };

    button.on('hold', () => {
        cb();
    }).on('press', () => {
        this.state.isPressed = true;
        cb();
    }).on('release', () => {
        this.state.isPressed = false;
        //cb();
    });
};

Button.prototype = {
    getState () {
        return this.state;
    }
};

module.exports = Button;
