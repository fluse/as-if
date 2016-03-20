'use strict';

var five = require('johnny-five');
var Button = require('./button.js');
var SelectionManager = require('./SelectionManager.js');

class Board {

    constructor (app, onSelection) {
        this.app = app;
        this.buttonList = [2, 4];
        this.buttons = [];
        var board = new five.Board();

        this.selectionManager = new SelectionManager(app, onSelection);

        // initialize all buttons from buttonList;
        board.on('ready', this.create.bind(this));
    }

    create () {
        this.createButtons ();
    }

    createButtons () {
        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttons.push(new Button(this.buttonList[i], this.onInput.bind(this)));
        }
    }

    onInput () {
        this.app.io.sockets.emit('action', this.buttons);
        this.selectionManager.onInput(this.buttons);
    }
}

module.exports = Board;
