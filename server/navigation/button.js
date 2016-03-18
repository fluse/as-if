var five = require('johnny-five');

var Button = function (pin) {

    var button = new five.Button(pin);
    button.on('hold', function() {
        console.log('hold %s', pin);
    }).on('press', function() {
        console.log('press %s', pin);
    }).on('release', function() {
        console.log('release %s', pin);
    });
};

module.exports = Button;
