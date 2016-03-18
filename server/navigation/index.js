var five = require('johnny-five');

var Button = require('./button.js');

var Board = function (app) {
    this.app = app;
    this.buttonList = [2, 4];
    this.buttons = [];
    var board = new five.Board();

    board.on('ready', () => {
        this.createButtons();
    });
};

Board.prototype = {
    createButtons () {
        for (var i = 0; i < this.buttonList.length; i++) {
            this.buttons.push(new Button(this.buttonList[i], this.events.bind(this)));
        }
    },

    events () {
        this.app.io.sockets.emit('action', this.buttons);
    }
};


module.exports = Board;
