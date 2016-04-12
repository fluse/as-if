'use strict';

var buttonMapping = require('./mapping.js');
var Ticker = require('./ticker.js');

class SelectionManager {

    constructor(app, onSelection) {

        this.app = app;
        this.onSelection = onSelection || () => {};
        this.isPaginationActive = true;
        // create validity ticker instance with
        // validity duration and clear callback
        this.ticker = new Ticker(8, this.clear.bind(this));

        this.tickerPagination = new Ticker(0.8, () => {
            console.log('isPaginationActive to active');
            this.isPaginationActive = true;
        });

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

            // check special behavior buttons

            if (buttonMapping[state.pin].type === 'pageNext' || buttonMapping[state.pin].type === 'pagePrevous') {
                this.pressed.first = buttonMapping[state.pin];
                this.pressed.second = null;

                if (this.isPaginationActive) {
                    this.tickerPagination.start();

                    return this.onSelectionEnd();
                }
                return;
            }

            // cache button behavior
            this.pressed[buttonMapping[state.pin].type] = buttonMapping[state.pin];
            if (buttonMapping[state.pin].type === 'first') {
                this.pressed.second = null;
            }

        }
    }

    checkForValiditySelection() {
        //console.log(this.pressed);
        if (this.pressed.first !== null && this.pressed.second !== null) {
            this.onSelectionEnd();
        }
    }

    onSelectionEnd() {
        var first = this.pressed.first.count;
        var second = typeof this.pressed.second !== undefined && this.pressed.second !== null && this.pressed.second.hasOwnProperty('count') ? this.pressed.second.count : 0;
        this.onSelection({
            value: first + second,
            pressed: this.pressed
        });
        this.clear();
    }

    clear() {
        this.ticker.abort();
        this.pressed = {
            first: null,
            second: null
        };
    }
}

module.exports = SelectionManager;
