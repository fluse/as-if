'use strict';

var buttonMapping = require('./mapping.js');
var Ticker = require('./ticker.js');

class SelectionManager {

    constructor(app, onSelection) {

        this.app = app;
        this.onSelection = onSelection || () => {};

        // create validity ticker instance with
        // validity duration and clear callback
        this.ticker = new Ticker(3, this.clear.bind(this));

        this.pressed = {
            first: null,
            second: null
        };
    }

    onInput(buttons) {

        // check pressed button
        for (var button of buttons) {
            this.checkForPressed(
                button.getState()
            );
        }

        this.checkForValiditySelection();
    }

    checkForPressed(state) {

        if (state.isPressed) {

            // set time
            if (buttonMapping[state.pin].type === 'first') {
                // start validity timer
                this.ticker.abort().start();
            }

            // cache button behavior
            this.pressed[buttonMapping[state.pin].type] = buttonMapping[state.pin];
        }
    }

    checkForValiditySelection() {
        console.log(this.pressed);
        if (this.pressed.first !== null && this.pressed.second !== null) {
            this.onSelectionEnd();
        }
    }

    onSelectionEnd() {
        console.log('validity %s', this.pressed.first + this.pressed.second);
        this.onSelection({
            value: this.pressed.first.count + this.pressed.second.count,
            pressed: this.pressed
        });
        this.clear();
    }

    clear() {
        this.pressed = {
            first: null,
            second: null
        };
    }
}

module.exports = SelectionManager;
