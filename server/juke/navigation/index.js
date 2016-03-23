'use strict';

var five = require('johnny-five');
var Button = require('./button.js');
var SelectionManager = require('./SelectionManager.js');
var Mapping = require('./mapping.js');

class Board {

    constructor (app, hooks) {
        this.app = app;
        this.buttonList = Mapping;
        this.buttons = [];
        var board = new five.Board();
        this.lastVolatage = 0;
        this.maxVolateage = 1023;
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
            var percentage = Math.round(Math.abs((voltage / this.maxVolateage * 100) - 100));
            console.log('%s%', percentage);
        }
    }

    create () {
        this.createButtons();
    }

    createButtons () {
        console.log(this.buttonList);
        for (var button in this.buttonList) {
            try {
                var current = new Button(button, this.onInput.bind(this));
                this.buttons.push(current);
            } catch (e) {
                console.log(e);
            }

        }
    }

    onInput () {
        this.app.io.sockets.emit('action', this.buttons);
        this.selectionManager.onInput(this.buttons);
    }
}

module.exports = Board;
