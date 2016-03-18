var five = require('johnny-five');

var Button = require('./button.js');

var Board = function () {
    this.buttons = [2, 4];
    var board = new five.Board();

    board.on('ready', () => {
        this.createButtons();
    });
};

Board.prototype = {
    createButtons () {
        for (var i = 0; i < this.buttons.length; i++) {
            new Button(this.buttons[i]);
        }
    }
};


module.exports = Board;
