'use strict';

var five = require('johnny-five');
var Button = require('./button.js');
var SelectionManager = require('./selectionManager.js');
var Mapping = require('./mapping.js');
var _ = require('lodash');

class Board {

    constructor (app, hooks) {
        this.app = app;
        this.buttonList = Mapping;
        this.buttons = [];
        this.volume = 0;
        this.hooks = hooks;
        var board = new five.Board();
        this.lastVolatage = 0;
        this.maxVolatage = 1023;
        this.minVoltage = 330;
        this.selectionManager = new SelectionManager(app, this.hooks.onSelection);

        var self = this;
        // initialize all buttons from buttonList;
        board.on('ready', function () {
            self.create();

            this.pinMode(0, five.Pin.ANALOG);
            this.analogRead(0, self.convertVolumePegel.bind(self));

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
            //console.log('%s%', percentage);
            this.hooks.onVolumeChange(this.volume / 100);
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
        this.selectionManager.onInput(this.buttons);

        this.app.io.sockets.emit('getState', {
            buttons: this.buttons,
            volume: this.volume,
            pressed: this.selectionManager.pressed
        });
    }
}

module.exports = Board;
