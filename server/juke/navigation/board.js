'use strict';

var five = require('johnny-five');
var Button = require('./button.js');
var SelectionManager = require('./SelectionManager.js');
var Mapping = require('./mapping.js');
var _ = require('lodash');

class Board {

    constructor (app, hooks) {
        this.app = app;
        this.buttonList = Mapping;
        this.buttons = [];
        this.volume = 0;

        var board = new five.Board();
        this.lastVolatage = 0;
        this.maxVolatage = 1023;
        this.minVoltage = 330;
        this.selectionManager = new SelectionManager(app, hooks.onSelection);

        var self = this;
        // initialize all buttons from buttonList;
        board.on('ready', function () {
            self.create();

            this.analogRead(1, self.convertVolumePegel.bind(self));

            hooks.onReady();
        });
    }

    convertVolumePegel(voltage) {

        if (this.lastVolatage !== voltage &&
            this.lastVolatage !== (voltage - 1) &&
            this.lastVolatage !== (voltage + 1)
        ) {
            this.lastVolatage = voltage;
            var percentage = Math.round(Math.abs((voltage / this.maxVolatage * 100) - 100));
            this.volume = percentage;
            this.onInput();
            //console.log('%s%', percentage);
        }
    }

    create () {
        this.createButtons();
    }

    createButtons () {
        for (var button in this.buttonList) {
            try {
                var current = new Button(this.buttonList[button], this.onInput.bind(this));
                this.buttons.push(current);
            } catch (e) {
                console.log(e);
            }

        }
    }

    onInput () {
        this.buttons = _.sortBy(this.buttons, function(o) { return o.name; });

        this.selectionManager.onInput(this.buttons);

        this.app.io.sockets.emit('getState', {
            buttons: this.buttons,
            volume: this.volume,
            pressed: this.selectionManager.pressed
        });
    }
}

module.exports = Board;
